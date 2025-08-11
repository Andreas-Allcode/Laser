import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Settings,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ScrubManager() {
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const { toast } = useToast();

  // Mock data
  const vendors = [
    { id: 'experian', name: 'Experian', cost_per_record: 0.75, enabled: true },
    { id: 'transunion_tlo', name: 'TransUnion TLO', cost_per_record: 0.85, enabled: true },
    { id: 'rnn_group', name: 'RNN Group', cost_per_record: 0.65, enabled: true },
    { id: 'innovis', name: 'Innovis', cost_per_record: 0.70, enabled: false }
  ];

  const portfolios = [
    { id: 'PORTFOLIO_1', name: 'Q1 2024 Healthcare', account_count: 15420 },
    { id: 'PORTFOLIO_2', name: 'Legacy Credit Cards', account_count: 28750 },
    { id: 'PORTFOLIO_3', name: 'Auto Loans 2024', account_count: 8940 }
  ];

  const scrubJobs = [
    {
      id: 'SCRUB_001',
      portfolio_id: 'PORTFOLIO_1',
      portfolio_name: 'Q1 2024 Healthcare',
      total_accounts: 15420,
      processed_accounts: 12580,
      status: 'processing',
      cost_estimate: 11565.00,
      actual_cost: 9435.00,
      vendor_sequence: [
        { vendor: 'experian', order: 1, status: 'completed', started_at: '2024-01-15T08:00:00Z', completed_at: '2024-01-15T12:30:00Z' },
        { vendor: 'transunion_tlo', order: 2, status: 'in_progress', started_at: '2024-01-15T12:30:00Z' },
        { vendor: 'rnn_group', order: 3, status: 'pending' }
      ],
      results_summary: {
        bankruptcy_found: 1311,
        deceased_found: 355,
        phone_updated: 8420,
        email_updated: 4250,
        address_updated: 6180
      },
      created_date: '2024-01-15T08:00:00Z'
    },
    {
      id: 'SCRUB_002',
      portfolio_id: 'PORTFOLIO_2',
      portfolio_name: 'Legacy Credit Cards',
      total_accounts: 28750,
      processed_accounts: 28750,
      status: 'completed',
      cost_estimate: 24537.50,
      actual_cost: 24537.50,
      vendor_sequence: [
        { vendor: 'experian', order: 1, status: 'completed', started_at: '2024-01-10T09:00:00Z', completed_at: '2024-01-10T18:45:00Z' },
        { vendor: 'transunion_tlo', order: 2, status: 'completed', started_at: '2024-01-10T18:45:00Z', completed_at: '2024-01-11T14:20:00Z' }
      ],
      results_summary: {
        bankruptcy_found: 3479,
        deceased_found: 1093,
        phone_updated: 15420,
        email_updated: 9850,
        address_updated: 12340
      },
      created_date: '2024-01-10T09:00:00Z'
    },
    {
      id: 'SCRUB_003',
      portfolio_id: 'PORTFOLIO_3',
      portfolio_name: 'Auto Loans 2024',
      total_accounts: 8940,
      processed_accounts: 0,
      status: 'queued',
      cost_estimate: 6705.00,
      actual_cost: 0,
      vendor_sequence: [
        { vendor: 'experian', order: 1, status: 'pending' },
        { vendor: 'rnn_group', order: 2, status: 'pending' }
      ],
      results_summary: {
        bankruptcy_found: 0,
        deceased_found: 0,
        phone_updated: 0,
        email_updated: 0,
        address_updated: 0
      },
      created_date: '2024-01-14T16:00:00Z'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'queued': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'processing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'failed': 'bg-red-500/20 text-red-400 border-red-500/30',
      'cancelled': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[status] || colors.queued;
  };

  const getVendorStatusIcon = (status) => {
    const icons = {
      'pending': Clock,
      'in_progress': Play,
      'completed': CheckCircle,
      'failed': AlertTriangle
    };
    return icons[status] || Clock;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStartScrub = (portfolioId) => {
    toast({
      title: "Scrub Job Started",
      description: `Initiating debt scrubbing process for selected portfolio with configured vendors.`,
    });
  };

  const handlePauseScrub = (scrubId) => {
    toast({
      title: "Scrub Job Paused",
      description: "The scrubbing process has been paused. You can resume it later.",
    });
  };

  const handleRestartScrub = (scrubId) => {
    toast({
      title: "Scrub Job Restarted",
      description: "The scrubbing process has been restarted from the beginning.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold laser-text-gradient">Debt Scrub Management</h2>
          <p className="text-gray-400 mt-1">Manage external vendor integrations for debt verification and data enhancement</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="laser-border-gradient text-white hover:bg-gray-700/50">
                <Settings className="w-4 h-4 mr-2" />
                Configure Vendors
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="laser-text-gradient">Scrub Vendor Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Available Vendors</h3>
                  <div className="space-y-3">
                    {vendors.map((vendor, index) => (
                      <div key={vendor.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-600">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full laser-bg-gradient flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-white">{vendor.name}</p>
                            <p className="text-xs text-gray-400">
                              Cost: {formatCurrency(vendor.cost_per_record)} per record
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={vendor.enabled ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                          {vendor.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowConfigDialog(false)} className="laser-border-gradient text-white">
                    Cancel
                  </Button>
                  <Button className="laser-bg-gradient text-white">
                    Save Configuration
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button className="laser-bg-gradient text-white">
            <Zap className="w-4 h-4 mr-2" />
            Start New Scrub
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="laser-border-gradient bg-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold laser-text-gradient">
                  {scrubJobs.filter(j => j.status === 'processing').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="laser-border-gradient bg-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Processed</p>
                <p className="text-2xl font-bold laser-text-gradient">
                  {scrubJobs.reduce((sum, job) => sum + job.processed_accounts, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 laser-text-gradient" />
            </div>
          </CardContent>
        </Card>

        <Card className="laser-border-gradient bg-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold laser-text-gradient">
                  {formatCurrency(scrubJobs.reduce((sum, job) => sum + job.actual_cost, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="laser-border-gradient bg-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bankruptcies Found</p>
                <p className="text-2xl font-bold laser-text-gradient">
                  {scrubJobs.reduce((sum, job) => sum + job.results_summary.bankruptcy_found, 0).toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrub Jobs Table */}
      <Card className="laser-border-gradient bg-gray-800/50">
        <CardHeader>
          <CardTitle className="laser-text-gradient">Scrub Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-600 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-600 bg-gray-900/50">
                  <TableHead className="text-white">Portfolio</TableHead>
                  <TableHead className="text-white">Progress</TableHead>
                  <TableHead className="text-white">Vendor Sequence</TableHead>
                  <TableHead className="text-white">Results</TableHead>
                  <TableHead className="text-white">Cost</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scrubJobs.map((job) => {
                  const progressPercentage = Math.round((job.processed_accounts / job.total_accounts) * 100);
                  
                  return (
                    <TableRow key={job.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{job.portfolio_name}</p>
                          <p className="text-xs text-gray-400">
                            {job.total_accounts.toLocaleString()} accounts
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{job.processed_accounts.toLocaleString()} / {job.total_accounts.toLocaleString()}</span>
                            <span className="text-gray-400">{progressPercentage}%</span>
                          </div>
                          <Progress value={progressPercentage} className="w-full h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {job.vendor_sequence.map((vendorStep, index) => {
                            const Icon = getVendorStatusIcon(vendorStep.status);
                            return (
                              <div key={index} className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  vendorStep.status === 'completed' ? 'bg-green-600' :
                                  vendorStep.status === 'in_progress' ? 'bg-blue-600' :
                                  vendorStep.status === 'failed' ? 'bg-red-600' :
                                  'bg-gray-600'
                                }`}>
                                  <Icon className="w-3 h-3 text-white" />
                                </div>
                                {index < job.vendor_sequence.length - 1 && (
                                  <div className="w-4 h-px bg-gray-600 mx-1" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">BK:</span>
                            <span className="text-red-400">{job.results_summary.bankruptcy_found}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Deceased:</span>
                            <span className="text-gray-400">{job.results_summary.deceased_found}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Phone:</span>
                            <span className="text-green-400">{job.results_summary.phone_updated}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white font-semibold">{formatCurrency(job.actual_cost)}</p>
                          <p className="text-xs text-gray-400">
                            Est: {formatCurrency(job.cost_estimate)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {job.status === 'processing' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePauseScrub(job.id)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                          {(job.status === 'failed' || job.status === 'cancelled') && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRestartScrub(job.id)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}