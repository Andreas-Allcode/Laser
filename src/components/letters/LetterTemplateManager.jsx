import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit } from 'lucide-react';

export default function LetterTemplateManager() {
  const templates = [
    { id: 'TEMP_001', template_name: 'Standard Initial Demand', template_type: 'initial_demand', is_active: true },
    { id: 'TEMP_002', template_name: 'Settlement Offer 50%', template_type: 'settlement_offer', is_active: true },
  ];

  return (
    <Card><CardHeader><div className="flex justify-between"><CardTitle>Letter Templates</CardTitle><Button><Plus className="w-4 h-4 mr-2"/>Create Template</Button></div></CardHeader><CardContent>
      <div className="rounded-md border"><Table><TableHeader><TableRow>
        <TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
      </TableRow></TableHeader><TableBody>{templates.map(t=><TableRow key={t.id}>
        <TableCell>{t.template_name}</TableCell><TableCell>{t.template_type.replace(/_/g,' ')}</TableCell>
        <TableCell><Switch checked={t.is_active}/></TableCell><TableCell><Button variant="ghost" size="icon"><Edit className="w-4 h-4"/></Button></TableCell>
      </TableRow>)}</TableBody></Table></div>
    </CardContent></Card>
  );
}