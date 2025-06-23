import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Calculator } from 'lucide-react';

interface HSNCategorization {
  hsnCode: string;
  description: string;
  b2bValue: number;
  b2bQuantity: number;
  b2cValue: number;
  b2cQuantity: number;
}

interface HSNSummary {
  hsnCode: string;
  description: string;
  uom: string;
  totalQuantity: number;
  totalValue: number;
  taxableValue: number;
  integratedTax: number;
  centralTax: number;
  stateTax: number;
}

interface B2BSummary {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGstin: string;
  placeOfSupply: string;
  invoiceValue: number;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  hsnCode: string;
}

interface B2CSummary {
  placeOfSupply: string;
  taxRate: number;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
}

export default function GSTR1Dashboard() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [hsnCategorization, setHsnCategorization] = useState<HSNCategorization[]>([]);
  const [hsnSummary, setHsnSummary] = useState<HSNSummary[]>([]);
  const [b2bSummary, setB2bSummary] = useState<B2BSummary[]>([]);
  const [b2cSummary, setB2cSummary] = useState<B2CSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Set default dates to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setFromDate(firstDay.toISOString().split('T')[0]);
    setToDate(lastDay.toISOString().split('T')[0]);
  }, []);

  const fetchGSTRData = async () => {
    if (!fromDate || !toDate) return;
    
    setLoading(true);
    try {
      const [categorizationRes, summaryRes, b2bRes, b2cRes] = await Promise.all([
        fetch(`/api/gstr1/hsn-categorization?fromDate=${fromDate}&toDate=${toDate}`),
        fetch(`/api/gstr1/hsn-summary?fromDate=${fromDate}&toDate=${toDate}`),
        fetch(`/api/gstr1/b2b-summary?fromDate=${fromDate}&toDate=${toDate}`),
        fetch(`/api/gstr1/b2c-summary?fromDate=${fromDate}&toDate=${toDate}`)
      ]);

      const [categorization, summary, b2b, b2c] = await Promise.all([
        categorizationRes.json(),
        summaryRes.json(),
        b2bRes.json(),
        b2cRes.json()
      ]);

      setHsnCategorization(categorization);
      setHsnSummary(summary);
      setB2bSummary(b2b);
      setB2cSummary(b2c);
    } catch (error) {
      console.error('Error fetching GSTR-1 data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${fromDate}_to_${toDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GSTR-1 Dashboard</h1>
          <p className="text-muted-foreground">HSN categorization for B2B and B2C transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Report Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <Button onClick={fetchGSTRData} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Reports'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categorization" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categorization">HSN Categorization</TabsTrigger>
          <TabsTrigger value="hsn-summary">HSN Summary</TabsTrigger>
          <TabsTrigger value="b2b">B2B Summary</TabsTrigger>
          <TabsTrigger value="b2c">B2C Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="categorization">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>HSN Code Categorization (B2B vs B2C)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportToCSV(hsnCategorization, 'hsn_categorization')}
                  disabled={hsnCategorization.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">B2B Value</TableHead>
                      <TableHead className="text-right">B2B Qty</TableHead>
                      <TableHead className="text-right">B2C Value</TableHead>
                      <TableHead className="text-right">B2C Qty</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hsnCategorization.map((item) => (
                      <TableRow key={item.hsnCode}>
                        <TableCell className="font-medium">{item.hsnCode}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.b2bValue)}</TableCell>
                        <TableCell className="text-right">{item.b2bQuantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.b2cValue)}</TableCell>
                        <TableCell className="text-right">{item.b2cQuantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.b2bValue + item.b2cValue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hsn-summary">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>HSN Summary (Combined B2B + B2C)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportToCSV(hsnSummary, 'hsn_summary')}
                  disabled={hsnSummary.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>HSN Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Taxable Value</TableHead>
                      <TableHead className="text-right">IGST</TableHead>
                      <TableHead className="text-right">CGST</TableHead>
                      <TableHead className="text-right">SGST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hsnSummary.map((item) => (
                      <TableRow key={item.hsnCode}>
                        <TableCell className="font-medium">{item.hsnCode}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.uom}</TableCell>
                        <TableCell className="text-right">{item.totalQuantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.taxableValue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.integratedTax)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.centralTax)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.stateTax)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="b2b">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>B2B Summary</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportToCSV(b2bSummary, 'b2b_summary')}
                  disabled={b2bSummary.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>GSTIN</TableHead>
                      <TableHead>HSN Code</TableHead>
                      <TableHead className="text-right">Invoice Value</TableHead>
                      <TableHead className="text-right">Taxable Value</TableHead>
                      <TableHead className="text-right">IGST</TableHead>
                      <TableHead className="text-right">CGST</TableHead>
                      <TableHead className="text-right">SGST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {b2bSummary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.invoiceNumber}</TableCell>
                        <TableCell>{item.invoiceDate}</TableCell>
                        <TableCell>{item.customerName}</TableCell>
                        <TableCell>{item.customerGstin}</TableCell>
                        <TableCell>{item.hsnCode}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.invoiceValue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.taxableValue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.igstAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.cgstAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.sgstAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="b2c">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>B2C Summary</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportToCSV(b2cSummary, 'b2c_summary')}
                  disabled={b2cSummary.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Place of Supply</TableHead>
                      <TableHead className="text-right">Tax Rate (%)</TableHead>
                      <TableHead className="text-right">Taxable Value</TableHead>
                      <TableHead className="text-right">IGST</TableHead>
                      <TableHead className="text-right">CGST</TableHead>
                      <TableHead className="text-right">SGST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {b2cSummary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.placeOfSupply}</TableCell>
                        <TableCell className="text-right">{item.taxRate}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.taxableValue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.igstAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.cgstAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.sgstAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}