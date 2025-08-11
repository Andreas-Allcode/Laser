import React from 'react';
import { FileImage } from 'lucide-react';
import MediaRequestManager from '../components/media/MediaRequestManager';

export default function MediaRequests() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileImage className="w-8 h-8 laser-text-gradient"/>
        <div>
          <h1 className="text-4xl font-bold laser-text-gradient">Media Requests</h1>
          <p className="text-gray-400 mt-1">
            Upload and manage supplementary documentation for debtor accounts
          </p>
        </div>
      </div>

      <MediaRequestManager />
    </div>
  );
}