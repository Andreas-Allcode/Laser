import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, User, Hash, Phone, MapPin, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { createSampleData } from '@/utils/sampleData';
import { syncCommandCenterToDatabase } from '@/utils/syncCommandCenterData';

const searchTypes = [
  { value: 'debtor_id', label: 'Debtor ID', icon: Hash },
  { value: 'name', label: 'Name', icon: User },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'address', label: 'Address', icon: MapPin },
  { value: 'homeowner', label: 'Homeowner', icon: User },
];

export default function AccountSearch({ onAccountSelect }) {
  const [searchType, setSearchType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(null);
  const [creatingData, setCreatingData] = useState(false);
  const [syncingData, setSyncingData] = useState(false);

  // Check if there's any data in the database or localStorage
  useEffect(() => {
    const checkForData = async () => {
      try {
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
          const { data, error } = await supabase
            .from('debts')
            .select('id')
            .limit(1);
          
          if (error) {
            console.error('Error checking for data:', error);
            setHasData(false);
          } else {
            const hasDataResult = data && data.length > 0;
            console.log('Supabase data check result:', { data, hasDataResult });
            setHasData(hasDataResult);
          }
        } else {
          // Check localStorage in development
          const localDebts = JSON.parse(localStorage.getItem('debts') || '[]');
          const hasDataResult = localDebts.length > 0;
          console.log('LocalStorage data check result:', { count: localDebts.length, hasDataResult });
          setHasData(hasDataResult);
        }
      } catch (error) {
        console.error('Error checking for data:', error);
        setHasData(false);
      }
    };
    
    checkForData();
  }, []);

  const handleCreateSampleData = async () => {
    setCreatingData(true);
    try {
      await createSampleData();
      setHasData(true);
      // Trigger a search to show the new data
      if (searchValue.trim()) {
        // Re-run the search effect
        setSearchValue(searchValue + ' ');
        setTimeout(() => setSearchValue(searchValue.trim()), 100);
      }
    } catch (error) {
      console.error('Error creating sample data:', error);
    } finally {
      setCreatingData(false);
    }
  };

  const handleSyncCommandCenter = async () => {
    setSyncingData(true);
    try {
      const result = await syncCommandCenterToDatabase();
      if (result.success) {
        setHasData(true);
        // Trigger a search to show the new data
        if (searchValue.trim()) {
          setSearchValue(searchValue + ' ');
          setTimeout(() => setSearchValue(searchValue.trim()), 100);
        }
      }
    } catch (error) {
      console.error('Error syncing Command Center data:', error);
    } finally {
      setSyncingData(false);
    }
  };

  useEffect(() => {
    const searchDebts = async () => {
      setLoading(true);
      try {
        let data = [];
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
          // Load from Supabase in production
          let query = supabase.from('debts').select('*');
          
          // Apply filters only if there's a search value
          if (searchValue.trim() !== '') {
            if (searchType === 'debtor_id') {
              query = query.ilike('debtor_id', `%${searchValue}%`);
            } else if (searchType === 'name') {
              const nameTerms = searchValue.trim().split(/\s+/);
              if (nameTerms.length === 1) {
                query = query.or(`debtor_info->>first_name.ilike.%${searchValue}%,debtor_info->>last_name.ilike.%${searchValue}%`);
              } else {
                const firstName = nameTerms[0];
                const lastName = nameTerms.slice(1).join(' ');
                query = query.and(`debtor_info->>first_name.ilike.%${firstName}%,debtor_info->>last_name.ilike.%${lastName}%`);
              }
            } else if (searchType === 'phone') {
              const cleanPhone = searchValue.replace(/\D/g, '');
              query = query.ilike('debtor_info->>phone', `%${cleanPhone}%`);
            } else if (searchType === 'address') {
              query = query.ilike('debtor_info->>address', `%${searchValue}%`);
            } else if (searchType === 'homeowner') {
              const isHomeowner = searchValue.toLowerCase().includes('yes') || searchValue.toLowerCase().includes('true') || searchValue.toLowerCase().includes('owner');
              query = query.eq('debtor_info->>homeowner', isHomeowner);
            }
          }
          
          const { data: supabaseData, error } = await query.limit(200);
          if (error) {
            console.error('Supabase search error:', error);
            data = [];
          } else {
            data = supabaseData || [];
          }
        } else {
          // Load from localStorage in development
          const localDebts = JSON.parse(localStorage.getItem('debts') || '[]');
          const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
          const validPortfolioIds = new Set(portfolios.map(p => p.id));
          
          // Only include debts that have valid portfolios
          const validDebts = localDebts.filter(debt => validPortfolioIds.has(debt.portfolio_id));
          console.log('Local debts found:', localDebts.length, 'Valid debts:', validDebts.length);
          
          // Clean up orphaned debts if any found
          if (validDebts.length !== localDebts.length) {
            localStorage.setItem('debts', JSON.stringify(validDebts));
            console.log(`Cleaned up ${localDebts.length - validDebts.length} orphaned debts`);
          }
          
          // Apply filters to valid debts only
          data = validDebts.filter(debt => {
            if (searchValue.trim() === '') return true;
            
            const searchLower = searchValue.toLowerCase();
            
            if (searchType === 'debtor_id') {
              return debt.debtor_id?.toLowerCase().includes(searchLower);
            } else if (searchType === 'name') {
              const firstName = debt.debtor_info?.first_name?.toLowerCase() || '';
              const lastName = debt.debtor_info?.last_name?.toLowerCase() || '';
              const fullName = `${firstName} ${lastName}`.trim();
              return fullName.includes(searchLower) || firstName.includes(searchLower) || lastName.includes(searchLower);
            } else if (searchType === 'phone') {
              const cleanPhone = searchValue.replace(/\D/g, '');
              const debtPhone = debt.debtor_info?.phone?.replace(/\D/g, '') || '';
              return debtPhone.includes(cleanPhone);
            } else if (searchType === 'address') {
              return debt.debtor_info?.address?.toLowerCase().includes(searchLower);
            } else if (searchType === 'homeowner') {
              const isHomeowner = searchLower.includes('yes') || searchLower.includes('true') || searchLower.includes('owner');
              return debt.debtor_info?.homeowner === isHomeowner;
            }
            
            return false;
          }).slice(0, 200);
        }
        
        // Group debts by debtor_id to show unique debtors
        const debtorMap = new Map();
        data.forEach(debt => {
          const debtorId = debt.debtor_id;
          if (!debtorMap.has(debtorId)) {
            debtorMap.set(debtorId, {
              ...debt,
              total_balance: debt.current_balance || 0,
              debt_count: 1,
              debts: [debt]
            });
          } else {
            const existing = debtorMap.get(debtorId);
            existing.total_balance += (debt.current_balance || 0);
            existing.debt_count += 1;
            existing.debts.push(debt);
          }
        });
        
        const uniqueDebtors = Array.from(debtorMap.values()).slice(0, 50);
        console.log('Grouped debtors:', uniqueDebtors);
        setSearchResults(uniqueDebtors);
        
        // Update hasData status
        if (data.length > 0) {
          setHasData(true);
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
                    <Badge variant="outline">
                      {result.debt_count} {result.debt_count === 1 ? 'Account' : 'Accounts'}
                    </Badge>
                    <span className="font-bold text-primary">
                      ${(result.total_balance || 0).toLocaleString()}
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
            <div className="text-center py-8 text-muted-foreground">
              <p>No accounts found.</p>
              {(hasData === false || hasData === null) && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm mb-3">Sync accounts from Command Center to get started.</p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={handleSyncCommandCenter} 
                      disabled={syncingData}
                      className="gap-2"
                      variant="default"
                    >
                      <Database className="w-4 h-4" />
                      {syncingData ? 'Syncing from Command Center...' : 'Sync from Command Center'}
                    </Button>
                    <Button 
                      onClick={handleCreateSampleData} 
                      disabled={creatingData}
                      className="gap-2"
                      variant="outline"
                    >
                      <Database className="w-4 h-4" />
                      {creatingData ? 'Creating Sample Data...' : 'Create Sample Data'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && searchResults.length === 0 && searchValue.trim() === '' && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Enter search criteria to find accounts.</p>
              {(hasData === false || hasData === null) && (
                <div className="mt-4">
                  <p className="text-sm mb-3">No accounts in database. Sync from Command Center to get started.</p>
                  <Button 
                    onClick={handleSyncCommandCenter} 
                    disabled={syncingData}
                    className="gap-2"
                  >
                    <Database className="w-4 h-4" />
                    {syncingData ? 'Syncing from Command Center...' : 'Sync from Command Center'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}