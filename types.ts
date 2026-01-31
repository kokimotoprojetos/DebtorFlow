
export enum DebtorStatus {
  ATIVO = 'Ativo',
  ATRASADO = 'Atrasado',
  PAGO = 'Pago',
  ACORDADO = 'Acordado',
  PENDENTE = 'Pendente'
}

export enum DebtCategory {
  PRODUTO = 'Produto',
  SERVICO = 'Serviço',
  EMPRESTIMO = 'Empréstimo',
  TAXA = 'Taxa/Juro',
  ALUGUEL = 'Aluguel',
  OUTROS = 'Outros'
}

export interface DebtItem {
  id: string;
  category: DebtCategory;
  description: string;
  amount: number;
  date: string;
  dueDate: string; // Data prevista para o pagamento
}

export interface Debtor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  debts: DebtItem[];
  status: DebtorStatus;
  avatar: string;
}

export interface HistoryEntry {
  id: string;
  debtorId: string;
  debtorName: string;
  type: 'Divida' | 'Pagamento';
  category: DebtCategory | 'Sistema';
  amount: number;
  date: string;
  description: string;
}

export interface Activity {
  id: string;
  type: 'payment' | 'new_debtor' | 'overdue' | 'report' | 'note';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
}
