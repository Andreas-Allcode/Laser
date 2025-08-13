import { supabase } from '@/lib/supabase';
import { calculateTotalPaid, getLastPaymentDate } from './mockPayments';

// Seeded random function for consistent data generation
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Mock data from Command Center (same as in CommandCenter.jsx)
const portfolios = Array.from({ length: 10 }, (_, i) => `PORTFOLIO_${i + 1}`);
const states = ['TX', 'CA', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
const statuses = ['active_internal', 'placed_external', 'resolved_paid', 'uncollectible_bankruptcy', 'resolved_settled'];
const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'Michael', 'Patricia', 'James', 'Linda', 'David', 'Susan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const generateMockDebts = () => {
  return Array.from({ length: 2000 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const state = states[i % states.length];
    const status = statuses[i % statuses.length];
    const portfolio = portfolios[i % portfolios.length];
    
    // Use seeded random for consistent data generation
    const originalBalance = Math.floor(seededRandom(i * 1234) * 60000) + 2000;
    const debtorId = `DEBT_${1000 + i}`;
    const totalPaid = calculateTotalPaid(debtorId);
    const currentBalance = Math.max(0, originalBalance - totalPaid);
    const chargeOffDate = new Date(Date.now() - seededRandom(i * 9012) * 365 * 3 * 24 * 60 * 60 * 1000);
    const lastPaymentDate = getLastPaymentDate(debtorId) ? new Date(getLastPaymentDate(debtorId)) : null;
    
    return {
      debtor_id: debtorId,
      original_account_number: `ACC_${String((i * 123) % 999999).padStart(6, '0')}`,
      original_creditor: ['Credit Card Company A', 'Medical Services LLC', 'Auto Finance Corp', 'Retail Store Chain', 'Utility Company'][i % 5],
      debtor_info: {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: new Date(1950 + (i % 50), i % 12, (i % 28) + 1).toISOString().split('T')[0],
        ssn: `${String((i * 7) % 900 + 100)}-${String((i * 11) % 90 + 10)}-${String((i * 13) % 9000 + 1000)}`,
        state: state,
        homeowner: i % 2 === 0,
        score_recovery_bankcard: 500 + (i * 17) % 300,
        score_recovery_retail: 520 + (i * 19) % 280,
        phone: `555-${String((i * 11) % 9000 + 1000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        address: `${i % 9999 + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Maple'][i % 5]} ${['St', 'Ave', 'Dr', 'Blvd'][i % 4]}`,
        address2: i % 4 === 0 ? `Apt ${(i % 99) + 1}` : '',
        city: ['Anytown', 'Otherville', 'Somewhere', 'Newtown', 'Hometown'][i % 5],
        zip: String((i * 17) % 90000 + 10000),
        employer: ['Tech Solutions Inc', 'Healthcare Partners', 'Construction Corp', 'Marketing Agency', 'Retail Store'][i % 5]
      },
      current_balance: currentBalance,
      original_balance: originalBalance,
      charge_off_date: chargeOffDate.toISOString().split('T')[0],
      last_payment_date: lastPaymentDate ? lastPaymentDate.toISOString().split('T')[0] : null,
      status: status,
      portfolio_id: portfolio,
    };
  });
};

export const syncCommandCenterToDatabase = async () => {
  try {
    // Check if we already have data
    const { data: existingData, error: checkError } = await supabase
      .from('debts')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    // Clear existing data to ensure fresh sync
    if (existingData && existingData.length > 0) {
      console.log('Clearing existing debt data for fresh sync');
      const { error: deleteError } = await supabase
        .from('debts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (deleteError) {
        console.error('Error clearing existing data:', deleteError);
      }
    }

    // First, create a default portfolio if none exists
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .select('id')
      .limit(1);

    let defaultPortfolioId;
    
    if (!portfolioData || portfolioData.length === 0) {
      // Create a default client first
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          company_name: 'Default Debt Seller',
          client_type: 'debt_seller',
          email: 'default@example.com',
          status: 'active'
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create a default portfolio
      const { data: newPortfolio, error: newPortfolioError } = await supabase
        .from('portfolios')
        .insert({
          name: 'Default Portfolio',
          description: 'Auto-generated portfolio for Command Center sync',
          debt_seller_client_id: clientData.id,
          purchase_date: new Date().toISOString().split('T')[0],
          purchase_price: 1000000,
          original_face_value: 5000000,
          status: 'active_collections'
        })
        .select()
        .single();

      if (newPortfolioError) throw newPortfolioError;
      defaultPortfolioId = newPortfolio.id;
    } else {
      defaultPortfolioId = portfolioData[0].id;
    }

    // Generate mock debts
    const mockDebts = generateMockDebts();

    // Prepare data for insertion (batch insert in chunks)
    const chunkSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < mockDebts.length; i += chunkSize) {
      const chunk = mockDebts.slice(i, i + chunkSize).map(debt => ({
        portfolio_id: defaultPortfolioId,
        debtor_id: debt.debtor_id,
        original_account_number: debt.original_account_number,
        original_creditor: debt.original_creditor,
        current_balance: debt.current_balance,
        original_balance: debt.original_balance,
        charge_off_date: debt.charge_off_date,
        last_payment_date: debt.last_payment_date,
        debtor_info: debt.debtor_info,
        status: debt.status
      }));

      const { error: insertError } = await supabase
        .from('debts')
        .insert(chunk);

      if (insertError) {
        console.error('Error inserting chunk:', insertError);
        throw insertError;
      }

      insertedCount += chunk.length;
      console.log(`Inserted ${insertedCount}/${mockDebts.length} records`);
    }

    return { 
      success: true, 
      message: `Successfully synced ${insertedCount} debt accounts to database`,
      count: insertedCount 
    };

  } catch (error) {
    console.error('Error syncing Command Center data:', error);
    return { 
      success: false, 
      message: `Failed to sync data: ${error.message}`,
      error 
    };
  }
};