import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, AlertTriangle, CheckCircle, Clock, X, Eye } from 'lucide-react';

export default function BuyBackQueue({ filters, onSelectBuyBack, onBulkAction }) {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const mockRequests = [
    { id: 'BB_001', debtor_name: 'James Brown', debtor_id: 'DEBT_JBR', portfolio_name: 'Q1 Healthcare', agency_name: 'Recovery Inc.', trigger_reason: 'bankruptcy_found', current_balance: 5230.00, review_deadline: '2025-08-15', status: 'pending_review' },
    { id: 'BB_002', debtor_name: 'Patricia Miller', debtor_id: 'DEBT_PMI', portfolio_name: 'Legacy Cards', agency_name: 'Collect LLC', trigger_reason: 'deceased_found', current_balance: 1890.50, review_deadline: '2025-08-22', status: 'under_review' },
  ];

  const filteredRequests = mockRequests; // Simplified
  const getStatusColor = (status) => ({ 'pending_review': 'bg-yellow-100 text-yellow-800', 'under_review': 'bg-blue-100 text-blue-800' }[status] || 'bg-gray-100');
  const isOverdue = (date) => new Date(date) < new Date();
  
  return (
    <Card><CardHeader><div className="flex justify-between"><CardTitle>Buy Back Queue</CardTitle>{selectedRequests.length > 0 && <Button size="sm" onClick={() => onBulkAction(selectedRequests, 'approve')}>Approve Selected</Button>}</div></CardHeader><CardContent>
      <div className="rounded-md border"><Table><TableHeader><TableRow>
          <TableHead><Checkbox/></TableHead><TableHead>Debtor</TableHead><TableHead>Agency</TableHead><TableHead>Trigger</TableHead><TableHead>Balance</TableHead><TableHead>Deadline</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
      </TableRow></TableHeader><TableBody>{filteredRequests.map(req => (<TableRow key={req.id}>
        <TableCell><Checkbox/></TableCell>
        <TableCell><p>{req.debtor_name}</p><p className="text-xs text-muted-foreground">{req.debtor_id}</p></TableCell>
        <TableCell>{req.agency_name}</TableCell>
        <TableCell><Badge variant="outline">{req.trigger_reason.replace(/_/g, ' ')}</Badge></TableCell>
        <TableCell>${req.current_balance.toFixed(2)}</TableCell>
        <TableCell className={isOverdue(req.review_deadline) ? 'text-red-500' : ''}>{req.review_deadline}</TableCell>
        <TableCell><Badge variant="outline" className={getStatusColor(req.status)}>{req.status.replace(/_/g, ' ')}</Badge></TableCell>
        <TableCell><Button variant="ghost" size="icon" onClick={() => onSelectBuyBack(req)}><Eye className="w-4 h-4"/></Button></TableCell>
      </TableRow>))}</TableBody></Table></div>
    </CardContent></Card>
  );
}