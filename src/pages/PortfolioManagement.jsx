import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { portfolioStorage } from '@/utils/portfolioStorage';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import PortfolioDetails from '../components/portfolio/PortfolioDetails';
import FileUploader from '../components/portfolio/FileUploader';
import SalePortfolios from '../components/portfolio/SalePortfolios';



export default function PortfolioManagement() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [activeTab, setActiveTab] = useState('purchased');
  const [purchasedPortfolios, setPurchasedPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mockPortfolios, setMockPortfolios] = useState([]);
  
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
      setPurchasedPortfolios([...mockPortfolios, ...storedPortfolios]);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      setPurchasedPortfolios(mockPortfolios);
    } finally {
      setLoading(false);
    }
  };

  // Update purchased portfolios when mock portfolios change
  useEffect(() => {
    if (!loading) {
      loadPortfolios();
    }
  }, [mockPortfolios]);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const handlePortfolioCreated = (newPortfolio) => {
    console.log('Portfolio created:', newPortfolio);
    loadPortfolios(); // Reload from storage
  };

  const handleDeletePortfolio = (portfolioId) => {
    const portfolio = purchasedPortfolios.find(p => p.id === portfolioId);
    setPortfolioToDelete(portfolio);
    setShowDeleteDialog(true);
    setConfirmDelete(false);
  };

  const confirmDeletePortfolio = async () => {
    if (!confirmDelete || !portfolioToDelete) return;
    
    try {
      console.log('Attempting to delete portfolio:', portfolioToDelete.id);
      
      // Delete portfolio (all portfolios are now stored in Supabase/localStorage)
      await portfolioStorage.deletePortfolio(portfolioToDelete.id);
      console.log('Portfolio deleted successfully');
      loadPortfolios(); // Reload after deletion
      
      setShowDeleteDialog(false);
      setPortfolioToDelete(null);
      setConfirmDelete(false);
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
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the portfolio "{portfolioToDelete?.name}"? This action cannot be undone and will also delete all associated debt records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirm-delete" 
                checked={confirmDelete} 
                onCheckedChange={setConfirmDelete} 
              />
              <label htmlFor="confirm-delete" className="text-sm">
                I understand this action cannot be undone
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeletePortfolio}
                disabled={!confirmDelete}
              >
                Delete Portfolio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}