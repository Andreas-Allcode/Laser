import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, MapPin, AlertTriangle } from 'lucide-react';

export default function PreviewResults({ previewData, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!previewData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-secondary">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{previewData.totalAccounts?.toLocaleString() || 0}</div>
            <div className="text-sm text-muted-foreground">Total Accounts</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-secondary">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              ${previewData.totalBalance?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Balance</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-secondary">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              ${Math.round(previewData.averageBalance || 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Average Balance</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-secondary">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{previewData.topStates?.length || 0}</div>
            <div className="text-sm text-muted-foreground">States</div>
          </div>
        </div>

        {previewData.topStates && previewData.topStates.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Top 5 States by Account Count</h4>
            <div className="space-y-2">
              {previewData.topStates.slice(0, 5).map((state, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <span className="text-foreground font-medium">{state.state}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-foreground font-semibold">{state.count.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{state.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {previewData.warnings && previewData.warnings.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-100/50 border border-yellow-300">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Performance Warning</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {previewData.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}