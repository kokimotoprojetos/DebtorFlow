
import { Debtor, DebtorStatus, DebtCategory, Activity } from './types';

export const MOCK_DEBTORS: Debtor[] = [
  {
    id: '49201',
    name: 'Acme Corp',
    email: 'financeiro@acmecorp.com',
    debts: [
      // Fix: Added missing dueDate property to match DebtItem interface
      { id: 'd1', category: DebtCategory.PRODUTO, description: 'Lote de Hardware', amount: 12500.00, date: '2023-10-24', dueDate: '2023-11-24' }
    ],
    status: DebtorStatus.ATRASADO,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIujoypXIPrv-QNnQ7C6Inn7a9bKzi1cKFvGad1WP_-LpqxF-kPqn_9AWfwIgZ7BZT3ELucUzSUep7Cr7MLEs74RxEjI3pSqWR9hWs_v-k30N4MERCwa0TOmCQacrK2ckdI3aZN0T3GkJfs00HHiU31E-54zCknxnGJm5wsgiIQRG08fi27GAIq9IhxnVB-BHwEytxyYNc5ZME5O5dXOM6OwNEq17-COShXR8T7wBinHo9MAQRl17wkqs8tSoModg9acYbaC391eO6'
  },
  {
    id: '49202',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    debts: [
      // Fix: Added missing dueDate property to match DebtItem interface
      { id: 'd2', category: DebtCategory.SERVICO, description: 'Consultoria TI', amount: 450.00, date: '2023-11-01', dueDate: '2023-12-01' }
    ],
    status: DebtorStatus.ATIVO,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXCmtu_R5fpqpYI2BrNmjetBHnjkkeh7gPmWAECqpuyHDeJFjpWsOeAGeNZFooexrOHleS0IHkicZrNnxXfaWIGkZ5WmGySzgfAEuAvesK8vZzwatAMP0NwEcJ_L8lxNgdZwZfkDdJ7nuZF8pYbBsnac0qNOnqpwuqN-y9tR-oHiV8ASpNhBDcz-nwrPI28T_gG_3x4yk3OzecAiiVjuRBhBcGnuXS6a4ZfW5rAiwogxfovhaA1z1rQHvqYeyCSNKfl_aI0kriepj2V6'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Pagamento Recebido',
    description: 'João Silva pagou',
    amount: 500,
    timestamp: '2m atrás'
  },
  {
    id: '2',
    type: 'new_debtor',
    title: 'Novo Devedor',
    description: 'Caso #4928 - Sarah Smith',
    timestamp: '1h atrás'
  }
];

export const CHART_DATA = [
  { name: 'Jan', value: 30000 },
  { name: 'Fev', value: 45000 },
  { name: 'Mar', value: 35000 },
  { name: 'Abr', value: 55000 },
  { name: 'Mai', value: 92450 },
  { name: 'Jun', value: 80000 },
];
