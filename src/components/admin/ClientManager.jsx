import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit } from 'lucide-react';

export default function ClientManager() {
  const clients = [
    { id: 'CLIENT_1', company_name: 'MedDebt Solutions LLC', client_type: 'debt_seller', status: 'active' },
    { id: 'CLIENT_2', company_name: 'Collection Partners LLC', client_type: 'collection_agency', status: 'active' },
  ];
  const getStatusColor = (status) => ({ active: 'bg-green-100 text-green-800' }[status] || 'bg-gray-100');

  return (
    <Card><CardHeader><div className="flex justify-between"><CardTitle>Client Management</CardTitle><Button><Plus className="w-4 h-4 mr-2"/>Add New Client</Button></div></CardHeader><CardContent>
        <div className="rounded-md border"><Table><TableHeader><TableRow>
            <TableHead>Company</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
        </TableRow></TableHeader><TableBody>{clients.map(c => <TableRow key={c.id}>
            <TableCell>{c.company_name}</TableCell><TableCell>{c.client_type.replace(/_/g, ' ')}</TableCell>
            <TableCell><Badge variant="outline" className={getStatusColor(c.status)}>{c.status}</Badge></TableCell>
            <TableCell><Button variant="ghost" size="icon"><Edit className="w-4 h-4"/></Button></TableCell>
        </TableRow>)}</TableBody></Table></div>
    </CardContent></Card>
  );
}