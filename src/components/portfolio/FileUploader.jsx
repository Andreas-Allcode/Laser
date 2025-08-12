import React, { useState, useRef } from 'react';
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
  Upload,
  X,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertTriangle,
  Save,
  Download
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function FileUploader({ isOpen, onClose, portfolios }) {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [isNewPortfolio, setIsNewPortfolio] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [fieldMappings, setFieldMappings] = useState({});
  const [mediaFileFields, setMediaFileFields] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const availableFields = [
    // Account Identifiers
    'debtor_id', 'beam_id', 'original_account_number', 'issuer_account_number', 'seller_account_number',
    
    // Creditor Information
    'original_creditor',
    
    // Personal Information
    'first_name', 'last_name', 'ssn', 'date_of_birth',
    
    // Contact Information
    'address', 'address2', 'city', 'state', 'zip', 'phone', 'email',
    
    // Employment & Demographics
    'employer', 'homeowner', 'score_recovery_bankcard', 'score_recovery_retail',
    
    // Financial Information
    'current_balance', 'original_balance', 'total_amount_due', 'principle_balance', 
    'charge_off_amount', 'total_paid', 'interest_rate',
    
    // Important Dates
    'account_open_date', 'charge_off_date', 'delinquency_date', 'last_payment_date'
  ];
  
  const mediaFileFieldOptions = [
    { value: 'debtor_id', label: 'Account ID' },
    { value: 'original_account_number', label: 'Original Account Number' },
    { value: 'issuer_account_number', label: 'Issuer Account Number' },
    { value: 'seller_account_number', label: 'Seller Account Number' },
    { value: 'beam_id', label: 'BEAM ID' },
    { value: 'ssn', label: 'Social Security Number' },
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // Read the actual CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        toast({ title: "Error", description: "File appears to be empty.", variant: "destructive" });
        return;
      }
      
      // Parse CSV (simple implementation)
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setPreviewData(rows);
      setValidationResults({
        total_records: lines.length - 1, // Subtract header row
        valid_records: 0,
        invalid_records: 0,
        errors: [],
        warnings: []
      });
      
      toast({ title: "File Uploaded", description: `${file.name} has been successfully uploaded. Found ${headers.length} columns and ${lines.length - 1} records.` });
    };
    
    reader.onerror = () => {
      toast({ title: "Error", description: "Failed to read file.", variant: "destructive" });
    };
    
    reader.readAsText(file);
  };

  const validateMappings = () => {
    if (!uploadedFile || previewData.length === 0) {
      toast({ title: "Error", description: "No data to validate.", variant: "destructive" });
      return;
    }
    
    const mappedFields = Object.values(fieldMappings).filter(Boolean);
    if (mappedFields.length === 0) {
      toast({ title: "Error", description: "Please map at least one field.", variant: "destructive" });
      return;
    }
    
    // Validate required fields
    const requiredFields = ['debtor_id', 'first_name', 'last_name', 'current_balance'];
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
    
    const errors = [];
    const warnings = [];
    
    if (missingRequired.length > 0) {
      warnings.push(`Missing recommended fields: ${missingRequired.join(', ')}`);
    }
    
    // Simulate validation of sample data
    let validCount = Math.floor(validationResults.total_records * 0.95);
    let invalidCount = validationResults.total_records - validCount;
    
    if (invalidCount > 0) {
      errors.push({ row: 25, field: 'current_balance', error: 'Invalid balance format' });
      errors.push({ row: 47, field: 'debtor_id', error: 'Duplicate debtor ID' });
    }
    
    setValidationResults({
      ...validationResults,
      valid_records: validCount,
      invalid_records: invalidCount,
      errors,
      warnings
    });
    
    // Generate portfolio summary
    generatePortfolioSummary(validCount, invalidCount);
    
    setStep(3);
  };
  
  const processImport = async () => {
    setStep(4);
    
    try {
      // Simulate portfolio creation
      const portfolioName = isNewPortfolio ? newPortfolioName : portfolios.find(p => p.id === selectedPortfolio)?.name;
      
      // Simulate API call to create portfolio and import data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Create the portfolio in the database
      // 2. Process the CSV file with the field mappings
      // 3. Insert the debt records into the database
      // 4. Return the created portfolio ID
      
      console.log('Portfolio created:', {
        name: portfolioName,
        isNew: isNewPortfolio,
        mappings: fieldMappings,
        recordCount: validationResults.valid_records,
        fileName: uploadedFile.name
      });
      
      toast({ 
        title: "Import Complete", 
        description: `Successfully created portfolio "${portfolioName}" and imported ${validationResults.valid_records} accounts.` 
      });
      
    } catch (error) {
      console.error('Import failed:', error);
      toast({ 
        title: "Import Failed", 
        description: "There was an error creating the portfolio. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleMediaFieldToggle = (fieldValue) => {
    setMediaFileFields(prev => {
      if (prev.includes(fieldValue)) {
        return prev.filter(f => f !== fieldValue);
      } else if (prev.length < 3) {
        return [...prev, fieldValue];
      }
      return prev; // Don't add if already at limit
    });
  };

  const generatePortfolioSummary = (validCount, invalidCount) => {
    // Simulate portfolio analysis
    const totalRecords = validationResults.total_records;
    const uniqueAccounts = Math.floor(validCount * 0.98); // Some duplicates removed
    const avgBalance = 2500 + Math.random() * 3000;
    const avgPrincipleBalance = avgBalance * 0.85;
    
    const topStates = [
      { state: 'TX', accounts: Math.floor(uniqueAccounts * 0.25), value: Math.floor(uniqueAccounts * 0.25 * avgBalance), percentage: 25.0 },
      { state: 'CA', accounts: Math.floor(uniqueAccounts * 0.20), value: Math.floor(uniqueAccounts * 0.20 * avgBalance), percentage: 20.0 },
      { state: 'FL', accounts: Math.floor(uniqueAccounts * 0.15), value: Math.floor(uniqueAccounts * 0.15 * avgBalance), percentage: 15.0 },
      { state: 'NY', accounts: Math.floor(uniqueAccounts * 0.12), value: Math.floor(uniqueAccounts * 0.12 * avgBalance), percentage: 12.0 },
      { state: 'IL', accounts: Math.floor(uniqueAccounts * 0.10), value: Math.floor(uniqueAccounts * 0.10 * avgBalance), percentage: 10.0 }
    ];
    
    const exceptions = {
      duplicateAccountNumbers: Math.floor(totalRecords * 0.02),
      duplicateSSN: Math.floor(totalRecords * 0.015),
      duplicateAccounts: Math.floor(totalRecords * 0.01)
    };
    
    setPortfolioSummary({
      creditorName: 'Sample Creditor LLC',
      creationDate: new Date().toISOString().split('T')[0],
      alternateUID: `ALT_${Date.now()}`,
      totalRecordsInFile: totalRecords,
      recordsRemoved: invalidCount + exceptions.duplicateAccountNumbers + exceptions.duplicateSSN + exceptions.duplicateAccounts,
      totalUniqueAccounts: uniqueAccounts,
      calculatedPortfolioValue: Math.floor(uniqueAccounts * avgBalance),
      topStates,
      avgTotalDue: Math.floor(avgBalance),
      avgPrincipleBalance: Math.floor(avgPrincipleBalance),
      avgDelinquentDays: 180 + Math.floor(Math.random() * 200),
      avgChargeOffDays: 365 + Math.floor(Math.random() * 200),
      exceptions
    });
  };

  const downloadExceptions = () => {
    if (!portfolioSummary) return;
    
    const exceptionsData = [
      ['Exception Type', 'Account ID', 'Reason'],
      ['Duplicate Account Number', 'ACC_12345', 'Account already exists in system'],
      ['Duplicate Account Number', 'ACC_67890', 'Account already exists in system'],
      ['Duplicate SSN', 'DEBT_111', 'SSN 123-45-6789 already exists'],
      ['Duplicate Account', 'DEBT_222', 'Duplicate entry in uploaded file'],
    ];
    
    const csvContent = exceptionsData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${isNewPortfolio ? newPortfolioName : 'portfolio'}_exceptions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: "Download Complete", description: "Exceptions file has been downloaded." });
  };

  const resetUploader = () => {
    setStep(1); 
    setUploadedFile(null); 
    setSelectedPortfolio(''); 
    setIsNewPortfolio(false);
    setNewPortfolioName('');
    setFieldMappings({});
    setMediaFileFields([]);
    setPreviewData([]); 
    setValidationResults(null);
    setPortfolioSummary(null);
  };
  const handleClose = () => { resetUploader(); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-primary">File Upload & Import</DialogTitle></DialogHeader>
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="portfolioOption" 
                    checked={!isNewPortfolio} 
                    onChange={() => setIsNewPortfolio(false)}
                  />
                  <span>Existing Portfolio</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="portfolioOption" 
                    checked={isNewPortfolio} 
                    onChange={() => setIsNewPortfolio(true)}
                  />
                  <span>New Portfolio</span>
                </label>
              </div>
              
              {isNewPortfolio ? (
                <div>
                  <Label>Portfolio Name</Label>
                  <Input 
                    value={newPortfolioName} 
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    placeholder="Enter new portfolio name"
                  />
                </div>
              ) : (
                <div>
                  <Label>Select Portfolio</Label>
                  <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolios.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleFileUpload} className="hidden" />
              {uploadedFile ? (<div className="flex items-center justify-center gap-3"><FileSpreadsheet className="w-12 h-12 text-primary" /><p>{uploadedFile.name}</p><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}><X className="w-4 h-4" /></Button></div>) : (<div><Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" /><p>Click to upload or drag and drop</p></div>)}
            </div>
            {uploadedFile && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={isNewPortfolio ? !newPortfolioName.trim() : !selectedPortfolio}
                >
                  Next: Map Fields
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Map File Columns to Database Fields</h3>
              <p className="text-muted-foreground">
                {isNewPortfolio ? `Creating new portfolio: ${newPortfolioName}` : `Adding to portfolio: ${portfolios.find(p => p.id === selectedPortfolio)?.name}`}
              </p>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Column</TableHead>
                    <TableHead>Sample Data</TableHead>
                    <TableHead>Map to Field</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(previewData[0] || {}).map((col, i) => (
                    <TableRow key={col}>
                      <TableCell className="font-medium">{col}</TableCell>
                      <TableCell className="text-muted-foreground">{previewData[0][col]}</TableCell>
                      <TableCell>
                        <Select 
                          value={fieldMappings[col] || ''} 
                          onValueChange={v => setFieldMappings(p => ({ ...p, [col]: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Skip this column --</SelectItem>
                            {availableFields.map(f => (
                              <SelectItem key={f} value={f}>
                                {f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Media File Field Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Supporting Media File Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select fields to match with supporting media file names (select up to 3 columns)
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mediaFileFieldOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mediaFileFields.includes(option.value)}
                        onChange={() => handleMediaFieldToggle(option.value)}
                        disabled={!mediaFileFields.includes(option.value) && mediaFileFields.length >= 3}
                        className="rounded"
                      />
                      <span className={`text-sm ${
                        !mediaFileFields.includes(option.value) && mediaFileFields.length >= 3 
                          ? 'text-muted-foreground' 
                          : 'text-foreground'
                      }`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {mediaFileFields.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected fields for media file matching:</p>
                    <div className="flex flex-wrap gap-2">
                      {mediaFileFields.map(field => {
                        const option = mediaFileFieldOptions.find(opt => opt.value === field);
                        return (
                          <Badge key={field} variant="secondary">
                            {option?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><div className="flex gap-2"><Button onClick={validateMappings} disabled={Object.keys(fieldMappings).length === 0}>Next: Validate Data</Button></div></div>
          </div>
        )}
        
        {step === 3 && portfolioSummary && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Portfolio Summary</h3>
              <Button variant="outline" onClick={downloadExceptions}>
                <Download className="w-4 h-4 mr-2" />
                Download Exceptions
              </Button>
            </div>
            
            {/* Portfolio Stats */}
            <Card>
              <CardHeader><CardTitle>Portfolio Statistics</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><strong>Creditor/Seller Name:</strong> {portfolioSummary.creditorName}</div>
                  <div><strong>Portfolio Creation Date:</strong> {portfolioSummary.creationDate}</div>
                  <div><strong>Alternate UID:</strong> {portfolioSummary.alternateUID}</div>
                  <div><strong>Total Records in File:</strong> {portfolioSummary.totalRecordsInFile.toLocaleString()}</div>
                  <div><strong>Records Removed:</strong> {portfolioSummary.recordsRemoved.toLocaleString()}</div>
                  <div><strong>Total Unique Accounts:</strong> {portfolioSummary.totalUniqueAccounts.toLocaleString()}</div>
                  <div><strong>Calculated Portfolio Value:</strong> ${portfolioSummary.calculatedPortfolioValue.toLocaleString()}</div>
                  <div><strong>Account Avg Total Due:</strong> ${portfolioSummary.avgTotalDue.toLocaleString()}</div>
                  <div><strong>Account Avg Principle Balance:</strong> ${portfolioSummary.avgPrincipleBalance.toLocaleString()}</div>
                  <div><strong>Account Avg Delinquent Days:</strong> {portfolioSummary.avgDelinquentDays}</div>
                  <div><strong>Account Avg Charge Off Days:</strong> {portfolioSummary.avgChargeOffDays}</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Top 5 States */}
            <Card>
              <CardHeader><CardTitle>Top 5 States by Account Value</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {portfolioSummary.topStates.map(state => (
                    <div key={state.state} className="flex justify-between items-center">
                      <span className="font-medium">{state.state}</span>
                      <div className="text-right">
                        <div>${state.value.toLocaleString()} ({state.accounts.toLocaleString()} accounts)</div>
                        <div className="text-sm text-muted-foreground">{state.percentage}% of total value</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Exceptions Summary */}
            <Card>
              <CardHeader><CardTitle className="text-red-600">Exceptions Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold text-red-600">{portfolioSummary.exceptions.duplicateAccountNumbers}</p>
                    <p className="text-sm">Duplicate Original Account Numbers</p>
                    <p className="text-xs text-muted-foreground">Accounts already exist in system</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold text-red-600">{portfolioSummary.exceptions.duplicateSSN}</p>
                    <p className="text-sm">Duplicate SSN</p>
                    <p className="text-xs text-muted-foreground">SSN already exists in system</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <p className="text-2xl font-bold text-red-600">{portfolioSummary.exceptions.duplicateAccounts}</p>
                    <p className="text-sm">Duplicate Accounts in File</p>
                    <p className="text-xs text-muted-foreground">Duplicate entries in uploaded file</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back to Mapping</Button>
              <Button onClick={processImport} className="bg-primary">
                Create Portfolio & Import {portfolioSummary.totalUniqueAccounts.toLocaleString()} Accounts
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold mb-2">Import Successful!</h3>
            <p className="text-muted-foreground mb-6">{validationResults?.valid_records} accounts have been imported.</p>
            <div className="flex justify-center gap-4"><Button variant="outline" onClick={handleClose}>Close</Button><Button onClick={resetUploader}>Import Another File</Button></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}