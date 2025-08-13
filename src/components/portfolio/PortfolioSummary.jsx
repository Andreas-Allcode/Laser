
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Grid3X3,
  List,
  Settings,
  Trash2
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, subtitle }) => (
  <Card className="bg-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          <span className="text-green-700 font-semibold">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DEFAULT_COLUMNS = [
  { key: 'name', label: 'Portfolio Name', visible: true },
  { key: 'client_name', label: 'Client', visible: true },
  { key: 'account_count', label: 'Accounts', visible: true },
  { key: 'original_face_value', label: 'Face Value', visible: true },
  { key: 'purchase_price', label: 'Purchase Price', visible: false },
  { key: 'purchase_date', label: 'Purchase Date', visible: false },
  { key: 'status', label: 'Status', visible: true },
  { key: 'collection_rate', label: 'Collection Rate', visible: false },
  { key: 'total_collected', label: 'Total Collected', visible: false },
];

export default function PortfolioSummary({ portfolios, onSelectPortfolio, onCreatePortfolio, onDeletePortfolio, type = 'purchased' }) {
  const [viewMode, setViewMode] = useState('card');
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  
  const totalPortfolios = portfolios.length;
  const totalFaceValue = portfolios.reduce((sum, p) => sum + p.original_face_value, 0);
  const totalAccounts = portfolios.reduce((sum, p) => sum + p.account_count, 0);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
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
      case 'client_name': return portfolio.client_name || 'N/A';
      case 'account_count': return portfolio.account_count?.toLocaleString();
      case 'original_face_value': return formatCurrency(portfolio.original_face_value);
      case 'purchase_price': return formatCurrency(portfolio.purchase_price || 0);
      case 'purchase_date': return portfolio.purchase_date ? new Date(portfolio.purchase_date).toLocaleDateString() : 'N/A';
      case 'status': return portfolio.status;
      case 'collection_rate': return portfolio.kpis?.collection_rate ? `${portfolio.kpis.collection_rate}%` : 'N/A';
      case 'total_collected': return formatCurrency(portfolio.kpis?.total_collected || 0);
      default: return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active_collections': 'bg-green-100 text-green-800',
      'pending_scrub': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-gray-100 text-gray-800',
      'in_review': 'bg-blue-100 text-blue-800',
      'for_sale': 'bg-green-100 text-green-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'sold': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {type === 'purchased' ? 'Purchased Portfolios' : 'Portfolios for Sale'}
          </h2>
          <p className="text-muted-foreground">
            {type === 'purchased' 
              ? 'Portfolios acquired from debt sellers and currently being worked' 
              : 'Portfolios created for sale to external debt buyers'
            }
          </p>
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
          {type === 'purchased' && (
            <Button onClick={onCreatePortfolio}>
              <FileText className="w-4 h-4 mr-2" />
              Upload Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Portfolios" value={totalPortfolios} icon={Users} />
        <StatCard title="Total Face Value" value={formatCurrency(totalFaceValue)} icon={DollarSign} />
        <StatCard title="Total Accounts" value={totalAccounts.toLocaleString()} icon={Users} />
      </div>

      {/* Portfolio Content */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              className="bg-white hover:border-primary cursor-pointer transition-all duration-200 flex flex-col"
              onClick={() => onSelectPortfolio(portfolio)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-foreground">{portfolio.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{portfolio.client_name}</p>
                  </div>
                  <Badge variant="outline" className={`font-medium ${getStatusColor(portfolio.status || portfolio.sale_status)}`}>
                    {(portfolio.status || portfolio.sale_status)?.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-secondary">
                      <p className="text-lg font-bold text-foreground">
                        {portfolio.account_count?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Accounts</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary">
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(portfolio.original_face_value)}
                      </p>
                      <p className="text-xs text-muted-foreground">Face Value</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {portfolio.kpis && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collection Rate:</span>
                        <span className="text-green-700 font-semibold">
                          {portfolio.kpis.collection_rate}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{portfolio.purchase_price ? 'Purchase Price:' : 'Asking Price:'}</span>
                      <span className="text-foreground font-semibold">
                        {formatCurrency(portfolio.purchase_price || portfolio.asking_price || 0)}
                      </span>
                    </div>
                  </div>
                  
                  {onDeletePortfolio && (
                    <div className="pt-2 border-t">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePortfolio(portfolio.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Portfolio
                      </Button>
                    </div>
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
                          {column.key === 'status' ? (
                            <Badge variant="outline" className={`font-medium ${getStatusColor(portfolio.status || portfolio.sale_status)}`}>
                              {(portfolio.status || portfolio.sale_status)?.replace(/_/g, ' ')}
                            </Badge>
                          ) : (
                            getCellValue(portfolio, column.key)
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
