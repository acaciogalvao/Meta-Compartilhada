import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Target, QrCode } from "lucide-react";

interface GoalConfigProps {
  itemName: string;
  setItemName: (val: string) => void;
  totalValue: string;
  setTotalValue: (val: string) => void;
  savedP1: string;
  setSavedP1: (val: string) => void;
  savedP2: string;
  setSavedP2: (val: string) => void;
  months: string;
  setMonths: (val: string) => void;
  nameP1: string;
  nameP2: string;
  pixKeyP1: string;
  setPixKeyP1: (val: string) => void;
  pixKeyP2: string;
  setPixKeyP2: (val: string) => void;
  formatCurrency: (value: number) => string;
  handleCurrencyChange: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => void;
  setCurrentPayer: (payer: "P1" | "P2") => void;
  setPixAmount: (amount: string) => void;
  setShowPixModal: (show: boolean) => void;
  installmentP1: number;
  installmentP2: number;
}

export function GoalConfig({
  itemName,
  setItemName,
  totalValue,
  setTotalValue,
  savedP1,
  setSavedP1,
  savedP2,
  setSavedP2,
  months,
  setMonths,
  nameP1,
  nameP2,
  pixKeyP1,
  setPixKeyP1,
  pixKeyP2,
  setPixKeyP2,
  formatCurrency,
  handleCurrencyChange,
  setCurrentPayer,
  setPixAmount,
  setShowPixModal,
  installmentP1,
  installmentP2
}: GoalConfigProps) {
  return (
    <Card className="border-rose-100 shadow-sm">
      <CardHeader className="bg-white/50 border-b border-rose-50/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-rose-500" />
          O que vamos conquistar?
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

        <div className="grid grid-cols-1 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pixKeyP1">Chave Pix de {nameP1}</Label>
            <Input 
              id="pixKeyP1" 
              placeholder="CPF, E-mail, Celular ou Aleatória" 
              value={pixKeyP1 ?? ""}
              onChange={(e) => setPixKeyP1(e.target.value)}
              className="focus-visible:ring-rose-500"
            />
            <p className="text-xs text-slate-400">Todo depósito para {nameP1} irá para esta chave.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pixKeyP2">Chave Pix de {nameP2}</Label>
            <Input 
              id="pixKeyP2" 
              placeholder="CPF, E-mail, Celular ou Aleatória" 
              value={pixKeyP2 ?? ""}
              onChange={(e) => setPixKeyP2(e.target.value)}
              className="focus-visible:ring-rose-500"
            />
            <p className="text-xs text-slate-400">Todo depósito para {nameP2} irá para esta chave.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="savedP1">Já guardado por {nameP1} (R$)</Label>
            <div className="flex gap-2">
              <Input 
                id="savedP1" 
                type="text" 
                inputMode="numeric"
                placeholder="R$ 0,00" 
                value={savedP1 === "" ? "" : formatCurrency(Number(savedP1))}
                onChange={(e) => handleCurrencyChange(e, setSavedP1)}
                className="focus-visible:ring-rose-500 flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentPayer("P1");
                  setPixAmount(installmentP1.toFixed(2));
                  setShowPixModal(true);
                }}
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 px-3"
                title="Depositar via Pix"
              >
                <QrCode className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="savedP2">Já guardado por {nameP2} (R$)</Label>
            <div className="flex gap-2">
              <Input 
                id="savedP2" 
                type="text" 
                inputMode="numeric"
                placeholder="R$ 0,00" 
                value={savedP2 === "" ? "" : formatCurrency(Number(savedP2))}
                onChange={(e) => handleCurrencyChange(e, setSavedP2)}
                className="focus-visible:ring-rose-500 flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentPayer("P2");
                  setPixAmount(installmentP2.toFixed(2));
                  setShowPixModal(true);
                }}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
