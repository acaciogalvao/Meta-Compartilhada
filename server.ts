import express from "express";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Payment } from "mercadopago";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import QRCode from "qrcode";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, runTransaction } from "firebase/firestore";

dotenv.config();

// Initialize Firebase Client SDK
let db: any = null;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.error("Error initializing Firebase Client in server:", e);
}

// Initialize Mercado Pago
let cachedMpClient: MercadoPagoConfig | null = null;
let cachedToken: string | null = null;

async function getMpConfig(): Promise<{ client: MercadoPagoConfig | null, isMock: boolean }> {
  // O usuário mencionou que criou a chave com o nome APP_USR no Google Studio
  let token = process.env.APP_USR || process.env.MP_ACCESS_TOKEN;
  
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

  // Webhook endpoint for Mercado Pago
  app.post("/api/webhook", async (req, res) => {
    const { client, isMock } = await getMpConfig();

    if (isMock || !client) {
      res.status(400).send("Mock mode or missing config");
      return;
    }

    const paymentId = req.body?.data?.id;
    const type = req.body?.type || req.body?.topic; // MP sends 'payment' in type or topic

    if ((type === "payment" || type === "payment.created" || type === "payment.updated") && paymentId) {
      try {
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: paymentId });

        if (paymentData.status === "approved") {
          const amountReceived = paymentData.transaction_amount;
          const goalId = paymentData.metadata?.goal_id || "default_goal";

          console.log(`Payment received! Amount: ${amountReceived}`);

          const goalRef = doc(db, "goals", goalId);
          await runTransaction(db, async (t) => {
            const docSnap = await t.get(goalRef);
            const paymentRef = doc(db, "goals", goalId, "payments", paymentId.toString());
            const paymentSnap = await t.get(paymentRef);

            if (!paymentSnap.exists()) {
              t.set(paymentRef, { amount: amountReceived, date: new Date().toISOString() });

              if (!docSnap.exists()) {
                t.set(goalRef, { alreadySaved: amountReceived });
              } else {
                const currentSaved = docSnap.data()?.alreadySaved || 0;
                t.update(goalRef, { alreadySaved: currentSaved + amountReceived });
              }
            }
          });
          console.log("Firestore updated successfully.");
        }
      } catch (error) {
        console.error("Error processing MP webhook:", error);
      }
    }

    res.json({ received: true });
  });

  app.post("/api/create-pix-payment", async (req, res) => {
    try {
      const { amount, goalId } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Invalid amount" });
        return;
      }

      const { client, isMock } = await getMpConfig();
      
      if (!isMock && client) {
        // Real Mercado Pago flow
        const payment = new Payment(client);
        const paymentResponse = await payment.create({
          body: {
            transaction_amount: Number(amount.toFixed(2)),
            description: "Meta Compartilhada",
            payment_method_id: "pix",
            payer: {
              email: "cliente@exemplo.com", // MP requires an email
            },
            metadata: { goal_id: goalId || "default_goal" },
          }
        });
        
        console.log("MP Payment Response:", JSON.stringify(paymentResponse, null, 2));
        
        const pixCode = paymentResponse.point_of_interaction?.transaction_data?.qr_code;
        let qrCodeBase64 = paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64;

        // Se o Mercado Pago não retornar a imagem em base64, geramos uma a partir do código copia e cola
        if (pixCode && !qrCodeBase64) {
          try {
            // QRCode.toDataURL retorna algo como "data:image/png;base64,iVBORw0KGgo..."
            // Precisamos remover o prefixo para manter a compatibilidade com o frontend
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
        // Mock flow for prototype
        const mockId = "pi_mock_" + Math.random().toString(36).substring(7);
        res.json({
          paymentId: mockId,
          isMock: true,
          pixCode: "00020101021126580014br.gov.bcb.pix0136mock-pix-key-for-prototype-only5204000053039865405" + amount.toFixed(2) + "5802BR5918Meta Compartilhada6009Sao Paulo62070503***6304ABCD"
        });
      }
    } catch (error: any) {
      console.error("Error creating Pix payment:", error);
      // Extrair mensagem de erro detalhada do Mercado Pago se existir
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
        // Update firestore if not already updated
        const amountReceived = paymentData.transaction_amount;
        const goalId = paymentData.metadata?.goal_id || "default_goal";

        if (db && amountReceived) {
          const goalRef = doc(db, "goals", goalId);
          await runTransaction(db, async (t) => {
            const docSnap = await t.get(goalRef);
            // We need to make sure we don't double-count if webhook already processed it.
            // A robust way is to store processed payment IDs. For simplicity, we'll store it in a subcollection or array.
            // Let's use a 'payments' subcollection to track processed payments.
            const paymentRef = doc(db, "goals", goalId, "payments", id);
            const paymentSnap = await t.get(paymentRef);
            
            if (!paymentSnap.exists()) {
              // Mark as processed
              t.set(paymentRef, { amount: amountReceived, date: new Date().toISOString() });
              
              // Update total
              if (!docSnap.exists()) {
                t.set(goalRef, { alreadySaved: amountReceived });
              } else {
                const currentSaved = docSnap.data()?.alreadySaved || 0;
                t.update(goalRef, { alreadySaved: currentSaved + amountReceived });
              }
            }
          });
        }
      }

      res.json({ status: paymentData.status });
    } catch (error: any) {
      console.error("Error checking payment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mock-pay", async (req, res) => {
    // This endpoint simulates a webhook from the bank/Stripe
    const { amount, goalId } = req.body;
    try {
      if (db) {
        const goalRef = doc(db, "goals", goalId || "default_goal");
        await runTransaction(db, async (t) => {
          const docSnap = await t.get(goalRef);
          if (!docSnap.exists()) {
            t.set(goalRef, { alreadySaved: amount });
          } else {
            const currentSaved = docSnap.data()?.alreadySaved || 0;
            t.update(goalRef, { alreadySaved: currentSaved + amount });
          }
        });
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
