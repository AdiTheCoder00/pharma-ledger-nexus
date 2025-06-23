import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, Users, Package, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface ImportResult {
  success: number;
  errors: string[];
}

export default function DataImport() {
  const [csvData, setCsvData] = useState('');
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('customers');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvData(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const downloadTemplate = async (type: string) => {
    try {
      const response = await fetch(`/api/import/template/${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_template.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const importData = async (type: string) => {
    if (!csvData.trim()) {
      alert('Please upload a CSV file first');
      return;
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      const response = await fetch(`/api/import/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData }),
      });

      const result = await response.json();
      setImportResults(result);
    } catch (error) {
      console.error('Import error:', error);
      setImportResults({ success: 0, errors: ['Import failed due to network error'] });
    } finally {
      setIsImporting(false);
    }
  };

  const ImportSection = ({ 
    type, 
    title, 
    description, 
    icon: Icon,
    templateFields 
  }: { 
    type: string; 
    title: string; 
    description: string; 
    icon: any;
    templateFields: string[];
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Expected CSV Fields:</Label>
          <div className="flex flex-wrap gap-1">
            {templateFields.map((field) => (
              <Badge key={field} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadTemplate(type)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button
            onClick={() => importData(type)}
            disabled={isImporting || !csvData}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isImporting ? 'Importing...' : `Import ${title}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="ml-64 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Import</h1>
            <p className="text-muted-foreground">Import data from Busy Accounting or other systems</p>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <p className="text-sm text-gray-600">
              Select a CSV file exported from Busy Accounting or other accounting software
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="csvFile">CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              {csvData && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    CSV file loaded successfully. {csvData.split('\n').length - 1} rows detected.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="stock">Stock Items</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <ImportSection
              type="customers"
              title="Customers"
              description="Import customer master data from Busy Accounting"
              icon={Users}
              templateFields={[
                'customer_name', 'phone', 'email', 'address', 
                'gst_number', 'credit_limit', 'opening_balance'
              ]}
            />
          </TabsContent>

          <TabsContent value="stock">
            <ImportSection
              type="stock"
              title="Stock Items"
              description="Import product/stock master data"
              icon={Package}
              templateFields={[
                'item_name', 'manufacturer', 'category', 'batch_number',
                'expiry_date', 'quantity', 'mrp', 'purchase_rate', 'hsn_code'
              ]}
            />
          </TabsContent>

          <TabsContent value="invoices">
            <ImportSection
              type="invoices"
              title="Sales Invoices"
              description="Import sales transaction data"
              icon={Receipt}
              templateFields={[
                'invoice_number', 'invoice_date', 'customer_name', 'item_name',
                'quantity', 'rate', 'gst_rate', 'taxable_amount', 'total_amount'
              ]}
            />
          </TabsContent>
        </Tabs>

        {importResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {importResults.errors.length === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Successfully Imported</p>
                  <p className="text-2xl font-bold text-green-900">{importResults.success}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Errors</p>
                  <p className="text-2xl font-bold text-red-900">{importResults.errors.length}</p>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div className="space-y-2">
                  <Label>Error Details:</Label>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-40 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">{error}</p>
                    ))}
                  </div>
                </div>
              )}

              {importResults.success > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Import completed successfully! You can now use the imported data in your GSTR-1 reports.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Import Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Busy Accounting Export Steps:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Open Busy Accounting software</li>
                  <li>Go to Reports &gt; Export Data</li>
                  <li>Select the required master/transaction</li>
                  <li>Choose CSV format and export</li>
                  <li>Upload the CSV file here</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Mapping:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customer GST numbers determine B2B/B2C classification</li>
                  <li>• HSN codes are mapped to pharmaceutical standards</li>
                  <li>• Invoice data creates GSTR-1 ready transactions</li>
                  <li>• Duplicate entries are automatically skipped</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}