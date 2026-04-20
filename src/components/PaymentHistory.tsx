import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, ArrowDownToLine, Receipt, Clock, CheckCircle2, ChevronDown, ChevronUp, Calendar, X } from "lucide-react";
import { useState, useMemo } from "react";

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
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // Generate available years and months from data
  const { availableYears, availableMonths } = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    paymentsHistory.forEach(p => {
      const d = new Date(p.date);
      years.add(d.getFullYear().toString());
      months.add((d.getMonth() + 1).toString());
    });
    return {
      availableYears: Array.from(years).sort((a, b) => Number(b) - Number(a)),
      availableMonths: Array.from(months).sort((a, b) => Number(a) - Number(b))
    };
  }, [paymentsHistory]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    return paymentsHistory.filter(payment => {
      const d = new Date(payment.date);
      const paymentMonth = (d.getMonth() + 1).toString();
      const paymentYear = d.getFullYear().toString();
      
      const monthMatch = selectedMonth === "all" || paymentMonth === selectedMonth;
      const yearMatch = selectedYear === "all" || paymentYear === selectedYear;
      
      return monthMatch && yearMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [paymentsHistory, selectedMonth, selectedYear]);

  const displayedPayments = filteredPayments.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPayments.length;

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <>
      <Card className="shadow-sm border-0 bg-transparent">
        <CardHeader className="pb-4 px-2">
          <div className="space-y-1">
            <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
              <span className="bg-rose-100 p-2 rounded-xl text-rose-600">
                <Receipt className="w-5 h-5" />
              </span>
              Extrato
            </CardTitle>
            <CardDescription className="text-xs">Acompanhe todos os depósitos feitos</CardDescription>
          </div>
          <div className="flex gap-2 self-start sm:self-auto flex-wrap">
             {progressPercent >= 100 && paymentsHistory.length > 0 && (
               <Button 
                 variant="outline" 
                 size="sm" 
                 className="text-red-600 border-red-200 hover:bg-red-50"
                 onClick={handleClearHistory}
               >
                 <Trash2 className="w-4 h-4 mr-2" />
                 Limpar
               </Button>
             )}
          </div>
        </CardHeader>
        <CardContent className="px-2">
          {paymentsHistory.length > 0 && (
             <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-rose-50 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 pl-2">
                   <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <select 
                  className="bg-slate-50 border-none text-slate-700 text-sm font-medium rounded-xl p-2 outline-none"
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setVisibleCount(5); }}
                >
                  <option value="all">Mês (Todos)</option>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{monthNames[Number(m)-1]}</option>
                  ))}
                </select>
                <select 
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 p-1.5 outline-none"
                  value={selectedYear}
                  onChange={(e) => { setSelectedYear(e.target.value); setVisibleCount(5); }}
                >
                  <option value="all">Ano (Todos)</option>
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
             </div>
          )}
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-slate-100 border-dashed mt-4">
              <Clock className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-center">Nenhum pagamento encontrado para este filtro.</p>
              {paymentsHistory.length === 0 && <p className="text-slate-400 text-sm text-center">Seus depósitos aparecerão aqui.</p>}
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
                    <div key={payment.paymentId || index} className="relative flex gap-4 cursor-pointer group" onClick={() => setSelectedPayment(payment)}>
                      {/* Avatar / Timeline node */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-sm transition-transform group-hover:scale-105
                          ${isP1 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {payerName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4 group-hover:shadow-md group-hover:border-rose-100 transition-all relative overflow-hidden">
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
                  Ver mais pagamentos ({filteredPayments.length - visibleCount})
                </Button>
              </div>
            )}
            
            {visibleCount > 5 && !hasMore && filteredPayments.length > 5 && (
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

      {/* Payment Details Modal */}
      {selectedPayment && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]" onClick={() => setSelectedPayment(null)}>
           <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             <div className="p-5 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <Receipt className="w-5 h-5 text-rose-500" />
                 Detalhes do Pagamento
               </h3>
               <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full p-1">
                 <X className="w-5 h-5" />
               </button>
             </div>
             <div className="p-5 space-y-4">
                <div className="flex justify-center mb-6">
                   <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl flex items-center gap-3">
                     <div className="bg-emerald-100 p-2 rounded-full">
                       <ArrowDownToLine className="w-6 h-6 text-emerald-600" />
                     </div>
                     <span className="text-3xl font-black">{formatCurrency(selectedPayment.amount)}</span>
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Pagador</span>
                    <span className="font-semibold text-slate-800">{selectedPayment.payerId === 'P1' ? nameP1 : nameP2}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Data e Hora</span>
                    <span className="font-medium text-slate-700 text-sm flex gap-1">
                      {new Date(selectedPayment.date).toLocaleDateString('pt-BR')} às {new Date(selectedPayment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Status</span>
                    <span className="text-emerald-600 font-medium text-sm flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4" /> {(selectedPayment.paymentId?.startsWith('mock_') || selectedPayment.paymentId?.startsWith('manual_')) ? 'Concluído' : 'Pix Confirmado'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 text-sm">ID da Transação</span>
                    <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded max-w-[150px] truncate" title={selectedPayment.paymentId}>{selectedPayment.paymentId}</span>
                  </div>
                </div>
             </div>
             <div className="p-4 bg-slate-50 rounded-b-2xl">
                <Button variant="ghost" className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700" onClick={() => setSelectedPayment(null)}>
                  Fechar Detalhes
                </Button>
             </div>
           </div>
         </div>
      )}
    </>
  );
}
