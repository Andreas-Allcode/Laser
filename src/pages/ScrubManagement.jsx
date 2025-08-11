import React from 'react';
import { Zap } from 'lucide-react';
import ScrubManager from '../components/scrub/ScrubManager';

export default function ScrubManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 laser-text-gradient"/>
        <div>
          <h1 className="text-4xl font-bold laser-text-gradient">Debt Scrubbing</h1>
          <p className="text-gray-400 mt-1">
            Manage external vendor integrations for debt verification and data enhancement
          </p>
        </div>
      </div>

      <ScrubManager />
    </div>
  );
}