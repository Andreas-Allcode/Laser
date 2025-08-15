import { supabase } from '@/lib/supabase';

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const portfolioStorage = {
  async savePortfolio(portfolioData) {
    if (isProduction) {
      // Save to Supabase in production
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('company_name', 'Imported Portfolio Client')
        .single();
      
      let clientId;
      if (clientError || !clientData) {
        const { data: newClient, error: newClientError } = await supabase
          .from('clients')
          .insert({
            company_name: 'Imported Portfolio Client',
            client_type: 'debt_seller',
            email: 'imported@example.com',
            status: 'active'
          })
          .select()
          .single();
        
        if (newClientError) throw newClientError;
        clientId = newClient.id;
      } else {
        clientId = clientData.id;
      }
      
      const { data: newPortfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .insert({
          ...portfolioData,
          debt_seller_client_id: clientId
        })
        .select()
        .single();
      
      if (portfolioError) throw portfolioError;
      return newPortfolio;
    } else {
      // Save to localStorage in development
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      const newPortfolio = {
        ...portfolioData,
        id: `PORT_${Date.now()}`,
        client_name: 'Imported Portfolio Client'
      };
      portfolios.push(newPortfolio);
      localStorage.setItem('portfolios', JSON.stringify(portfolios));
      return newPortfolio;
    }
  },

  async loadPortfolios() {
    if (isProduction) {
      // Load from Supabase in production
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          clients!debt_seller_client_id(company_name)
        `);
      
      if (error) throw error;
      
      return data.map(portfolio => ({
        ...portfolio,
        client_name: portfolio.clients?.company_name || 'Unknown Client',
        portfolio_type: 'purchased'
      }));
    } else {
      // Load from localStorage in development
      return JSON.parse(localStorage.getItem('portfolios') || '[]');
    }
  },

  async updatePortfolioStats(portfolioId, stats) {
    if (isProduction) {
      // Update Supabase in production
      const { data, error } = await supabase
        .from('portfolios')
        .update(stats)
        .eq('id', portfolioId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Update localStorage in development
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);
      
      if (portfolioIndex !== -1) {
        portfolios[portfolioIndex] = { ...portfolios[portfolioIndex], ...stats };
        localStorage.setItem('portfolios', JSON.stringify(portfolios));
        return portfolios[portfolioIndex];
      }
      
      return null;
    }
  },

  async cleanupOrphanedDebts() {
    if (isProduction) {
      // Clean up orphaned debts in Supabase
      const { data: portfolios } = await supabase.from('portfolios').select('id');
      const validIds = portfolios?.map(p => p.id) || [];
      
      if (validIds.length > 0) {
        const { data: deletedDebts, error } = await supabase
          .from('debts')
          .delete()
          .not('portfolio_id', 'in', `(${validIds.join(',')})`)
          .select('id');
        
        if (error) throw error;
        return deletedDebts?.length || 0;
      }
      return 0;
    } else {
      // Clean up orphaned debts in localStorage
      const portfolios = await this.loadPortfolios(); // Load actual portfolios from Portfolio Management
      const debts = JSON.parse(localStorage.getItem('debts') || '[]');
      
      // Get valid portfolio IDs from Portfolio Management page
      const validPortfolioIds = new Set(portfolios.map(p => p.id));
      
      console.log('Valid portfolio IDs:', Array.from(validPortfolioIds));
      console.log('Total debts before cleanup:', debts.length);
      
      // Filter out debts that don't have a valid portfolio_id
      const validDebts = debts.filter(debt => {
        const isValid = validPortfolioIds.has(debt.portfolio_id);
        if (!isValid) {
          console.log(`Removing orphaned debt ${debt.debtor_id} with invalid portfolio_id: ${debt.portfolio_id}`);
        }
        return isValid;
      });
      
      const orphanedCount = debts.length - validDebts.length;
      
      if (orphanedCount > 0) {
        localStorage.setItem('debts', JSON.stringify(validDebts));
        console.log(`Cleaned up ${orphanedCount} orphaned debts. Remaining debts:`, validDebts.length);
      }
      
      return orphanedCount;
    }
  },

  async deletePortfolio(portfolioId) {
    console.log('deletePortfolio called with ID:', portfolioId);
    if (isProduction) {
      // Delete from Supabase in production
      // First delete all associated debts
      const { error: debtError } = await supabase
        .from('debts')
        .delete()
        .eq('portfolio_id', portfolioId);
      
      if (debtError) throw debtError;
      
      // Then delete the portfolio
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);
      
      if (error) throw error;
    } else {
      // Delete from localStorage in development
      // First delete all associated debts
      const debts = JSON.parse(localStorage.getItem('debts') || '[]');
      const debtsBefore = debts.length;
      const updatedDebts = debts.filter(debt => debt.portfolio_id !== portfolioId);
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      console.log(`Deleted ${debtsBefore - updatedDebts.length} debts for portfolio ${portfolioId}`);
      
      // Then delete the portfolio
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      const portfoliosBefore = portfolios.length;
      console.log('Portfolios before deletion:', portfolios.map(p => ({ id: p.id, name: p.name })));
      const updatedPortfolios = portfolios.filter(p => p.id !== portfolioId);
      localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
      console.log(`Deleted ${portfoliosBefore - updatedPortfolios.length} portfolios`);
      console.log('Portfolios after deletion:', updatedPortfolios.map(p => ({ id: p.id, name: p.name })));
    }
  }
};