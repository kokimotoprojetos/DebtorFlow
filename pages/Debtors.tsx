
import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Debtor, DebtorStatus, DebtCategory, DebtItem } from '../types';

interface DebtorsProps {
  navigate: (view: any, debtorId?: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  debtors: Debtor[];
  onAddDebtor: (debtor: Debtor) => void;
  onAddDebt: (debtorId: string, debt: DebtItem) => void;
  onLogout?: () => void;
  userEmail?: string;
}

const Debtors: React.FC<DebtorsProps> = ({ navigate, toggleDarkMode, isDarkMode, debtors, onAddDebtor, onAddDebt, onLogout, userEmail }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDebtorModal, setShowDebtorModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<DebtCategory>(DebtCategory.PRODUTO);
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const filteredDebtors = debtors.filter(d => {
    const matchesFilter = filter === 'Todos' || d.status === filter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateDebtor = () => {
    if (!newName || !newAmount || !newDueDate) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const today = new Date().toISOString().split('T')[0];

    const debtor: Debtor = {
      id: newId,
      name: newName,
      email: newEmail,
      status: newDueDate < today ? DebtorStatus.ATRASADO : DebtorStatus.ATIVO,
      avatar: `https://ui-avatars.com/api/?name=${newName}&background=random`,
      debts: [{
        id: 'd-' + Date.now(),
        category: newCategory,
        description: newDesc || 'Dívida Inicial',
        amount: parseFloat(newAmount),
        date: today,
        dueDate: newDueDate
      }]
    };
    onAddDebtor(debtor);
    setShowDebtorModal(false);
    resetForm();
  };

  const handleAddDebt = () => {
    if (!selectedDebtorId || !newAmount || !newDueDate) return;
    const today = new Date().toISOString().split('T')[0];
    const debt: DebtItem = {
      id: 'd-' + Date.now(),
      category: newCategory,
      description: newDesc || 'Nova Dívida',
      amount: parseFloat(newAmount),
      date: today,
      dueDate: newDueDate
    };
    onAddDebt(selectedDebtorId, debt);
    setShowDebtModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName(''); setNewEmail(''); setNewAmount(''); setNewDesc('');
    setNewCategory(DebtCategory.PRODUTO); setNewDueDate('');
    setSelectedDebtorId(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <AdminSidebar current="debtors" onNavigate={navigate} onLogout={onLogout} userEmail={userEmail} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex flex-1 flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between bg-white dark:bg-surface-dark border-b border-[#e5e7eb] dark:border-gray-800 px-4 md:px-10 py-3 sticky top-0 z-30 h-[64px]">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(true);
              }}
              className="lg:hidden text-[#637588] dark:text-[#9ca3af] p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <h2 className="text-xl font-bold dark:text-white hidden sm:block">Dívidas Ativas</h2>
            <h2 className="text-xl font-bold dark:text-white sm:hidden">Dívidas</h2>
          </div>
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
            <button onClick={() => setShowDebtorModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm">+ Novo Devedor</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-11 border border-gray-200 dark:border-gray-700 bg-transparent rounded-lg text-sm dark:text-white"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['Todos', 'Ativo', 'Atrasado', 'Pago'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === t ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase">Devedor</th>
                    <th className="py-4 px-3 text-xs font-bold text-gray-400 uppercase text-right">Dívida Total</th>
                    <th className="py-4 px-3 text-xs font-bold text-gray-400 uppercase">Vencimento Próximo</th>
                    <th className="py-4 px-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredDebtors.map((d) => {
                    const total = d.debts.reduce((acc, curr) => acc + curr.amount, 0);
                    const nextDue = d.debts.length > 0 ? d.debts.reduce((prev, curr) => prev.dueDate < curr.dueDate ? prev : curr).dueDate : '-';
                    const isOverdue = nextDue !== '-' && nextDue < new Date().toISOString().split('T')[0];

                    return (
                      <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img src={d.avatar} className="size-10 rounded-full" />
                            <div className="flex flex-col">
                              <span className="font-bold text-navy dark:text-white text-sm">{d.name}</span>
                              <span className="text-gray-400 text-xs">{d.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <span className="font-mono font-bold text-sm dark:text-white">R$ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                            {nextDue}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${d.status === 'Atrasado' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => { setSelectedDebtorId(d.id); setShowDebtModal(true); }}
                            className="text-xs font-bold text-primary hover:underline mr-4"
                          >
                            + Add Dívida
                          </button>
                          <button
                            onClick={() => navigate('settle', d.id)}
                            className="text-xs font-bold text-gray-400 hover:text-navy dark:hover:text-white bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg"
                          >
                            Acertar Contas
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Novo Devedor */}
      {showDebtorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold dark:text-white">Novo Devedor</h3>
              <button onClick={() => setShowDebtorModal(false)} className="material-symbols-outlined text-gray-400">close</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input value={newName} onChange={e => setNewName(e.target.value)} className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="Nome Completo" />
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="E-mail" />
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <p className="text-xs font-bold text-primary uppercase">Dados da Dívida</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Categoria</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value as DebtCategory)} className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm">
                    {Object.values(DebtCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Valor (R$)</label>
                  <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="0,00" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase">Data Prevista de Pagamento</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className={`h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm ${newDueDate && newDueDate < new Date().toISOString().split('T')[0] ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}
                />
              </div>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className="rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="Observações adicionais..." rows={2} />
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => setShowDebtorModal(false)} className="text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={handleCreateDebtor} className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Salvar Registro</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Dívida Extra */}
      {showDebtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold dark:text-white">Lançar Nova Dívida</h3>
              <button onClick={() => setShowDebtModal(false)} className="material-symbols-outlined text-gray-400">close</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <select value={newCategory} onChange={e => setNewCategory(e.target.value as DebtCategory)} className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm">
                {Object.values(DebtCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="Valor (R$)" />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase">Novo Vencimento</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="h-11 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
                />
              </div>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className="rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm" placeholder="O que é esta dívida?" rows={3} />
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button onClick={() => setShowDebtModal(false)} className="text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={handleAddDebt} className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Confirmar Lançamento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debtors;
