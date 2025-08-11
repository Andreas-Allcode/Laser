import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, FileText, Edit, FilePlus } from 'lucide-react';

export default function RecentActivityWidget({ config, onNavigate }) {
  const activities = [
    { type: 'search', text: 'Saved search "High-Balance Texas Accounts"', time: '2024-01-15T11:30:00Z', icon: Search },
    { type: 'placement', text: 'Generated placement file for Agency Partners', time: '2024-01-15T10:45:00Z', icon: FileText },
    { type: 'update', text: 'Updated 21 accounts to bankruptcy status', time: '2024-01-15T09:20:00Z', icon: Edit },
    { type: 'note', text: 'Added payment plan note for debtor DEBT_12845', time: '2024-01-15T08:15:00Z', icon: FilePlus },
    { type: 'note', text: 'Uploaded 3 documents for portfolio Q1 Healthcare', time: '2024-01-15T07:15:00Z', icon: FilePlus },
  ];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  }

  return (
    <Card className="bg-blue-50 border-blue-200 h-full flex flex-col">
       <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Recent Activity
        </CardTitle>
        <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('ChangeLog')}
            className="text-primary"
        >
            View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                 <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-100">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                <div className="flex-grow">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.time)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}