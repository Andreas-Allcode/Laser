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
        beam_id: 'BEAM_001',
        original_account_number: 'ACC_12345',
        issuer_account_number: 'ISS_12345',
        seller_account_number: 'SEL_12345',
        original_creditor: 'Credit Card Company A',
        current_balance: 1545.25,
        original_balance: 2000.00,
        charge_off_amount: 2000.00,
        total_paid: 454.75,
        charge_off_date: '2023-06-15',
        account_open_date: '2020-03-10',
        delinquency_date: '2023-01-15',
        debtor_info: {
          first_name: 'John',
          last_name: 'Smith',
          date_of_birth: '1985-04-12',
          ssn: '123-45-6789',
          phone: '555-1234',
          email: 'john.smith@email.com',
          address: '123 Main St',
          address2: 'Apt 4B',
          city: 'Anytown',
          state: 'TX',
          zip: '12345',
          employer: 'Tech Solutions Inc',
          score_recovery_bankcard: 650,
          score_recovery_retail: 675,
          homeowner: true
        },
        status: 'active_internal'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_002',
        beam_id: 'BEAM_002',
        original_account_number: 'ACC_67890',
        issuer_account_number: 'ISS_67890',
        seller_account_number: 'SEL_67890',
        original_creditor: 'Credit Card Company B',
        current_balance: 2840.50,
        original_balance: 3500.00,
        charge_off_amount: 3500.00,
        total_paid: 659.50,
        charge_off_date: '2023-08-22',
        account_open_date: '2019-11-05',
        delinquency_date: '2023-03-22',
        debtor_info: {
          first_name: 'Maria',
          last_name: 'Garcia',
          date_of_birth: '1990-07-18',
          ssn: '987-65-4321',
          phone: '555-5678',
          email: 'maria.garcia@email.com',
          address: '456 Oak Ave',
          address2: '',
          city: 'Otherville',
          state: 'CA',
          zip: '67890',
          employer: 'Healthcare Partners',
          score_recovery_bankcard: 580,
          score_recovery_retail: 620,
          homeowner: false
        },
        status: 'placed_external'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_003',
        beam_id: 'BEAM_003',
        original_account_number: 'ACC_11111',
        issuer_account_number: 'ISS_11111',
        seller_account_number: 'SEL_11111',
        original_creditor: 'Auto Loan Company',
        current_balance: 5200.75,
        original_balance: 8000.00,
        charge_off_amount: 8000.00,
        total_paid: 2799.25,
        charge_off_date: '2023-04-10',
        account_open_date: '2021-01-20',
        delinquency_date: '2022-12-10',
        debtor_info: {
          first_name: 'Robert',
          last_name: 'Johnson',
          date_of_birth: '1978-12-03',
          ssn: '456-78-9012',
          phone: '555-9999',
          email: 'robert.johnson@email.com',
          address: '789 Pine St',
          address2: 'Unit 12',
          city: 'Somewhere',
          state: 'FL',
          zip: '33101',
          employer: 'Construction Corp',
          score_recovery_bankcard: 720,
          score_recovery_retail: 740,
          homeowner: true
        },
        status: 'active_internal'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_004',
        beam_id: 'BEAM_004',
        original_account_number: 'ACC_22222',
        issuer_account_number: 'ISS_22222',
        seller_account_number: 'SEL_22222',
        original_creditor: 'Medical Services LLC',
        current_balance: 890.00,
        original_balance: 1200.00,
        charge_off_amount: 1200.00,
        total_paid: 310.00,
        charge_off_date: '2023-09-05',
        account_open_date: '2022-05-15',
        delinquency_date: '2023-06-05',
        debtor_info: {
          first_name: 'Sarah',
          last_name: 'Williams',
          date_of_birth: '1992-09-25',
          ssn: '789-01-2345',
          phone: '555-7777',
          email: 'sarah.williams@email.com',
          address: '321 Elm Dr',
          address2: '',
          city: 'Newtown',
          state: 'NY',
          zip: '10001',
          employer: 'Marketing Agency',
          score_recovery_bankcard: 610,
          score_recovery_retail: 590,
          homeowner: false
        },
        status: 'resolved_paid'
      },
      {
        portfolio_id: portfolioData.id,
        debtor_id: 'DEBT_005',
        beam_id: 'BEAM_005',
        original_account_number: 'ACC_33333',
        issuer_account_number: 'ISS_33333',
        seller_account_number: 'SEL_33333',
        original_creditor: 'Utility Company',
        current_balance: 425.30,
        original_balance: 600.00,
        charge_off_amount: 600.00,
        total_paid: 174.70,
        charge_off_date: '2023-11-12',
        account_open_date: '2021-08-01',
        delinquency_date: '2023-08-12',
        debtor_info: {
          first_name: 'Michael',
          last_name: 'Brown',
          date_of_birth: '1980-02-14',
          ssn: '234-56-7890',
          phone: '555-3333',
          email: 'michael.brown@email.com',
          address: '654 Maple Ave',
          address2: '',
          city: 'Hometown',
          state: 'OH',
          zip: '44101',
          employer: 'Retail Store',
          score_recovery_bankcard: 540,
          score_recovery_retail: 565,
          homeowner: true
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