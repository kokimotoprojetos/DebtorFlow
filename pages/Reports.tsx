
import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { HistoryEntry, DebtCategory } from '../types';

interface ReportsProps {
  navigate: (view: any) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  history: HistoryEntry[];
  onLogout?: () => void;
  userEmail?: string;
}

const Reports: React.FC<ReportsProps> = ({ navigate, toggleDarkMode, isDarkMode, history, onLogout, userEmail }) => {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Divida' | 'Pagamento'>('Todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  const filteredHistory = useMemo(() => {
    return history.filter(entry => {
      const matchesType = typeFilter === 'Todos' || entry.type === typeFilter;
      const matchesCategory = categoryFilter === 'Todas' || entry.category === categoryFilter;
      const matchesStart = !dateStart || entry.date >= dateStart;
      const matchesEnd = !dateEnd || entry.date <= dateEnd;
      return matchesType && matchesCategory && matchesStart && matchesEnd;
    });
  }, [history, typeFilter, categoryFilter, dateStart, dateEnd]);

  const stats = useMemo(() => {
    const totalDividas = filteredHistory
      .filter(h => h.type === 'Divida')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalPagamentos = filteredHistory
      .filter(h => h.type === 'Pagamento')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { totalDividas, totalPagamentos };
  }, [filteredHistory]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <AdminSidebar current="reports" onNavigate={navigate} onLogout={onLogout} userEmail={userEmail} />

      <main className="flex flex-1 flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between bg-white dark:bg-surface-dark border-b border-[#e5e7eb] dark:border-gray-800 px-10 py-3 sticky top-0 z-30 h-[64px]">
          <h2 className="text-lg font-bold dark:text-white">Histórico e Relatórios</h2>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="text-[#637588] dark:text-gray-400 p-2">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-red-200 dark:border-red-900/30"
                title="Sair da Conta"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-xs font-bold hidden sm:inline">Sair</span>
              </button>
            )}
            <button className="bg-emerald-accent text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span> Exportar CSV
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">

            {/* Cards de Resumo do Período */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dívidas Adicionadas (no período)</p>
                <h3 className="text-3xl font-black text-red-500">R$ {stats.totalDividas.toLocaleString()}</h3>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pagamentos Recebidos (no período)</p>
                <h3 className="text-3xl font-black text-emerald-accent">R$ {stats.totalPagamentos.toLocaleString()}</h3>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-6">
              <div className="flex flex-wrap gap-6 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Data Inicial</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={e => setDateStart(e.target.value)}
                    className="h-10 rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Data Final</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={e => setDateEnd(e.target.value)}
                    className="h-10 rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Tipo</label>
                  <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value as any)}
                    className="h-10 rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm min-w-[140px]"
                  >
                    <option value="Todos">Todos os tipos</option>
                    <option value="Divida">Apenas Dívidas</option>
                    <option value="Pagamento">Apenas Pagamentos</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Categoria</label>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="h-10 rounded-lg border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm min-w-[140px]"
                  >
                    <option value="Todas">Todas categorias</option>
                    {Object.values(DebtCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <button
                  onClick={() => { setDateStart(''); setDateEnd(''); setTypeFilter('Todos'); setCategoryFilter('Todas'); }}
                  className="h-10 px-4 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Tabela de Histórico */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase">Data</th>
                    <th className="py-4 px-3 text-xs font-bold text-gray-400 uppercase">Devedor</th>
                    <th className="py-4 px-3 text-xs font-bold text-gray-400 uppercase">Tipo / Categoria</th>
                    <th className="py-4 px-3 text-xs font-bold text-gray-400 uppercase">Descrição</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredHistory.length > 0 ? filteredHistory.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-500 font-mono">{entry.date}</td>
                      <td className="py-4 px-3">
                        <span className="font-bold text-navy dark:text-white text-sm">{entry.debtorName}</span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[18px] ${entry.type === 'Divida' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {entry.type === 'Divida' ? 'trending_down' : 'trending_up'}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold dark:text-white">{entry.type}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{entry.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-sm text-gray-600 dark:text-gray-400">
                        {entry.description}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-mono font-bold text-sm ${entry.type === 'Divida' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {entry.type === 'Divida' ? '-' : '+'} R$ {entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-400">
                        <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
                        <p>Nenhum registro encontrado para os filtros selecionados.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
