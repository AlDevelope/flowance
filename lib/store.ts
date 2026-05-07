import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number; // Initial balance for this account
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string;
  note: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM format
}

interface AppState {
  initialBalance: number;
  setInitialBalance: (amount: number) => void;
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;

  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;

  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
}

const defaultCategories: Category[] = [
  { id: 'cat_1', name: 'Makan & Minum', type: 'EXPENSE', color: '#F28B6E', icon: '🍔' },
  { id: 'cat_2', name: 'Transportasi', type: 'EXPENSE', color: '#7BB8D4', icon: '🚗' },
  { id: 'cat_3', name: 'Belanja (Bebelian)', type: 'EXPENSE', color: '#8B5CF6', icon: '🛍️' },
  { id: 'cat_4', name: 'Jajan', type: 'EXPENSE', color: '#F59E0B', icon: '🍦' },
  { id: 'cat_5', name: 'Tagihan', type: 'EXPENSE', color: '#EF4444', icon: '🧾' },
  { id: 'cat_6', name: 'Gaji', type: 'INCOME', color: '#4CAF85', icon: '💰' },
  { id: 'cat_7', name: 'Freelance', type: 'INCOME', color: '#3B82F6', icon: '💻' },
];

const defaultAccounts: Account[] = [
  { id: 'acc_1', name: 'Tunai', balance: 0, color: '#4CAF85', icon: '💵' },
  { id: 'acc_2', name: 'E-Wallet', balance: 0, color: '#3B82F6', icon: '📱' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      initialBalance: 0,
      setInitialBalance: (amount) => set({ initialBalance: amount }),

      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),

      accounts: defaultAccounts,
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateAccount: (id, updatedAccount) => set((state) => ({
        accounts: state.accounts.map((a) => a.id === id ? { ...updatedAccount, id } : a)
      })),
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id)
      })),

      categories: defaultCategories,
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateCategory: (id, updatedCategory) => set((state) => ({
        categories: state.categories.map((c) => c.id === id ? { ...updatedCategory, id } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id)
      })),

      transactions: [],
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: Math.random().toString(36).substr(2, 9) }, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      updateTransaction: (id, updatedTransaction) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === id ? { ...updatedTransaction, id } : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      budgets: [],
      addBudget: (budget) => set((state) => ({
        budgets: [...state.budgets, { ...budget, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateBudget: (id, updatedBudget) => set((state) => ({
        budgets: state.budgets.map((b) => b.id === id ? { ...updatedBudget, id } : b)
      })),
      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id)
      })),
    }),
    {
      name: 'flowance-storage',
    }
  )
);
