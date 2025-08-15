import { supabase } from '@/lib/supabase';

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const accountStorage = {
  async saveAccounts(portfolioId, accounts) {
    if (isProduction) {
      try {
        // Save to Supabase debts table in production
        const debtsData = accounts.map(account => {
          const cleanDebtData = {
            debtor_id: account.debtor_id,
            portfolio_id: portfolioId,
            debtor_info: account.debtor_info || {},
            current_balance: Number(account.total_amount_due || account.current_balance || 0),
            original_balance: Number(account.original_balance || account.total_amount_due || 0),
            status: account.status || 'active_internal'
          };
          
          // Only add optional fields if they have valid values
          if (account.principle_balance) cleanDebtData.principle_balance = Number(account.principle_balance);
          if (account.interest_rate) cleanDebtData.interest_rate = Number(account.interest_rate);
          if (account.original_creditor) cleanDebtData.original_creditor = account.original_creditor;
          if (account.original_account_number) cleanDebtData.original_account_number = account.original_account_number;
          if (account.seller_account_number) cleanDebtData.seller_account_number = account.seller_account_number;
          if (account.account_open_date) cleanDebtData.account_open_date = account.account_open_date;
          if (account.charge_off_date) cleanDebtData.charge_off_date = account.charge_off_date;
          if (account.delinquency_date) cleanDebtData.delinquency_date = account.delinquency_date;
          if (account.last_payment_date) cleanDebtData.last_payment_date = account.last_payment_date;
          
          return cleanDebtData;
        });
        
        console.log('Inserting debt data to Supabase:', debtsData[0]); // Log first record for debugging
        
        const { data, error } = await supabase
          .from('debts')
          .insert(debtsData)
          .select();
        
        if (error) {
          console.error('Supabase debt insertion error:', error);
          throw error;
        }
        
        console.log('Successfully inserted debts to Supabase:', data?.length);
        return data;
      } catch (error) {
        console.error('Error saving accounts to Supabase:', error);
        throw error;
      }
    } else {
      // Save to localStorage debts in development
      const existingDebts = JSON.parse(localStorage.getItem('debts') || '[]');
      const debtsData = accounts.map((account, index) => ({
        id: `DEBT_${portfolioId}_${Date.now()}_${index}`,
        debtor_id: account.debtor_id,
        portfolio_id: portfolioId,
        debtor_info: account.debtor_info,
        current_balance: account.total_amount_due || account.current_balance || 0,
        original_balance: account.original_balance || account.total_amount_due || 0,
        principle_balance: account.principle_balance || 0,
        interest_rate: account.interest_rate || 0,
        original_creditor: account.original_creditor || '',
        original_account_number: account.original_account_number || '',
        seller_account_number: account.seller_account_number || '',
        account_open_date: account.account_open_date,
        charge_off_date: account.charge_off_date,
        delinquency_date: account.delinquency_date,
        last_payment_date: account.last_payment_date,
        status: account.status || 'active_internal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const updatedDebts = [...existingDebts, ...debtsData];
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      return debtsData;
    }
  },

  async loadAccountsByPortfolio(portfolioId) {
    if (isProduction) {
      // Load from Supabase debts table in production
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('portfolio_id', portfolioId);
      
      if (error) throw error;
      return data || [];
    } else {
      // Load from localStorage debts in development
      const debts = JSON.parse(localStorage.getItem('debts') || '[]');
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      
      // Verify portfolio exists
      const portfolioExists = portfolios.some(p => p.id === portfolioId);
      if (!portfolioExists) {
        console.warn(`Portfolio ${portfolioId} not found. No debts will be returned.`);
        return [];
      }
      
      return debts.filter(debt => debt.portfolio_id === portfolioId);
    }
  },

  async deleteAccountsByPortfolio(portfolioId) {
    if (isProduction) {
      // Delete from Supabase debts table in production
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('portfolio_id', portfolioId);
      
      if (error) throw error;
    } else {
      // Delete from localStorage debts in development
      const debts = JSON.parse(localStorage.getItem('debts') || '[]');
      const updatedDebts = debts.filter(debt => debt.portfolio_id !== portfolioId);
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
    }
  }
};