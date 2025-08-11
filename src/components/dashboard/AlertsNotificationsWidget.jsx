import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle,
  Info,
  ArrowRight
} from 'lucide-react';

export default function AlertsNotificationsWidget({ config, onNavigate }) {
  const alerts = [
    { id: 1, type: 'warning', title: 'High-Priority Portfolio Attention', description: 'Auto Loans 2024 portfolio has 1,240 accounts requiring immediate attention.', category: 'portfolio alert' },
    { id: 2, type: 'success', title: 'Scrub Job Completed', description: 'Experian scrub completed for Healthcare Receivables - 1,250 accounts processed', category: 'scrub update' },
    { id: 3, type: 'info', title: 'Placement File Generated', description: 'Collection agency placement file ready for Agency Partners LLC (850 accounts)', category: 'placement update' },
  ];

  const alertStyles = {
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    }
  };

  return (
    <Card className="bg-blue-50 border-blue-200 h-full flex flex-col">
       <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-muted-foreground" />
          Alerts & Notifications
        </CardTitle>
        <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">{alerts.length}</Badge>
            <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('NotificationCenter')}
                className="text-primary"
            >
                View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          {alerts.map((alert) => {
            const styles = alertStyles[alert.type];
            const Icon = styles.icon;
            return (
              <div 
                key={alert.id}
                className="p-4 rounded-lg bg-card border hover:border-primary cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${styles.iconBg}`}>
                    <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-semibold text-foreground leading-tight">{alert.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <Badge variant="outline" className="mt-3 text-xs">{alert.category}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}