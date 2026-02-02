import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setIsProcessing(false);
      setShowSuccess(true);
      if (onPaymentConfirm) {
        onPaymentConfirm(currentDebtor.id, totalAmount, `Liquidação Total via ${method.toUpperCase()}`);
      }
    }, 1200);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-navy dark:text-white">
      <AdminSidebar
        current="settle"
        onNavigate={navigate}
        onLogout={onLogout}
        userEmail={userEmail}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-4 md:px-10 py-3 sticky top-0 z-50 h-[64px] flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(true);
              }}
              className="lg:hidden text-[#637588] dark:text-[#9ca3af] p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[28px]" translate="no">menu</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight">Acerto</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleDarkMode} className="text-[#637588] dark:text-gray-400 p-2">
              <span className="material-symbols-outlined" translate="no">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            {onLogout && (
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-red-200 dark:border-red-900/30">
                <span className="material-symbols-outlined text-[20px] flex-shrink-0" translate="no">logout</span>
                <span className="text-xs font-bold hidden sm:inline">Sair</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-10 lg:px-20 xl:px-40 flex justify-center">
          {showSuccess ? (
            <div className="w-full max-w-xl text-center py-20 animate-fade-in bg-white dark:bg-surface-dark rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-800 h-fit self-center">
              <div className="inline-flex size-20 items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-accent rounded-full mb-6">
                <span className="material-symbols-outlined text-5xl flex-shrink-0" translate="no">check_circle</span>
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
                <h1 className="text-3xl font-black text-navy dark:text-white">Liquidar Dívida</h1>
                <p className="text-gray-500">Selecione o devedor e escolha o método de pagamento.</p>
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
                      <option value="">Selecione um devedor...</option>
                      {debtors.filter(d => d.debts.length > 0).map(d => (
                        <option key={d.id} value={d.id}>{d.name} - (R$ {d.debts.reduce((a, c) => a + c.amount, 0).toLocaleString()})</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <label className="text-xs font-black text-primary uppercase tracking-widest mb-4 block">2. Forma de Pagamento</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'pix', icon: 'qr_code_2', label: 'PIX' },
                        { id: 'dinheiro', icon: 'payments', label: 'Dinheiro' },
                        { id: 'cartao', icon: 'credit_card', label: 'Cartão' },
                        { id: 'transferencia', icon: 'account_balance', label: 'TED / DOC' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${method === m.id ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-primary/30'}`}
                        >
                          <span className={`material-symbols-outlined flex-shrink-0 ${method === m.id ? 'text-primary' : 'text-gray-400'}`} translate="no">{m.icon}</span>
                          <p className="font-bold text-sm dark:text-white">{m.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="sticky top-24 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-primary text-white">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Saldo Devedor</p>
                      <h2 className="text-4xl font-black text-white">R$ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    </div>

                    <div className="p-8 flex flex-col gap-6">
                      <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalhamento</p>
                        {currentDebtor ? (
                          <div className="flex flex-col gap-3">
                            {currentDebtor.debts.map(d => (
                              <div key={d.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold dark:text-white">{d.description}</span>
                                  <span className="text-[10px] text-gray-400">{d.dueDate}</span>
                                </div>
                                <span className="font-black text-sm text-primary">R$ {d.amount.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Nenhum devedor selecionado</p>
                        )}
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-gray-800"></div>

                      <button
                        disabled={!currentDebtor || totalAmount <= 0 || isProcessing}
                        onClick={handlePayment}
                        className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <span className="animate-spin material-symbols-outlined flex-shrink-0" translate="no">sync</span>
                        ) : (
                          <>Finalizar Acerto <span className="material-symbols-outlined flex-shrink-0" translate="no">done_all</span></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettleDebt;
