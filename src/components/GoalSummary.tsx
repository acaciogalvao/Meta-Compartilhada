import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, MessageCircle, Copy, CheckCircle2, Clock, Share2, Edit2, Trash2, PlusCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState } from 'react';

interface GoalSummaryProps {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  handleDeleteGoal: () => void;
  setShowPixModal: (val: boolean) => void;
  setCurrentPayer: (val: "P1" | "P2") => void;
  goalType: "individual" | "shared";
  results: any;
  savedP1: string;
  savedP2: string;
  nameP1: string;
  nameP2: string;
  contributionP1: string;
  contributionP2: number;
  frequencyP1: string;
  frequencyP2: string;
  phoneP1: string;
  phoneP2: string;
  itemName: string;
  months: string;
  formatCurrency: (value: number) => string;
  getFreqLabel: (freq: string) => string;
  handleExportText: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export function GoalSummary({
  isEditing,
  setIsEditing,
  handleDeleteGoal,
  setShowPixModal,
  setCurrentPayer,
  goalType,
  results,
  savedP1,
  savedP2,
  nameP1,
  nameP2,
  contributionP1,
  contributionP2,
  frequencyP1,
  frequencyP2,
  phoneP1,
  phoneP2,
  itemName,
  months,
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
    <div className="space-y-6">
      
      {/* MAIN GOAL CARD */}
      <Card className="bg-rose-50 border-rose-100/60 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-8">
             <div>
               <h2 className="text-2xl font-bold text-slate-900">{itemName || "Nova Meta"}</h2>
               <p className="text-sm text-slate-500 mt-1">{goalType === 'individual' ? nameP1 : `${nameP1} & ${nameP2}`}</p>
             </div>
             <div className="flex gap-1">
               <button onClick={handleExportText} className="p-2 text-rose-400 hover:text-rose-600 transition-colors"><Share2 className="w-5 h-5"/></button>
               <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-rose-400 hover:text-rose-600 transition-colors"><Edit2 className="w-5 h-5"/></button>
               <button onClick={handleDeleteGoal} className="p-2 text-rose-400 hover:text-rose-600 transition-colors"><Trash2 className="w-5 h-5"/></button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col items-center justify-center relative pl-2">
               {/* Progress visualization drawn shape */}
               <svg width="70" height="25" viewBox="0 0 70 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-[-25px] left-[50%] ml-[-35px] transform -rotate-[15deg]">
                 <path d="M4 16C15 6 45 2 66 12" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
               </svg>
               <span className="text-[3.5rem] leading-none font-black text-rose-500 tracking-tighter mb-2">{Math.floor(results.progressPercent)}%</span>
               <span className="text-lg font-bold text-slate-800">{formatCurrency(results.saved)}</span>
               <span className="text-[13px] text-slate-400 mt-1">de {formatCurrency(results.total)}</span>
             </div>
             <div className="space-y-3">
               <div className="bg-white rounded-[1.5rem] p-4 py-5 shadow-sm border border-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                     <Clock className="w-4 h-4"/>
                     <span className="text-xs font-medium">Prazo</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{months}m</span>
               </div>
               <div className="bg-white rounded-[1.5rem] p-4 py-5 shadow-sm border border-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                     <TrendingUp className="w-4 h-4"/>
                     <span className="text-xs font-medium">Restante</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{formatCurrency(results.total - results.saved)}</span>
               </div>
             </div>
          </div>

          <div className="mt-8 text-center text-rose-500 text-[15px] font-medium tracking-tight">
             Bom começo! Mantenham a consistência.
          </div>
        </CardContent>
      </Card>

      {/* CONTRIBUTIONS OVERVIEW */}
      {!isEditing && (
        <div className="space-y-4 pt-2">
          <div className="uppercase tracking-widest text-[13px] font-bold text-rose-900/40 pl-2">
            Contribuições
          </div>

          <Card className="rounded-[2rem] border-rose-50 shadow-sm relative overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-5">
                 <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xl shrink-0">
                   {nameP1.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg leading-tight">{nameP1}</h3>
                   <p className="text-[13px] text-slate-400 font-medium">{contributionP1}% da meta</p>
                 </div>
              </div>

              <div className="w-full bg-rose-50 h-2 rounded-full mb-6 relative overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${Math.min(100, (Number(savedP1) / results.totalP1) * 100)}%` }}></div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 divide-x divide-slate-100">
                 <div className="flex flex-col text-left">
                   <span className="text-[11px] text-slate-500 mb-1">Guardado</span>
                   <span className="text-[15px] font-bold text-slate-800">{formatCurrency(Number(savedP1))}</span>
                 </div>
                 <div className="flex flex-col text-center">
                   <span className="text-[11px] text-rose-400 mb-1">Restante</span>
                   <span className="text-[15px] font-bold text-rose-500">{formatCurrency(results.remainingP1)}</span>
                 </div>
                 <div className="flex flex-col text-right">
                   <span className="text-[11px] text-rose-400 mb-1">{getFreqLabel(frequencyP1)}</span>
                   <span className="text-[15px] font-bold text-rose-500">{formatCurrency(results.installmentP1)}</span>
                 </div>
              </div>

              <div className="flex gap-3">
                 <Button className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-2xl shadow-sm h-14 font-semibold text-[15px]" onClick={() => { setCurrentPayer('P1'); setShowPixModal(true); }}>
                   <PlusCircle className="w-5 h-5 mr-2"/>
                   Registrar pagamento
                 </Button>
                 <Button variant="outline" className="flex-none px-6 h-14 rounded-2xl border-rose-100/60 text-slate-500 bg-rose-50/30 hover:bg-rose-50 font-medium" onClick={() => handleCharge(nameP1, phoneP1, results.installmentP1)}>
                   <MessageCircle className="w-5 h-5 mr-2"/>
                   Lembrar
                 </Button>
              </div>
            </CardContent>
          </Card>

          {goalType === 'shared' && (
            <Card className="rounded-[2rem] border-rose-50 shadow-sm relative overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-5">
                   <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xl shrink-0">
                     {nameP2.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800 text-lg leading-tight">{nameP2}</h3>
                     <p className="text-[13px] text-slate-400 font-medium">{contributionP2}% da meta</p>
                   </div>
                </div>

                <div className="w-full bg-rose-50 h-2 rounded-full mb-6 relative overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${Math.min(100, (Number(savedP2) / results.totalP2) * 100)}%` }}></div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6 divide-x divide-slate-100">
                   <div className="flex flex-col text-left">
                     <span className="text-[11px] text-slate-500 mb-1">Guardado</span>
                     <span className="text-[15px] font-bold text-slate-800">{formatCurrency(Number(savedP2))}</span>
                   </div>
                   <div className="flex flex-col text-center">
                     <span className="text-[11px] text-rose-400 mb-1">Restante</span>
                     <span className="text-[15px] font-bold text-rose-500">{formatCurrency(results.remainingP2)}</span>
                   </div>
                   <div className="flex flex-col text-right">
                     <span className="text-[11px] text-rose-400 mb-1">{getFreqLabel(frequencyP2)}</span>
                     <span className="text-[15px] font-bold text-rose-500">{formatCurrency(results.installmentP2)}</span>
                   </div>
                </div>

                <div className="flex gap-3">
                   <Button className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-2xl shadow-sm h-14 font-semibold text-[15px]" onClick={() => { setCurrentPayer('P2'); setShowPixModal(true); }}>
                     <PlusCircle className="w-5 h-5 mr-2"/>
                     Registrar pagamento
                   </Button>
                   <Button variant="outline" className="flex-none px-6 h-14 rounded-2xl border-rose-100/60 text-slate-500 bg-rose-50/30 hover:bg-rose-50 font-medium" onClick={() => handleCharge(nameP2, phoneP2, results.installmentP2)}>
                     <MessageCircle className="w-5 h-5 mr-2"/>
                     Lembrar
                   </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}

      {chargeModalState.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-200">
            <CardHeader className="bg-emerald-50 border-b border-emerald-100 rounded-t-3xl p-6">
              <CardTitle className="text-emerald-800">Enviar Cobrança</CardTitle>
              <CardDescription className="text-emerald-600 mt-1">
                O WhatsApp envia apenas uma mensagem por vez no atalho automático. Complete o envio em 2 passos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              
              <div className="space-y-3">
                <Button 
                  onClick={sendWhatsAppMsg} 
                  className="w-full bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 flex justify-start h-auto p-4 rounded-2xl relative shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mr-4 shrink-0">1</div>
                  <div className="text-left font-normal overflow-hidden w-full">
                    <span className="block font-bold text-slate-900 mb-1">Clica aqui para Enviar Mensagem</span>
                    <span className="text-xs text-slate-500 truncate block">"{chargeModalState.text}"</span>
                  </div>
                  <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                </Button>

                <Button 
                  onClick={sendWhatsAppPix} 
                  className="w-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex justify-start h-auto p-4 rounded-2xl relative shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mr-4 shrink-0">2</div>
                  <div className="text-left font-normal overflow-hidden w-full">
                    <span className="block font-bold text-emerald-900 mb-1">Clica aqui para Enviar Código Pix</span>
                    <span className="text-xs text-emerald-600/80 truncate block">{chargeModalState.pixCode}</span>
                  </div>
                  <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                </Button>
              </div>

            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-3xl gap-2">
              <Button variant="ghost" className="w-full rounded-2xl h-12 text-slate-500" onClick={() => setChargeModalState(prev => ({...prev, isOpen: false}))}>
                Fechar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
