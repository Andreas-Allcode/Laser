import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { generateMockPayments } from '@/utils/mockPayments';

export default function PaymentHistory({ debtorId }) {
  const mockPayments = generateMockPayments(debtorId);
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const getStatusColor = (status) => ({ processed: 'bg-green-100 text-green-800' }[status] || 'bg-gray-100 text-gray-800');

  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><DollarSign/> Payment History</CardTitle></CardHeader><CardContent>
      <div className="rounded-md border"><Table><TableHeader><TableRow>
        <TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead>
      </TableRow></TableHeader><TableBody>{mockPayments.map(p => <TableRow key={p.id}>
        <TableCell>{formatDate(p.payment_date)}</TableCell><TableCell>{formatCurrency(p.payment_amount)}</TableCell><TableCell>{p.payment_method.replace('_', ' ')}</TableCell><TableCell><Badge variant="outline" className={getStatusColor(p.status)}>{p.status}</Badge></TableCell>
      </TableRow>)}</TableBody></Table></div>
    </CardContent></Card>
  );
}