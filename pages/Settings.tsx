import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { UserSettings } from '../types';
import { supabase } from '../supabase';

interface SettingsProps {
    navigate: (view: any) => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    onLogout?: () => void;
    userEmail?: string;
}

const Settings: React.FC<SettingsProps> = ({ navigate, toggleDarkMode, isDarkMode, onLogout, userEmail }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [settings, setSettings] = useState<UserSettings>({ interest_rate: 0, installment_fee: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) setSettings({ interest_rate: data.interest_rate, installment_fee: data.installment_fee });
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    interest_rate: settings.interest_rate,
                    installment_fee: settings.installment_fee
                }, { onConflict: 'user_id' });

            if (error) throw error;
            setMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Erro ao salvar configurações.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'As senhas não coincidem.', type: 'error' });
            return;
        }
        setIsSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ text: 'Erro ao alterar senha. Verifique os requisitos.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') return;
        setIsDeleting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Delete all user data
            await supabase.from('history_entries').delete().eq('user_id', user.id);
            await supabase.from('debts').delete().eq('user_id', user.id);
            await supabase.from('debtors').delete().eq('user_id', user.id);
            await supabase.from('user_settings').delete().eq('user_id', user.id);

            // Sign out and redirect
            await supabase.auth.signOut();
            if (onLogout) onLogout();
            else navigate('landing');

        } catch (err) {
            console.error('Error deleting account:', err);
            setMessage({ text: 'Erro ao excluir dados. Tente novamente.', type: 'error' });
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-navy dark:text-white">
            <AdminSidebar
                current="settings"
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
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden text-[#637588] dark:text-[#9ca3af] p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            <span className="material-symbols-outlined text-[28px]" translate="no">menu</span>
                        </button>
                        <h2 className="text-xl font-bold tracking-tight">Configurações</h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={toggleDarkMode} className="text-[#637588] dark:text-gray-400 p-2">
                            <span className="material-symbols-outlined" translate="no">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-20 flex justify-center">
                    <div className="w-full max-w-3xl flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-black">Ajustes do Sistema</h1>
                            <p className="text-gray-500">Gerencie suas preferências de cobrança e segurança.</p>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                <span className="material-symbols-outlined" translate="no">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Seção de Cobrança */}
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <span className="material-symbols-outlined" translate="no">payments</span>
                                    <h2 className="font-bold uppercase tracking-widest text-xs">Regras de Cobrança</h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Juros por Atraso (%)</label>
                                        <input
                                            type="number"
                                            value={settings.interest_rate}
                                            onChange={(e) => setSettings({ ...settings, interest_rate: Number(e.target.value) })}
                                            className="h-11 rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                            placeholder="Ex: 2.5"
                                        />
                                        <p className="text-[10px] text-gray-400 italic">Taxa aplicada mensalmente sobre o valor original em atraso.</p>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Taxa de Parcelamento (R$)</label>
                                        <input
                                            type="number"
                                            value={settings.installment_fee}
                                            onChange={(e) => setSettings({ ...settings, installment_fee: Number(e.target.value) })}
                                            className="h-11 rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                            placeholder="Ex: 5.00"
                                        />
                                        <p className="text-[10px] text-gray-400 italic">Valor fixo adicionado ao total se a dívida for parcelada.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={saveSettings}
                                    disabled={isSaving}
                                    className="mt-auto bg-primary text-white h-11 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                                </button>
                            </div>

                            {/* Seção de Segurança */}
                            <form onSubmit={handleChangePassword} className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-6">
                                <div className="flex items-center gap-3 text-red-500">
                                    <span className="material-symbols-outlined" translate="no">lock</span>
                                    <h2 className="font-bold uppercase tracking-widest text-xs">Segurança</h2>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Nova Senha</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-11 rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Confirmar Nova Senha</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-11 rounded-xl border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="mt-auto bg-navy dark:bg-white dark:text-navy text-white h-11 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Alterando...' : 'Alterar Senha'}
                                </button>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-6 rounded-3xl flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined" translate="no">warning</span>
                                <h2 className="font-bold uppercase tracking-widest text-xs">Zona de Perigo</h2>
                            </div>

                            <p className="text-sm text-red-600/80 dark:text-red-400/80">
                                A exclusão da conta é irreversível. Todos os seus dados, devedores e histórico serão apagados permanentemente.
                            </p>

                            {!isDeleteModalOpen ? (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="bg-white text-red-600 border border-red-200 hover:bg-red-50 font-bold h-11 rounded-xl transition-all self-start px-6"
                                >
                                    Excluir Minha Conta
                                </button>
                            ) : (
                                <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-red-200 dark:border-red-800/50 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                        Para confirmar, digite <span className="font-black select-all">DELETE</span> abaixo:
                                    </p>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="h-11 rounded-xl border-red-200 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        placeholder="Digite DELETE para confirmar"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                            className="flex-1 bg-red-600 text-white h-11 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsDeleteModalOpen(false);
                                                setDeleteConfirmation('');
                                            }}
                                            disabled={isDeleting}
                                            className="px-6 bg-gray-100 text-gray-600 h-11 rounded-xl font-bold hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                <span className="material-symbols-outlined text-[20px]" translate="no">info</span>
                                <span className="font-bold text-sm uppercase tracking-wider">Sobre o Parcelamento</span>
                            </div>
                            <p className="text-xs text-blue-800/70 dark:text-blue-200/70 leading-relaxed">
                                As opções de parcelamento estarão disponíveis diretamente no cadastro de novas dívidas.
                                O sistema gerará automaticamente as parcelas com base no número definido, facilitando o controle individual de cada devedor.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
