import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, User, Hash, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockAccounts = [
  { debtor_id: 'DEBT_001', debtor_info: { first_name: 'John', last_name: 'Smith', phone: '555-1234', address: '123 Main St', city: 'Anytown', state: 'TX', zip: '12345' }, current_balance: 1545.25, status: 'active_internal', portfolio_id: 'PORT_1' },
  { debtor_id: 'DEBT_002', debtor_info: { first_name: 'Maria', last_name: 'Garcia', phone: '555-5678', address: '456 Oak Ave', city: 'Otherville', state: 'CA', zip: '67890' }, current_balance: 2840.50, status: 'placed_external', portfolio_id: 'PORT_1' },
];

const searchTypes = [
  { value: 'debtor_id', label: 'Debtor ID', icon: Hash },
  { value: 'name', label: 'Name', icon: User },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'address', label: 'Address', icon: MapPin },
];

export default function AccountSearch({ onAccountSelect }) {
  const [searchType, setSearchType] = useState('debtor_id');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchValue.trim() === '') {
      setSearchResults([]);
      return;
    }
    const filtered = mockAccounts.filter(acc => {
      if (searchType === 'name') return `${acc.debtor_info.first_name} ${acc.debtor_info.last_name}`.toLowerCase().includes(searchValue.toLowerCase());
      if (searchType === 'phone') return acc.debtor_info.phone.includes(searchValue);
      return acc[searchType]?.toLowerCase().includes(searchValue.toLowerCase());
    });
    setSearchResults(filtered);
  }, [searchValue, searchType]);

  const getStatusColor = (status) => ({
    'active_internal': 'bg-green-100 text-green-800', 'placed_external': 'bg-blue-100 text-blue-800',
    'resolved_paid': 'bg-purple-100 text-purple-800', 'uncollectible_bankruptcy': 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800');

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Live Account Search</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-secondary/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Search By</Label><Select value={searchType} onValueChange={setSearchType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{searchTypes.map(t => <SelectItem key={t.value} value={t.value}><div className="flex items-center gap-2"><t.icon className="w-4 h-4" />{t.label}</div></SelectItem>)}</SelectContent></Select></div>
            <div className="md:col-span-2"><Label>Search Value</Label><Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={`Enter ${searchTypes.find(t => t.value === searchType)?.label.toLowerCase()}...`}/></div>
          </div>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
          <h4 className="font-semibold">{searchResults.length} {searchResults.length === 1 ? 'Account' : 'Accounts'} Found</h4>
          {searchResults.map((result) => (
            <div key={result.debtor_id} onClick={() => onAccountSelect(result)} className="p-4 rounded-lg border bg-card hover:border-primary cursor-pointer transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3"><Badge>{result.debtor_id}</Badge><h5 className="font-semibold">{result.debtor_info.first_name} {result.debtor_info.last_name}</h5></div>
                <div className="flex items-center gap-3"><Badge variant="outline" className={getStatusColor(result.status)}>{result.status.replace(/_/g, ' ')}</Badge><span className="font-bold text-primary">${result.current_balance.toLocaleString()}</span></div>
              </div>
              <div className="text-sm text-muted-foreground"><strong>Address:</strong> {result.debtor_info.address}, {result.debtor_info.city}, {result.debtor_info.state} {result.debtor_info.zip}</div>
            </div>
          ))}
          {searchResults.length === 0 && <div className="text-center py-8 text-muted-foreground">No accounts found.</div>}
        </div>
      </CardContent>
    </Card>
  );
}