import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  FileImage,
  FileText,
  Upload,
  Search,
  CheckCircle,
  AlertTriangle,
  Download,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MediaRequestManager() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Mock data
  const portfolios = [
    { id: 'PORTFOLIO_1', name: 'Q1 2024 Healthcare' },
    { id: 'PORTFOLIO_2', name: 'Legacy Credit Cards' },
    { id: 'PORTFOLIO_3', name: 'Auto Loans 2024' }
  ];

  const mediaFiles = [
    {
      id: 'MEDIA_001',
      file_name: 'legal_notice_DEBT001.pdf',
      file_type: 'pdf',
      file_size: 2048576,
      portfolio_id: 'PORTFOLIO_1',
      debtor_id: 'DEBT_001',
      category: 'legal_document',
      upload_method: 'batch_import',
      vendor_source: 'Legal Services LLC',
      status: 'associated',
      created_date: '2024-01-15T10:30:00Z'
    },
    {
      id: 'MEDIA_002',
      file_name: 'payment_receipt_12845.jpg',
      file_type: 'jpg',
      file_size: 512000,
      portfolio_id: 'PORTFOLIO_1',
      debtor_id: 'DEBT_12845',
      category: 'payment_proof',
      upload_method: 'manual_upload',
      status: 'associated',
      created_date: '2024-01-15T09:15:00Z'
    },
    {
      id: 'MEDIA_003',
      file_name: 'correspondence_batch_jan2024.zip',
      file_type: 'zip',
      file_size: 15728640,
      portfolio_id: 'PORTFOLIO_1',
      debtor_id: null,
      category: 'correspondence',
      upload_method: 'batch_import',
      vendor_source: 'MedDebt Solutions LLC',
      status: 'pending_association',
      created_date: '2024-01-15T08:00:00Z'
    },
    {
      id: 'MEDIA_004',
      file_name: 'id_verification_failed.pdf',
      file_type: 'pdf',
      file_size: 1024000,
      portfolio_id: 'PORTFOLIO_2',
      debtor_id: 'DEBT_2840',
      category: 'identity_verification',
      upload_method: 'vendor_submission',
      vendor_source: 'ID Verify Corp',
      status: 'error',
      created_date: '2024-01-14T16:45:00Z'
    }
  ];

  const getFileIcon = (fileType) => {
    const icons = {
      'pdf': FileText,
      'jpg': FileImage,
      'png': FileImage,
      'doc': FileText,
      'docx': FileText,
      'zip': FileText
    };
    return icons[fileType] || FileText;
  };

  const getStatusColor = (status) => {
    const colors = {
      'associated': 'bg-green-500/20 text-green-400 border-green-500/30',
      'pending_association': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'duplicate': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'error': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || colors.pending_association;
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${bytes} bytes`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleBatchUpload = () => {
    // Mock batch upload process
    toast({
      title: "Batch Upload Initiated",
      description: "Processing files and attempting automatic association with debtor accounts.",
    });
    setShowUploadDialog(false);
  };

  const handleAutoAssociate = () => {
    toast({
      title: "Auto-Association Started",
      description: "Attempting to automatically associate pending media files with debtor accounts.",
    });
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.debtor_id && file.debtor_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    const matchesPortfolio = !selectedPortfolio || file.portfolio_id === selectedPortfolio;
    
    return matchesSearch && matchesStatus && matchesPortfolio;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold laser-text-gradient">Media File Management</h2>
          <p className="text-gray-400 mt-1">Upload and manage supplementary documentation for debtor accounts</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAutoAssociate}
            variant="outline"
            className="laser-border-gradient text-white hover:bg-gray-700/50"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Auto-Associate Files
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="laser-bg-gradient text-white">
                <Upload className="w-4 h-4 mr-2" />
                Batch Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-600 text-white">
              <DialogHeader>
                <DialogTitle className="laser-text-gradient">Batch Media Upload</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Select Portfolio</Label>
                  <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Choose portfolio" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {portfolios.map(portfolio => (
                        <SelectItem key={portfolio.id} value={portfolio.id} className="text-white">
                          {portfolio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold text-white mb-2">Upload Media Files</p>
                  <p className="text-gray-400">
                    Drop files here or click to browse. Supports PDF, JPG, PNG, DOC, ZIP files.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="laser-border-gradient text-white">
                    Cancel
                  </Button>
                  <Button onClick={handleBatchUpload} className="laser-bg-gradient text-white">
                    Start Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="laser-border-gradient bg-gray-800/50">
        <CardHeader>
          <CardTitle className="laser-text-gradient">Filter Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-white">Portfolio</Label>
              <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All portfolios" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value={null} className="text-white">All Portfolios</SelectItem>
                  {portfolios.map(portfolio => (
                    <SelectItem key={portfolio.id} value={portfolio.id} className="text-white">
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-white">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="associated" className="text-white">Associated</SelectItem>
                  <SelectItem value="pending_association" className="text-white">Pending Association</SelectItem>
                  <SelectItem value="duplicate" className="text-white">Duplicate</SelectItem>
                  <SelectItem value="error" className="text-white">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-white">Search</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by filename or debtor ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className="laser-border-gradient bg-gray-800/50">
        <CardHeader>
          <CardTitle className="laser-text-gradient">
            Media Files ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-600 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-600 bg-gray-900/50">
                  <TableHead className="text-white">File</TableHead>
                  <TableHead className="text-white">Portfolio</TableHead>
                  <TableHead className="text-white">Debtor ID</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Source</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.file_type);
                  return (
                    <TableRow key={file.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-5 h-5 laser-text-gradient" />
                          <div>
                            <p className="text-white font-medium">{file.file_name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.file_size)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {portfolios.find(p => p.id === file.portfolio_id)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-white font-mono">
                        {file.debtor_id || <span className="text-gray-500">Not assigned</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {file.category.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {file.vendor_source || file.upload_method.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(file.status)}>
                          {file.status === 'associated' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {file.status === 'error' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {file.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(file.created_date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {file.status === 'pending_association' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <LinkIcon className="w-4 h-4" />
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