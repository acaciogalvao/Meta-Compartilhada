import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Heart, Target, Calculator, RefreshCcw, Download, TrendingUp, Sparkles, MessageCircle, QrCode, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PaymentHistory } from './components/PaymentHistory';
import { PixModal } from './components/PixModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ClearHistoryConfirmModal } from './components/ClearHistoryConfirmModal';
import { GoalSummary } from './components/GoalSummary';
import { GoalConfig } from './components/GoalConfig';
import { GoalDivision } from './components/GoalDivision';
import confetti from 'canvas-confetti';

export default function App() {
  const [toastMessage, setToastMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [currentGoalId, setCurrentGoalId] = useState<string>("");

  const [itemName, setItemName] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [months, setMonths] = useState("12");
  const [contributionP1, setContributionP1] = useState("50");
  const [savedP1, setSavedP1] = useState("");
  const [savedP2, setSavedP2] = useState("");
  const [paymentsHistory, setPaymentsHistory] = useState<any[]>([]);
  
  const [nameP1, setNameP1] = useState("Você");
  const [nameP2, setNameP2] = useState("Seu Amor");
  const [phoneP1, setPhoneP1] = useState("");
  const [phoneP2, setPhoneP2] = useState("");
  const [pixKeyP1, setPixKeyP1] = useState("");
  const [pixKeyP2, setPixKeyP2] = useState("");
  const [frequencyP1, setFrequencyP1] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [frequencyP2, setFrequencyP2] = useState<"daily" | "weekly" | "monthly">("monthly");

  // Pix Modal State
  const [showPixModal, setShowPixModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [currentPayer, setCurrentPayer] = useState<"P1" | "P2">("P1");
  const [pixAmount, setPixAmount] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [isMockPayment, setIsMockPayment] = useState(true);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch data from MongoDB
  const clearGoalData = () => {
    setCurrentGoalId("");
    setItemName("");
    setTotalValue("");
    setMonths("12");
    setContributionP1("50");
    setNameP1("Você");
    setNameP2("Seu Amor");
    setPhoneP1("");
    setPhoneP2("");
    setPixKeyP1("");
    setPixKeyP2("");
    setFrequencyP1("monthly");
    setFrequencyP2("monthly");
    setSavedP1("");
    setSavedP2("");
    setPaymentsHistory([]);
  };

  const populateGoalData = (data: any, isInitialLoad: boolean = false) => {
    if (isInitialLoad) {
      if (data.itemName !== undefined) setItemName(data.itemName);
      if (data.totalValue !== undefined) setTotalValue(data.totalValue.toString());
      if (data.months !== undefined) setMonths(data.months.toString());
      if (data.contributionP1 !== undefined) setContributionP1(data.contributionP1.toString());
      if (data.nameP1 !== undefined) setNameP1(data.nameP1);
      if (data.nameP2 !== undefined) setNameP2(data.nameP2);
      if (data.phoneP1 !== undefined) setPhoneP1(data.phoneP1);
      if (data.phoneP2 !== undefined) setPhoneP2(data.phoneP2);
      if (data.pixKeyP1 !== undefined) setPixKeyP1(data.pixKeyP1);
      if (data.pixKeyP2 !== undefined) setPixKeyP2(data.pixKeyP2);
      if (data.frequencyP1 !== undefined) setFrequencyP1(data.frequencyP1);
      if (data.frequencyP2 !== undefined) setFrequencyP2(data.frequencyP2);
    }
    
    // Check if goal was just completed
    const oldSaved = Number(savedP1) + Number(savedP2);
    const newSaved = (data.savedP1 || 0) + (data.savedP2 || 0);
    const total = data.totalValue || 0;
    
    if (data.savedP1 !== undefined) setSavedP1(data.savedP1.toString());
    if (data.savedP2 !== undefined) setSavedP2(data.savedP2.toString());
    if (data.payments !== undefined) setPaymentsHistory(data.payments);

    if (newSaved >= total && oldSaved < total && total > 0) {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // Create a custom canvas to avoid conflicts with global canvas variables
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    });

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }, 3000);
        return;
      }

      const particleCount = Math.floor(50 * (timeLeft / duration));
      myConfetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      myConfetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await fetch("/api/goals");
        if (!res.ok) return;
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           return;
        }
        
        const data = await res.json();
        setGoalsList(data);
        if (data.length > 0) {
          setCurrentGoalId(data[0]._id);
        } else {
          clearGoalData();
        }
      } catch (e) {
        console.error("Error loading initial goals", e);
      }
    };
    loadInitial();
  }, []);

  // Polling and data fetching when currentGoalId changes
  useEffect(() => {
    const fetchGoalsList = async () => {
      try {
        const res = await fetch("/api/goals");
        if (!res.ok) return;
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return;
        }
        
        const data = await res.json();
        setGoalsList(data);
      } catch (e: any) {
        if (e.message === "Failed to fetch") return;
        console.error("Error loading goals list", e);
      }
    };

    const fetchGoalData = async (isInitialLoad: boolean = false) => {
      if (!currentGoalId) return;
      
      try {
        const res = await fetch(`/api/goal/${currentGoalId}`);
        if (!res.ok) return;
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return;
        }
        
        const data = await res.json();
        populateGoalData(data, isInitialLoad);
      } catch (e: any) {
        // Ignore network errors during polling (e.g. when server restarts)
        if (e.message === "Failed to fetch") return;
        console.error("Error loading initial data", e);
      }
    };
    
    if (currentGoalId) {
      fetchGoalData(true);
    }
    
    const interval = setInterval(() => {
      if (currentGoalId) {
        fetchGoalData(false);
      }
      fetchGoalsList();
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [currentGoalId]);

  const handleSaveGoals = async () => {
    try {
      const updates = {
        itemName,
        totalValue: Number(totalValue),
        months: Number(months),
        contributionP1: Number(contributionP1),
        nameP1,
        nameP2,
        phoneP1,
        phoneP2,
        pixKeyP1,
        pixKeyP2,
        frequencyP1,
        frequencyP2,
        savedP1: Number(savedP1),
        savedP2: Number(savedP2)
      };

      let res;
      if (currentGoalId) {
        res = await fetch(`/api/goal/${currentGoalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
      } else {
        res = await fetch("/api/goal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
      }
      
      if (res.ok) {
        const savedGoal = await res.json();
        setCurrentGoalId(savedGoal._id);
        
        // Update goals list
        const listRes = await fetch("/api/goals");
        if (listRes.ok) {
          const data = await listRes.json();
          setGoalsList(data);
        }
        showToast("Metas salvas com sucesso!", "success");
      } else {
        showToast("Erro ao salvar metas.");
      }
    } catch (error) {
      console.error("Error saving goal data:", error);
      showToast("Erro ao salvar metas.");
    }
  };

  const handleCreateNewGoal = () => {
    clearGoalData();
  };

  const handleClearHistoryClick = () => {
    setShowClearHistoryConfirm(true);
  };

  const confirmClearHistory = async () => {
    try {
      await Promise.all(paymentsHistory.map(p => 
        fetch(`/api/goal/${currentGoalId}/payment/${p.paymentId}`, { method: "DELETE" })
      ));
      showToast("Histórico excluído com sucesso!", "success");
      
      // Reset saved amounts locally
      setSavedP1("0");
      setSavedP2("0");
      setPaymentsHistory([]);
      
      // Re-fetch to ensure sync
      const res = await fetch(`/api/goal/${currentGoalId}`);
      if (res.ok) {
        const data = await res.json();
        populateGoalData(data, false);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      showToast("Erro ao excluir histórico.", "error");
    } finally {
      setShowClearHistoryConfirm(false);
    }
  };

  const handleDeleteGoal = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteGoal = async () => {
    try {
      await fetch(`/api/goal/${currentGoalId}`, {
        method: "DELETE"
      });
      
      // Update goals list
      const listRes = await fetch("/api/goals");
      if (listRes.ok) {
        const data = await listRes.json();
        setGoalsList(data);
        if (data.length > 0) {
          setCurrentGoalId(data[0]._id);
        } else {
          clearGoalData(); // Clear fields if all are deleted
        }
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting goal:", error);
      // Fallback if alert is blocked, we just log it
    }
  };

  // Poll payment status
  useEffect(() => {
    if (!paymentId || !showPixModal || paymentSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-payment/${paymentId}`);
        const data = await res.json();
        if (data.status === "approved") {
          setPaymentSuccess(true);
          
          // Fetch updated data immediately
          fetch(`/api/goal/${currentGoalId}`)
            .then(r => {
              if (!r.ok || !r.headers.get("content-type")?.includes("application/json")) {
                throw new Error("Invalid response");
              }
              return r.json();
            })
            .then(goalData => {
            if (goalData.savedP1 !== undefined) setSavedP1(goalData.savedP1.toString());
            if (goalData.savedP2 !== undefined) setSavedP2(goalData.savedP2.toString());
            if (goalData.payments !== undefined) setPaymentsHistory(goalData.payments);
          }).catch(console.error);

          setTimeout(() => {
            setShowPixModal(false);
            setPaymentSuccess(false);
            setPixCode("");
            setQrCodeBase64("");
            setPixAmount("");
            setPaymentId(null);
          }, 2000);
        }
      } catch (e: any) {
        if (e.message === "Failed to fetch") return;
        console.error("Error checking payment status", e);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [paymentId, showPixModal, paymentSuccess]);

  const handleGeneratePix = async () => {
    if (!currentGoalId) {
      showToast("Por favor, salve a meta antes de gerar um Pix.");
      return;
    }
    const amount = Number(pixAmount);
    if (amount <= 0) return;
    
    setIsGeneratingPix(true);
    try {
      const activePixKey = currentPayer === "P1" ? pixKeyP1 : pixKeyP2;
      
      let response;
      if (activePixKey) {
        // Option 1: Direct personal Pix key provided
        response = await fetch('/api/generate-static-pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount, 
            pixKey: activePixKey,
            merchantName: currentPayer === "P1" ? nameP1 : nameP2
          })
        });
        
        // In personal pix mode, we don't have a MercadoPago ID to poll
        setPaymentId(null);
        // We set it as mock payment to show the 'Mock Pay' / 'Já Paguei' button
        setIsMockPayment(true);
        
      } else {
        // Option 2: Mercado Pago backend
        response = await fetch('/api/create-pix-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, goalId: currentGoalId, payerId: currentPayer })
        });
      }

      const data = await response.json();
      
      if (!response.ok || data.error) {
        showToast(`Erro ao gerar Pix: ${data.error || 'Erro desconhecido'}`);
        return;
      }
      
      if (data.pixCode) {
        setPixCode(data.pixCode);
      }
      if (data.qrCodeBase64) {
        setQrCodeBase64(data.qrCodeBase64);
      }
      if (data.paymentId) {
        setPaymentId(data.paymentId);
      }
      if (data.isMock !== undefined && !activePixKey) {
        setIsMockPayment(data.isMock);
      }
    } catch (error) {
      console.error("Error generating pix:", error);
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!currentGoalId) {
      showToast("Por favor, salve a meta antes de simular um pagamento.");
      return;
    }
    const amount = Number(pixAmount);
    try {
      await fetch('/api/mock-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, goalId: currentGoalId, payerId: currentPayer })
      });
      setPaymentSuccess(true);
      
      // Fetch updated data immediately
      fetch(`/api/goal/${currentGoalId}`)
        .then(r => {
          if (!r.ok || !r.headers.get("content-type")?.includes("application/json")) {
            throw new Error("Invalid response");
          }
          return r.json();
        })
        .then(goalData => {
        if (goalData.savedP1 !== undefined) setSavedP1(goalData.savedP1.toString());
        if (goalData.savedP2 !== undefined) setSavedP2(goalData.savedP2.toString());
        if (goalData.payments !== undefined) setPaymentsHistory(goalData.payments);
      }).catch(console.error);

      setTimeout(() => {
        setShowPixModal(false);
        setPaymentSuccess(false);
        setPixCode("");
        setQrCodeBase64("");
        setPixAmount("");
        setPaymentId(null);
      }, 2000);
    } catch (error) {
      console.error("Error simulating payment:", error);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contributionP2 = 100 - (Number(contributionP1) || 0);

  const results = useMemo(() => {
    const total = Number(totalValue) || 0;
    const time = Number(months) || 1;
    const sP1 = Number(savedP1) || 0;
    const sP2 = Number(savedP2) || 0;
    const saved = sP1 + sP2;

    const remaining = Math.max(0, total - saved);
    const progressPercent = total > 0 ? Math.min(100, (saved / total) * 100) : 0;

    const totalP1 = total * ((Number(contributionP1) || 0) / 100);
    const totalP2 = total * (contributionP2 / 100);

    const remainingP1 = Math.max(0, totalP1 - sP1);
    const remainingP2 = Math.max(0, totalP2 - sP2);

    const getInstallment = (remainingAmount: number, monthsTime: number, freq: string) => {
      if (monthsTime <= 0) return 0;
      if (freq === 'daily') return remainingAmount / (monthsTime * 30.4166);
      if (freq === 'weekly') return remainingAmount / (monthsTime * 4.3333);
      return remainingAmount / monthsTime; // monthly
    };

    const installmentP1 = getInstallment(remainingP1, time, frequencyP1);
    const installmentP2 = getInstallment(remainingP2, time, frequencyP2);

    const monthlyP1 = time > 0 ? remainingP1 / time : 0;
    const monthlyP2 = time > 0 ? remainingP2 / time : 0;
    const monthlyTotal = monthlyP1 + monthlyP2;

    const weeklyP1 = monthlyP1 / 4.3333;
    const weeklyP2 = monthlyP2 / 4.3333;
    const weeklyTotal = monthlyTotal / 4.3333;

    const dailyP1 = monthlyP1 / 30.4166;
    const dailyP2 = monthlyP2 / 30.4166;
    const dailyTotal = monthlyTotal / 30.4166;

    // Chart Data Projection
    const chartData = [];
    let currentSaved = saved;
    for (let i = 0; i <= time; i++) {
      chartData.push({
        month: i === 0 ? 'Hoje' : `Mês ${i}`,
        acumulado: currentSaved,
        meta: total
      });
      currentSaved += monthlyTotal;
    }

    return {
      total,
      time,
      saved,
      remaining,
      progressPercent,
      totalP1,
      totalP2,
      remainingP1,
      remainingP2,
      installmentP1,
      installmentP2,
      monthlyP1,
      monthlyP2,
      monthlyTotal,
      weeklyP1,
      weeklyP2,
      weeklyTotal,
      dailyP1,
      dailyP2,
      dailyTotal,
      chartData
    };
  }, [totalValue, months, contributionP1, savedP1, savedP2, frequencyP1, frequencyP2, contributionP2]);

  const getMotivationalMessage = (percent: number) => {
    if (percent === 0) return "Toda grande jornada começa com o primeiro passo. Vamos lá!";
    if (percent < 25) return "Bom começo! O importante é manter a consistência.";
    if (percent < 50) return "Quase na metade! Vocês estão indo super bem.";
    if (percent < 75) return "Passamos da metade! O sonho está cada vez mais perto.";
    if (percent < 100) return "Falta muito pouco! Reta final para a conquista.";
    return "🎉 Parabéns! Vocês alcançaram a meta juntos! Que venham os próximos sonhos!";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      setter("");
      return;
    }
    const numericValue = Number(digits) / 100;
    setter(numericValue.toString());
  };

  const getFreqLabel = (freq: string) => {
    if (freq === 'daily') return 'Por dia';
    if (freq === 'weekly') return 'Por semana';
    return 'Por mês';
  };

  const handleReset = () => {
    setItemName("");
    setTotalValue("");
    setMonths("12");
    setContributionP1("50");
    setSavedP1("");
    setSavedP2("");
  };

  const handleExportText = () => {
    const text = `
🎯 Nossa Meta: ${itemName || 'Sem nome'}
💰 Valor Total: ${formatCurrency(results.total)}
⏳ Prazo: ${results.time} meses
✅ Já guardamos: ${formatCurrency(results.saved)} (${results.progressPercent.toFixed(1)}%)
📉 Falta: ${formatCurrency(results.remaining)}

📊 Resumo Individual:
👤 ${nameP1} (${contributionP1}%):
   - Já pagou: ${formatCurrency(Number(savedP1) || 0)}
   - Falta pagar: ${formatCurrency(results.remainingP1)}
   - Parcela: ${formatCurrency(results.installmentP1)} ${getFreqLabel(frequencyP1).toLowerCase()}

👤 ${nameP2} (${contributionP2}%):
   - Já pagou: ${formatCurrency(Number(savedP2) || 0)}
   - Falta pagar: ${formatCurrency(results.remainingP2)}
   - Parcela: ${formatCurrency(results.installmentP2)} ${getFreqLabel(frequencyP2).toLowerCase()}

💵 Total das parcelas por mês: ${formatCurrency(results.monthlyTotal)}

Bora conquistar juntos! ❤️
    `.trim();

    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 p-4 md:p-8 font-sans selection:bg-rose-200 relative">
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${toastMessage.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {toastMessage.text}
        </div>
      )}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Meta Compartilhada</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Calculem juntos como alcançar os sonhos do casal de forma justa e transparente.</p>
        </div>

        {/* Goals List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {goalsList.map(goal => (
            <Button 
              key={goal._id} 
              variant={currentGoalId === goal._id ? "default" : "outline"}
              className={currentGoalId === goal._id ? "bg-rose-600 hover:bg-rose-700 whitespace-nowrap" : "text-slate-600 whitespace-nowrap"}
              onClick={() => setCurrentGoalId(goal._id)}
            >
              {goal.itemName || "Nova Meta"}
            </Button>
          ))}
          <Button variant="outline" onClick={handleCreateNewGoal} className="border-dashed border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 whitespace-nowrap">
            + Criar Nova Meta
          </Button>
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={handleDeleteGoal} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Meta
          </Button>
          <Button onClick={handleSaveGoals} className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Salvar Metas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Inputs */}
          <div className="md:col-span-5 space-y-6">
            <GoalConfig 
              itemName={itemName}
              setItemName={setItemName}
              totalValue={totalValue}
              setTotalValue={setTotalValue}
              savedP1={savedP1}
              setSavedP1={setSavedP1}
              savedP2={savedP2}
              setSavedP2={setSavedP2}
              months={months}
              setMonths={setMonths}
              nameP1={nameP1}
              nameP2={nameP2}
              pixKeyP1={pixKeyP1}
              setPixKeyP1={setPixKeyP1}
              pixKeyP2={pixKeyP2}
              setPixKeyP2={setPixKeyP2}
              formatCurrency={formatCurrency}
              handleCurrencyChange={handleCurrencyChange}
              setCurrentPayer={setCurrentPayer}
              setPixAmount={setPixAmount}
              setShowPixModal={setShowPixModal}
              installmentP1={results.installmentP1}
              installmentP2={results.installmentP2}
            />

            <GoalDivision 
              nameP1={nameP1}
              setNameP1={setNameP1}
              nameP2={nameP2}
              setNameP2={setNameP2}
              contributionP1={contributionP1}
              setContributionP1={setContributionP1}
              contributionP2={contributionP2}
              frequencyP1={frequencyP1}
              setFrequencyP1={setFrequencyP1}
              frequencyP2={frequencyP2}
              setFrequencyP2={setFrequencyP2}
              phoneP1={phoneP1}
              setPhoneP1={setPhoneP1}
              phoneP2={phoneP2}
              setPhoneP2={setPhoneP2}
              hasPayments={paymentsHistory.length > 0}
            />

            <Card className="border-rose-100 shadow-sm">
              <CardFooter className="bg-slate-50 border-t flex justify-between pt-6">
                <Button variant="outline" onClick={handleReset} className="w-full text-slate-600">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Limpar Dados
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Progress Card */}
            <Card className="border-rose-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-400"></div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Progresso Atual</h3>
                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(results.saved)} <span className="text-sm font-normal text-slate-500">de {formatCurrency(results.total)}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-rose-500">{results.progressPercent.toFixed(1)}%</span>
                  </div>
                </div>
                <Progress value={results.progressPercent} className="h-3 bg-rose-100 [&>div]:bg-rose-500" />
                <div className="mt-4 flex items-start gap-3 bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-800 font-medium">{getMotivationalMessage(results.progressPercent)}</p>
                </div>
              </CardContent>
            </Card>

            <GoalSummary 
              results={results}
              nameP1={nameP1}
              nameP2={nameP2}
              contributionP1={contributionP1}
              contributionP2={contributionP2}
              frequencyP1={frequencyP1}
              frequencyP2={frequencyP2}
              phoneP1={phoneP1}
              phoneP2={phoneP2}
              itemName={itemName}
              formatCurrency={formatCurrency}
              getFreqLabel={getFreqLabel}
              handleExportText={handleExportText}
              showToast={showToast}
            />

            <PaymentHistory 
              paymentsHistory={paymentsHistory}
              nameP1={nameP1}
              nameP2={nameP2}
              formatCurrency={formatCurrency}
              progressPercent={results.progressPercent}
              handleClearHistory={handleClearHistoryClick}
            />

          </div>
        </div>
      </div>
      
      <DeleteConfirmModal 
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        confirmDeleteGoal={confirmDeleteGoal}
      />

      <ClearHistoryConfirmModal 
        showClearHistoryConfirm={showClearHistoryConfirm}
        setShowClearHistoryConfirm={setShowClearHistoryConfirm}
        confirmClearHistory={confirmClearHistory}
      />

      <PixModal 
        showPixModal={showPixModal}
        setShowPixModal={setShowPixModal}
        currentPayer={currentPayer}
        nameP1={nameP1}
        nameP2={nameP2}
        pixAmount={pixAmount}
        setPixAmount={setPixAmount}
        pixCode={pixCode}
        setPixCode={setPixCode}
        qrCodeBase64={qrCodeBase64}
        isGeneratingPix={isGeneratingPix}
        paymentSuccess={paymentSuccess}
        copied={copied}
        copyPixCode={copyPixCode}
        handleGeneratePix={handleGeneratePix}
        handleSimulatePayment={handleSimulatePayment}
        isMockPayment={isMockPayment}
        setIsMockPayment={setIsMockPayment}
        formatCurrency={formatCurrency}
        handleCurrencyChange={handleCurrencyChange}
      />
    </div>
  );
}
