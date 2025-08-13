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
import { calculateTotalPaid, getLastPaymentDate } from '@/utils/mockPayments';

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

  // Calculate total paid from actual payments
  const actualTotalPaid = calculateTotalPaid(account.debtor_id);
  const calculatedCurrentBalance = (account.original_balance || 0) - actualTotalPaid;
  const actualLastPaymentDate = getLastPaymentDate(account.debtor_id);

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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="profile"><User className="w-4 h-4 mr-2"/>Profile</TabsTrigger><TabsTrigger value="payments"><DollarSign className="w-4 h-4 mr-2"/>Payments</TabsTrigger><TabsTrigger value="notes"><FileText className="w-4 h-4 mr-2"/>Notes</TabsTrigger><TabsTrigger value="activity"><History className="w-4 h-4 mr-2"/>Activity</TabsTrigger></TabsList>
            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Account Information */}
                <Card>
                  <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Debtor ID:</span>
                        <span>{account.debtor_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">BEAM ID:</span>
                        <span>{account.beam_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Original Account:</span>
                        <span>{account.original_account_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Issuer Account:</span>
                        <span>{account.issuer_account_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Seller Account:</span>
                        <span>{account.seller_account_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Original Creditor:</span>
                        <span>{account.original_creditor || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge className={getStatusColor(account.status)}>
                          {account.status?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Portfolio:</span>
                        <span>{account.portfolio_id || 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Balance Information */}
                <Card>
                  <CardHeader><CardTitle>Balance Information</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Current Balance:</span>
                        <span className="font-semibold text-primary">{formatCurrency(calculatedCurrentBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Original Balance:</span>
                        <span>{formatCurrency(account.original_balance || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Charge Off Amount:</span>
                        <span>{formatCurrency(account.charge_off_amount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Paid:</span>
                        <span>{formatCurrency(actualTotalPaid)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Account Open Date:</span>
                        <span>{formatDate(account.account_open_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Charge Off Date:</span>
                        <span>{formatDate(account.charge_off_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Delinquency Date:</span>
                        <span>{formatDate(account.delinquency_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last Payment:</span>
                        <span>{actualLastPaymentDate ? formatDate(actualLastPaymentDate) : 'N/A'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card><CardHeader><CardTitle className="text-primary">Debtor Profile Details</CardTitle></CardHeader><CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input 
                      value={editedAccount.debtor_info?.first_name || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, first_name: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input 
                      value={editedAccount.debtor_info?.last_name || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, last_name: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input 
                      value={editedAccount.debtor_info?.phone || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, phone: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      value={editedAccount.debtor_info?.email || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, email: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input 
                      value={editedAccount.debtor_info?.address || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, address: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input 
                      value={editedAccount.debtor_info?.city || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, city: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input 
                      value={editedAccount.debtor_info?.state || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, state: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input 
                      value={editedAccount.debtor_info?.zip || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, zip: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Homeowner</Label>
                    <Select 
                      value={editedAccount.debtor_info?.homeowner ? 'yes' : 'no'} 
                      onValueChange={(value) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, homeowner: value === 'yes'}})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Recovery Score (Bankcard)</Label>
                    <Input 
                      type="number"
                      value={editedAccount.debtor_info?.score_recovery_bankcard || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, score_recovery_bankcard: parseInt(e.target.value)}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Recovery Score (Retail)</Label>
                    <Input 
                      type="number"
                      value={editedAccount.debtor_info?.score_recovery_retail || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, score_recovery_retail: parseInt(e.target.value)}})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Employer</Label>
                    <Input 
                      value={editedAccount.debtor_info?.employer || ''} 
                      onChange={(e) => setEditedAccount({...editedAccount, debtor_info: {...editedAccount.debtor_info, employer: e.target.value}})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
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
  );
}