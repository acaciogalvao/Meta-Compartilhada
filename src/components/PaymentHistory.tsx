import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface PaymentHistoryProps {
  paymentsHistory: any[];
  nameP1: string;
  nameP2: string;
  formatCurrency: (value: number) => string;
  progressPercent: number;
  handleClearHistory: () => void;
}

export function PaymentHistory({
  paymentsHistory,
  nameP1,
  nameP2,
  formatCurrency,
  progressPercent,
  handleClearHistory
}: PaymentHistoryProps) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
          <span className="bg-rose-100 p-2 rounded-lg text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </span>
          Histórico de Pagamentos
        </CardTitle>
        {progressPercent >= 100 && paymentsHistory.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleClearHistory}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Histórico
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {paymentsHistory.length === 0 ? (
          <p className="text-slate-500 text-center py-4">Nenhum pagamento registrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {paymentsHistory.map((payment, index) => (
              <div key={payment.paymentId || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    {formatCurrency(payment.amount)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {payment.payerId === 'P1' ? nameP1 : nameP2} • ID: {payment.paymentId?.substring(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {new Date(payment.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
