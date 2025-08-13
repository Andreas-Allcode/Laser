import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, ShoppingCart } from 'lucide-react';
import { portfolioStorage } from '@/utils/portfolioStorage';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import PortfolioDetails from '../components/portfolio/PortfolioDetails';
import FileUploader from '../components/portfolio/FileUploader';
import SalePortfolios from '../components/portfolio/SalePortfolios';

const mockPurchasedPortfolios = [
    { id: 'PORT_1', name: 'Q1 2024 Healthcare', client_name: 'MedDebt Solutions LLC', purchase_date: '2024-01-15', purchase_price: 1200000, original_face_value: 8500000, account_count: 15420, status: 'active_collections', portfolio_type: 'purchased', kpis: { total_collected: 540000, collection_rate: 6.35, average_balance: 551, average_charge_off_days: 180, resolved_percentage: 12, bankruptcy_percentage: 1.5, deceased_percentage: 0.8, cease_desist_percentage: 0.5, placed_percentage: 78 }, top_states: [{ state: 'CA', percentage: 18 }, { state: 'TX', percentage: 15 }, { state: 'FL', percentage: 11 }] },
    { id: 'PORT_2', name: 'Legacy Credit Cards', client_name: 'First National Bank', purchase_date: '2023-11-20', purchase_price: 2500000, original_face_value: 12800000, account_count: 28750, status: 'active_collections', portfolio_type: 'purchased', kpis: { total_collected: 980000, collection_rate: 7.65, average_balance: 445, average_charge_off_days: 320, resolved_percentage: 18, bankruptcy_percentage: 2.1, deceased_percentage: 1.1, cease_desist_percentage: 0.9, placed_percentage: 85 }, top_states: [{ state: 'NY', percentage: 22 }, { state: 'CA', percentage: 16 }, { state: 'IL', percentage: 9 }] },
    { id: 'PORT_3', name: 'Auto Loans 2024', client_name: 'Premier Auto Finance', purchase_date: '2024-03-01', purchase_price: 4500000, original_face_value: 18200000, account_count: 8940, status: 'pending_scrub', portfolio_type: 'purchased', kpis: { total_collected: 0, collection_rate: 0, average_balance: 2035, average_charge_off_days: 95, resolved_percentage: 0, bankruptcy_percentage: 0, deceased_percentage: 0, cease_desist_percentage: 0, placed_percentage: 0 }, top_states: [{ state: 'TX', percentage: 25 }, { state: 'GA', percentage: 12 }, { state: 'OH', percentage: 8 }] },
  ];

export default function PortfolioManagement() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [activeTab, setActiveTab] = useState('purchased');
  const [purchasedPortfolios, setPurchasedPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const mockSalePortfolios = [

    { id: 'SALE_1', name: 'Uncollectible Accounts Package', created_by: 'admin@bayview.com', created_date: '2024-01-10', account_count: 2450, original_face_value: 1850000, asking_price: 185000, sale_status: 'for_sale', portfolio_type: 'for_sale', description: 'Collection of accounts marked as uncollectible after 18+ months of collection efforts', top_states: [{ state: 'TX', percentage: 28 }, { state: 'CA', percentage: 22 }, { state: 'FL', percentage: 15 }] },
    { id: 'SALE_2', name: 'Small Balance Portfolio', created_by: 'manager@bayview.com', created_date: '2024-01-05', account_count: 8920, original_face_value: 890000, asking_price: 89000, sale_status: 'under_review', portfolio_type: 'for_sale', description: 'Accounts with balances under $500, suitable for high-volume collection', top_states: [{ state: 'NY', percentage: 18 }, { state: 'IL', percentage: 16 }, { state: 'OH', percentage: 12 }] },
    { id: 'SALE_3', name: 'Medical Debt Collection', created_by: 'admin@bayview.com', created_date: '2023-12-15', account_count: 1250, original_face_value: 625000, asking_price: 62500, sale_status: 'sold', portfolio_type: 'for_sale', description: 'Medical debt accounts with comprehensive scrub data', top_states: [{ state: 'CA', percentage: 35 }, { state: 'TX', percentage: 20 }, { state: 'FL', percentage: 18 }] },
  ];

  const handleSelectPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const handleBackToSummary = () => {
    setSelectedPortfolio(null);
  };
  
  const handleUploadFile = () => {
    setShowFileUploader(true);
  };

  const loadPortfolios = async () => {
    try {
      const storedPortfolios = await portfolioStorage.loadPortfolios();
      console.log('Loaded portfolios:', storedPortfolios);
      setPurchasedPortfolios([...mockPurchasedPortfolios, ...storedPortfolios]);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      setPurchasedPortfolios(mockPurchasedPortfolios);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const handlePortfolioCreated = (newPortfolio) => {
    console.log('Portfolio created:', newPortfolio);
    loadPortfolios(); // Reload from storage
  };

  const handleDeletePortfolio = async (portfolioId) => {
    try {
      await portfolioStorage.deletePortfolio(portfolioId);
      loadPortfolios(); // Reload after deletion
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  if (selectedPortfolio) {
    return <PortfolioDetails portfolio={selectedPortfolio} onBack={handleBackToSummary} onUploadFile={handleUploadFile} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">Manage purchased portfolios and portfolios for sale</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchased"><Database className="w-4 h-4 mr-2" />Purchased Portfolios</TabsTrigger>
          <TabsTrigger value="for_sale"><ShoppingCart className="w-4 h-4 mr-2" />Portfolios for Sale</TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchased" className="mt-6">
          <PortfolioSummary 
            portfolios={purchasedPortfolios} 
            onSelectPortfolio={handleSelectPortfolio} 
            onCreatePortfolio={() => setShowFileUploader(true)} 
            onDeletePortfolio={handleDeletePortfolio}
            type="purchased"
          />
        </TabsContent>
        
        <TabsContent value="for_sale" className="mt-6">
          <SalePortfolios 
            portfolios={mockSalePortfolios} 
            onSelectPortfolio={handleSelectPortfolio}
          />
        </TabsContent>
      </Tabs>

      <FileUploader 
        isOpen={showFileUploader} 
        onClose={() => setShowFileUploader(false)}
        portfolios={purchasedPortfolios}
        onPortfolioCreated={handlePortfolioCreated}
      />
    </div>
  );
}