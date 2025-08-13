// Shared mock payment data generator
export const generateMockPayments = (debtorId) => {
  // Use debtor_id to generate consistent payments
  const id = parseInt(debtorId.replace('DEBT_', '')) || 1000;
  
  // Generate consistent payments based on debtor_id
  const paymentCount = (id % 3) + 1; // 1-3 payments per debtor
  const payments = [];
  
  for (let i = 0; i < paymentCount; i++) {
    const baseAmount = ((id + i) % 500) + 50; // $50-$550 per payment
    payments.push({
      id: `PAY_${id}_${i + 1}`,
      payment_amount: baseAmount,
      payment_date: new Date(Date.now() - (i * 30 + (id % 90)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      payment_method: ['credit_card', 'ach', 'check'][i % 3],
      status: 'processed'
    });
  }
  
  return payments;
};

export const calculateTotalPaid = (debtorId) => {
  const payments = generateMockPayments(debtorId);
  return payments
    .filter(payment => payment.status === 'processed')
    .reduce((total, payment) => total + payment.payment_amount, 0);
};

export const getLastPaymentDate = (debtorId) => {
  const payments = generateMockPayments(debtorId);
  const processedPayments = payments.filter(payment => payment.status === 'processed');
  
  if (processedPayments.length === 0) return null;
  
  // Return the most recent payment date
  return processedPayments
    .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0]
    .payment_date;
};