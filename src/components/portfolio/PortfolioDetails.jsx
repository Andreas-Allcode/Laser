
import React, { useState, useEffect } from 'react';
import { accountStorage } from '@/utils/accountStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MediaManager from './MediaManager';
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
  MapPin,
  FolderOpen
} from 'lucide-react';

export default function PortfolioDetails({ portfolio, onBack, onUploadFile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Load real account data
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const accountData = await accountStorage.loadAccountsByPortfolio(portfolio.id);
        setAccounts(accountData);
      } catch (error) {
        console.error('Error loading accounts:', error);
        // Fallback to mock data if no real data exists
        setAccounts(generateFallbackData());
      } finally {
        setLoading(false);
      }
    };
    
    loadAccounts();
  }, [portfolio.id]);
  
  // Generate fallback data for portfolios without imported accounts
  const generateFallbackData = () => {
    const firstNames = ['John', 'Maria', 'Robert', 'Sarah', 'Michael'];
    const lastNames = ['Smith', 'Garcia', 'Johnson', 'Williams', 'Davis'];
    const states = ['TX', 'CA', 'FL', 'NY', 'IL'];
    
    return Array.from({ length: Math.min(portfolio.account_count || 5, 10) }, (_, i) => ({
      debtor_id: `${portfolio.id}_${String(i + 1).padStart(3, '0')}`,
      debtor_info: {
        first_name: firstNames[i % firstNames.length],
        last_name: lastNames[i % lastNames.length],
        state: states[i % states.length]
      },
      total_amount_due: 1000 + (i * 500),
      current_balance: 800 + (i * 400),
      status: 'active_internal'
    }));
  };

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

  const filteredAccounts = accounts.filter(account =>
    `${account.debtor_info?.first_name || ''} ${account.debtor_info?.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.debtor_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  // Show Media Manager if selected
  if (showMediaManager) {
    return (
      <MediaManager 
        portfolio={portfolio} 
        onBack={() => setShowMediaManager(false)}
      />
    );
  }

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
          <Button variant="outline" onClick={() => setShowMediaManager(true)}>
            <FolderOpen className="w-4 h-4 mr-2" />Media Manager
          </Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button onClick={onUploadFile}><Upload className="w-4 h-4 mr-2" />Upload File</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Accounts</p><p className="text-2xl font-bold">{portfolio.account_count?.toLocaleString()}</p></div><Users className="w-8 h-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Face Value</p><p className="text-2xl font-bold">${(portfolio.original_face_value / 1000000).toFixed(1)}M</p></div><DollarSign className="w-8 h-8 text-primary" /></div></CardContent></Card>
        {portfolio.portfolio_type === 'for_sale' ? (
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Asking Price</p><p className="text-2xl font-bold text-green-600">${(portfolio.asking_price / 1000000).toFixed(1)}M</p></div><DollarSign className="w-8 h-8 text-green-500" /></div></CardContent></Card>
        ) : (
          <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Collected</p><p className="text-2xl font-bold text-green-600">${((portfolio.kpis?.total_collected || 0) / 1000000).toFixed(1)}M</p></div><CheckCircle className="w-8 h-8 text-green-500" /></div></CardContent></Card>
        )}
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{portfolio.portfolio_type === 'for_sale' ? 'Created Date' : 'Avg Balance'}</p><p className="text-2xl font-bold">{portfolio.portfolio_type === 'for_sale' ? new Date(portfolio.created_date).toLocaleDateString() : `$${portfolio.kpis?.average_balance || 'N/A'}`}</p></div><BarChart3 className="w-8 h-8 text-primary" /></div></CardContent></Card>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading accounts...
                    </TableCell>
                  </TableRow>
                ) : paginatedAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No accounts found. Upload a CSV file to import account data.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAccounts.map((account) => {
                    const StatusIcon = getStatusIcon(account.status);
                    const balance = account.current_balance || account.total_amount_due || 0;
                    return (
                      <TableRow key={account.debtor_id}>
                        <TableCell className="font-mono">{account.debtor_id}</TableCell>
                        <TableCell>
                          {account.debtor_info?.first_name && account.debtor_info?.last_name 
                            ? `${account.debtor_info.first_name} ${account.debtor_info.last_name}`
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>{account.debtor_info?.state || 'N/A'}</TableCell>
                        <TableCell className="font-semibold text-primary">{formatCurrency(account.current_balance || 0)}</TableCell>
                        <TableCell>
                          {account.last_payment_date 
                            ? `Last payment: ${formatDate(account.last_payment_date)}` 
                            : 'No payments'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-medium ${getStatusColor(account.status)}`}>
                            {StatusIcon && <StatusIcon className="w-3.5 h-3.5 mr-1.5" />}
                            {account.status?.replace(/_/g, ' ') || 'active'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts</div>
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
