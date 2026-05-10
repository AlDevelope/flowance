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

  user: {
    displayName: string;
    email: string;
    isGoogleConnected: boolean;
    avatar?: string;
  };
  updateUser: (data: Partial<AppState['user']>) => void;

  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, account: Omit<Account, 'id'>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;

  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Omit<Budget, 'id'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  hydrate: (data: {
    accounts?: Account[];
    categories?: Category[];
    transactions?: Transaction[];
    budgets?: Budget[];
    user?: Partial<AppState['user']>;
  }) => void;
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

      user: {
        displayName: 'User Flowance',
        email: '',
        isGoogleConnected: false,
      },
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),

      accounts: defaultAccounts,
      addAccount: async (account) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        set((state) => ({ accounts: [...state.accounts, { ...account, id: tempId }] }));
        try {
          const res = await fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account)
          });
          if (res.ok) {
            const saved = await res.json();
            set((state) => ({ accounts: state.accounts.map(a => a.id === tempId ? saved : a) }));
          }
        } catch (e) { console.error(e); }
      },
      updateAccount: async (id, updatedAccount) => {
        set((state) => ({ accounts: state.accounts.map((a) => a.id === id ? { ...updatedAccount, id } : a) }));
        try {
          await fetch(`/api/accounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAccount)
          });
        } catch (e) { console.error(e); }
      },
      deleteAccount: async (id) => {
        set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
        try {
          await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
      },

      categories: defaultCategories,
      addCategory: async (category) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        set((state) => ({ categories: [...state.categories, { ...category, id: tempId }] }));
        try {
          const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
          });
          if (res.ok) {
            const saved = await res.json();
            set((state) => ({ categories: state.categories.map(c => c.id === tempId ? saved : c) }));
          }
        } catch (e) { console.error(e); }
      },
      updateCategory: async (id, updatedCategory) => {
        set((state) => ({ categories: state.categories.map((c) => c.id === id ? { ...updatedCategory, id } : c) }));
        try {
          await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCategory)
          });
        } catch (e) { console.error(e); }
      },
      deleteCategory: async (id) => {
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
        try {
          await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
      },

      transactions: [],
      addTransaction: async (transaction) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          transactions: [{ ...transaction, id: tempId }, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }));

        try {
          const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
          });
          if (res.ok) {
            const savedTx = await res.json();
            set((state) => ({
              transactions: state.transactions.map(t => t.id === tempId ? { ...savedTx, id: savedTx.id } : t)
            }));
          }
        } catch (error) {
          console.error("Failed to sync transaction", error);
        }
      },
      updateTransaction: async (id, updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) => t.id === id ? { ...updatedTransaction, id } : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }));

        try {
          await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTransaction)
          });
        } catch (error) {
          console.error("Failed to sync updated transaction", error);
        }
      },
      deleteTransaction: async (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }));

        try {
          await fetch(`/api/transactions/${id}`, {
            method: 'DELETE'
          });
        } catch (error) {
          console.error("Failed to delete transaction", error);
        }
      },

      budgets: [],
      addBudget: async (budget) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        set((state) => ({ budgets: [...state.budgets, { ...budget, id: tempId }] }));
        try {
          const res = await fetch('/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget)
          });
          if (res.ok) {
            const saved = await res.json();
            set((state) => ({ budgets: state.budgets.map(b => b.id === tempId ? saved : b) }));
          }
        } catch (e) { console.error(e); }
      },
      updateBudget: async (id, updatedBudget) => {
        set((state) => ({ budgets: state.budgets.map((b) => b.id === id ? { ...updatedBudget, id } : b) }));
        try {
          await fetch(`/api/budgets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBudget)
          });
        } catch (e) { console.error(e); }
      },
      deleteBudget: async (id) => {
        set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }));
        try {
          await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
      },
      
      hydrate: (data) => set((state) => ({
        accounts: data.accounts || state.accounts,
        categories: data.categories || state.categories,
        transactions: data.transactions || state.transactions,
        budgets: data.budgets || state.budgets,
        user: { ...state.user, ...data.user }
      })),
    }),
    {
      name: 'flowance-storage',
    }
  )
);
