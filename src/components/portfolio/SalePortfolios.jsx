import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Eye, DollarSign, Users, Calendar, MapPin, Grid3X3, List, Settings, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const STATUS_COLORS = {
  'for_sale': 'bg-green-100 text-green-800',
  'under_review': 'bg-yellow-100 text-yellow-800',
  'sold': 'bg-blue-100 text-blue-800',
  'not_for_sale': 'bg-gray-100 text-gray-800'
};

const SALE_COLUMNS = [
  { key: 'name', label: 'Portfolio Name', visible: true },
  { key: 'created_by', label: 'Created By', visible: true },
  { key: 'account_count', label: 'Accounts', visible: true },
  { key: 'original_face_value', label: 'Face Value', visible: true },
  { key: 'asking_price', label: 'Asking Price', visible: true },
  { key: 'created_date', label: 'Created Date', visible: false },
  { key: 'sale_status', label: 'Status', visible: true },
  { key: 'description', label: 'Description', visible: false },
];

export default function SalePortfolios({ portfolios, onSelectPortfolio }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [columns, setColumns] = useState(SALE_COLUMNS);
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: '',
    asking_price: '',
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleColumnVisibility = (columnKey) => {
    setColumns(columns.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const visibleColumns = columns.filter(col => col.visible);

  const getCellValue = (portfolio, columnKey) => {
    switch (columnKey) {
      case 'name': return portfolio.name;
      case 'created_by': return portfolio.created_by;
      case 'account_count': return portfolio.account_count?.toLocaleString();
      case 'original_face_value': return formatCurrency(portfolio.original_face_value);
      case 'asking_price': return formatCurrency(portfolio.asking_price);
      case 'created_date': return new Date(portfolio.created_date).toLocaleDateString();
      case 'sale_status': return portfolio.sale_status;
      case 'description': return portfolio.description;
      default: return 'N/A';
    }
  };

  const handleCreatePortfolio = () => {
    // Handle portfolio creation logic here
    console.log('Creating portfolio:', newPortfolio);
    setShowCreateDialog(false);
    setNewPortfolio({ name: '', description: '', asking_price: '' });
  };

  const handleDownloadAccounts = (portfolio) => {
    // Generate comprehensive account data for external debt buyer
    const accountData = generateAccountData(portfolio);
    const csvContent = convertToCSV(accountData);
    downloadCSV(csvContent, `${portfolio.name}_accounts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateAccountData = (portfolio) => {
    // Generate mock account data based on portfolio
    const firstNames = ['John', 'Maria', 'Robert', 'Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'James', 'Patricia'];
    const lastNames = ['Smith', 'Garcia', 'Johnson', 'Williams', 'Davis', 'Brown', 'Jones', 'Miller', 'Wilson', 'Moore'];
    const states = ['TX', 'CA', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
    const creditors = ['Credit Card Company A', 'Medical Services LLC', 'Auto Loan Company', 'Utility Company', 'Retail Store'];
    const employers = ['Tech Solutions Inc', 'Healthcare Partners', 'Construction Corp', 'Marketing Agency', 'Retail Store'];
    
    return Array.from({ length: portfolio.account_count }, (_, i) => {
      const seed = portfolio.id.charCodeAt(portfolio.id.length - 1) + i;
      const originalBalance = 500 + (seed * 47) % 5000;
      const currentBalance = Math.max(0, originalBalance - (seed * 23) % originalBalance);
      
      return {
        // Account Information
        debtor_id: `${portfolio.id}_${String(i + 1).padStart(4, '0')}`,
        beam_id: `BEAM_${portfolio.id}_${String(i + 1).padStart(4, '0')}`,
        original_account_number: `ACC_${String(seed).padStart(6, '0')}`,
        issuer_account_number: `ISS_${String(seed).padStart(6, '0')}`,
        seller_account_number: `SEL_${String(seed).padStart(6, '0')}`,
        original_creditor: creditors[seed % creditors.length],
        
        // Balance Information
        current_balance: currentBalance,
        original_balance: originalBalance,
        charge_off_amount: originalBalance,
        total_paid: originalBalance - currentBalance,
        account_open_date: new Date(Date.now() - (seed * 86400000 * 365)).toISOString().split('T')[0],
        charge_off_date: new Date(Date.now() - (seed * 86400000 * 180)).toISOString().split('T')[0],
        delinquency_date: new Date(Date.now() - (seed * 86400000 * 200)).toISOString().split('T')[0],
        
        // Debtor Demographics
        first_name: firstNames[seed % firstNames.length],
        last_name: lastNames[(seed + 7) % lastNames.length],
        date_of_birth: new Date(1950 + (seed % 50), seed % 12, (seed % 28) + 1).toISOString().split('T')[0],
        ssn: `${String(seed % 900 + 100)}-${String((seed * 7) % 90 + 10)}-${String((seed * 13) % 9000 + 1000)}`,
        phone: `555-${String((seed * 11) % 9000 + 1000)}`,
        email: `${firstNames[seed % firstNames.length].toLowerCase()}.${lastNames[(seed + 7) % lastNames.length].toLowerCase()}@email.com`,
        
        // Address Information
        address: `${seed % 9999 + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Maple'][seed % 5]} ${'St Ave Dr Blvd'.split(' ')[seed % 4]}`,
        address2: seed % 3 === 0 ? `Apt ${seed % 99 + 1}` : '',
        city: ['Anytown', 'Otherville', 'Somewhere', 'Newtown', 'Hometown'][seed % 5],
        state: states[seed % states.length],
        zip: String((seed * 17) % 90000 + 10000),
        
        // Additional Demographics
        employer: employers[seed % employers.length],
        homeowner: seed % 3 === 0 ? 'Yes' : 'No',
        score_recovery_bankcard: 500 + (seed * 17) % 300,
        score_recovery_retail: 520 + (seed * 19) % 280,
        
        // Scrub Information
        last_scrub_date: new Date(Date.now() - (seed * 86400000 * 30)).toISOString().split('T')[0],
        scrub_status: ['Verified', 'Needs Review', 'Updated'][seed % 3],
        bankruptcy_flag: seed % 20 === 0 ? 'Yes' : 'No',
        deceased_flag: seed % 50 === 0 ? 'Yes' : 'No',
        cease_desist_flag: seed % 30 === 0 ? 'Yes' : 'No'
      };
    });
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolios for Sale</h2>
          <p className="text-muted-foreground">Manage portfolios available for external debt buyers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          {viewMode === 'list' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {columns.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Sale Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Portfolio for Sale</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Portfolio Name</Label>
                <Input
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                  placeholder="Enter portfolio name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                  placeholder="Describe the portfolio contents and characteristics"
                />
              </div>
              <div>
                <Label>Asking Price</Label>
                <Input
                  type="number"
                  value={newPortfolio.asking_price}
                  onChange={(e) => setNewPortfolio({...newPortfolio, asking_price: e.target.value})}
                  placeholder="Enter asking price"
                />
              </div>
              <Button onClick={handleCreatePortfolio} className="w-full">
                Create Portfolio
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                <Badge className={STATUS_COLORS[portfolio.sale_status]}>
                  {portfolio.sale_status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{portfolio.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{portfolio.account_count?.toLocaleString()} accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{formatCurrency(portfolio.original_face_value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(portfolio.created_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(portfolio.asking_price)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Top States</h4>
                <div className="flex flex-wrap gap-1">
                  {portfolio.top_states?.slice(0, 3).map((state) => (
                    <Badge key={state.state} variant="outline" className="text-xs">
                      {state.state} {state.percentage}%
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => onSelectPortfolio(portfolio)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {portfolio.sale_status === 'sold' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadAccounts(portfolio);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map(column => (
                      <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolios.map((portfolio) => (
                    <TableRow 
                      key={portfolio.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectPortfolio(portfolio)}
                    >
                      {visibleColumns.map(column => (
                        <TableCell key={column.key}>
                          {column.key === 'sale_status' ? (
                            <Badge className={STATUS_COLORS[portfolio.sale_status]}>
                              {portfolio.sale_status.replace('_', ' ')}
                            </Badge>
                          ) : (
                            getCellValue(portfolio, column.key)
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => onSelectPortfolio(portfolio)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {portfolio.sale_status === 'sold' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadAccounts(portfolio);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {portfolios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">No portfolios for sale</p>
              <p className="text-sm">Create your first portfolio to make it available for external buyers</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}