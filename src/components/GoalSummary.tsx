import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, MessageCircle, Copy, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState } from 'react';

interface GoalSummaryProps {
  results: any;
  nameP1: string;
  nameP2: string;
  contributionP1: string;
  contributionP2: number;
  frequencyP1: string;
  frequencyP2: string;
  phoneP1: string;
  phoneP2: string;
  itemName: string;
  formatCurrency: (value: number) => string;
  getFreqLabel: (freq: string) => string;
  handleExportText: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export function GoalSummary({
  results,
  nameP1,
  nameP2,
  contributionP1,
  contributionP2,
  frequencyP1,
  frequencyP2,
  phoneP1,
  phoneP2,
  itemName,
  formatCurrency,
  getFreqLabel,
  handleExportText,
  showToast
}: GoalSummaryProps) {
  const [chargeModalState, setChargeModalState] = useState<{
    isOpen: boolean;
    name: string;
    phone: string;
    amount: number;
    pixCode: string;
    text: string;
  }>({
    isOpen: false,
    name: '',
    phone: '',
    amount: 0,
    pixCode: '',
    text: ''
  });

  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCharge = async (name: string, phone: string, amount: number) => {
    if (!phone) {
      showToast(`Cadastre o WhatsApp de ${name} na área de Divisão da Meta.`, "error");
      return;
    }
    
    try {
      showToast("Gerando código Pix...", "success");
      const res = await fetch("/api/create-pix-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount })
      });
      const data = await res.json();
      const pixCode = data.pixCode;
      
      const isFeminine = (n: string) => {
        const firstWord = n.trim().split(' ')[0].toLowerCase();
        return firstWord.endsWith('a') || firstWord.endsWith('ely') || firstWord.endsWith('ele') || firstWord.endsWith('eli');
      };
      
      const term = isFeminine(name) ? 'sua parcela' : 'seu pagamento';
      const adjective = isFeminine(name) ? 'atrasada' : 'atrasado';
      
      const text = `Oi ${name}, vi que ${term} da meta *${itemName || 'Sem nome'}* está ${adjective}. O valor é de *${formatCurrency(amount)}*. Vou te mandar o código Pix Copia e Cola separadamente logo abaixo para facilitar o pagamento!`;

      setChargeModalState({
        isOpen: true,
        name,
        phone,
        amount,
        pixCode,
        text
      });
      setCopiedPix(false);
      setCopiedText(false);

    } catch (err) {
      console.error(err);
      showToast("Erro ao gerar Pix para cobrança.", "error");
    }
  };

  const copyToClipboard = (text: string, type: 'pix' | 'text') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'pix') {
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 2000);
        showToast("Código Pix copiado!", "success");
      } else {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
        showToast("Texto copiado!", "success");
      }
    });
  };

  const sendWhatsAppMsg = () => {
    const encodedText = encodeURIComponent(chargeModalState.text);
    const cleanPhone = chargeModalState.phone.replace(/\D/g, "");
    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodedText}`, '_blank');
  };

  const sendWhatsAppPix = () => {
    const encodedPix = encodeURIComponent(chargeModalState.pixCode);
    const cleanPhone = chargeModalState.phone.replace(/\D/g, "");
    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodedPix}`, '_blank');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-rose-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl mb-2">
                {nameP1.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-semibold text-slate-700">{nameP1} <span className="text-slate-400 font-normal text-sm">({contributionP1}%)</span></h4>
              
              <div className="space-y-2 w-full mt-2">
                <div className="flex justify-between items-center bg-rose-50 p-2 rounded border border-rose-100">
                  <span className="text-sm font-medium text-rose-700">{getFreqLabel(frequencyP1)}</span>
                  <span className="font-bold text-rose-700 text-lg">{formatCurrency(results.installmentP1)}</span>
                </div>
                {results.isLateP1 && <p className="text-xs text-red-500 font-bold animate-pulse">Este pagamento está em atraso!</p>}
                <Button 
                  variant={results.isLateP1 ? "default" : "outline"}
                  size="sm" 
                  className={`w-full ${results.isLateP1 ? "bg-red-500 hover:bg-red-600 text-white" : "text-rose-600 border-rose-200 hover:bg-rose-50"}`}
                  onClick={() => handleCharge(nameP1, phoneP1, results.installmentP1)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {results.isLateP1 ? "Cobrar Atraso" : "Lembrar Pagamento"}
                </Button>
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
                <div className="flex justify-between items-center bg-slate-100 p-2 rounded border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">{getFreqLabel(frequencyP2)}</span>
                  <span className="font-bold text-slate-700 text-lg">{formatCurrency(results.installmentP2)}</span>
                </div>
                {results.isLateP2 && <p className="text-xs text-red-500 font-bold animate-pulse">Este pagamento está em atraso!</p>}
                <Button 
                  variant={results.isLateP2 ? "default" : "outline"}
                  size="sm" 
                  className={`w-full ${results.isLateP2 ? "bg-red-500 hover:bg-red-600 text-white" : "text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                  onClick={() => handleCharge(nameP2, phoneP2, results.installmentP2)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {results.isLateP2 ? "Cobrar Atraso" : "Lembrar Pagamento"}
                </Button>
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

      {chargeModalState.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader className="bg-emerald-50 border-b border-emerald-100 rounded-t-xl">
              <CardTitle className="text-emerald-800">Enviar Cobrança</CardTitle>
              <CardDescription className="text-emerald-600">
                O WhatsApp envia apenas uma mensagem por vez no atalho automático. Complete o envio em 2 passos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <Button 
                  onClick={sendWhatsAppMsg} 
                  className="w-full bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 flex justify-start h-auto p-4 relative shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mr-3 shrink-0">1</div>
                  <div className="text-left font-normal overflow-hidden w-full">
                    <span className="block font-bold text-slate-900 mb-1">Clica aqui para Enviar Mensagem</span>
                    <span className="text-xs text-slate-500 truncate block">"{chargeModalState.text}"</span>
                  </div>
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                </Button>

                <Button 
                  onClick={sendWhatsAppPix} 
                  className="w-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex justify-start h-auto p-4 relative shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mr-3 shrink-0">2</div>
                  <div className="text-left font-normal overflow-hidden w-full">
                    <span className="block font-bold text-emerald-900 mb-1">Clica aqui para Enviar Código Pix</span>
                    <span className="text-xs text-emerald-600/70 truncate block">{chargeModalState.pixCode}</span>
                  </div>
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                </Button>
              </div>

            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-xl gap-2">
              <Button variant="ghost" className="w-full" onClick={() => setChargeModalState(prev => ({...prev, isOpen: false}))}>
                Fechar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
