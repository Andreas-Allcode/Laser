
import React from 'react';
import { FileText } from 'lucide-react';
import LetterTemplateManager from '../components/letters/LetterTemplateManager';

export default function LetterManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary"/>
        <div>
          <h1 className="text-3xl font-bold text-primary">Letter Management</h1>
          <p className="text-muted-foreground mt-1">Create, manage, and send letters to debtors</p>
        </div>
      </div>
      <LetterTemplateManager />
    </div>
  );
}
