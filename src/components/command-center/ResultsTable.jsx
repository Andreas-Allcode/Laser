import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Settings, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DEFAULT_COLUMNS = [
  { key: 'debtor_id', label: 'Debtor ID', visible: true, sortable: true },
  { key: 'debtor_info.first_name', label: 'First Name', visible: true, sortable: true },
  { key: 'debtor_info.last_name', label: 'Last Name', visible: true, sortable: true },
  { key: 'current_balance', label: 'Balance', visible: true, sortable: true },
  { key: 'debtor_info.state', label: 'State', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'assigned_agency_id', label: 'Agency', visible: false, sortable: true },
  { key: 'charge_off_date', label: 'Charge Off Date', visible: false, sortable: true },
  { key: 'portfolio_id', label: 'Portfolio', visible: false, sortable: true },
];

const STATUS_COLORS = {
  'active_internal': 'bg-green-100 text-green-800 border-green-200',
  'placed_external': 'bg-blue-100 text-blue-800 border-blue-200',
  'resolved_paid': 'bg-purple-100 text-purple-800 border-purple-200',
  'uncollectible_bankruptcy': 'bg-red-100 text-red-800 border-red-200',
  'uncollectible_deceased': 'bg-gray-200 text-gray-800 border-gray-300',
  'payment_plan_active': 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

export default function ResultsTable({ 
  data, 
  isLoading, 
  totalCount,
  currentPage,
  onPageChange,
  onBulkAction,
  onExport 
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkAgency, setBulkAgency] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const visibleColumns = columns.filter(col => col.visible);
  const rowsPerPage = 50;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const toggleColumnVisibility = (columnKey) => {
    setColumns(columns.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(data.map(row => row.debtor_id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (debtorId, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, debtorId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== debtorId));
    }
  };

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };
  
  const handleBulkActionSubmit = () => {
    onBulkAction({
      action: bulkAction,
      debtorIds: selectedRows,
      agencyId: bulkAgency,
    });
    setShowBulkDialog(false);
    setSelectedRows([]);
    setBulkAction('');
    setBulkAgency('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getCellValue = (row, columnKey) => {
    const keys = columnKey.split('.');
    let value = row;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>
            Search Results ({totalCount?.toLocaleString() || 0} accounts)
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Bulk Actions ({selectedRows.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Actions</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Action</Label>
                      <Select value={bulkAction} onValueChange={setBulkAction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="place_with_agency">Place with Collection Agency</SelectItem>
                          <SelectItem value="update_status">Update Status</SelectItem>
                          <SelectItem value="flag_for_review">Flag for Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {bulkAction === 'place_with_agency' && (
                      <div>
                        <Label>Collection Agency</Label>
                        <Select value={bulkAgency} onValueChange={setBulkAgency}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select agency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agency_a">Collection Agency A</SelectItem>
                            <SelectItem value="agency_b">Collection Agency B</SelectItem>
                            <SelectItem value="agency_c">Collection Agency C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleBulkActionSubmit} 
                      className="w-full"
                      disabled={!bulkAction}
                    >
                      Execute Action
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button onClick={onExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {columns.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {visibleColumns.map(column => (
                  <TableHead 
                    key={column.key} 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? data.map((row, index) => (
                <TableRow key={row.debtor_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.debtor_id)}
                      onCheckedChange={(checked) => handleRowSelect(row.debtor_id, checked)}
                    />
                  </TableCell>
                  {visibleColumns.map(column => (
                    <TableCell key={column.key}>
                      {column.key === 'current_balance' ? (
                        <span className="font-semibold text-foreground">
                          {formatCurrency(getCellValue(row, column.key))}
                        </span>
                      ) : column.key === 'status' ? (
                        <Badge 
                          variant="outline" 
                          className={`${STATUS_COLORS[getCellValue(row, column.key)] || 'bg-gray-100 text-gray-800'} border-transparent font-medium`}
                        >
                          {getCellValue(row, column.key)?.replace(/_/g, ' ')}
                        </Badge>
                      ) : column.key.includes('date') ? (
                        formatDate(getCellValue(row, column.key))
                      ) : (
                        getCellValue(row, column.key) || '-'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {totalCount > 0 ? ((currentPage - 1) * rowsPerPage) + 1 : 0} to {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-foreground px-3 py-1 text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}