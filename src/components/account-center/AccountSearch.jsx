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
import { supabase } from '@/lib/supabase';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchDebts = async () => {
      if (searchValue.trim() === '') {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        let query = supabase.from('debts').select('*');
        
        if (searchType === 'debtor_id') {
          query = query.ilike('debtor_id', `%${searchValue}%`);
        } else if (searchType === 'name') {
          query = query.or(`debtor_info->>first_name.ilike.%${searchValue}%,debtor_info->>last_name.ilike.%${searchValue}%`);
        } else if (searchType === 'phone') {
          query = query.ilike('debtor_info->>phone', `%${searchValue}%`);
        } else if (searchType === 'address') {
          query = query.ilike('debtor_info->>address', `%${searchValue}%`);
        }
        
        const { data, error } = await query.limit(50);
        
        if (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } else {
          setSearchResults(data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchDebts, 300);
    return () => clearTimeout(timeoutId);
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
          <h4 className="font-semibold">
            {loading ? 'Searching...' : `${searchResults.length} ${searchResults.length === 1 ? 'Account' : 'Accounts'} Found`}
          </h4>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Searching accounts...</div>
          ) : (
            searchResults.map((result) => (
              <div key={result.id} onClick={() => onAccountSelect(result)} className="p-4 rounded-lg border bg-card hover:border-primary cursor-pointer transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge>{result.debtor_id}</Badge>
                    <h5 className="font-semibold">
                      {result.debtor_info?.first_name || 'N/A'} {result.debtor_info?.last_name || 'N/A'}
                    </h5>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(result.status)}>
                      {result.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="font-bold text-primary">
                      ${(result.current_balance || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Address:</strong> {result.debtor_info?.address || 'N/A'}, {result.debtor_info?.city || 'N/A'}, {result.debtor_info?.state || 'N/A'} {result.debtor_info?.zip || 'N/A'}
                </div>
              </div>
            ))
          )}
          {!loading && searchResults.length === 0 && searchValue.trim() !== '' && (
            <div className="text-center py-8 text-muted-foreground">No accounts found.</div>
          )}
          {!loading && searchValue.trim() === '' && (
            <div className="text-center py-8 text-muted-foreground">Enter search criteria to find accounts.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}