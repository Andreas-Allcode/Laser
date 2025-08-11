
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search, Save, Share, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const FILTER_FIELDS = [
  { value: 'portfolio_id', label: 'Portfolio' },
  { value: 'debtor_info.state', label: 'State' },
  { value: 'status', label: 'Status' },
  { value: 'assigned_agency_id', label: 'Collection Agency' },
  { value: 'current_balance', label: 'Balance' },
  { value: 'charge_off_date', label: 'Charge Off Date' },
  { value: 'debtor_info.first_name', label: 'First Name' },
  { value: 'debtor_info.last_name', label: 'Last Name' },
];

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
];

export default function SearchFilters({ filters, setFilters, onSearch, onPreview, onSaveSearch, onShareSearch }) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [shareEmails, setShareEmails] = useState('');

  const addFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '', logic: 'AND' }]);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const handleSaveSearch = () => {
    onSaveSearch({
      name: searchName,
      description: searchDescription,
      filters: filters,
    });
    setShowSaveDialog(false);
    setSearchName('');
    setSearchDescription('');
  };

  const handleShareSearch = () => {
    const emails = shareEmails.split(',').map(email => email.trim());
    onShareSearch({
      name: searchName || 'Shared Search',
      filters: filters,
      shareWith: emails,
    });
    setShowShareDialog(false);
    setShareEmails('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Search Filters</h2>
        <div className="space-y-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-secondary border">
              {index > 0 && (
                <Select value={filter.logic} onValueChange={(value) => updateFilter(index, 'logic', value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Select value={filter.field} onValueChange={(value) => updateFilter(index, 'field', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_FIELDS.map(field => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filter.operator} onValueChange={(value) => updateFilter(index, 'operator', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 min-w-[150px]"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(index)}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={addFilter}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </Button>

            <Button
              onClick={onPreview}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Results
            </Button>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Search</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="searchName">Search Name</Label>
                    <Input
                      id="searchName"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="searchDesc">Description</Label>
                    <Textarea
                      id="searchDesc"
                      value={searchDescription}
                      onChange={(e) => setSearchDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveSearch} className="w-full">
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Search
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Search</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="shareEmails">Share with (emails, comma separated)</Label>
                    <Textarea
                      id="shareEmails"
                      value={shareEmails}
                      onChange={(e) => setShareEmails(e.target.value)}
                      placeholder="user1@bayview.com, user2@bayview.com"
                    />
                  </div>
                  <Button onClick={handleShareSearch} className="w-full">
                    Share
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={onSearch}
              className="ml-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Execute Search
            </Button>
          </div>

          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t">
              <span className="text-sm font-medium text-foreground self-center">Active Filters:</span>
              {filters.map((filter, index) => (
                <Badge key={index} variant="secondary">
                  {index > 0 && <span className="font-normal mr-1">{filter.logic}</span>}
                  <span className="font-semibold mr-1">{FILTER_FIELDS.find(f => f.value === filter.field)?.label}</span>
                  <span className="font-normal mr-1">{filter.operator}</span>
                  <span className="font-semibold">{filter.value}</span>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
