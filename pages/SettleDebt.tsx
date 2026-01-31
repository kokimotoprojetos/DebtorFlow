
import React, { useState, useMemo } from 'react';
import { Debtor } from '../types';

interface SettleDebtProps {
  navigate: (view: any, debtorId?: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  debtors: Debtor[];
  selectedDebtorId: string | null;
  onPaymentConfirm?: (debtorId: string, amount: number, description: string) => void;
  onLogout?: () => void;
  userEmail?: string;
}

const SettleDebt: React.FC<SettleDebtProps> = ({ navigate, toggleDarkMode, isDarkMode, debtors, selectedDebtorId, onPaymentConfirm, onLogout, userEmail }) => {
  const [method, setMethod] = useState('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localSelectedId, setLocalSelectedId] = useState<string>(selectedDebtorId || '');

  const currentDebtor = useMemo(() => {
    return debtors.find(d => d.id === localSelectedId);
  }, [debtors, localSelectedId]);

  const totalAmount = useMemo(() => {
    if (!currentDebtor) return 0;
    return currentDebtor.debts.reduce((acc, d) => acc + d.amount, 0);
  }, [currentDebtor]);

  const handlePayment = () => {
    if (!currentDebtor || totalAmount <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(true);
      setShowSuccess(true);
      if (onPaymentConfirm) {
        onPaymentConfirm(currentDebtor.id, totalAmount, `Liquidação Total via ${method.toUpperCase()}`);
      }
    }, 1200);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-navy dark:text-white flex flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('landing')}>
          <div className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl font-black">account_balance_wallet</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">DebtorFlow Pro</h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-end gap-6 items-center">
          <button onClick={() => navigate('dashboard')} className="text-sm font-medium hover:text-primary transition-colors">Dashboard</button>
          <button onClick={() => navigate('debtors')} className="text-sm font-medium hover:text-primary transition-colors">Devedores</button>
          <button onClick={() => navigate('reports')} className="text-sm font-medium hover:text-primary transition-colors">Relatórios</button>
          <button onClick={toggleDarkMode} className="text-[#637588] dark:text-gray-400 p-2">
            <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors ml-4">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="text-xs font-bold">Sair</span>
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1 px-4 py-8 md:px-10 lg:px-20 xl:px-40 flex justify-center">
        {showSuccess ? (
          <div className="w-full max-w-xl text-center py-20 animate-fade-in bg-white dark:bg-surface-dark rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="inline-flex size-20 items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-accent rounded-full mb-6">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-black mb-2">Conta Acertada!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              O devedor <b>{currentDebtor?.name}</b> agora está em dia com a empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('reports')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">Ver no Histórico</button>
              <button onClick={() => navigate('dashboard')} className="border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Voltar ao Início</button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black text-navy dark:text-white">Acerto de Contas</h1>
              <p className="text-gray-500">Selecione o devedor e escolha a melhor forma de liquidar a dívida.</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 flex flex-col gap-8">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <label className="text-xs font-black text-primary uppercase tracking-widest mb-4 block">1. Escolha o Devedor</label>
                  <select
                    value={localSelectedId}
                    onChange={(e) => setLocalSelectedId(e.target.value)}
                    className="w-full h-12 rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-bold"
                  >
                    <option value="">Selecione um devedor da lista...</option>
                    {debtors.filter(d => d.debts.length > 0).map(d => (
                      <option key={d.id} value={d.id}>{d.name} - (R$ {d.debts.reduce((a, c) => a + c.amount, 0).toLocaleString()})</option>
                    ))}
                    {debtors.filter(d => d.debts.length === 0).map(d => (
                      <option key={d.id} value={d.id} disabled>{d.name} (Sem dívidas ativas)</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <label className="text-xs font-black text-primary uppercase tracking-widest mb-4 block">2. Forma de Pagamento</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'pix', icon: 'qr_code_2', label: 'PIX', desc: 'Transferência instantânea' },
                      { id: 'dinheiro', icon: 'payments', label: 'Dinheiro', desc: 'Recebimento em mãos' },
                      { id: 'cartao', icon: 'credit_card', label: 'Cartão', desc: 'Débito ou Crédito' },
                      { id: 'transferencia', icon: 'account_balance', label: 'TED / DOC', desc: 'Transferência bancária' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${method === m.id ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'
                          }`}
                      >
                        <span className={`material-symbols-outlined ${method === m.id ? 'text-primary' : 'text-gray-400'}`}>{m.icon}</span>
                        <div>
                          <p className="font-bold text-sm dark:text-white">{m.label}</p>
                          <p className="text-[10px] text-gray-400">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="sticky top-24 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
                  <div className="p-8 bg-primary text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Saldo Devedor Atual</p>
                    <h2 className="text-4xl font-black">R$ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                  </div>

                  <div className="p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalhamento por Vencimento</p>
                      {currentDebtor ? (
                        <div className="flex flex-col gap-3">
                          {currentDebtor.debts.map(d => (
                            <div key={d.id} className="flex justify-between text-xs items-center">
                              <div className="flex flex-col">
                                <span className="font-bold dark:text-white">{d.description}</span>
                                <span className={`text-[10px] ${d.dueDate < today ? 'text-red-500 font-bold' : 'text-gray-400'}`}>Vence em: {d.dueDate}</span>
                              </div>
                              <span className="font-bold text-sm">R$ {d.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Nenhum devedor selecionado</p>
                      )}
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Total a Receber</span>
                      <span className="text-2xl font-black text-primary">R$ {totalAmount.toLocaleString()}</span>
                    </div>

                    <button
                      disabled={!currentDebtor || totalAmount <= 0 || isProcessing}
                      onClick={handlePayment}
                      className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span className="animate-spin material-symbols-outlined">sync</span>
                      ) : (
                        <>Finalizar Acerto <span className="material-symbols-outlined">done_all</span></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettleDebt;
