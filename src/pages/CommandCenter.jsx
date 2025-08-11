
import React, { useState, useEffect } from 'react';
import { Target, Search, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import SearchFilters from '../components/command-center/SearchFilters';
import PreviewResults from '../components/command-center/PreviewResults';
import ResultsTable from '../components/command-center/ResultsTable';
import SummaryView from '../components/command-center/SummaryView';

import { Debt } from '@/api/entities';
import { SavedSearch } from '@/api/entities'; // Fixed JavaScript syntax error: changed '=>' to 'from'
import { Notification } from '@/api/entities';

// --- Mock Data Source ---
const portfolios = Array.from({ length: 10 }, (_, i) => `PORTFOLIO_${i + 1}`);
const states = ['TX', 'CA', 'FL', 'NY', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
const statuses = ['active_internal', 'placed_external', 'resolved_paid', 'uncollectible_bankruptcy', 'payment_plan_active'];
const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'Michael', 'Patricia', 'James', 'Linda', 'David', 'Susan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const ALL_MOCK_DEBTS = Array.from({ length: 2000 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const state = states[i % states.length];
    const status = statuses[i % statuses.length];
    const portfolio = portfolios[i % portfolios.length];
    
    return {
        debtor_id: `DEBT_${1000 + i}`,
        debtor_info: {
            first_name: firstName,
            last_name: lastName,
            state: state,
        },
        current_balance: Math.floor(Math.random() * 50000) + 1000,
        status: status,
        assigned_agency_id: Math.random() > 0.5 ? 'agency_a' : null,
        charge_off_date: new Date(Date.now() - Math.random() * 365 * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        portfolio_id: portfolio,
    };
});
// --- End Mock Data Source ---


export default function CommandCenter() {
  const [filters, setFilters] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('search');
  
  const { toast } = useToast();

  const getNestedValue = (obj, path) => {
    if (!path) return undefined;
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  };
  
  const generateMockSearchResults = (currentFilters = [], page = 1, pageSize = 50) => {
    let filteredData = [...ALL_MOCK_DEBTS];

    if (currentFilters.length > 0) {
        filteredData = ALL_MOCK_DEBTS.filter(debt => {
            return currentFilters.every(filter => {
                const { field, operator, value } = filter;
                if (!field || !operator || value === undefined || value === '') return true;

                const actualValue = getNestedValue(debt, field);
                if (actualValue === undefined || actualValue === null) return false;

                const actualValueStr = String(actualValue).toLowerCase();
                const filterValueStr = String(value).toLowerCase();
                
                switch (operator) {
                    case 'equals':
                        return actualValueStr === filterValueStr;
                    case 'not_equals':
                        return actualValueStr !== filterValueStr;
                    case 'contains':
                        return actualValueStr.includes(filterValueStr);
                    case 'starts_with':
                        return actualValueStr.startsWith(filterValueStr);
                    case 'greater_than':
                        return Number(actualValue) > Number(value);
                    case 'less_than':
                        return Number(actualValue) < Number(value);
                    default:
                        return true;
                }
            });
        });
    }

    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    return { results: paginatedData, total: filteredData.length, fullResults: filteredData };
  };

  const generateMockPreviewData = (fullResults) => {
    if (!fullResults || fullResults.length === 0) {
      return { totalAccounts: 0, totalBalance: 0, averageBalance: 0, topStates: [], warnings: [] };
    }

    const totalAccounts = fullResults.length;
    const totalBalance = fullResults.reduce((sum, item) => sum + item.current_balance, 0);

    const stateCounts = fullResults.reduce((acc, item) => {
      const state = item.debtor_info.state;
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    const topStates = Object.entries(stateCounts)
      .map(([state, count]) => ({ state, count, percentage: (count / totalAccounts) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
      
    const warnings = [];
    if (totalAccounts > 1000) {
      warnings.push('Large result set detected. Consider adding more filters for better performance.');
    }
    if (filters.length === 0) {
      warnings.push('No filters applied. Results may be extensive.');
    }

    return {
      totalAccounts,
      totalBalance,
      averageBalance: Math.floor(totalBalance / totalAccounts),
      topStates,
      warnings,
    };
  };

  const generateMockSummaryData = (fullResults) => {
    if (!fullResults || fullResults.length === 0) return null;

    const totalAccounts = fullResults.length;
    const totalBalance = fullResults.reduce((sum, item) => sum + item.current_balance, 0);
    
    const portfolios = {};
    fullResults.forEach(item => {
      if (!portfolios[item.portfolio_id]) {
        portfolios[item.portfolio_id] = { count: 0, balance: 0 };
      }
      portfolios[item.portfolio_id].count++;
      portfolios[item.portfolio_id].balance += item.current_balance;
    });

    const chartData = Object.entries(portfolios).map(([id, data]) => ({
      name: id,
      value: data.balance,
      count: data.count
    }));

    const topItems = chartData
      .sort((a, b) => b.value - a.value)
      .map(item => ({
        name: item.name,
        balance: item.value,
        accounts: item.count,
        percentage: (item.value / totalBalance) * 100
      }));

    return {
      totalAccounts,
      totalBalance,
      averageBalance: Math.floor(totalBalance / totalAccounts),
      avgChargeOffDays: Math.floor(Math.random() * 200) + 100,
      chartData,
      topItems,
      portfolioDetails: {
        statusBreakdown: {
          active: { count: Math.floor(totalAccounts * 0.4), percentage: '40' },
          placed: { count: Math.floor(totalAccounts * 0.35), percentage: '35' },
          resolved: { count: Math.floor(totalAccounts * 0.15), percentage: '15' },
          uncollectible: { count: Math.floor(totalAccounts * 0.1), percentage: '10' }
        },
        topStates: [
          { state: 'TX', count: Math.floor(totalAccounts * 0.25), percentage: '25.0' },
          { state: 'CA', count: Math.floor(totalAccounts * 0.20), percentage: '20.0' },
          { state: 'FL', count: Math.floor(totalAccounts * 0.15), percentage: '15.0' },
          { state: 'NY', count: Math.floor(totalAccounts * 0.12), percentage: '12.0' },
          { state: 'IL', count: Math.floor(totalAccounts * 0.10), percentage: '10.0' }
        ],
        placementRate: 72.5,
        collectionRate: 18.3,
        recoveryAmount: Math.floor(totalBalance * 0.18)
      }
    };
  };

  useEffect(() => {
    // Load initial sample data on page load
    const { results, total, fullResults } = generateMockSearchResults([], 1);
    setSearchResults(results);
    setTotalCount(total);
    
    // Generate initial summary data
    const summary = generateMockSummaryData(fullResults);
    setSummaryData(summary);
  }, []);

  const handlePreview = async () => {
    setIsPreviewLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { fullResults } = generateMockSearchResults(filters, 1, ALL_MOCK_DEBTS.length);
      const preview = generateMockPreviewData(fullResults);
      setPreviewData(preview);
      
      toast({
        title: "Preview Generated",
        description: `Found ${preview.totalAccounts.toLocaleString()} matching accounts`,
      });
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Unable to generate preview. Please try again.",
        variant: "destructive",
      });
    }
    setIsPreviewLoading(false);
  };

  const handleSearch = async (page = 1) => {
    setIsSearchLoading(true);
    setCurrentPage(page);
    try {
      // Use a shorter delay for pagination for better UX
      await new Promise(resolve => setTimeout(resolve, page === currentPage ? 1000 : 300));
      
      const { results, total, fullResults } = generateMockSearchResults(filters, page);
      setSearchResults(results);
      setTotalCount(total);
      
      const summary = generateMockSummaryData(fullResults);
      setSummaryData(summary);
      
      // Only switch to results tab on initial search (page 1), not on pagination
      if (page === 1) {
        setActiveTab('search');
      }
      
      // Only show toast on a new search, not when changing pages
      if (page === 1 && total > 0 && filters.length > 0) {
        toast({
          title: "Search Complete",
          description: `Found ${total.toLocaleString()} total results.`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to execute search. Please try again.",
        variant: "destructive",
      });
    }
    setIsSearchLoading(false);
  };

  const handleSaveSearch = async (searchData) => {
    try {
      await SavedSearch.create({
        search_name: searchData.name,
        description: searchData.description,
        search_criteria: { filters: searchData.filters },
        column_config: [],
        shared_with: [],
        is_public: false
      });
      
      toast({
        title: "Search Saved",
        description: `"${searchData.name}" has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save search. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareSearch = async (shareData) => {
    try {
      const savedSearch = await SavedSearch.create({
        search_name: shareData.name,
        description: `Shared search with filters`,
        search_criteria: { filters: shareData.filters },
        column_config: [],
        shared_with: shareData.shareWith,
        is_public: false
      });

      // Create notifications for shared users
      for (const email of shareData.shareWith) {
        await Notification.create({
          title: "Search Shared With You",
          message: `A search "${shareData.name}" has been shared with you by ${savedSearch.created_by}`,
          type: "info",
          category: "shared_search",
          recipient_email: email,
          related_entity_link: `/command-center?search=${savedSearch.id}`
        });
      }
      
      toast({
        title: "Search Shared",
        description: `Search shared with ${shareData.shareWith.length} users.`,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share search. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (actionData) => {
    try {
      // Simulate bulk action processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create notification for bulk action
      await Notification.create({
        title: "Bulk Action Completed",
        message: `${actionData.action} completed for ${actionData.debtorIds.length} accounts`,
        type: "success",
        category: "placement",
        recipient_email: "admin@bayview.com"
      });
      
      toast({
        title: "Bulk Action Complete",
        description: `${actionData.action} applied to ${actionData.debtorIds.length} accounts.`,
      });
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Unable to complete bulk action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // Simulate CSV export
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Debtor ID,First Name,Last Name,Balance,State,Status\n"
      + searchResults.map(row => 
          `${row.debtor_id},${row.debtor_info.first_name},${row.debtor_info.last_name},${row.current_balance},${row.debtor_info.state},${row.status}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `search_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Search results exported to CSV file.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg">
          <Target className="w-8 h-8 text-primary"/>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Command Center</h1>
          <p className="text-muted-foreground mt-1">Advanced debt search and management operations</p>
        </div>
      </div>

      <div className="flex flex-col space-y-6 p-6 bg-background border border-border rounded-lg">
        {/* Search Filters - Full Width at Top */}
        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          onSearch={() => handleSearch(1)}
          onPreview={handlePreview}
          onSaveSearch={handleSaveSearch}
          onShareSearch={handleShareSearch}
        />
        
        {/* Preview Results - now full width and appears above results when triggered */}
        <PreviewResults 
          previewData={previewData}
          isLoading={isPreviewLoading}
        />

        {/* Results Area - now full width */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="search" 
            >
              <Search className="w-4 h-4 mr-2" />
              Search Results
            </TabsTrigger>
            <TabsTrigger 
              value="summary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Summary View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <ResultsTable
              data={searchResults}
              isLoading={isSearchLoading}
              totalCount={totalCount}
              currentPage={currentPage}
              onPageChange={handleSearch}
              onBulkAction={handleBulkAction}
              onExport={handleExport}
            />
          </TabsContent>
          
          <TabsContent value="summary" className="mt-6">
            <SummaryView
              summaryData={summaryData}
              onCustomize={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
