
import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BuyBackSummary from '../components/buyback/BuyBackSummary';
import BuyBackQueue from '../components/buyback/BuyBackQueue';
import BuyBackFilters from '../components/buyback/BuyBackFilters';
import BuyBackReview from '../components/buyback/BuyBackReview';

export default function BuyBackCenter() {
  const [selectedBuyBack, setSelectedBuyBack] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', portfolio: 'all', agency: 'all', trigger_reason: 'all' });
  const { toast } = useToast();

  const handleBulkAction = (requestIds, action) => {
    toast({ title: `Bulk action: ${action}`, description: `${requestIds.length} requests affected.` });
  };
  
  const handleDecision = (id, decision, reason) => {
    toast({ title: `Buy back ${decision}`, description: `Reason: ${reason}` });
    setSelectedBuyBack(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Buy Back Center</h1>
          <p className="text-muted-foreground mt-1">Review and process agency buy back requests</p>
        </div>
      </div>
      
      {selectedBuyBack ? (
        <BuyBackReview buyBack={selectedBuyBack} onDecision={handleDecision} onBack={() => setSelectedBuyBack(null)} />
      ) : (
        <>
          <BuyBackSummary />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><BuyBackFilters filters={filters} onFiltersChange={setFilters} /></div>
            <div className="lg:col-span-3"><BuyBackQueue filters={filters} onSelectBuyBack={setSelectedBuyBack} onBulkAction={handleBulkAction} /></div>
          </div>
        </>
      )}
    </div>
  );
}
