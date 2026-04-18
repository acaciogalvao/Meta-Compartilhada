import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, ArrowDownToLine, Receipt, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [visibleCount, setVisibleCount] = useState(5);

  // Sort payments newest first
  const sortedPayments = [...paymentsHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayedPayments = sortedPayments.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPayments.length;

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            <span className="bg-rose-100 p-2 rounded-lg text-rose-600">
              <Receipt className="w-5 h-5" />
            </span>
            Histórico de Pagamentos
          </CardTitle>
          <CardDescription>Acompanhe todos os depósitos feitos na meta</CardDescription>
        </div>
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
          <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-slate-100 border-dashed mt-4">
            <Clock className="w-8 h-8 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium text-center">Nenhum pagamento registrado ainda.</p>
            <p className="text-slate-400 text-sm text-center">Seus depósitos aparecerão aqui.</p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100" />
              
              <div className="space-y-6">
                {displayedPayments.map((payment, index) => {
                  const isP1 = payment.payerId === 'P1';
                  const payerName = isP1 ? nameP1 : nameP2;
                  const paymentDate = new Date(payment.date);
                  const isManual = payment.paymentId?.startsWith('mock_') || payment.paymentId?.startsWith('manual_');
                  
                  return (
                    <div key={payment.paymentId || index} className="relative flex gap-4">
                      {/* Avatar / Timeline node */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-sm
                          ${isP1 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {payerName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${isP1 ? 'bg-rose-400' : 'bg-slate-400'}`} />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{payerName}</span>
                              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center gap-1 border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" />
                                {isManual ? "Concluído" : "Pix"}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
                              <span className="capitalize">
                                {paymentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {paymentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}
                              </span>
                              <span className="px-1 text-slate-200 hidden sm:inline">•</span>
                              <span className="font-mono text-[10px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-400" title="ID do Pagamento">
                                ID: {payment.paymentId?.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="font-black text-xl text-emerald-600 flex items-center sm:justify-end gap-1.5 bg-emerald-50 sm:bg-transparent px-3 py-1 sm:p-0 rounded-lg w-fit">
                              <ArrowDownToLine className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-700">+ {formatCurrency(payment.amount)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-slate-600 hover:bg-slate-50 border-slate-200 rounded-full px-6 shadow-sm z-10 relative"
                  onClick={() => setVisibleCount(prev => prev + 5)}
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Ver mais pagamentos ({sortedPayments.length - visibleCount})
                </Button>
              </div>
            )}
            
            {visibleCount > 5 && !hasMore && sortedPayments.length > 5 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="ghost" 
                  className="text-slate-500 hover:bg-slate-50 rounded-full px-6 z-10 relative"
                  onClick={() => setVisibleCount(5)}
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Recolher histórico
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
