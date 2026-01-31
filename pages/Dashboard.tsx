import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../components/AdminSidebar';
import { Debtor, HistoryEntry, DebtorStatus } from '../types';

interface DashboardProps {
  navigate: (view: any) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  debtors: Debtor[];
  history: HistoryEntry[];
  onLogout?: () => void;
  userEmail?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ navigate, toggleDarkMode, isDarkMode, debtors, history, onLogout, userEmail }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const stats = useMemo(() => {
    // Total portfolio value
    const totalActiveDebt = debtors.reduce((acc, d) => acc + d.debts.reduce((sum, item) => sum + item.amount, 0), 0);

    // Total payments received recorded in history
    const totalReceived = history
      .filter(h => h.type === 'Pagamento')
      .reduce((acc, h) => acc + h.amount, 0);

    // Count of debtors with overdue status
    const overdueDebtors = debtors.filter(d => d.status === DebtorStatus.ATRASADO).length;

    // Success rate based on history entries (payments / total activities)
    const totalHistory = history.length;
    const paymentCount = history.filter(h => h.type === 'Pagamento').length;
    const successRate = totalHistory > 0 ? Math.round((paymentCount / totalHistory) * 100) : 0;

    return { totalActiveDebt, totalReceived, overdueDebtors, successRate };
  }, [debtors, history]);

  // Generate real chart data from history dates
  const chartData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const last6 = [];

    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      const mName = months[mIdx];
      const mPadded = String(mIdx + 1).padStart(2, '0');

      // Filter activities for this month
      const monthValue = history
        .filter(h => h.date.includes(`-${mPadded}-`))
        .reduce((sum, h) => sum + (h.type === 'Pagamento' ? h.amount : 0), 0);

      last6.push({ name: mName, value: monthValue });
    }
    return last6;
  }, [history]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <AdminSidebar
        current="dashboard"
        onNavigate={navigate}
        onLogout={onLogout}
        userEmail={userEmail}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <main className="flex flex-1 flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between bg-surface-light dark:bg-surface-dark border-b border-[#e5e7eb] dark:border-[#2d3748] px-4 md:px-6 py-3 flex-shrink-0 z-10 h-[64px]">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(true);
              }}
              className="text-[#637588] dark:text-[#9ca3af] p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <h1 className="text-xl font-bold text-navy dark:text-white">Início</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4 w-full max-w-sm">
            <div className="flex w-full items-center rounded-lg h-10 border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden bg-surface-light dark:bg-surface-dark transition-all">
              <span className="material-symbols-outlined text-[20px] text-[#637588] px-3">search</span>
              <input className="flex-1 bg-transparent border-none text-sm focus:outline-0 placeholder:text-[#637588] dark:text-white" placeholder="Buscar devedor..." />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 font-display">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-[#637588] dark:text-[#9ca3af] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="relative p-2 rounded-lg text-[#637588] dark:text-[#9ca3af] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all border border-red-200 dark:border-red-900/30 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-xs font-bold sm:inline">Sair</span>
              </button>
            )}

            <button onClick={() => navigate('debtors')} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition-all text-sm shadow-lg shadow-primary/20 active:scale-95">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:block">Novo Registro</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <h2 className="text-2xl lg:text-3xl font-black text-navy dark:text-white tracking-tight">
                Olá{userEmail ? `, ${userEmail.split('@')[0]}` : ''} 👋
              </h2>
              <p className="text-[#637588] dark:text-[#9ca3af] mt-1 font-medium">Aqui estão os dados reais da sua carteira no Supabase.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Carteira Total (Ativa)', val: `R$ ${stats.totalActiveDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: 'account_balance', iconColor: 'text-primary' },
                { label: 'Total Recebido', val: `R$ ${stats.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: 'savings', iconColor: 'text-emerald-accent' },
                { label: 'Devedores em Atraso', val: stats.overdueDebtors.toString(), icon: 'error_outline', iconColor: 'text-red-500' },
                { label: 'Taxa de Pagamento', val: `${stats.successRate}%`, icon: 'analytics', iconColor: 'text-blue-500' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                    <div className={`w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-[20px] ${kpi.iconColor || 'text-gray-400'}`}>{kpi.icon}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-navy dark:text-white tracking-tight">{kpi.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest">Desempenho de Cobrança</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Recebimentos</span>
                  </div>
                </div>
                <div className="h-64 w-full">
                  {history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#197fe6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#197fe6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2d3748' : '#f1f5f9'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: isDarkMode ? '#1a2632' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: isDarkMode ? '#ffffff' : '#000000' }}
                          itemStyle={{ color: '#197fe6', fontWeight: 700 }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#197fe6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">query_stats</span>
                      <p className="text-sm font-bold text-slate-400">Sem dados para o gráfico</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                  <h3 className="text-[10px] font-black text-navy dark:text-white uppercase tracking-widest">Histórico em Tempo Real</h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 max-h-[350px]">
                  {history.length > 0 ? history.slice(0, 10).map((act) => (
                    <div key={act.id} className="group flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-all">
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${act.type === 'Pagamento' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                        <span className="material-symbols-outlined text-[20px]">{act.type === 'Pagamento' ? 'verified' : 'add_circle'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-navy dark:text-white truncate tracking-tight">{act.debtorName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">{act.description}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-bold uppercase tracking-tighter">{new Date(act.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black ${act.type === 'Pagamento' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {act.type === 'Pagamento' ? '+' : '-'} R$ {act.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-700">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl">cloud_off</span>
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest">Banco Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
