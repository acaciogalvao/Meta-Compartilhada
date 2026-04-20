import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface GoalFormProps {
  goalType: "individual" | "shared";
  setGoalType: (val: "individual" | "shared") => void;
  itemName: string;
  setItemName: (val: string) => void;
  totalValue: string;
  setTotalValue: (val: string) => void;
  months: string;
  setMonths: (val: string) => void;
  nameP1: string;
  setNameP1: (val: string) => void;
  nameP2: string;
  setNameP2: (val: string) => void;
  pixKeyP1: string;
  setPixKeyP1: (val: string) => void;
  pixKeyP2: string;
  setPixKeyP2: (val: string) => void;
  phoneP1: string;
  setPhoneP1: (val: string) => void;
  phoneP2: string;
  setPhoneP2: (val: string) => void;
  contributionP1: string;
  setContributionP1: (val: string) => void;
  frequencyP1: string;
  setFrequencyP1: (val: string) => void;
  frequencyP2: string;
  setFrequencyP2: (val: string) => void;
  formatCurrency: (val: number) => string;
  handleCurrencyChange: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function GoalForm({
  goalType, setGoalType,
  itemName, setItemName,
  totalValue, setTotalValue,
  months, setMonths,
  nameP1, setNameP1,
  nameP2, setNameP2,
  pixKeyP1, setPixKeyP1,
  pixKeyP2, setPixKeyP2,
  phoneP1, setPhoneP1,
  phoneP2, setPhoneP2,
  contributionP1, setContributionP1,
  frequencyP1, setFrequencyP1,
  frequencyP2, setFrequencyP2,
  formatCurrency, handleCurrencyChange,
  onCancel, onSave
}: GoalFormProps) {
  const [activeTab, setActiveTab] = useState<"meta" | "pessoas">("meta");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonMonths = ["3", "6", "12", "18", "24", "36", "48", "60"];
  const percentages = ["10", "20", "30", "40", "50", "60", "70", "80", "90"];

  const formatPhone = (val: string) => {
    val = val.replace(/\D/g, "");
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 6) {
      return `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      return `(${val.slice(0, 2)}) ${val.slice(2)}`;
    } else if (val.length > 0) {
      return `(${val}`;
    }
    return val;
  };

  const handleValidation = () => {
    const newErrors: Record<string, string> = {};
    if (!itemName.trim()) newErrors.itemName = "O nome da meta é obrigatório.";
    if (!totalValue || Number(totalValue) <= 0) newErrors.totalValue = "O valor deve ser maior que 0.";
    if (!months || Number(months) <= 0) newErrors.months = "Informe o prazo.";
    
    if (activeTab === "pessoas") {
      if (!nameP1.trim()) newErrors.nameP1 = "O nome é obrigatório.";
      if (goalType === "shared" && !nameP2.trim()) newErrors.nameP2 = "O nome é obrigatório.";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // If errors are on the other tab, switch to it
      if (newErrors.itemName || newErrors.totalValue || newErrors.months) {
        if (activeTab !== "meta") setActiveTab("meta");
      } else if (newErrors.nameP1 || newErrors.nameP2) {
        if (activeTab !== "pessoas") setActiveTab("pessoas");
      }
      return false;
    }
    return true;
  };

  const handleSaveClick = () => {
    if (handleValidation()) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-rose-50/30 z-[100] flex flex-col sm:max-w-md sm:mx-auto sm:relative sm:min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white sticky top-0 z-10 border-b border-rose-50">
        <button onClick={onCancel} className="text-slate-500 font-medium">Cancelar</button>
        <h2 className="font-bold text-slate-900 text-lg">{itemName ? 'Editar Meta' : 'Nova Meta'}</h2>
        <button onClick={handleSaveClick} className="text-rose-500 font-medium">Salvar</button>
      </div>

      {/* Tabs */}
      <div className="flex p-4 bg-white pb-2">
        <div className="flex w-full bg-rose-50/50 rounded-2xl p-1 border border-rose-100/50">
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${activeTab === 'meta' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('meta')}
          >
            A Meta
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${activeTab === 'pessoas' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('pessoas')}
          >
            {goalType === 'shared' ? 'As Pessoas' : 'Seus Dados'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'meta' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2 mb-4">
              <Label className="text-rose-400 font-medium text-xs uppercase tracking-wider block mb-2">Tipo de Meta</Label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${goalType === "shared" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setGoalType("shared")}
                >
                  Em Casal (Dividida)
                </button>
                <button
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${goalType === "individual" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  onClick={() => setGoalType("individual")}
                >
                  Individual (Só eu)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemName" className="text-rose-400 font-medium text-xs uppercase tracking-wider">O que {goalType === "shared" ? "vocês querem" : "você quer"} conquistar? *</Label>
              <Input 
                id="itemName" 
                value={itemName} 
                onChange={(e) => {
                  setItemName(e.target.value);
                  if (errors.itemName) setErrors({ ...errors, itemName: "" });
                }} 
                className={`rounded-xl h-12 focus-visible:ring-rose-500 bg-white ${errors.itemName ? 'border-red-400 focus-visible:ring-red-500' : 'border-rose-100'}`}
              />
              {errors.itemName && <p className="text-xs text-red-500 font-medium mt-1">{errors.itemName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalValue" className="text-rose-400 font-medium text-xs uppercase tracking-wider">Valor Total *</Label>
              <Input 
                id="totalValue" 
                inputMode="numeric"
                value={totalValue === "" ? "" : formatCurrency(Number(totalValue))}
                onChange={(e) => {
                  handleCurrencyChange(e, setTotalValue as any);
                  if (errors.totalValue) setErrors({ ...errors, totalValue: "" });
                }} 
                className={`rounded-xl h-12 focus-visible:ring-rose-500 bg-white ${errors.totalValue ? 'border-red-400 focus-visible:ring-red-500' : 'border-rose-100'}`}
              />
              {errors.totalValue && <p className="text-xs text-red-500 font-medium mt-1">{errors.totalValue}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-rose-400 font-medium text-xs uppercase tracking-wider">Prazo em meses — {months} meses *</Label>
              <div className="flex items-center gap-3">
                <div className={`flex bg-white border rounded-xl overflow-hidden shadow-sm h-12 ${errors.months ? 'border-red-400' : 'border-rose-100'}`}>
                  <Input 
                    type="number"
                    value={months}
                    onChange={(e) => {
                      setMonths(e.target.value);
                      if (errors.months) setErrors({ ...errors, months: "" });
                    }}
                    className="w-16 border-0 text-center font-bold text-slate-800 focus-visible:ring-0 h-full"
                  />
                  <div className="flex items-center px-3 text-slate-400 text-sm border-l border-rose-50 bg-rose-50/20">
                    meses
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                  {commonMonths.map(m => (
                    <button 
                      key={m} 
                      onClick={() => setMonths(m)}
                      className="w-10 h-10 shrink-0 rounded-full border border-rose-100/60 bg-white text-slate-600 font-medium hover:bg-rose-50 transition-colors"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {goalType === 'shared' && (
              <div className="space-y-3">
                <Label className="text-rose-400 font-medium text-xs uppercase tracking-wider">Divisão: {nameP1} {contributionP1}% / {nameP2} {100 - Number(contributionP1)}%</Label>
                
                <div className="w-full bg-rose-50 h-1.5 rounded-full mb-4 relative overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${contributionP1}%` }}></div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {percentages.map(p => (
                    <button 
                      key={p} 
                      onClick={() => setContributionP1(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${contributionP1 === p ? 'bg-rose-500 text-white' : 'border border-rose-100/60 bg-white text-slate-500 hover:bg-rose-50'}`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pessoas' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200 pb-10">
            {/* Pessoa 1 */}
            <Card className="bg-rose-50/20 border-rose-100 rounded-2xl shadow-sm overflow-hidden">
               <div className="bg-rose-50/50 p-3 border-b border-rose-100">
                 <h3 className="font-bold text-rose-500">Pessoa 1</h3>
               </div>
               <CardContent className="p-4 space-y-4">
                 <div className="space-y-1.5">
                   <Label className="text-rose-400/80 font-medium text-xs">Nome *</Label>
                   <Input 
                     value={nameP1} 
                     onChange={e => {
                       setNameP1(e.target.value);
                       if (errors.nameP1) setErrors({ ...errors, nameP1: "" });
                     }} 
                     className={`rounded-xl bg-white h-11 ${errors.nameP1 ? 'border-red-400 focus-visible:ring-red-500' : 'border-rose-100'}`} 
                   />
                   {errors.nameP1 && <p className="text-[10px] text-red-500 font-medium">{errors.nameP1}</p>}
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-rose-400/80 font-medium text-xs">WhatsApp</Label>
                   <Input 
                     type="tel"
                     value={phoneP1} 
                     onChange={e => setPhoneP1(formatPhone(e.target.value))} 
                     placeholder="(99) 99999-9999"
                     className="rounded-xl border-rose-100 bg-white h-11" 
                   />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-rose-400/80 font-medium text-xs">Chave Pix</Label>
                   <Input value={pixKeyP1} onChange={e => setPixKeyP1(e.target.value)} className="rounded-xl border-rose-100 bg-white h-11" />
                 </div>
                 <div className="space-y-1.5 pt-2">
                   <Label className="text-rose-400/80 font-medium text-xs block mb-2">Frequência de contribuição</Label>
                   <div className="flex gap-2 bg-white p-1 rounded-xl border border-rose-100">
                     {['daily', 'weekly', 'monthly'].map(freq => (
                       <button
                         key={freq}
                         onClick={() => setFrequencyP1(freq)}
                         className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${frequencyP1 === freq ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                       >
                         {freq === 'daily' ? 'Diário' : freq === 'weekly' ? 'Semanal' : 'Mensal'}
                       </button>
                     ))}
                   </div>
                 </div>
               </CardContent>
            </Card>

            {/* Pessoa 2 */}
            {goalType === 'shared' && (
              <Card className="bg-rose-50/20 border-rose-100 rounded-2xl shadow-sm overflow-hidden">
                 <div className="bg-rose-50/50 p-3 border-b border-rose-100">
                   <h3 className="font-bold text-rose-500">Pessoa 2</h3>
                 </div>
               <CardContent className="p-4 space-y-4">
                   <div className="space-y-1.5">
                     <Label className="text-rose-400/80 font-medium text-xs">Nome *</Label>
                     <Input 
                       value={nameP2} 
                       onChange={e => {
                         setNameP2(e.target.value);
                         if (errors.nameP2) setErrors({ ...errors, nameP2: "" });
                       }} 
                       className={`rounded-xl bg-white h-11 ${errors.nameP2 ? 'border-red-400 focus-visible:ring-red-500' : 'border-rose-100'}`} 
                     />
                     {errors.nameP2 && <p className="text-[10px] text-red-500 font-medium">{errors.nameP2}</p>}
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-rose-400/80 font-medium text-xs">WhatsApp</Label>
                     <Input 
                       type="tel"
                       value={phoneP2} 
                       onChange={e => setPhoneP2(formatPhone(e.target.value))} 
                       placeholder="(99) 99999-9999"
                       className="rounded-xl border-rose-100 bg-white h-11" 
                     />
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-rose-400/80 font-medium text-xs">Chave Pix</Label>
                     <Input value={pixKeyP2} onChange={e => setPixKeyP2(e.target.value)} className="rounded-xl border-rose-100 bg-white h-11" />
                   </div>
                   <div className="space-y-1.5 pt-2">
                     <Label className="text-rose-400/80 font-medium text-xs block mb-2">Frequência de contribuição</Label>
                     <div className="flex gap-2 bg-white p-1 rounded-xl border border-rose-100">
                       {['daily', 'weekly', 'monthly'].map(freq => (
                         <button
                           key={freq}
                           onClick={() => setFrequencyP2(freq)}
                           className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${frequencyP2 === freq ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                         >
                           {freq === 'daily' ? 'Diário' : freq === 'weekly' ? 'Semanal' : 'Mensal'}
                         </button>
                       ))}
                     </div>
                   </div>
                 </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
