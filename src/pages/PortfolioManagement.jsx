import React, { useState } from 'react';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import PortfolioDetails from '../components/portfolio/PortfolioDetails';
import FileUploader from '../components/portfolio/FileUploader';
import { Database } from 'lucide-react';

export default function PortfolioManagement() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showFileUploader, setShowFileUploader] = useState(false);
  
  const mockPortfolios = [
    { id: 'PORT_1', name: 'Q1 2024 Healthcare', client_name: 'MedDebt Solutions LLC', purchase_date: '2024-01-15', purchase_price: 1200000, original_face_value: 8500000, account_count: 15420, status: 'active_collections', kpis: { total_collected: 540000, collection_rate: 6.35, average_balance: 551, average_charge_off_days: 180, resolved_percentage: 12, bankruptcy_percentage: 1.5, deceased_percentage: 0.8, cease_desist_percentage: 0.5, placed_percentage: 78 }, top_states: [{ state: 'CA', percentage: 18 }, { state: 'TX', percentage: 15 }, { state: 'FL', percentage: 11 }] },
    { id: 'PORT_2', name: 'Legacy Credit Cards', client_name: 'First National Bank', purchase_date: '2023-11-20', purchase_price: 2500000, original_face_value: 12800000, account_count: 28750, status: 'active_collections', kpis: { total_collected: 980000, collection_rate: 7.65, average_balance: 445, average_charge_off_days: 320, resolved_percentage: 18, bankruptcy_percentage: 2.1, deceased_percentage: 1.1, cease_desist_percentage: 0.9, placed_percentage: 85 }, top_states: [{ state: 'NY', percentage: 22 }, { state: 'CA', percentage: 16 }, { state: 'IL', percentage: 9 }] },
    { id: 'PORT_3', name: 'Auto Loans 2024', client_name: 'Premier Auto Finance', purchase_date: '2024-03-01', purchase_price: 4500000, original_face_value: 18200000, account_count: 8940, status: 'pending_scrub', kpis: { total_collected: 0, collection_rate: 0, average_balance: 2035, average_charge_off_days: 95, resolved_percentage: 0, bankruptcy_percentage: 0, deceased_percentage: 0, cease_desist_percentage: 0, placed_percentage: 0 }, top_states: [{ state: 'TX', percentage: 25 }, { state: 'GA', percentage: 12 }, { state: 'OH', percentage: 8 }] },
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

  if (selectedPortfolio) {
    return <PortfolioDetails portfolio={selectedPortfolio} onBack={handleBackToSummary} onUploadFile={handleUploadFile} />;
  }

  return (
    <>
      <PortfolioSummary portfolios={mockPortfolios} onSelectPortfolio={handleSelectPortfolio} onCreatePortfolio={() => setShowFileUploader(true)} />
      <FileUploader 
        isOpen={showFileUploader} 
        onClose={() => setShowFileUploader(false)}
        portfolios={mockPortfolios}
      />
    </>
  );
}