
import React from 'react';

interface AdminSidebarProps {
  current: string;
  onNavigate: (view: any) => void;
  onLogout?: () => void;
  userEmail?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ current, onNavigate, onLogout, userEmail, isOpen, onClose }) => {
  const handleNavigate = (view: any) => {
    onNavigate(view);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col transform bg-white dark:bg-surface-dark border-r border-[#e5e7eb] dark:border-[#2d3748] transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex h-screen
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col gap-4 p-4 h-full w-full">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex flex-col cursor-pointer" onClick={() => handleNavigate('landing')}>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <h1 className="text-lg font-bold leading-normal text-[#111418] dark:text-white">DebtorFlow</h1>
              </div>
              <p className="text-[#637588] dark:text-[#9ca3af] text-xs font-normal leading-normal mt-1 pl-10">Portal Administrativo</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="lg:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-[#637588] dark:text-[#9ca3af]">
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-2 mt-4 flex-1">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${current === 'dashboard' ? 'bg-primary/10 text-primary' : 'hover:bg-[#f3f4f6] dark:hover:bg-[#2d3748] text-[#637588] dark:text-[#9ca3af]'}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Painel Inicial</p>
            </button>

            <button
              onClick={() => handleNavigate('debtors')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${current === 'debtors' ? 'bg-primary/10 text-primary' : 'hover:bg-[#f3f4f6] dark:hover:bg-[#2d3748] text-[#637588] dark:text-[#9ca3af]'}`}
            >
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium leading-normal">Devedores</p>
            </button>

            <button
              onClick={() => handleNavigate('settle')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${current === 'settle' ? 'bg-primary/10 text-primary' : 'hover:bg-[#f3f4f6] dark:hover:bg-[#2d3748] text-[#637588] dark:text-[#9ca3af]'}`}
            >
              <span className="material-symbols-outlined">payments</span>
              <p className="text-sm font-medium leading-normal">Acerto de Contas</p>
            </button>

            <button
              onClick={() => handleNavigate('reports')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${current === 'reports' ? 'bg-primary/10 text-primary' : 'hover:bg-[#f3f4f6] dark:hover:bg-[#2d3748] text-[#637588] dark:text-[#9ca3af]'}`}
            >
              <span className="material-symbols-outlined">description</span>
              <p className="text-sm font-medium leading-normal">Relatórios / Histórico</p>
            </button>

            <div className="my-2 border-t border-[#e5e7eb] dark:border-[#2d3748]"></div>

            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#2d3748] text-[#637588] dark:text-[#9ca3af] transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Configurações</p>
            </button>
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-bold leading-normal">Sair da Conta</p>
              </button>
            )}

            <div className="flex items-center gap-3 px-2 py-3 border-t border-[#e5e7eb] dark:border-[#2d3748]">
              <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 flex-shrink-0" style={{ backgroundImage: `url("https://ui-avatars.com/api/?name=${userEmail || 'User'}&background=random")` }}></div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-[#111418] dark:text-white truncate">{userEmail?.split('@')[0] || 'Usuário'}</p>
                <p className="text-[10px] text-[#637588] dark:text-[#9ca3af] truncate">{userEmail || 'Sessão Ativa'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
