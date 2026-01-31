
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Debtors from './pages/Debtors';
import SettleDebt from './pages/SettleDebt';
import Reports from './pages/Reports';
import { MOCK_DEBTORS } from './constants';
import { Debtor, HistoryEntry, DebtItem, DebtCategory, DebtorStatus } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'debtors' | 'settle' | 'reports'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debtors, setDebtors] = useState<Debtor[]>(MOCK_DEBTORS);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'h1',
      debtorId: '49201',
      debtorName: 'Acme Corp',
      type: 'Divida',
      category: DebtCategory.PRODUTO,
      amount: 12500,
      date: '2023-10-24',
      description: 'Lote de Hardware Inicial'
    }
  ]);

  // Efeito para verificar dívidas atrasadas
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setDebtors(prev => prev.map(debtor => {
      if (debtor.status === DebtorStatus.PAGO || debtor.debts.length === 0) return debtor;

      const hasOverdueDebt = debtor.debts.some(debt => debt.dueDate < today);
      
      if (hasOverdueDebt && debtor.status !== DebtorStatus.ATRASADO) {
        return { ...debtor, status: DebtorStatus.ATRASADO };
      } else if (!hasOverdueDebt && debtor.status === DebtorStatus.ATRASADO) {
        // Se antes estava atrasado mas agora as datas são futuras (ex: editado), volta para Ativo
        return { ...debtor, status: DebtorStatus.ATIVO };
      }
      
      return debtor;
    }));
  }, []); // Executa uma vez ao montar o app

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navigate = (view: 'landing' | 'dashboard' | 'debtors' | 'settle' | 'reports', debtorId?: string) => {
    setCurrentView(view);
    if (debtorId) {
      setSelectedDebtorId(debtorId);
    } else if (view !== 'settle') {
      setSelectedDebtorId(null);
    }
    window.scrollTo(0, 0);
  };

  const addDebtor = (newDebtor: Debtor) => {
    setDebtors(prev => [newDebtor, ...prev]);
    const initialDebt = newDebtor.debts[0];
    const entry: HistoryEntry = {
      id: 'h-' + Date.now(),
      debtorId: newDebtor.id,
      debtorName: newDebtor.name,
      type: 'Divida',
      category: initialDebt.category,
      amount: initialDebt.amount,
      date: initialDebt.date,
      description: `Cadastro Inicial: ${initialDebt.description}`
    };
    setHistory(prev => [entry, ...prev]);
  };

  const addDebtToDebtor = (debtorId: string, newDebt: DebtItem) => {
    const today = new Date().toISOString().split('T')[0];
    const targetDebtor = debtors.find(d => d.id === debtorId);
    
    setDebtors(prev => prev.map(d => {
      if (d.id === debtorId) {
        const updatedDebts = [...d.debts, newDebt];
        const isOverdue = updatedDebts.some(debt => debt.dueDate < today);
        return { 
          ...d, 
          debts: updatedDebts, 
          status: isOverdue ? DebtorStatus.ATRASADO : DebtorStatus.ATIVO 
        };
      }
      return d;
    }));

    if (targetDebtor) {
      const entry: HistoryEntry = {
        id: 'h-' + Date.now(),
        debtorId: debtorId,
        debtorName: targetDebtor.name,
        type: 'Divida',
        category: newDebt.category,
        amount: newDebt.amount,
        date: newDebt.date,
        description: newDebt.description
      };
      setHistory(prev => [entry, ...prev]);
    }
  };

  const registerPayment = (debtorId: string, amount: number, description: string) => {
    const targetDebtor = debtors.find(d => d.id === debtorId);
    if (targetDebtor) {
      setDebtors(prev => prev.map(d => {
        if (d.id === debtorId) {
          return { ...d, debts: [], status: DebtorStatus.PAGO };
        }
        return d;
      }));

      const entry: HistoryEntry = {
        id: 'h-' + Date.now(),
        debtorId: debtorId,
        debtorName: targetDebtor.name,
        type: 'Pagamento',
        category: DebtCategory.OUTROS,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        description: description
      };
      setHistory(prev => [entry, ...prev]);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={() => navigate('dashboard')} />;
      case 'dashboard':
        return <Dashboard navigate={navigate} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} debtors={debtors} />;
      case 'debtors':
        return <Debtors navigate={navigate} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} debtors={debtors} onAddDebtor={addDebtor} onAddDebt={addDebtToDebtor} />;
      case 'settle':
        return <SettleDebt navigate={navigate} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} debtors={debtors} selectedDebtorId={selectedDebtorId} onPaymentConfirm={registerPayment} />;
      case 'reports':
        return <Reports navigate={navigate} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} history={history} />;
      default:
        return <LandingPage onStart={() => navigate('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderView()}
    </div>
  );
}

export default App;
