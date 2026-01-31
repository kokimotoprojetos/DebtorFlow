
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Debtors from './pages/Debtors';
import SettleDebt from './pages/SettleDebt';
import Reports from './pages/Reports';
import Auth from './pages/Auth';
import { Debtor, HistoryEntry, DebtItem, DebtCategory, DebtorStatus } from './types';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'debtors' | 'settle' | 'reports'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      else setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchData();
        if (currentView === 'landing') setCurrentView('dashboard');
      } else {
        setDebtors([]);
        setHistory([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch debtors with their debts
      const { data: debtorsData, error: debtorsError } = await supabase
        .from('debtors')
        .select('*, debts(*)');

      if (debtorsError) throw debtorsError;

      // Fetch history
      const { data: historyData, error: historyError } = await supabase
        .from('history_entries')
        .select('*')
        .order('date', { ascending: false });

      if (historyError) throw historyError;

      // Transform data to match local types
      const formattedDebtors: Debtor[] = (debtorsData || []).map(d => ({
        id: d.id,
        name: d.name,
        email: d.email || '',
        phone: d.phone || '',
        status: d.status as DebtorStatus,
        avatar: d.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=random`,
        debts: (d.debts || []).map((debt: any) => ({
          id: debt.id,
          category: debt.category as DebtCategory,
          description: debt.description || '',
          amount: Number(debt.amount),
          date: debt.date,
          dueDate: debt.due_date
        }))
      }));

      const formattedHistory: HistoryEntry[] = (historyData || []).map(h => ({
        id: h.id,
        debtorId: h.debtor_id,
        debtorName: formattedDebtors.find(d => d.id === h.debtor_id)?.name || 'Devedor Desconhecido',
        type: h.type as 'Divida' | 'Pagamento',
        category: h.category as DebtCategory | 'Sistema',
        amount: Number(h.amount),
        date: h.date,
        description: h.description || ''
      }));

      setDebtors(formattedDebtors);
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para verificar dívidas atrasadas
  useEffect(() => {
    if (!session || debtors.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const updateOverdue = async () => {
      const updates = debtors
        .filter(debtor => {
          if (debtor.status === DebtorStatus.PAGO || debtor.debts.length === 0) return false;
          const hasOverdueDebt = debtor.debts.some(debt => debt.dueDate < today);
          return hasOverdueDebt && debtor.status !== DebtorStatus.ATRASADO;
        })
        .map(debtor => ({ id: debtor.id, status: DebtorStatus.ATRASADO }));

      if (updates.length > 0) {
        for (const update of updates) {
          await supabase.from('debtors').update({ status: update.status }).eq('id', update.id);
        }
        fetchData();
      }
    };

    updateOverdue();
  }, [debtors, session]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navigate = (view: 'landing' | 'dashboard' | 'debtors' | 'settle' | 'reports', debtorId?: string) => {
    setCurrentView(view);
    if (debtorId) {
      setSelectedDebtorId(debtorId);
    } else if (view !== 'settle') {
      setSelectedDebtorId(null);
    }
    window.scrollTo(0, 0);
  };

  const addDebtor = async (newDebtor: Debtor) => {
    if (!session) return;
    try {
      const { data: debtorData, error: debtorError } = await supabase
        .from('debtors')
        .insert([{
          user_id: session.user.id,
          name: newDebtor.name,
          email: newDebtor.email,
          phone: newDebtor.phone,
          status: newDebtor.status,
          avatar: newDebtor.avatar
        }])
        .select()
        .single();

      if (debtorError) throw debtorError;

      const initialDebt = newDebtor.debts[0];
      const { error: debtError } = await supabase
        .from('debts')
        .insert([{
          user_id: session.user.id,
          debtor_id: debtorData.id,
          amount: initialDebt.amount,
          description: initialDebt.description,
          category: initialDebt.category,
          date: initialDebt.date,
          due_date: initialDebt.dueDate
        }]);

      if (debtError) throw debtError;

      const { error: historyError } = await supabase
        .from('history_entries')
        .insert([{
          user_id: session.user.id,
          debtor_id: debtorData.id,
          type: 'Divida',
          category: initialDebt.category,
          amount: initialDebt.amount,
          date: initialDebt.date,
          description: `Cadastro Inicial: ${initialDebt.description}`
        }]);

      if (historyError) throw historyError;

      fetchData();
    } catch (error) {
      console.error('Error adding debtor:', error);
    }
  };

  const addDebtToDebtor = async (debtorId: string, newDebt: DebtItem) => {
    if (!session) return;
    try {
      const today = new Date().toISOString().split('T')[0];

      const { error: debtError } = await supabase
        .from('debts')
        .insert([{
          user_id: session.user.id,
          debtor_id: debtorId,
          amount: newDebt.amount,
          description: newDebt.description,
          category: newDebt.category,
          date: newDebt.date,
          due_date: newDebt.dueDate
        }]);

      if (debtError) throw debtError;

      if (newDebt.dueDate < today) {
        await supabase.from('debtors').update({ status: DebtorStatus.ATRASADO }).eq('id', debtorId);
      }

      const { error: historyError } = await supabase
        .from('history_entries')
        .insert([{
          user_id: session.user.id,
          debtor_id: debtorId,
          type: 'Divida',
          category: newDebt.category,
          amount: newDebt.amount,
          date: newDebt.date,
          description: newDebt.description
        }]);

      if (historyError) throw historyError;

      fetchData();
    } catch (error) {
      console.error('Error adding debt:', error);
    }
  };

  const registerPayment = async (debtorId: string, amount: number, description: string) => {
    if (!session) return;
    try {
      const { error: settleError } = await supabase
        .from('debts')
        .delete()
        .eq('debtor_id', debtorId);

      if (settleError) throw settleError;

      await supabase.from('debtors').update({ status: DebtorStatus.PAGO }).eq('id', debtorId);

      const { error: historyError } = await supabase
        .from('history_entries')
        .insert([{
          user_id: session.user.id,
          debtor_id: debtorId,
          type: 'Pagamento',
          category: DebtCategory.OUTROS,
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          description: description
        }]);

      if (historyError) throw historyError;

      fetchData();
    } catch (error) {
      console.error('Error registering payment:', error);
    }
  };

  const renderView = () => {
    if (isLoading) return null; // Handled by loading screen in return

    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={() => navigate('dashboard')} />;
      case 'dashboard':
        return <Dashboard navigate={navigate} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} debtors={debtors} onLogout={handleLogout} />;
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
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-background-dark z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando...</p>
          </div>
        </div>
      ) : !session ? (
        <Auth onAuthSuccess={() => navigate('dashboard')} />
      ) : (
        renderView()
      )}
    </div>
  );
}

export default App;
