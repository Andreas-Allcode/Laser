import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Eye } from 'lucide-react';

export default function RemittanceManager() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const remittances = [{ id: 'REM_1', agency_name: 'Recovery Inc.', submission_date: '2025-07-31', total_collected: 125430.50, net_remittance: 100344.40, status: 'pending_verification' }];
  const getStatusColor = (status) => ({ 'pending_verification': 'bg-yellow-100 text-yellow-800' }[status] || 'bg-gray-100');

  return (
    <Card><CardHeader><div className="flex justify-between"><CardTitle>Remittance Queue</CardTitle><Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}><DialogTrigger asChild><Button><Upload className="w-4 h-4 mr-2"/>Upload Remit File</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Upload Remittance</DialogTitle></DialogHeader>{/* Form here */}</DialogContent></Dialog></div></CardHeader><CardContent>
      <div className="rounded-md border"><Table><TableHeader><TableRow>
        <TableHead>Agency</TableHead><TableHead>Date</TableHead><TableHead>Total Collected</TableHead><TableHead>Net Remittance</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
      </TableRow></TableHeader><TableBody>{remittances.map(r => <TableRow key={r.id}>
        <TableCell>{r.agency_name}</TableCell><TableCell>{r.submission_date}</TableCell><TableCell>${r.total_collected.toFixed(2)}</TableCell><TableCell>${r.net_remittance.toFixed(2)}</TableCell><TableCell><Badge variant="outline" className={getStatusColor(r.status)}>{r.status.replace(/_/g, ' ')}</Badge></TableCell><TableCell><Button variant="ghost" size="icon"><Eye className="w-4 h-4"/></Button></TableCell>
      </TableRow>)}</TableBody></Table></div>
    </CardContent></Card>
  );
}