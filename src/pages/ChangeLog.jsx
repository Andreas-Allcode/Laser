
import React from 'react';
import { BookCopy } from 'lucide-react';
import LogViewer from '../components/changelog/LogViewer';

export default function ChangeLog() {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3">
        <BookCopy className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Change Log</h1>
          <p className="text-muted-foreground mt-1">Track system changes, updates, and audit trails</p>
        </div>
      </div>
      <LogViewer />
    </div>
  );
}
