import { supabase } from '@/lib/supabase';

export const deleteDuplicateAccounts = async () => {
  try {
    // Get all debts
    const { data: allDebts, error: fetchError } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) throw fetchError;

    // Group by debtor_id and name combination
    const debtorGroups = new Map();
    
    allDebts.forEach(debt => {
      const firstName = debt.debtor_info?.first_name || '';
      const lastName = debt.debtor_info?.last_name || '';
      const key = `${debt.debtor_id}-${firstName}-${lastName}`;
      
      if (!debtorGroups.has(key)) {
        debtorGroups.set(key, []);
      }
      debtorGroups.get(key).push(debt);
    });

    // Find duplicates and keep only the first one
    const duplicateIds = [];
    let duplicateCount = 0;

    debtorGroups.forEach(debts => {
      if (debts.length > 1) {
        // Keep the first (oldest) record, mark others for deletion
        for (let i = 1; i < debts.length; i++) {
          duplicateIds.push(debts[i].id);
          duplicateCount++;
        }
      }
    });

    if (duplicateIds.length === 0) {
      return { success: true, message: 'No duplicates found', deletedCount: 0 };
    }

    // Delete duplicates in batches
    const batchSize = 100;
    let deletedCount = 0;

    for (let i = 0; i < duplicateIds.length; i += batchSize) {
      const batch = duplicateIds.slice(i, i + batchSize);
      
      const { error: deleteError } = await supabase
        .from('debts')
        .delete()
        .in('id', batch);

      if (deleteError) throw deleteError;
      deletedCount += batch.length;
    }

    return { 
      success: true, 
      message: `Successfully deleted ${deletedCount} duplicate accounts`,
      deletedCount 
    };

  } catch (error) {
    console.error('Error deleting duplicates:', error);
    return { 
      success: false, 
      message: `Failed to delete duplicates: ${error.message}`,
      error 
    };
  }
};