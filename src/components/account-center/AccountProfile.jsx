import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import PaymentHistory from './PaymentHistory';
import AccountNotes from './AccountNotes';
import ActivityLog from './ActivityLog';
import { User, DollarSign, Calendar, MapPin, Phone, Mail, Edit3, Save, X, AlertTriangle, Ban, Skull, FileText, History, ArrowLeft } from 'lucide-react';

export default function AccountProfile({ account, onBack, onUpdate, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState(account);

  useEffect(() => { setEditedAccount(account); }, [account]);

  const handleSave = () => { onUpdate?.(editedAccount); setIsEditing(false); };
  const handleCancel = () => { setEditedAccount(account); setIsEditing(false); };

  const getStatusColor = (status) => ({
    'active_internal': 'bg-green-100 text-green-800', 'placed_external': 'bg-blue-100 text-blue-800',
    'resolved_paid': 'bg-purple-100 text-purple-800', 'uncollectible_bankruptcy': 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800');
  
  const StatusIcon = { 'uncollectible_bankruptcy': AlertTriangle, 'uncollectible_deceased': Skull, 'action_cease_desist': Ban }[account.status];
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Back to Search</Button>
              <CardTitle className="text-primary flex items-center gap-3"><User className="w-6 h-6" />Account Profile - {account.debtor_id}</CardTitle>
            </div>
            <Badge variant="outline" className={`font-medium text-base ${getStatusColor(account.status)}`}>{StatusIcon && <StatusIcon className="w-4 h-4 mr-2" />}{account.status.replace(/_/g, ' ')}</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><DollarSign className="w-6 h-6 text-primary" /></div><div><p className="text-2xl font-bold">{formatCurrency(account.current_balance)}</p><p className="text-sm text-muted-foreground">Current Balance</p></div></div><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-primary" /></div><div><p className="text-lg font-bold">{formatDate(account.charge_off_date)}</p><p className="text-sm text-muted-foreground">Charge Off Date</p></div></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Contact Information</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /><span>{account.debtor_info?.phone || 'N/A'}</span></div><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /><span>{account.debtor_info?.email || 'N/A'}</span></div></CardContent></Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="profile"><User className="w-4 h-4 mr-2"/>Profile</TabsTrigger><TabsTrigger value="payments"><DollarSign className="w-4 h-4 mr-2"/>Payments</TabsTrigger><TabsTrigger value="notes"><FileText className="w-4 h-4 mr-2"/>Notes</TabsTrigger><TabsTrigger value="activity"><History className="w-4 h-4 mr-2"/>Activity</TabsTrigger></TabsList>
            <TabsContent value="profile" className="mt-6">
              <Card><CardHeader><CardTitle className="text-primary">Debtor Profile Details</CardTitle></CardHeader><CardContent className="space-y-6">
                  {/* Editable form fields would go here, simplified for brevity */}
                  <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
                    {isEditing ? (<><Button onClick={handleCancel} variant="outline"><X className="w-4 h-4 mr-2"/>Cancel</Button><Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/>Save Changes</Button></>) : (<Button onClick={() => setIsEditing(true)} variant="outline"><Edit3 className="w-4 h-4 mr-2"/>Edit Profile</Button>)}
                  </div>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="payments" className="mt-6"><PaymentHistory debtorId={account.debtor_id} /></TabsContent>
            <TabsContent value="notes" className="mt-6"><AccountNotes debtorId={account.debtor_id} /></TabsContent>
            <TabsContent value="activity" className="mt-6"><ActivityLog debtorId={account.debtor_id} /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}