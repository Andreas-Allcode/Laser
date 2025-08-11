import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import { Button } from '@/components/ui/button';
import { createSampleData } from '@/utils/sampleData';
import { useToast } from '@/components/ui/use-toast';
import { Database } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creatingData, setCreatingData] = useState(false);

  const handleCreateSampleData = async () => {
    setCreatingData(true);
    try {
      await createSampleData();
      toast({
        title: "Sample Data Created",
        description: "5 sample debt accounts have been added to the database.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sample data. Check console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setCreatingData(false);
    }
  };
  
  const [widgets, setWidgets] = useState([
    {
      id: 'widget_1',
      widget_type: 'portfolio_overview',
      title: 'Portfolio Overview',
      position: { x: 0, y: 0, width: 2, height: 1 },
      config: {},
      is_visible: true,
      refresh_interval: 300
    },
    {
      id: 'widget_2',
      widget_type: 'alerts_notifications',
      title: 'Alerts & Notifications',
      position: { x: 2, y: 0, width: 1, height: 1 },
      config: {},
      is_visible: true,
      refresh_interval: 60
    },
    {
      id: 'widget_3',
      widget_type: 'recent_activity',
      title: 'Recent Activity',
      position: { x: 0, y: 1, width: 2, height: 1 },
      config: {},
      is_visible: true,
      refresh_interval: 180
    }
  ]);

  const handleUpdateWidgets = (newWidgets) => {
    setWidgets(newWidgets);
  };

  const handleNavigate = (pageName, params = {}) => {
    const url = createPageUrl(pageName);
    navigate(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor key metrics and manage your debt portfolios</p>
        </div>
        <Button 
          onClick={handleCreateSampleData} 
          disabled={creatingData}
          variant="outline"
        >
          <Database className="w-4 h-4 mr-2" />
          {creatingData ? 'Creating...' : 'Create Sample Data'}
        </Button>
      </div>
      <DashboardGrid 
        widgets={widgets}
        onUpdateWidgets={handleUpdateWidgets}
        onNavigate={handleNavigate}
      />
    </div>
  );
}