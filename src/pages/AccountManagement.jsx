
import React, { useState, useCallback } from 'react';
import { Users, Search, UserCheck, Database, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { syncCommandCenterToDatabase } from '@/utils/syncCommandCenterData';
import { deleteDuplicateAccounts } from '@/utils/deleteDuplicates';

import AccountSearch from '../components/account-center/AccountSearch';
import AccountProfile from '../components/account-center/AccountProfile';

export default function AccountManagement() {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [syncingData, setSyncingData] = useState(false);
  const [deletingDuplicates, setDeletingDuplicates] = useState(false);
  const { toast } = useToast();

  const handleAccountSelect = useCallback((account) => {
    setSelectedAccount(account);
    setActiveTab('profile');
  }, []);

  const handleBackToSearch = useCallback(() => {
    setSelectedAccount(null);
    setActiveTab('search');
  }, []);

  const handleUpdateAccount = useCallback((updatedAccount) => {
    setSelectedAccount(updatedAccount);
    toast({
      title: "Account Updated",
      description: "Account information has been saved successfully.",
      duration: 5000,
    });
  }, [toast]);

  const handleStatusChange = useCallback((statusUpdate) => {
    setSelectedAccount((prevAccount) => ({
      ...prevAccount,
      status: statusUpdate.new_status
    }));
    
    toast({
      title: "Status Updated",
      description: `Account status changed to ${statusUpdate.new_status.replace(/_/g, ' ')}`,
      duration: 5000,
    });
  }, [toast]);

  const handleSyncCommandCenter = useCallback(async () => {
    setSyncingData(true);
    try {
      const result = await syncCommandCenterToDatabase();
      if (result.success) {
        toast({
          title: "Sync Complete",
          description: result.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "Failed to sync Command Center data",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSyncingData(false);
    }
  }, [toast]);

  const handleDeleteDuplicates = useCallback(async () => {
    setDeletingDuplicates(true);
    try {
      const result = await deleteDuplicateAccounts();
      if (result.success) {
        toast({
          title: "Duplicates Removed",
          description: result.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Delete Failed",
          description: result.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Delete Error",
        description: "Failed to delete duplicate accounts",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeletingDuplicates(false);
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary"/>
          <div>
            <h1 className="text-3xl font-bold text-primary">Account Management</h1>
            <p className="text-muted-foreground mt-1">
              Search for and view individual debtor account profiles
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSyncCommandCenter}
            disabled={syncingData}
            className="gap-2"
            variant="outline"
          >
            <Database className="w-4 h-4" />
            {syncingData ? 'Syncing...' : 'Sync from Command Center'}
          </Button>
          <Button 
            onClick={handleDeleteDuplicates}
            disabled={deletingDuplicates}
            className="gap-2"
            variant="destructive"
          >
            <Trash2 className="w-4 h-4" />
            {deletingDuplicates ? 'Deleting...' : 'Delete Duplicates'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search"><Search className="w-4 h-4 mr-2" />Account Search</TabsTrigger>
          <TabsTrigger value="profile" disabled={!selectedAccount}><UserCheck className="w-4 h-4 mr-2" />Account Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="mt-6">
          <AccountSearch onAccountSelect={handleAccountSelect} />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          {selectedAccount ? (
            <AccountProfile
              account={selectedAccount}
              onBack={handleBackToSearch}
              onUpdate={handleUpdateAccount}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card border rounded-lg">
              <p>Select an account from the search tab to view its profile.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
