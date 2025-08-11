
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Users,
  TrendingUp,
  FileText
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

export default function PortfolioSummary({ portfolios, onSelectPortfolio, onCreatePortfolio }) {
  const totalPortfolios = portfolios.length;
  const totalFaceValue = portfolios.reduce((sum, p) => sum + p.original_face_value, 0);
  const totalAccounts = portfolios.reduce((sum, p) => sum + p.account_count, 0);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'active_collections': 'bg-green-100 text-green-800',
      'pending_scrub': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-gray-100 text-gray-800',
      'in_review': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div/>
        <Button onClick={onCreatePortfolio}>
          <FileText className="w-4 h-4 mr-2" />
          Create Portfolio
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Portfolios" value={totalPortfolios} icon={Users} />
        <StatCard title="Total Face Value" value={formatCurrency(totalFaceValue)} icon={DollarSign} />
        <StatCard title="Total Accounts" value={totalAccounts.toLocaleString()} icon={Users} />
      </div>

      {/* Portfolio Grid */}
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
                <Badge variant="outline" className={`font-medium ${getStatusColor(portfolio.status)}`}>
                  {portfolio.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary">
                    <p className="text-lg font-bold text-foreground">
                      {portfolio.account_count.toLocaleString()}
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Collection Rate:</span>
                    <span className="text-green-700 font-semibold">
                      {portfolio.kpis.collection_rate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase Price:</span>
                    <span className="text-foreground font-semibold">
                      {formatCurrency(portfolio.purchase_price)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
