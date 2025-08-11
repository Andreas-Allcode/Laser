import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

export default function BuyBackFilters({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => onFiltersChange({ ...filters, [key]: value });
  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" /> Filters</CardTitle></CardHeader><CardContent className="space-y-4">
      <div><Label>Status</Label><Select value={filters.status} onValueChange={v => updateFilter('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending_review">Pending</SelectItem></SelectContent></Select></div>
      <div><Label>Portfolio</Label><Select value={filters.portfolio} onValueChange={v => updateFilter('portfolio', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select></div>
      <div><Label>Agency</Label><Select value={filters.agency} onValueChange={v => updateFilter('agency', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select></div>
      <div><Label>Trigger Reason</Label><Select value={filters.trigger_reason} onValueChange={v => updateFilter('trigger_reason', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select></div>
    </CardContent></Card>
  );
}