import { supabase } from '@/lib/supabase'

// Database operations
export const db = {
  // Clients
  getClients: () => supabase.from('clients').select('*'),
  createClient: (data) => supabase.from('clients').insert(data),
  
  // Portfolios
  getPortfolios: () => supabase.from('portfolios').select('*'),
  createPortfolio: (data) => supabase.from('portfolios').insert(data),
  
  // Debts
  getDebts: () => supabase.from('debts').select('*'),
  createDebt: (data) => supabase.from('debts').insert(data),
  
  // Payments
  getPayments: () => supabase.from('payments').select('*'),
  createPayment: (data) => supabase.from('payments').insert(data),
}
