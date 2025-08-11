import { supabase } from '@/lib/supabase';

export const createSampleData = async () => {
  try {
    // First, create a sample client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert([
        {
          company_name: 'Sample Debt Seller Inc.',
          client_type: 'debt_seller',
          email: 'contact@sampledebt.com',
          phone: '555-0100',
          address: { street: '123 Business Ave', city: 'Business City', state: 'TX', zip: '12345' }
        }
      ])
      .select()
      .single();

    if (clientError) throw clientError;

    // Create a sample portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolios')
      .insert([
        {
          name: 'Sample Portfolio 2024',
          description: 'Sample debt portfolio for testing',
          debt_seller_client_id: clientData.id,
          purchase_date: '2024-01-15',
          purchase_price: 50000.00,
          original_face_value: 250000.00,
          account_count: 5
        }
      ])
      .select()
      .single();

    if (portfolioError) throw portfolioError;

    // Create sample debt records
    const sampleDebts = [
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_001',
        original_account_number: 'ACC_12345',
        original_creditor: 'Credit Card Company A',
        current_balance: 1545.25,
        original_balance: 2000.00,
        charge_off_date: '2023-06-15',
        debtor_info: {
          first_name: 'John',
          last_name: 'Smith',
          phone: '555-1234',
          email: 'john.smith@email.com',
          address: '123 Main St',
          city: 'Anytown',
          state: 'TX',
          zip: '12345'
        },
        status: 'active_internal'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_002',
        original_account_number: 'ACC_67890',
        original_creditor: 'Credit Card Company B',
        current_balance: 2840.50,
        original_balance: 3500.00,
        charge_off_date: '2023-08-22',
        debtor_info: {
          first_name: 'Maria',
          last_name: 'Garcia',
          phone: '555-5678',
          email: 'maria.garcia@email.com',
          address: '456 Oak Ave',
          city: 'Otherville',
          state: 'CA',
          zip: '67890'
        },
        status: 'placed_external'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_003',
        original_account_number: 'ACC_11111',
        original_creditor: 'Auto Loan Company',
        current_balance: 5200.75,
        original_balance: 8000.00,
        charge_off_date: '2023-04-10',
        debtor_info: {
          first_name: 'Robert',
          last_name: 'Johnson',
          phone: '555-9999',
          email: 'robert.johnson@email.com',
          address: '789 Pine St',
          city: 'Somewhere',
          state: 'FL',
          zip: '33101'
        },
        status: 'active_internal'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_004',
        original_account_number: 'ACC_22222',
        original_creditor: 'Medical Services LLC',
        current_balance: 890.00,
        original_balance: 1200.00,
        charge_off_date: '2023-09-05',
        debtor_info: {
          first_name: 'Sarah',
          last_name: 'Williams',
          phone: '555-7777',
          email: 'sarah.williams@email.com',
          address: '321 Elm Dr',
          city: 'Newtown',
          state: 'NY',
          zip: '10001'
        },
        status: 'resolved_paid'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_005',
        original_account_number: 'ACC_33333',
        original_creditor: 'Utility Company',
        current_balance: 425.30,
        original_balance: 600.00,
        charge_off_date: '2023-11-12',
        debtor_info: {
          first_name: 'Michael',
          last_name: 'Brown',
          phone: '555-3333',
          email: 'michael.brown@email.com',
          address: '654 Maple Ave',
          city: 'Hometown',
          state: 'OH',
          zip: '44101'
        },
        status: 'uncollectible_bankruptcy'
      }
    ];

    const { data: debtData, error: debtError } = await supabase
      .from('debts')
      .insert(sampleDebts)
      .select();

    if (debtError) throw debtError;

    console.log('Sample data created successfully!');
    return { client: clientData, portfolio: portfolioData, debts: debtData };
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};