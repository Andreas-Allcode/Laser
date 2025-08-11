
import React from 'react';
import { Bell } from 'lucide-react';
import NotificationManager from '../components/notifications/NotificationManager';

export default function NotificationCenter() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Notification Center</h1>
          <p className="text-muted-foreground mt-1">Manage alerts, system notifications, and communication preferences</p>
        </div>
      </div>
      <NotificationManager />
    </div>
  );
}
