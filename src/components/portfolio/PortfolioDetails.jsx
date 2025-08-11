
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  DollarSign,
  Users,
  Search,
  Download,
  Upload,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Skull,
  Ban,
  MapPin
} from 'lucide-react';

export default function PortfolioDetails({ portfolio, onBack, onUploadFile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockDebts = [
    { debtor_id: 'DEBT_001', debtor_info: { first_name: 'John', last_name: 'Smith', state: 'TX' }, current_balance: 1545.25, original_balance: 2100.00, last_payment_amount: 150.00, last_payment_date: '2024-01-15', status: 'active_internal' },
    { debtor_id: 'DEBT_002', debtor_info: { first_name: 'Maria', last_name: 'Garcia', state: 'CA' }, current_balance: 2840.50, original_balance: 3200.00, last_payment_amount: 0, last_payment_date: null, status: 'placed_external' },
    { debtor_id: 'DEBT_003', debtor_info: { first_name: 'Robert', last_name: 'Johnson', state: 'FL' }, current_balance: 0, original_balance: 1850.75, last_payment_amount: 1850.75, last_payment_date: '2024-01-20', status: 'resolved_paid' },
    { debtor_id: 'DEBT_004', debtor_info: { first_name: 'Sarah', last_name: 'Williams', state: 'NY' }, current_balance: 950.00, original_balance: 950.00, last_payment_amount: 0, last_payment_date: null, status: 'uncollectible_bankruptcy' },
    { debtor_id: 'DEBT_005', debtor_info: { first_name: 'Michael', last_name: 'Davis', state: 'TX' }, current_balance: 3250.80, original_balance: 4100.00, last_payment_amount: 200.00, last_payment_date: '2023-12-28', status: 'placed_external' },
  ];

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

  const getStatusColor = (status) => ({
    'active_internal': 'bg-green-100 text-green-800', 'placed_external': 'bg-blue-100 text-blue-800',
    'resolved_paid': 'bg-purple-100 text-purple-800', 'resolved_settled': 'bg-indigo-100 text-indigo-800',
    'uncollectible_bankruptcy': 'bg-red-100 text-red-800', 'uncollectible_deceased': 'bg-gray-100 text-gray-800',
    'action_cease_desist': 'bg-orange-100 text-orange-800'
  }[status] || 'bg-gray-100 text-gray-800');

  const getStatusIcon = (status) => ({
    'resolved_paid': CheckCircle, 'resolved_settled': CheckCircle,
    'uncollectible_bankruptcy': AlertTriangle, 'uncollectible_deceased': Skull,
    'action_cease_desist': Ban
  }[status]);

  const filteredDebts = mockDebts.filter(debt =>
    `${debt.debtor_info.first_name} ${debt.debtor_info.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.debtor_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedDebts = filteredDebts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredDebts.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{portfolio.name}</h1>
            <p className="text-muted-foreground mt-1">{portfolio.client_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button onClick={onUploadFile}><Upload className="w-4 h-4 mr-2" />Upload File</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Accounts</p><p className="text-2xl font-bold">{portfolio.account_count.toLocaleString()}</p></div><Users className="w-8 h-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Face Value</p><p className="text-2xl font-bold">${(portfolio.original_face_value / 1000000).toFixed(1)}M</p></div><DollarSign className="w-8 h-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Collected</p><p className="text-2xl font-bold text-green-600">${(portfolio.kpis.total_collected / 1000000).toFixed(1)}M</p></div><CheckCircle className="w-8 h-8 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Avg Balance</p><p className="text-2xl font-bold">${portfolio.kpis.average_balance}</p></div><BarChart3 className="w-8 h-8 text-primary" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio Accounts</CardTitle>
            <div className="flex items-center gap-4 w-1/3">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input placeholder="Search accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Account ID</TableHead><TableHead>Debtor Name</TableHead><TableHead>State</TableHead><TableHead>Current Balance</TableHead><TableHead>Last Payment</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {paginatedDebts.map((debt) => {
                  const StatusIcon = getStatusIcon(debt.status);
                  return (
                    <TableRow key={debt.debtor_id}><TableCell className="font-mono">{debt.debtor_id}</TableCell><TableCell>{`${debt.debtor_info.first_name} ${debt.debtor_info.last_name}`}</TableCell><TableCell>{debt.debtor_info.state}</TableCell><TableCell className="font-semibold text-primary">{formatCurrency(debt.current_balance)}</TableCell><TableCell>{debt.last_payment_amount > 0 ? `${formatCurrency(debt.last_payment_amount)} on ${formatDate(debt.last_payment_date)}` : 'N/A'}</TableCell><TableCell><Badge variant="outline" className={`font-medium ${getStatusColor(debt.status)}`}>{StatusIcon && <StatusIcon className="w-3.5 h-3.5 mr-1.5" />}{debt.status.replace(/_/g, ' ')}</Badge></TableCell></TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDebts.length)} of {filteredDebts.length} accounts</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Previous</Button>
              <span className="text-sm font-medium px-2">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
