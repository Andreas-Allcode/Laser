import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function PortfolioOverviewWidget({ config, onNavigate }) {
  const mockPortfolios = [
    { id: 'PORT_1', name: 'Q1 2024 Healthcare', account_count: 15420, total_balance: 8500000, placed_percent: 78, attention_needed: 340, status: 'active_collections' },
    { id: 'PORT_2', name: 'Legacy Credit Cards', account_count: 28750, total_balance: 12800000, placed_percent: 85, attention_needed: 125, status: 'active_collections' },
  ];

  const totalAccounts = 53110;
  const totalBalance = 39500000;
  const totalCollected = 5200000;
  const totalAttention = 1705;

  const formatCurrency = (amount) => `$${(amount / 1000000).toFixed(1)}M`;
  const formatNumber = (num) => num.toLocaleString();

  const getStatusColor = (status) => {
    const colors = {
      'active_collections': 'bg-green-100 text-green-800',
      'pending_scrub': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="bg-card border h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Database className="w-5 h-5 text-muted-foreground" />
          Portfolio Overview
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate('PortfolioManagement')}
          className="text-primary"
        >
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-card border">
            <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{formatNumber(totalAccounts)}</p>
            <p className="text-xs text-muted-foreground">Total Accounts</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <DollarSign className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-muted-foreground">Total Balance</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalCollected)}</p>
            <p className="text-xs text-muted-foreground">Collected</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border">
            <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-red-500" />
            <p className="text-lg font-bold text-red-600">{formatNumber(totalAttention)}</p>
            <p className="text-xs text-muted-foreground">Need Attention</p>
          </div>
        </div>

        {/* Portfolio List */}
        <div className="space-y-3 flex-grow">
          {mockPortfolios.map((portfolio) => (
            <div 
              key={portfolio.id}
              className="p-4 rounded-lg bg-secondary/50 border hover:border-primary cursor-pointer transition-colors"
              onClick={() => onNavigate('PortfolioManagement', { portfolioId: portfolio.id })}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground truncate">{portfolio.name}</h4>
                <Badge variant="outline" className={`text-xs font-medium ${getStatusColor(portfolio.status)}`}>
                  {portfolio.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                <div>
                  <span className="text-muted-foreground">Accounts:</span>
                  <p className="text-foreground font-semibold">{portfolio.account_count.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Balance:</span>
                  <p className="text-foreground font-semibold">{formatCurrency(portfolio.total_balance)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Placed:</span>
                  <p className="text-foreground font-semibold">{portfolio.placed_percent}%</p>
                </div>
              </div>
              
              {portfolio.attention_needed > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {portfolio.attention_needed} accounts need attention
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}