import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SummaryView({ summaryData, onCustomize }) {
  const [summaryType, setSummaryType] = useState('portfolio');
  const [aggregationType, setAggregationType] = useState('sum');

  if (!summaryData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Summary View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Execute a search to view summary data.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Summary Configuration</CardTitle>
            <div className="flex gap-2">
              <Select value={summaryType} onValueChange={setSummaryType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">By Portfolio</SelectItem>
                  <SelectItem value="state">By State</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                  <SelectItem value="agency">By Agency</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={aggregationType} onValueChange={setAggregationType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {summaryData.totalAccounts?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${summaryData.totalBalance?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${Math.round(summaryData.averageBalance || 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Average Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {summaryData.avgChargeOffDays || 0}
                </p>
                <p className="text-sm text-muted-foreground">Avg Charge Off Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {summaryType === 'portfolio' ? 'Portfolio Distribution' :
               summaryType === 'state' ? 'State Distribution' :
               summaryType === 'status' ? 'Status Distribution' :
               'Agency Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 5 Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>
              Top 5 {summaryType === 'portfolio' ? 'Portfolios' :
                     summaryType === 'state' ? 'States' :
                     summaryType === 'status' ? 'Statuses' :
                     'Agencies'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(summaryData.topItems || []).slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className="w-8 h-8 flex items-center justify-center p-0"
                    >
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.accounts?.toLocaleString()} accounts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${item.balance?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.percentage?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio-specific Summary */}
      {summaryType === 'portfolio' && summaryData.portfolioDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Collection Status</h4>
                {Object.entries(summaryData.portfolioDetails.statusBreakdown || {}).map(([status, data]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-muted-foreground capitalize">{status.replace(/_/g, ' ')}</span>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{data.count}</div>
                      <div className="text-xs text-muted-foreground">{data.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Geographic Distribution</h4>
                {(summaryData.portfolioDetails.topStates || []).map((state, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{state.state}</span>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{state.count}</div>
                      <div className="text-xs text-muted-foreground">{state.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Key Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Placement Rate</span>
                    <span className="font-semibold text-primary">
                      {summaryData.portfolioDetails.placementRate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collection Rate</span>
                    <span className="font-semibold text-primary">
                      {summaryData.portfolioDetails.collectionRate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recovery Amount</span>
                    <span className="font-semibold text-primary">
                      ${(summaryData.portfolioDetails.recoveryAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}