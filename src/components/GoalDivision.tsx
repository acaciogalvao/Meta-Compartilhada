import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface GoalDivisionProps {
  nameP1: string;
  setNameP1: (val: string) => void;
  nameP2: string;
  setNameP2: (val: string) => void;
  contributionP1: string;
  setContributionP1: (val: string) => void;
  contributionP2: number;
  frequencyP1: "daily" | "weekly" | "monthly";
  setFrequencyP1: (val: "daily" | "weekly" | "monthly") => void;
  frequencyP2: "daily" | "weekly" | "monthly";
  setFrequencyP2: (val: "daily" | "weekly" | "monthly") => void;
  dueDayP1: number;
  setDueDayP1: (val: number) => void;
  dueDayP2: number;
  setDueDayP2: (val: number) => void;
  phoneP1: string;
  setPhoneP1: (val: string) => void;
  phoneP2: string;
  setPhoneP2: (val: string) => void;
  hasPayments: boolean;
}

export function GoalDivision({
  nameP1,
  setNameP1,
  nameP2,
  setNameP2,
  contributionP1,
  setContributionP1,
  contributionP2,
  frequencyP1,
  setFrequencyP1,
  frequencyP2,
  setFrequencyP2,
  dueDayP1,
  setDueDayP1,
  dueDayP2,
  setDueDayP2,
  phoneP1,
  setPhoneP1,
  phoneP2,
  setPhoneP2,
  hasPayments
}: GoalDivisionProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) {
      val = val.replace(/^(\d{2})(\d)/g, "($1) $2");
      val = val.replace(/(\d)(\d{4})$/, "$1-$2");
      setter(val);
    }
  };

  return (
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
            <Label>WhatsApp {nameP1}</Label>
            <Input 
              placeholder="(00) 00000-0000"
              value={phoneP1 ?? ""}
              onChange={(e) => handlePhoneChange(e, setPhoneP1)}
              className="focus-visible:ring-rose-500"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp {nameP2}</Label>
            <Input 
              placeholder="(00) 00000-0000"
              value={phoneP2 ?? ""}
              onChange={(e) => handlePhoneChange(e, setPhoneP2)}
              className="focus-visible:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Frequência de {nameP1}</Label>
              <div className={`flex bg-slate-100 p-1 rounded-lg ${hasPayments ? 'opacity-60 pointer-events-none' : ''}`}>
                <button onClick={() => setFrequencyP1('daily')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP1 === 'daily' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Dia</button>
                <button onClick={() => setFrequencyP1('weekly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP1 === 'weekly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Sem</button>
                <button onClick={() => setFrequencyP1('monthly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP1 === 'monthly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Mês</button>
              </div>
            </div>
            {(frequencyP1 === 'monthly' || frequencyP1 === 'weekly') && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">{frequencyP1 === 'monthly' ? 'Dia do Mês (Pagamento)' : 'Dia da Semana (Pagamento)'}</Label>
                <div className="flex bg-slate-100 p-1 rounded-lg items-center px-3 py-1.5">
                  {frequencyP1 === 'monthly' ? (
                    <input 
                      type="number" 
                      min={1} 
                      max={31} 
                      value={dueDayP1} 
                      onChange={(e) => setDueDayP1(Number(e.target.value))}
                      className="bg-transparent border-none w-full text-sm outline-none text-center font-medium text-rose-600"
                    />
                  ) : (
                    <select 
                      value={dueDayP1} 
                      onChange={(e) => setDueDayP1(Number(e.target.value))}
                      className="bg-transparent border-none w-full text-sm outline-none text-center font-medium text-rose-600"
                    >
                      <option value={1}>Segunda</option>
                      <option value={2}>Terça</option>
                      <option value={3}>Quarta</option>
                      <option value={4}>Quinta</option>
                      <option value={5}>Sexta</option>
                      <option value={6}>Sábado</option>
                      <option value={0}>Domingo</option>
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Frequência de {nameP2}</Label>
              <div className={`flex bg-slate-100 p-1 rounded-lg ${hasPayments ? 'opacity-60 pointer-events-none' : ''}`}>
                <button onClick={() => setFrequencyP2('daily')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP2 === 'daily' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Dia</button>
                <button onClick={() => setFrequencyP2('weekly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP2 === 'weekly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Sem</button>
                <button onClick={() => setFrequencyP2('monthly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP2 === 'monthly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Mês</button>
              </div>
            </div>
            {(frequencyP2 === 'monthly' || frequencyP2 === 'weekly') && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">{frequencyP2 === 'monthly' ? 'Dia do Mês (Pagamento)' : 'Dia da Semana (Pagamento)'}</Label>
                <div className="flex bg-slate-100 p-1 rounded-lg items-center px-3 py-1.5">
                  {frequencyP2 === 'monthly' ? (
                    <input 
                      type="number" 
                      min={1} 
                      max={31} 
                      value={dueDayP2} 
                      onChange={(e) => setDueDayP2(Number(e.target.value))}
                      className="bg-transparent border-none w-full text-sm outline-none text-center font-medium text-rose-600"
                    />
                  ) : (
                    <select 
                      value={dueDayP2} 
                      onChange={(e) => setDueDayP2(Number(e.target.value))}
                      className="bg-transparent border-none w-full text-sm outline-none text-center font-medium text-rose-600"
                    >
                      <option value={1}>Segunda</option>
                      <option value={2}>Terça</option>
                      <option value={3}>Quarta</option>
                      <option value={4}>Quinta</option>
                      <option value={5}>Sexta</option>
                      <option value={6}>Sábado</option>
                      <option value={0}>Domingo</option>
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {hasPayments && <p className="text-xs text-amber-600 text-center mt-1">A frequência não pode ser alterada após o início dos pagamentos.</p>}

        <div className="space-y-4 mt-6">
          <div className="text-sm font-medium text-slate-700 flex justify-between">
            <span>Porcentagem de Divisão</span>
            <span className="text-slate-400 font-normal">Soma: {Number(contributionP1) + contributionP2}%</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-rose-500">{nameP1}</Label>
              <div className="relative">
                <Input 
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={contributionP1}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val > 100) val = 100;
                    if (val < 0) val = 0;
                    setContributionP1(val.toString());
                  }}
                  disabled={hasPayments}
                  className={`pl-8 ${hasPayments ? 'bg-slate-50 text-slate-500' : 'focus-visible:ring-rose-500'}`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">{nameP2}</Label>
              <div className="relative">
                <Input 
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={contributionP2}
                  disabled
                  className="pl-8 bg-slate-50 text-slate-500 border-slate-200"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </div>
          </div>
          {hasPayments && <p className="text-xs text-amber-600 text-center mt-1">A proporção da meta não pode ser alterada após o início dos pagamentos.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
