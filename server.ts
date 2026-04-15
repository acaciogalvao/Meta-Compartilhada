import express from "express";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Payment } from "mercadopago";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import QRCode from "qrcode";
import mongoose from "mongoose";

dotenv.config();

// Initialize MongoDB
mongoose.connect(process.env.MONGODB_URI || "").then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  amount: Number,
  payerId: String,
  date: { type: Date, default: Date.now }
});

const goalSchema = new mongoose.Schema({
  _id: { type: String, default: "default_goal" },
  itemName: String,
  totalValue: Number,
  months: Number,
  contributionP1: Number,
  nameP1: String,
  nameP2: String,
  savedP1: { type: Number, default: 0 },
  savedP2: { type: Number, default: 0 },
  payments: [paymentSchema]
});

const Goal = mongoose.model("Goal", goalSchema);

// Initialize Mercado Pago
let cachedMpClient: MercadoPagoConfig | null = null;
let cachedToken: string | null = null;

async function getMpConfig(): Promise<{ client: MercadoPagoConfig | null, isMock: boolean }> {
  let token = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.APP_USR || process.env.MP_ACCESS_TOKEN;
  
  const isMock = !token || token === "test_dummy";
  
  if (!isMock && (!cachedMpClient || cachedToken !== token)) {
    cachedMpClient = new MercadoPagoConfig({ accessToken: token! });
    cachedToken = token!;
  }
  
  return { client: cachedMpClient, isMock };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Endpoints for frontend state
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await Goal.find().sort({ _id: -1 });
      res.json(goals);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/goal/:id", async (req, res) => {
    try {
      const goal = await Goal.findById(req.params.id);
      if (!goal) return res.status(404).json({ error: "Goal not found" });
      res.json(goal);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/goal", async (req, res) => {
    try {
      console.log("POST /api/goal body:", req.body);
      const newGoal = await Goal.create({
        _id: "goal_" + Date.now(),
        ...req.body,
        payments: []
      });
      console.log("Created goal:", newGoal);
      res.json(newGoal);
    } catch (e: any) {
      console.error("Error creating goal:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/goal/:id", async (req, res) => {
    try {
      const updates = req.body;
      const goal = await Goal.findByIdAndUpdate(req.params.id, updates, { new: true });
      res.json(goal);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/goal/:id", async (req, res) => {
    try {
      await Goal.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Webhook endpoint for Mercado Pago
  app.post("/api/webhook", async (req, res) => {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2), "Query:", req.query);
    const { client, isMock } = await getMpConfig();

    if (isMock || !client) {
      res.status(400).send("Mock mode or missing config");
      return;
    }

    const paymentId = req.body?.data?.id || req.query?.['data.id'] || req.query?.id;
    const type = req.body?.type || req.body?.topic || req.body?.action || req.query?.type || req.query?.topic;

    if ((type === "payment" || type === "payment.created" || type === "payment.updated") && paymentId) {
      try {
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: paymentId });

        if (paymentData.status === "approved") {
          const amountReceived = paymentData.transaction_amount;
          const goalId = paymentData.metadata?.goal_id || "default_goal";
          const payerId = paymentData.metadata?.payer_id; // 'P1' or 'P2'

          console.log(`Payment received! Amount: ${amountReceived}, Payer: ${payerId}`);

          if (amountReceived) {
            const goal = await Goal.findById(goalId);
            if (goal && !goal.payments.some(p => p.paymentId === paymentId.toString())) {
              goal.payments.push({
                paymentId: paymentId.toString(),
                amount: amountReceived,
                payerId: payerId || 'P1'
              });
              if (payerId === 'P2') {
                goal.savedP2 = (goal.savedP2 || 0) + amountReceived;
              } else {
                goal.savedP1 = (goal.savedP1 || 0) + amountReceived;
              }
              await goal.save();
              console.log("MongoDB updated successfully.");
            }
          }
        }
      } catch (error) {
        console.error("Error processing MP webhook:", error);
      }
    }

    res.json({ received: true });
  });

  app.post("/api/create-pix-payment", async (req, res) => {
    try {
      const { amount, goalId, payerId } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Invalid amount" });
        return;
      }

      const { client, isMock } = await getMpConfig();
      
      if (!isMock && client) {
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host;
        const notificationUrl = host && !host.includes('localhost') 
          ? `${protocol}://${host}/api/webhook` 
          : undefined;

        const payment = new Payment(client);
        const paymentData: any = {
          transaction_amount: Number(amount.toFixed(2)),
          description: "Meta Compartilhada",
          payment_method_id: "pix",
          payer: {
            email: "cliente@exemplo.com",
          },
          metadata: { 
            goal_id: goalId || "default_goal",
            payer_id: payerId || "P1"
          },
        };

        if (notificationUrl) {
          paymentData.notification_url = notificationUrl;
        }

        const paymentResponse = await payment.create({
          body: paymentData
        });
        
        console.log("MP Payment Response:", JSON.stringify(paymentResponse, null, 2));
        
        const pixCode = paymentResponse.point_of_interaction?.transaction_data?.qr_code;
        let qrCodeBase64 = paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64;

        if (pixCode && !qrCodeBase64) {
          try {
            const dataUrl = await QRCode.toDataURL(pixCode);
            qrCodeBase64 = dataUrl.split(',')[1];
          } catch (err) {
            console.error("Erro ao gerar QR Code de fallback:", err);
          }
        }

        res.json({
          pixCode: pixCode,
          qrCodeBase64: qrCodeBase64,
          paymentId: paymentResponse.id,
          isMock: false
        });
      } else {
        const mockId = "pi_mock_" + Math.random().toString(36).substring(7);
        res.json({
          paymentId: mockId,
          isMock: true,
          pixCode: "00020101021126580014br.gov.bcb.pix0136mock-pix-key-for-prototype-only5204000053039865405" + amount.toFixed(2) + "5802BR5918Meta Compartilhada6009Sao Paulo62070503***6304ABCD"
        });
      }
    } catch (error: any) {
      console.error("Error creating Pix payment:", error);
      const errorMessage = error.message || error.response?.data?.message || error.cause?.message || "Erro desconhecido";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/check-payment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { client, isMock } = await getMpConfig();

      if (isMock || !client) {
        res.json({ status: "pending", isMock: true });
        return;
      }

      const payment = new Payment(client);
      const paymentData = await payment.get({ id });

      if (paymentData.status === "approved") {
        const amountReceived = paymentData.transaction_amount;
        const goalId = paymentData.metadata?.goal_id || "default_goal";
        const payerId = paymentData.metadata?.payer_id;

        if (amountReceived) {
          const goal = await Goal.findById(goalId);
          if (goal && !goal.payments.some(p => p.paymentId === id)) {
            goal.payments.push({
              paymentId: id,
              amount: amountReceived,
              payerId: payerId || 'P1'
            });
            if (payerId === 'P2') {
              goal.savedP2 = (goal.savedP2 || 0) + amountReceived;
            } else {
              goal.savedP1 = (goal.savedP1 || 0) + amountReceived;
            }
            await goal.save();
          }
        }
      }

      res.json({ status: paymentData.status });
    } catch (error: any) {
      console.error("Error checking payment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mock-pay", async (req, res) => {
    const { amount, goalId, payerId } = req.body;
    try {
      const mockPaymentId = "mock_" + Date.now();
      const goal = await Goal.findById(goalId || "default_goal");
      if (goal) {
        goal.payments.push({
          paymentId: mockPaymentId,
          amount: amount,
          payerId: payerId || 'P1'
        });
        if (payerId === 'P2') {
          goal.savedP2 = (goal.savedP2 || 0) + amount;
        } else {
          goal.savedP1 = (goal.savedP1 || 0) + amount;
        }
        await goal.save();
      } else {
        const newGoal = { 
          _id: goalId || "default_goal",
          payments: [{
            paymentId: mockPaymentId,
            amount: amount,
            payerId: payerId || 'P1'
          }]
        } as any;
        if (payerId === 'P2') newGoal.savedP2 = amount;
        else newGoal.savedP1 = amount;
        await Goal.create(newGoal);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
