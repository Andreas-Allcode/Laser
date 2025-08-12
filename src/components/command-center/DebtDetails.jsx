import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X } from 'lucide-react';

const STATUS_COLORS = {
  'active_internal': 'bg-green-100 text-green-800',
  'placed_external': 'bg-blue-100 text-blue-800',
  'resolved_paid': 'bg-purple-100 text-purple-800',
  'resolved_settled': 'bg-indigo-100 text-indigo-800',
  'uncollectible_bankruptcy': 'bg-red-100 text-red-800',
  'uncollectible_deceased': 'bg-gray-100 text-gray-800',
  'action_cease_desist': 'bg-orange-100 text-orange-800',
  'payment_plan_active': 'bg-yellow-100 text-yellow-800'
};

export default function DebtDetails({ debt, onBack }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Command Center
              </Button>
              <div>
                <CardTitle className="text-2xl">Debt Account Details</CardTitle>
                <p className="text-muted-foreground mt-1">Account ID: {debt.debtor_id}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onBack}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Debtor ID:</span>
                <span>{debt.debtor_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">BEAM ID:</span>
                <span>{debt.beam_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Original Account:</span>
                <span>{debt.original_account_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Issuer Account:</span>
                <span>{debt.issuer_account_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Seller Account:</span>
                <span>{debt.seller_account_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Original Creditor:</span>
                <span>{debt.original_creditor || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <Badge className={STATUS_COLORS[debt.status] || 'bg-gray-100 text-gray-800'}>
                  {debt.status?.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Portfolio:</span>
                <span>{debt.portfolio_id || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Current Balance:</span>
                <span className="font-semibold text-primary">{formatCurrency(debt.current_balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Original Balance:</span>
                <span>{formatCurrency(debt.original_balance || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Charge Off Amount:</span>
                <span>{formatCurrency(debt.charge_off_amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Paid:</span>
                <span>{formatCurrency(debt.total_paid || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Open Date:</span>
                <span>{formatDate(debt.account_open_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Charge Off Date:</span>
                <span>{formatDate(debt.charge_off_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Delinquency Date:</span>
                <span>{formatDate(debt.delinquency_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Payment:</span>
                <span>{formatDate(debt.last_payment_date)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debtor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debtor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{debt.debtor_info?.first_name} {debt.debtor_info?.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date of Birth:</span>
                <span>{debt.debtor_info?.date_of_birth || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">SSN:</span>
                <span>{debt.debtor_info?.ssn || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{debt.debtor_info?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{debt.debtor_info?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Employer:</span>
                <span>{debt.debtor_info?.employer || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Homeowner:</span>
                <span>{debt.debtor_info?.homeowner ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recovery Score (Bankcard):</span>
                <span>{debt.debtor_info?.score_recovery_bankcard || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recovery Score (Retail):</span>
                <span>{debt.debtor_info?.score_recovery_retail || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span>{debt.debtor_info?.address || 'N/A'}</span>
              </div>
              {debt.debtor_info?.address2 && (
                <div className="flex justify-between">
                  <span className="font-medium">Address 2:</span>
                  <span>{debt.debtor_info.address2}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">City:</span>
                <span>{debt.debtor_info?.city || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">State:</span>
                <span>{debt.debtor_info?.state || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ZIP:</span>
                <span>{debt.debtor_info?.zip || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}