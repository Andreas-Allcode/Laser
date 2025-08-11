
import React from 'react';
import { Settings } from 'lucide-react';
import ClientManager from '../components/admin/ClientManager';

export default function AdminCenter() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage client partners, create profiles, and administer roles and permissions
          </p>
        </div>
      </div>
      <ClientManager />
    </div>
  );
}
