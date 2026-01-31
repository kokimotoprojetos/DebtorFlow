
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../components/AdminSidebar';
import { CHART_DATA, MOCK_ACTIVITIES } from '../constants';
import { Debtor } from '../types';

interface DashboardProps {
  navigate: (view: any) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  debtors: Debtor[];
}

const Dashboard: React.FC<DashboardProps> = ({ navigate, toggleDarkMode, isDarkMode, debtors }) => {
  const totalDebt = debtors.reduce((acc, d) => acc + d.debts.reduce((sum, item) => sum + item.amount, 0), 0);
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <AdminSidebar current="dashboard" onNavigate={navigate} />

      <main className="flex flex-1 flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between bg-surface-light dark:bg-surface-dark border-b border-[#e5e7eb] dark:border-[#2d3748] px-6 py-3 flex-shrink-0 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-[#637588] dark:text-[#9ca3af]">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-lg font-bold text-[#111418] dark:text-white">Painel</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4 w-full max-w-sm">
            <div className="flex w-full items-center rounded-lg h-10 border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden bg-surface-light dark:bg-surface-dark transition-all">
              <span className="material-symbols-outlined text-[20px] text-[#637588] px-3">search</span>
              <input className="flex-1 bg-transparent border-none text-sm focus:outline-0 placeholder:text-[#637588] dark:text-white" placeholder="Buscar devedor, ID..." />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-[#637588] dark:text-[#9ca3af] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="relative p-2 rounded-lg text-[#637588] dark:text-[#9ca3af] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button onClick={() => navigate('debtors')} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition-colors text-sm">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:block">Novo Registro</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-navy dark:text-white">Visão Geral</h2>
              <p className="text-[#637588] dark:text-[#9ca3af] mt-1">Atualizações em tempo real do seu portfólio.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Carteira Total', val: `R$ ${totalDebt.toLocaleString()}`, change: '0.0%', trend: 'neutral', icon: 'account_balance' },
                { label: 'Total Recebido', val: 'R$ 450.000', change: '+12.0%', trend: 'up', icon: 'savings', iconColor: 'text-primary' },
                { label: 'Pagamentos Pendentes', val: `R$ ${totalDebt.toLocaleString()}`, change: '+2.3%', trend: 'down', icon: 'pending_actions', iconColor: 'text-orange-500' },
                { label: 'Taxa de Sucesso', val: '36%', change: '+1.5%', trend: 'up', icon: 'pie_chart', iconColor: 'text-blue-500' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</p>
                    <span className={`material-symbols-outlined text-[20px] ${kpi.iconColor || 'text-gray-400'}`}>{kpi.icon}</span>
                  </div>
                  <p className="text-2xl font-black text-navy dark:text-white">{kpi.val}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                      kpi.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-navy dark:text-white mb-6">Tendências de Cobrança</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2d3748' : '#e5e7eb'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#637588'}} dy={10} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#197fe6" strokeWidth={3} fill="#197fe622" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-navy dark:text-white">Atividade Recente</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {MOCK_ACTIVITIES.map((act) => (
                    <div key={act.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-navy dark:text-white truncate">{act.title}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{act.description}</p>
                      </div>
                    </div>
                  ))}
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
