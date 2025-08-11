import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import AccountSearch from '../components/account-center/AccountSearch';
import AccountProfile from '../components/account-center/AccountProfile';

import { Debt } from '@/api/entities';
import { AccountNote } from '@/api/entities';
import { Payment } from '@/api/entities';
import { PaymentPlan } from '@/api/entities';
import { ActivityLog } from '@/api/entities';

export default function AccountCenter() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };
  
  const handleBackToSearch = () => {
    setSelectedAccount(null);
  };

  const handleUpdateAccount = async (accountId, data) => {
    try {
      setIsLoading(true);
      await Debt.update(accountId, data);
      
      const updatedAccount = { ...selectedAccount, ...data };
      setSelectedAccount(updatedAccount);

      await ActivityLog.create({
        activity_type: 'updated_debt_status',
        description: `Updated account ${accountId}.`,
        entity_type: 'debt',
        entity_id: accountId,
        metadata: { changes: Object.keys(data) }
      });

      toast({
        title: "Account Updated",
        description: "Debtor profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to update account details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
     try {
      await AccountNote.create(noteData);
      await ActivityLog.create({
        activity_type: 'added_note',
        description: `Added note: "${noteData.title}"`,
        entity_type: 'debt',
        entity_id: noteData.debtor_id
      });
      toast({ title: "Note Added", description: "The note has been successfully added to the account." });
    } catch (error) {
       toast({ title: "Failed to Add Note", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 laser-text-gradient"/>
        <div>
          <h1 className="text-4xl font-bold laser-text-gradient">Account Center</h1>
          <p className="text-gray-400 mt-1">
            Search for and manage individual debtor accounts
          </p>
        </div>
      </div>

      {!selectedAccount ? (
        <AccountSearch onAccountSelect={handleAccountSelect} />
      ) : (
        <AccountProfile 
          account={selectedAccount}
          onBack={handleBackToSearch}
          onUpdate={handleUpdateAccount}
          onAddNote={handleAddNote}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}