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

  async deletePortfolio(portfolioId) {
    if (isProduction) {
      // Delete from Supabase in production
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);
      
      if (error) throw error;
    } else {
      // Delete from localStorage in development
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      const updatedPortfolios = portfolios.filter(p => p.id !== portfolioId);
      localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));
    }
  }
};