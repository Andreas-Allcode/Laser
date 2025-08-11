import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export default function ActivityLog({ debtorId }) {
  const activities = [
    { id: 1, text: 'Updated status to payment_plan_active', time: '2024-01-15T08:15:00Z' },
    { id: 2, text: 'Received payment of $150.00', time: '2024-01-15T08:14:00Z' },
  ];
  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><History/> Activity Log</CardTitle></CardHeader><CardContent className="space-y-4">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
          <div><p className="text-sm">{activity.text}</p><p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p></div>
        </div>
      ))}
    </CardContent></Card>
  );
}