import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Frequência de {nameP1}</Label>
            <div className={`flex bg-slate-100 p-1 rounded-lg ${hasPayments ? 'opacity-60 pointer-events-none' : ''}`}>
              <button onClick={() => setFrequencyP1('daily')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP1 === 'daily' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Dia</button>
              <button onClick={() => setFrequencyP1('weekly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP1 === 'weekly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Sem</button>
              <button onClick={() => setFrequencyP1('monthly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP1 === 'monthly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Mês</button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Frequência de {nameP2}</Label>
            <div className={`flex bg-slate-100 p-1 rounded-lg ${hasPayments ? 'opacity-60 pointer-events-none' : ''}`}>
              <button onClick={() => setFrequencyP2('daily')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP2 === 'daily' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Dia</button>
              <button onClick={() => setFrequencyP2('weekly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP2 === 'weekly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Sem</button>
              <button onClick={() => setFrequencyP2('monthly')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${frequencyP2 === 'monthly' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>Mês</button>
            </div>
          </div>
        </div>
        {hasPayments && <p className="text-xs text-amber-600 text-center mt-1">A frequência não pode ser alterada após o início dos pagamentos.</p>}

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
    </Card>
  );
}
