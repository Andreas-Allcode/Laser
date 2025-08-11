
import React from 'react';
import { Landmark } from 'lucide-react';
import RemittanceManager from '../components/remit/RemittanceManager';

export default function RemitCenter() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Landmark className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Remit Center</h1>
          <p className="text-muted-foreground mt-1">Manage and verify remittance files from collection agencies</p>
        </div>
      </div>
      <RemittanceManager />
    </div>
  );
}
