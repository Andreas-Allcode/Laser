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
  const [previewData, setPreviewData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const availableFields = [
    'debtor_id', 'beam_id', 'first_name', 'last_name', 'ssn', 'date_of_birth', 
    'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'employer',
    'homeowner', 'score_recovery_bankcard', 'score_recovery_retail',
    'original_account_number', 'issuer_account_number', 'seller_account_number',
    'original_creditor', 'current_balance', 'original_balance', 'charge_off_amount',
    'total_paid', 'charge_off_date', 'account_open_date', 'delinquency_date',
    'last_payment_date', 'last_payment_amount'
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    const mockPreview = [
      { col1: 'DEBT001', col2: 'John', col3: 'Smith', col4: '1234', col5: '1980-05-15', col6: '123 Main St' },
      { col1: 'DEBT002', col2: 'Jane', col3: 'Doe', col4: '5678', col5: '1975-12-22', col6: '456 Oak Ave' },
      { col1: 'DEBT003', col2: 'Bob', col3: 'Johnson', col4: '9012', col5: '1990-08-10', col6: '789 Pine St' }
    ];
    setPreviewData(mockPreview);
    toast({ title: "File Uploaded", description: `${file.name} has been successfully uploaded.` });
  };

  const validateMappings = () => {
    setValidationResults({ total_records: 1250, valid_records: 1180, invalid_records: 70, errors: [{ row: 25, field: 'ssn', error: 'Invalid SSN format' }], warnings: ['Missing phone numbers for 15% of records'] });
    setStep(3);
  };
  
  const processImport = async () => {
    setStep(4);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Import Complete", description: `Successfully imported ${validationResults.valid_records} accounts.` });
  };
  
  const resetUploader = () => {
    setStep(1); 
    setUploadedFile(null); 
    setSelectedPortfolio(''); 
    setIsNewPortfolio(false);
    setNewPortfolioName('');
    setFieldMappings({}); 
    setPreviewData([]); 
    setValidationResults(null);
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
            <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>File Column</TableHead><TableHead>Sample Data</TableHead><TableHead>Map to Field</TableHead></TableRow></TableHeader><TableBody>{Object.keys(previewData[0] || {}).map((col, i) => (<TableRow key={col}><TableCell>Column {i + 1}</TableCell><TableCell>{previewData[0][col]}</TableCell><TableCell><Select value={fieldMappings[col] || ''} onValueChange={v => setFieldMappings(p => ({ ...p, [col]: v }))}><SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger><SelectContent>{availableFields.map(f => <SelectItem key={f} value={f}>{f.replace(/_/g, ' ')}</SelectItem>)}</SelectContent></Select></TableCell></TableRow>))}</TableBody></Table></div>
            <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><div className="flex gap-2"><Button onClick={validateMappings} disabled={Object.keys(fieldMappings).length === 0}>Next: Validate Data</Button></div></div>
          </div>
        )}
        
        {step === 3 && validationResults && (
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Data Validation Results</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Card><CardContent className="p-4 text-center"><CheckCircle className="mx-auto text-green-500 w-8 h-8"/><p className="text-2xl font-bold">{validationResults.valid_records}</p><p>Valid Records</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><AlertTriangle className="mx-auto text-red-500 w-8 h-8"/><p className="text-2xl font-bold">{validationResults.invalid_records}</p><p>Invalid Records</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><FileText className="mx-auto w-8 h-8"/><p className="text-2xl font-bold">{validationResults.total_records}</p><p>Total Records</p></CardContent></Card>
                </div>
                {validationResults.errors.length > 0 && <Card><CardHeader><CardTitle className="text-red-600">Errors</CardTitle></CardHeader><CardContent>{validationResults.errors.map((e, i)=><p key={i}>Row {e.row}: {e.error}</p>)}</CardContent></Card>}
                <div className="flex justify-between"><Button variant="outline" onClick={()=>setStep(2)}>Back</Button><Button onClick={processImport}>Import Valid Records</Button></div>
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