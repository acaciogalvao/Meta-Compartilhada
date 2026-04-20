import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Copy, CheckCircle2, Zap, CheckSquare, QrCode } from "lucide-react";

interface PixModalProps {
  showPixModal: boolean;
  setShowPixModal: (show: boolean) => void;
  currentPayer: "P1" | "P2";
  nameP1: string;
  nameP2: string;
  pixAmount: string;
  setPixAmount: (amount: string) => void;
  installmentP1?: number;
  installmentP2?: number;
  remainingP1?: number;
  remainingP2?: number;
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
  installmentP1 = 0,
  installmentP2 = 0,
  remainingP1 = 0,
  remainingP2 = 0,
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
  const payerName = currentPayer === "P1" ? nameP1 : nameP2;
  const installmentAmount = currentPayer === "P1" ? installmentP1 : installmentP2;
  const remainingAmount = currentPayer === "P1" ? remainingP1 : remainingP2;

  // Auto-generate PIX if amount changes and it's valid
  useEffect(() => {
    if (showPixModal && pixAmount && Number(pixAmount) > 0 && !isGeneratingPix && !pixCode && !paymentSuccess) {
      const timeoutId = setTimeout(() => {
        handleGeneratePix();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [pixAmount, showPixModal]);

  if (!showPixModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in duration-300 flex flex-col max-h-[90vh] pb-6">
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold text-slate-800">Registrar Pagamento</h2>
            <button onClick={() => { setShowPixModal(false); setPixCode(""); setPixAmount(""); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-4">Pagador: <span className="font-semibold text-rose-500">{payerName}</span></p>

          <div className="bg-white border border-rose-100 rounded-2xl p-4 mb-4 shadow-sm flex items-center">
            <span className="text-2xl font-medium text-slate-400 mr-2">R$</span>
            <Input 
              type="text"
              inputMode="numeric"
              value={pixAmount === "" ? "" : formatCurrency(Number(pixAmount)).replace("R$", "").trim()}
              onChange={(e) => { setPixCode(""); handleCurrencyChange(e, setPixAmount); }}
              className="text-4xl font-bold text-slate-800 border-none shadow-none focus-visible:ring-0 p-0 h-auto"
            />
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              onClick={() => { setPixAmount(installmentAmount.toFixed(2)); setPixCode(""); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium flex items-center transition-colors ${Number(pixAmount) === installmentAmount && Number(pixAmount) > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Parcela: {formatCurrency(installmentAmount)}
            </button>
            <button 
              onClick={() => { setPixAmount(remainingAmount.toFixed(2)); setPixCode(""); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium flex items-center transition-colors ${Number(pixAmount) === remainingAmount && Number(pixAmount) > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Quitar tudo: {formatCurrency(remainingAmount)}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 border-t border-slate-100 pt-6">
          <div className="text-center relative mb-4">
             <span className="bg-white px-2 text-xs text-slate-400 relative z-10 font-medium">QR Code Pix</span>
             <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100"></div>
          </div>

          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-emerald-600 space-y-4">
              <CheckCircle2 className="w-16 h-16 animate-bounce" />
              <p className="text-xl font-bold">Pagamento Confirmado!</p>
              <p className="text-sm text-slate-500 text-center">O valor já foi adicionado à sua meta.</p>
              <Button 
                variant="outline" 
                className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50 mt-4"
                onClick={() => setShowPixModal(false)}
              >
                Fechar
              </Button>
            </div>
          ) : qrCodeBase64 ? (
            <div className="flex flex-col items-center mt-2">
              <p className="text-sm text-slate-500 mb-6">Escaneie para pagar para <span className="font-semibold text-slate-800">{payerName}</span></p>
              
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-6 inline-block relative">
                <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
              </div>
              
              <div className="bg-rose-50 text-rose-600 font-bold px-6 py-2 rounded-full mb-8 text-lg shadow-sm">
                {formatCurrency(Number(pixAmount))}
              </div>

              <div className="w-full space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl text-slate-700 bg-rose-50 border-rose-100 hover:bg-rose-100 transition-colors font-medium"
                  onClick={copyPixCode}
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" /> : <Copy className="w-5 h-5 mr-2" />}
                  {copied ? "Copiado!" : "Copiar código Pix (copia e cola)"}
                </Button>

                <Button 
                  className="w-full h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-lg shadow-sm"
                  onClick={handleSimulatePayment}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirmar {formatCurrency(Number(pixAmount))}
                </Button>
              </div>
            </div>
          ) : isGeneratingPix ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm font-medium">Gerando QR Code...</p>
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-12 text-center h-48 border-2 border-dashed border-slate-100 rounded-2xl">
               <QrCode className="w-12 h-12 text-slate-200 mb-2" />
               <p className="text-slate-400 text-sm max-w-[200px]">Insira o valor acima e aguarde para gerar o Pix</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
