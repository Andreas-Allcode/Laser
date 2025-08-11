import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import PortfolioOverviewWidget from './PortfolioOverviewWidget';
import AlertsNotificationsWidget from './AlertsNotificationsWidget';
import RecentActivityWidget from './RecentActivityWidget';

export default function DashboardGrid({ widgets, onUpdateWidgets, onNavigate }) {
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [configWidgets, setConfigWidgets] = useState(widgets);

  const availableWidgetTypes = [
    { value: 'portfolio_overview', label: 'Portfolio Overview', component: PortfolioOverviewWidget },
    { value: 'alerts_notifications', label: 'Alerts & Notifications', component: AlertsNotificationsWidget },
    { value: 'recent_activity', label: 'Recent Activity', component: RecentActivityWidget },
    { value: 'kpi_summary', label: 'KPI Summary', component: null },
    { value: 'scrub_status', label: 'Scrub Status', component: null },
    { value: 'collection_performance', label: 'Collection Performance', component: null }
  ];

  const getWidgetComponent = (widget) => {
    const widgetType = availableWidgetTypes.find(t => t.value === widget.widget_type);
    if (!widgetType?.component) return null;
    
    const Component = widgetType.component;
    const gridClass = `col-span-1 md:col-span-${widget.position.width} row-span-1`;
    
    return (
      <div key={widget.id} className={gridClass}>
        <Component 
          config={widget.config} 
          onNavigate={onNavigate}
        />
      </div>
    );
  };

  const handleSaveConfiguration = () => {
    onUpdateWidgets(configWidgets);
    setShowConfigDialog(false);
  };

  const visibleWidgets = widgets.filter(w => w.is_visible);

  return (
    <div className="space-y-6">
       <div className="flex justify-end">
        <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
          <DialogTrigger asChild>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Configure Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Dashboard Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Widgets</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3 p-1">
                {configWidgets.map((widget) => (
                  <div 
                    key={widget.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={widget.is_visible}
                        onCheckedChange={(checked) => setConfigWidgets(configWidgets.map(w => w.id === widget.id ? { ...w, is_visible: checked } : w))}
                      />
                      <div>
                        <Label className="font-medium">{widget.title}</Label>
                        <p className="text-xs text-muted-foreground">
                          {availableWidgetTypes.find(t => t.value === widget.widget_type)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfigDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveConfiguration}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {visibleWidgets.map(widget => getWidgetComponent(widget))}
      </div>

      {visibleWidgets.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-card col-span-full">
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Widgets Configured</h3>
          <p className="text-muted-foreground mb-4">Add widgets to customize your dashboard view.</p>
          <Button 
            onClick={() => setShowConfigDialog(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}