import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Heart, Target, Calculator, RefreshCcw, Download, TrendingUp, Sparkles, MessageCircle, QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [itemName, setItemName] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [months, setMonths] = useState("12");
  const [contributionP1, setContributionP1] = useState("50");
  const [alreadySaved, setAlreadySaved] = useState("");
  
  const [nameP1, setNameP1] = useState("Você");
  const [nameP2, setNameP2] = useState("Seu Amor");

  // Pix Modal State
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixAmount, setPixAmount] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [isMockPayment, setIsMockPayment] = useState(true);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Listen to Firestore for real-time updates
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "goals", "default_goal"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.itemName !== undefined) setItemName(data.itemName);
          if (data.totalValue !== undefined) setTotalValue(data.totalValue.toString());
          if (data.months !== undefined) setMonths(data.months.toString());
          if (data.contributionP1 !== undefined) setContributionP1(data.contributionP1.toString());
          if (data.nameP1 !== undefined) setNameP1(data.nameP1);
          if (data.nameP2 !== undefined) setNameP2(data.nameP2);
        }
      } catch (e) {
        console.error("Error loading initial data", e);
      }
    };
    loadInitialData();

    const unsub = onSnapshot(doc(db, "goals", "default_goal"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.alreadySaved !== undefined) {
          setAlreadySaved(data.alreadySaved.toString());
        }
      }
    });
    return () => unsub();
  }, []);

  const saveGoalData = async (updates: any) => {
    try {
      await setDoc(doc(db, "goals", "default_goal"), updates, { merge: true });
    } catch (error) {
      console.error("Error saving goal data:", error);
    }
  };

  // Auto-save debounced
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveGoalData({
        itemName,
        totalValue: Number(totalValue),
        months: Number(months),
        contributionP1: Number(contributionP1),
        nameP1,
        nameP2,
        alreadySaved: Number(alreadySaved)
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [itemName, totalValue, months, contributionP1, nameP1, nameP2, alreadySaved]);

  // Poll payment status
  useEffect(() => {
    if (!paymentId || !showPixModal || paymentSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-payment/${paymentId}`);
        const data = await res.json();
        if (data.status === "approved") {
          setPaymentSuccess(true);
          setTimeout(() => {
            setShowPixModal(false);
            setPaymentSuccess(false);
            setPixCode("");
            setQrCodeBase64("");
            setPixAmount("");
            setPaymentId(null);
          }, 3000);
        }
      } catch (e) {
        console.error("Error checking payment status", e);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [paymentId, showPixModal, paymentSuccess]);

  const handleGeneratePix = async () => {
    const amount = Number(pixAmount);
    if (amount <= 0) return;
    
    setIsGeneratingPix(true);
    try {
      const response = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, goalId: "default_goal" })
      });
      const data = await response.json();
      
      if (!response.ok || data.error) {
        alert(`Erro ao gerar Pix: ${data.error || 'Erro desconhecido'}`);
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
      setIsMockPayment(data.isMock);
    } catch (error) {
      console.error("Error generating pix:", error);
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const handleSimulatePayment = async () => {
    const amount = Number(pixAmount);
    try {
      await fetch('/api/mock-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, goalId: "default_goal" })
      });
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPixModal(false);
        setPaymentSuccess(false);
        setPixCode("");
        setQrCodeBase64("");
        setPixAmount("");
        setPaymentId(null);
      }, 3000);
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
    const saved = Number(alreadySaved) || 0;

    const remaining = Math.max(0, total - saved);
    const progressPercent = total > 0 ? Math.min(100, (saved / total) * 100) : 0;

    const totalP1 = remaining * ((Number(contributionP1) || 0) / 100);
    const totalP2 = remaining * (contributionP2 / 100);

    const monthlyP1 = time > 0 ? totalP1 / time : 0;
    const monthlyP2 = time > 0 ? totalP2 / time : 0;
    const monthlyTotal = time > 0 ? remaining / time : 0;

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
  }, [totalValue, months, contributionP1, alreadySaved]);

  const getMotivationalMessage = (percent: number) => {
    if (percent === 0) return "Toda grande jornada começa com o primeiro passo. Vamos lá!";
    if (percent < 25) return "Bom começo! O importante é manter a consistência.";
    if (percent < 50) return "Quase na metade! Vocês estão indo super bem.";
    if (percent < 75) return "Passamos da metade! O sonho está cada vez mais perto.";
    if (percent < 100) return "Falta muito pouco! Reta final para a conquista.";
    return "Parabéns! Vocês alcançaram a meta juntos! 🎉";
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

  const handleReset = () => {
    setItemName("");
    setTotalValue("");
    setMonths("12");
    setContributionP1("50");
    setAlreadySaved("");
  };

  const handleExportText = () => {
    const text = `
🎯 Nossa Meta: ${itemName || 'Sem nome'}
💰 Valor Total: ${formatCurrency(results.total)}
⏳ Prazo: ${results.time} meses
✅ Já guardamos: ${formatCurrency(results.saved)} (${results.progressPercent.toFixed(1)}%)
📉 Falta: ${formatCurrency(results.remaining)}

Mensalidade para alcançar a meta:
👤 ${nameP1} (${contributionP1}%):
   - ${formatCurrency(results.dailyP1)}/dia
   - ${formatCurrency(results.weeklyP1)}/semana
   - ${formatCurrency(results.monthlyP1)}/mês

👤 ${nameP2} (${contributionP2}%):
   - ${formatCurrency(results.dailyP2)}/dia
   - ${formatCurrency(results.weeklyP2)}/semana
   - ${formatCurrency(results.monthlyP2)}/mês

💵 Total por mês: ${formatCurrency(results.monthlyTotal)}

Bora conquistar juntos! ❤️
    `.trim();

    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 p-4 md:p-8 font-sans selection:bg-rose-200 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-2">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Meta Compartilhada</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Calculem juntos como alcançar os sonhos do casal de forma justa e transparente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Inputs */}
          <div className="md:col-span-5 space-y-6">
            <Card className="border-rose-100 shadow-sm">
              <CardHeader className="bg-white/50 border-b border-rose-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-rose-500" />
                  Detalhes do Sonho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="itemName">O que vocês querem comprar?</Label>
                  <Input 
                    id="itemName" 
                    placeholder="Ex: Viagem para Paris, Sofá novo..." 
                    value={itemName ?? ""}
                    onChange={(e) => setItemName(e.target.value)}
                    className="focus-visible:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalValue">Valor Total (R$)</Label>
                    <Input 
                      id="totalValue" 
                      type="text" 
                      inputMode="numeric"
                      placeholder="R$ 0,00" 
                      value={totalValue === "" ? "" : formatCurrency(Number(totalValue))}
                      onChange={(e) => handleCurrencyChange(e, setTotalValue)}
                      className="focus-visible:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alreadySaved">Já guardado (R$)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="alreadySaved" 
                        type="text" 
                        inputMode="numeric"
                        placeholder="R$ 0,00" 
                        value={alreadySaved === "" ? "" : formatCurrency(Number(alreadySaved))}
                        onChange={(e) => handleCurrencyChange(e, setAlreadySaved)}
                        className="focus-visible:ring-rose-500 flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPixModal(true)}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 px-3"
                        title="Depositar via Pix"
                      >
                        <QrCode className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="months">Prazo (meses): {months}</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      id="months"
                      value={[Number(months) || 1]} 
                      min={1} 
                      max={60} 
                      step={1}
                      onValueChange={(vals) => {
                        const val = Array.isArray(vals) ? vals[0] : vals;
                        if (val !== undefined) {
                          setMonths(val.toString());
                        }
                      }}
                      className="[&_[role=slider]]:bg-rose-500 [&_[role=slider]]:border-rose-500"
                    />
                    <Input 
                      type="number" 
                      min="1" max="60"
                      value={months ?? ""}
                      onChange={(e) => setMonths(e.target.value)}
                      className="w-20 focus-visible:ring-rose-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-100 shadow-sm">
              <CardHeader className="bg-white/50 border-b border-rose-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="w-5 h-5 text-rose-500" />
                  Divisão da Meta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Pessoa 1</Label>
                    <Input 
                      value={nameP1 ?? ""}
                      onChange={(e) => setNameP1(e.target.value)}
                      className="focus-visible:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome da Pessoa 2</Label>
                    <Input 
                      value={nameP2 ?? ""}
                      onChange={(e) => setNameP2(e.target.value)}
                      className="focus-visible:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Contribuição {nameP1} (%)</Label>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      value={contributionP1 ?? ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val !== "" && Number(val) > 100) val = "100";
                        if (val !== "" && Number(val) < 0) val = "0";
                        setContributionP1(val);
                      }}
                      className="focus-visible:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contribuição {nameP2} (%)</Label>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      value={contributionP1 === "" ? "" : contributionP2.toString()}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val !== "" && Number(val) > 100) val = "100";
                        if (val !== "" && Number(val) < 0) val = "0";
                        if (val === "") {
                          setContributionP1("");
                        } else {
                          setContributionP1((100 - Number(val)).toString());
                        }
                      }}
                      className="focus-visible:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <Slider 
                    value={[Number(contributionP1) || 0]} 
                    min={0} 
                    max={100} 
                    step={1}
                    onValueChange={(vals) => {
                      const val = Array.isArray(vals) ? vals[0] : vals;
                      if (val !== undefined) {
                        setContributionP1(val.toString());
                      }
                    }}
                    className="[&_[role=slider]]:bg-rose-500 [&_[role=slider]]:border-rose-500"
                  />
                  <p className="text-xs text-slate-500 text-center">Deslize para ajustar a proporção de cada um</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t flex justify-between">
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

            {/* Monthly Plan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-rose-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl mb-2">
                      {nameP1.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="font-semibold text-slate-700">{nameP1} <span className="text-slate-400 font-normal text-sm">({contributionP1}%)</span></h4>
                    
                    <div className="space-y-2 w-full mt-2">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="text-sm text-slate-500">Por dia</span>
                        <span className="font-bold text-slate-700">{formatCurrency(results.dailyP1)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="text-sm text-slate-500">Por semana</span>
                        <span className="font-bold text-slate-700">{formatCurrency(results.weeklyP1)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-rose-50 p-2 rounded border border-rose-100">
                        <span className="text-sm font-medium text-rose-700">Por mês</span>
                        <span className="font-bold text-rose-700 text-lg">{formatCurrency(results.monthlyP1)}</span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-100 my-2"></div>
                    <p className="text-xs text-slate-400">Total a juntar: {formatCurrency(results.totalP1)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl mb-2">
                      {nameP2.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="font-semibold text-slate-700">{nameP2} <span className="text-slate-400 font-normal text-sm">({contributionP2}%)</span></h4>
                    
                    <div className="space-y-2 w-full mt-2">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="text-sm text-slate-500">Por dia</span>
                        <span className="font-bold text-slate-700">{formatCurrency(results.dailyP2)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="text-sm text-slate-500">Por semana</span>
                        <span className="font-bold text-slate-700">{formatCurrency(results.weeklyP2)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-100 p-2 rounded border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">Por mês</span>
                        <span className="font-bold text-slate-700 text-lg">{formatCurrency(results.monthlyP2)}</span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-100 my-2"></div>
                    <p className="text-xs text-slate-400">Total a juntar: {formatCurrency(results.totalP2)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="border-rose-100 shadow-sm">
              <CardHeader className="bg-white/50 border-b border-rose-50/50 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-rose-500" />
                  Projeção da Meta
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleExportText} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar p/ WhatsApp
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748b' }} 
                        dy={10}
                      />
                      <YAxis 
                        hide 
                        domain={[0, 'dataMax + 1000']} 
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <ReferenceLine y={results.total} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Meta', fill: '#10b981', fontSize: 12 }} />
                      <Bar dataKey="acumulado" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      {/* Pix Modal */}
      {showPixModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <QrCode className="w-6 h-6" />
                Depositar via Pix
              </CardTitle>
              <CardDescription>
                Adicione dinheiro à sua meta compartilhada. O valor será atualizado automaticamente para ambos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-emerald-600 space-y-4">
                  <CheckCircle2 className="w-16 h-16 animate-bounce" />
                  <p className="text-xl font-bold">Pagamento Confirmado!</p>
                  <p className="text-sm text-slate-500 text-center">O valor já foi adicionado à sua meta.</p>
                </div>
              ) : !pixCode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Valor do Depósito</Label>
                    <Input 
                      type="text"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={pixAmount === "" ? "" : formatCurrency(Number(pixAmount))}
                      onChange={(e) => handleCurrencyChange(e, setPixAmount)}
                      className="text-lg"
                    />
                  </div>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleGeneratePix}
                    disabled={isGeneratingPix || !pixAmount || Number(pixAmount) === 0}
                  >
                    {isGeneratingPix ? "Gerando..." : "Gerar Código Pix"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm">
                    {qrCodeBase64 ? (
                      <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
                    ) : (
                      <QrCode className="w-48 h-48 text-slate-800" />
                    )}
                  </div>
                  
                  <div className="w-full space-y-2">
                    <Label>Pix Copia e Cola</Label>
                    <div className="flex gap-2">
                      <Input value={pixCode} readOnly className="bg-slate-50 font-mono text-xs" />
                      <Button variant="outline" onClick={copyPixCode} className="shrink-0">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {isMockPayment && (
                    <div className="w-full p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800 text-center mb-3">
                        <strong>Modo Protótipo:</strong> Como este é um ambiente de teste, clique abaixo para simular que você pagou no seu banco.
                      </p>
                      <Button 
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={handleSimulatePayment}
                      >
                        Simular Pagamento Realizado
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {!paymentSuccess && (
              <CardFooter className="flex justify-end">
                <Button variant="ghost" onClick={() => {
                  setShowPixModal(false);
                  setPixCode("");
                  setPixAmount("");
                }}>
                  Cancelar
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
