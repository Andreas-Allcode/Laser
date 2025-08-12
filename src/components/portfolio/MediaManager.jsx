import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  Download,
  Search,
  FileText,
  File,
  ChevronLeft,
  ChevronRight,
  Archive
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MOCK_MEDIA_FILES = Array.from({ length: 25 }, (_, i) => ({
  id: `file_${i + 1}`,
  name: `document_${String(i + 1).padStart(3, '0')}.${['pdf', 'txt', 'doc', 'xlsx'][i % 4]}`,
  size: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
  uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  type: ['pdf', 'txt', 'doc', 'xlsx'][i % 4]
}));

const MOCK_MEDIA_REQUESTS = Array.from({ length: 15 }, (_, i) => ({
  id: `req_${i + 1}`,
  portfolioName: `Portfolio ${String.fromCharCode(65 + (i % 5))}`,
  requestedBy: ['john.doe@company.com', 'jane.smith@company.com', 'bob.wilson@company.com'][i % 3],
  requestedTo: ['legal@company.com', 'compliance@company.com', 'operations@company.com'][i % 3],
  status: ['Requested', 'Completed'][i % 2],
  requestedDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}));

export default function MediaManager({ portfolio, onBack }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesPerPage, setFilesPerPage] = useState(10);
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [requestsPerPage, setRequestsPerPage] = useState(10);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('');
  const [mediaRequests, setMediaRequests] = useState(MOCK_MEDIA_REQUESTS);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    return type === 'pdf' || type === 'doc' || type === 'txt' || type === 'xlsx' ? FileText : File;
  };

  // Filter and paginate media files
  const filteredFiles = MOCK_MEDIA_FILES.filter(file =>
    file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())
  );
  const totalFilePages = Math.ceil(filteredFiles.length / filesPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentFilePage - 1) * filesPerPage,
    currentFilePage * filesPerPage
  );

  // Filter and paginate media requests
  const filteredRequests = mediaRequests.filter(request => {
    const matchesSearch = request.portfolioName.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
                         request.requestedDate.includes(requestSearchTerm);
    const matchesStatus = !requestStatusFilter || requestStatusFilter === "all" || request.status === requestStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalRequestPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentRequestPage - 1) * requestsPerPage,
    currentRequestPage * requestsPerPage
  );

  const handleFileSelect = (fileId, checked) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleSelectAllFiles = (checked) => {
    if (checked) {
      setSelectedFiles(paginatedFiles.map(file => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const supportedTypes = ['pdf', 'txt', 'doc', 'docx', 'xlsx', 'xls'];
    
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return supportedTypes.includes(extension);
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files skipped",
        description: "Only PDF, TXT, DOC, and XLSX files are supported.",
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${validFiles.length} file(s).`
      });
    }
  };

  const handleDownloadSelected = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to download.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Download started",
      description: `Downloading ${selectedFiles.length} file(s)...`
    });
  };

  const handleZipAndDownload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to zip and download.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Creating archive",
      description: `Creating ZIP archive with ${selectedFiles.length} file(s)...`
    });
  };

  const updateRequestStatus = (requestId, newStatus) => {
    setMediaRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
    toast({
      title: "Status updated",
      description: `Request status changed to ${newStatus}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
              <div>
                <CardTitle className="text-2xl">Media Manager</CardTitle>
                <p className="text-muted-foreground mt-1">Portfolio: {portfolio.name}</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section 1: Media Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Media Files</CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              {selectedFiles.length > 0 && (
                <>
                  <Button variant="outline" onClick={handleDownloadSelected}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Selected
                  </Button>
                  <Button variant="outline" onClick={handleZipAndDownload}>
                    <Archive className="w-4 h-4 mr-2" />
                    Zip & Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={fileSearchTerm}
                  onChange={(e) => setFileSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filesPerPage.toString()} onValueChange={(value) => setFilesPerPage(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedFiles.length > 0 && (
              <Badge variant="secondary">{selectedFiles.length} selected</Badge>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedFiles.length === paginatedFiles.length && paginatedFiles.length > 0}
                      onCheckedChange={handleSelectAllFiles}
                    />
                  </TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <TableRow key={file.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={(checked) => handleFileSelect(file.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4" />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Files Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentFilePage - 1) * filesPerPage) + 1} to {Math.min(currentFilePage * filesPerPage, filteredFiles.length)} of {filteredFiles.length} files
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentFilePage(p => Math.max(1, p - 1))}
                disabled={currentFilePage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">Page {currentFilePage} of {totalFilePages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentFilePage(p => Math.min(totalFilePages, p + 1))}
                disabled={currentFilePage >= totalFilePages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Media Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Media Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={requestSearchTerm}
                  onChange={(e) => setRequestSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={requestStatusFilter || "all"} onValueChange={(value) => setRequestStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Requested">Requested</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={requestsPerPage.toString()} onValueChange={(value) => setRequestsPerPage(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Portfolio Name</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Requested To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.portfolioName}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.requestedTo}</TableCell>
                    <TableCell>
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateRequestStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Requested">Requested</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{request.requestedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Requests Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentRequestPage - 1) * requestsPerPage) + 1} to {Math.min(currentRequestPage * requestsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRequestPage(p => Math.max(1, p - 1))}
                disabled={currentRequestPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">Page {currentRequestPage} of {totalRequestPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentRequestPage(p => Math.min(totalRequestPages, p + 1))}
                disabled={currentRequestPage >= totalRequestPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}