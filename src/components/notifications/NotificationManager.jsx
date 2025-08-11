import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit } from 'lucide-react';

export default function NotificationManager() {
  const notifications = [
    { id: 'NOTIF_001', notification_type: 'payment_received', recipient_type: 'bayview_user', is_enabled: true },
    { id: 'NOTIF_002', notification_type: 'placement_created', recipient_type: 'collection_agency', is_enabled: true }
  ];

  return (
    <Card><CardHeader><div className="flex justify-between"><CardTitle>Notification Configurations</CardTitle><Button><Plus className="w-4 h-4 mr-2"/>Create Notification</Button></div></CardHeader><CardContent>
        <div className="rounded-md border"><Table><TableHeader><TableRow>
            <TableHead>Type</TableHead><TableHead>Recipients</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
        </TableRow></TableHeader><TableBody>{notifications.map(n=><TableRow key={n.id}>
            <TableCell>{n.notification_type.replace(/_/g,' ')}</TableCell><TableCell>{n.recipient_type.replace(/_/g,' ')}</TableCell>
            <TableCell><Switch checked={n.is_enabled}/></TableCell><TableCell><Button variant="ghost" size="icon"><Edit className="w-4 h-4"/></Button></TableCell>
        </TableRow>)}</TableBody></Table></div>
    </CardContent></Card>
  );
}