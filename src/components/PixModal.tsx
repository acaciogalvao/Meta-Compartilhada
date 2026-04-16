import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, CheckCircle2 } from "lucide-react";

interface PixModalProps {
  showPixModal: boolean;
  setShowPixModal: (show: boolean) => void;
  currentPayer: "P1" | "P2";
  nameP1: string;
  nameP2: string;
  pixAmount: string;
  setPixAmount: (amount: string) => void;
  pixCode: string;
  setPixCode: (code: string) => void;
  qrCodeBase64: string;
  isGeneratingPix: boolean;
  paymentSuccess: boolean;
  copied: boolean;
  copyPixCode: () => void;
  handleGeneratePix: () => void;
  handleSimulatePayment: () => void;
  isMockPayment: boolean;
  setIsMockPayment: (isMock: boolean) => void;
  formatCurrency: (value: number) => string;
  handleCurrencyChange: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => void;
}

export function PixModal({
  showPixModal,
  setShowPixModal,
  currentPayer,
  nameP1,
  nameP2,
  pixAmount,
  setPixAmount,
  pixCode,
  setPixCode,
  qrCodeBase64,
  isGeneratingPix,
  paymentSuccess,
  copied,
  copyPixCode,
  handleGeneratePix,
  handleSimulatePayment,
  isMockPayment,
  setIsMockPayment,
  formatCurrency,
  handleCurrencyChange
}: PixModalProps) {
  if (!showPixModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <CardHeader className="bg-emerald-50 border-b border-emerald-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <QrCode className="w-6 h-6" />
            Depositar via Pix ({currentPayer === "P1" ? nameP1 : nameP2})
          </CardTitle>
          <CardDescription className="text-emerald-600">
            O valor será adicionado à meta de {currentPayer === "P1" ? nameP1 : nameP2}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
                <p className="text-xs text-slate-500">Você pode alterar este valor para fazer um pagamento livre.</p>
              </div>
              
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4" 
                onClick={handleGeneratePix}
                disabled={isGeneratingPix || !pixAmount || Number(pixAmount) <= 0}
              >
                {isGeneratingPix ? "Processando..." : "Gerar QR Code Pix"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                {qrCodeBase64 ? (
                  <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                    QR Code Indisponível
                  </div>
                )}
              </div>
              
              <div className="w-full space-y-2">
                <Label className="text-center block">Código Pix Copia e Cola</Label>
                <div className="flex gap-2">
                  <Input value={pixCode} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={copyPixCode} className={copied ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}>
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Abra o app do seu banco e escolha a opção Pix Copia e Cola.
                {!isMockPayment && " O pagamento será identificado automaticamente."}
              </p>
              
              {isMockPayment && (
                <div className="w-full mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col gap-2">
                  <p className="text-sm text-emerald-800 text-center">Como vocês estão usando Chaves Pix pessoais, o aplicativo não recebe o aviso do banco sozinho.</p>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" 
                    onClick={handleSimulatePayment}
                  >
                    Somar este valor na Meta ("Já Paguei")
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
  );
}
