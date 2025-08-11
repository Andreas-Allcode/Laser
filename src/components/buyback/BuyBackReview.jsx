import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, X, AlertTriangle, DollarSign, User, Building } from 'lucide-react';

export default function BuyBackReview({ buyBack, onDecision, onBack }) {
  const [reason, setReason] = useState('');
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Back to Queue</Button>
        <h2 className="text-2xl font-bold text-primary">Buy Back Review</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><User/> Debtor Information</CardTitle></CardHeader><CardContent><p>{buyBack.debtor_name} ({buyBack.debtor_id})</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building/> Portfolio & Agency</CardTitle></CardHeader><CardContent><p>Portfolio: {buyBack.portfolio_name}</p><p>Agency: {buyBack.agency_name}</p></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><DollarSign/> Financials</CardTitle></CardHeader><CardContent><p>Balance: ${buyBack.current_balance.toFixed(2)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Make Decision</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} /></div>
            <div className="space-y-3">
              <Button onClick={() => onDecision(buyBack.id, 'approved', reason)} className="w-full bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-2" />Approve</Button>
              <Button onClick={() => onDecision(buyBack.id, 'declined', reason)} variant="destructive" className="w-full"><X className="w-4 h-4 mr-2" />Decline</Button>
            </div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}