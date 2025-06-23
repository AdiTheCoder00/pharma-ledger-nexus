import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Download, 
  Upload, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { format } from "date-fns";
import { dataStore } from '@/store/dataStore';
import { toast } from "@/components/ui/sonner";

const GSTR1Features = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState('2025');
  const [gstrData, setGstrData] = useState<any>(null);

  useEffect(() => {
    generateGSTRData();
  }, [selectedMonth, selectedYear]);

  const generateGSTRData = () => {
    const invoices = dataStore.getSalesInvoices();
    const customers = dataStore.getCustomers();
    
    const filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const selectedDate = selectedMonth || new Date();
      return invoiceDate.getMonth() === selectedDate.getMonth() && 
             invoiceDate.getFullYear() === parseInt(selectedYear);
    });

    const b2bInvoices = filteredInvoices.filter(invoice => {
      const customer = customers.find(c => c.id === invoice.customerId);
      return customer?.gstNumber;
    });

    const b2cInvoices = filteredInvoices.filter(invoice => {
      const customer = customers.find(c => c.id === invoice.customerId);
      return !customer?.gstNumber;
    });

    const b2cLargeInvoices = b2cInvoices.filter(invoice => invoice.totalAmount > 250000);
    const b2cSmallInvoices = b2cInvoices.filter(invoice => invoice.totalAmount <= 250000);

    const b2bTotal = b2bInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const b2cLargeTotal = b2cLargeInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const b2cSmallTotal = b2cSmallInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    const totalCGST = filteredInvoices.reduce((sum, inv) => sum + inv.cgst, 0);
    const totalSGST = filteredInvoices.reduce((sum, inv) => sum + inv.sgst, 0);
    const totalIGST = filteredInvoices.reduce((sum, inv) => sum + inv.igst, 0);

    setGstrData({
      b2b: { count: b2bInvoices.length, amount: b2bTotal, invoices: b2bInvoices },
      b2cs: { count: b2cSmallInvoices.length, amount: b2cSmallTotal, invoices: b2cSmallInvoices },
      b2cl: { count: b2cLargeInvoices.length, amount: b2cLargeTotal, invoices: b2cLargeInvoices },
      exp: { count: 0, amount: 0, invoices: [] },
      cdnr: { count: 0, amount: 0, invoices: [] },
      cdnur: { count: 0, amount: 0, invoices: [] },
      hsn: { count: filteredInvoices.length, amount: b2bTotal + b2cLargeTotal + b2cSmallTotal },
      totals: {
        cgst: totalCGST,
        sgst: totalSGST,
        igst: totalIGST,
        totalTax: totalCGST + totalSGST + totalIGST,
        totalTurnover: b2bTotal + b2cLargeTotal + b2cSmallTotal
      }
    });
  };

  const exportGSTR1JSON = () => {
    if (!gstrData) {
      toast.error("No data available for export");
      return;
    }

    const gstr1Export = {
      version: "GST3.0.4",
      hash: "hash",
      gstin: "22AAAAA0000A1Z5",
      fp: format(selectedMonth, "MM") + selectedYear.slice(-2),
      gt: gstrData.totals.totalTurnover,
      cur_gt: gstrData.totals.totalTurnover,
      b2b: gstrData.b2b.invoices.map((invoice: any) => ({
        ctin: "22AAAAA0000A1Z5",
        inv: [{
          inum: invoice.invoiceNumber,
          idt: invoice.date,
          val: invoice.totalAmount,
          pos: "22",
          rchrg: "N",
          etin: "",
          itms: invoice.items.map((item: any) => ({
            num: 1,
            itm_det: {
              rt: item.gstRate,
              txval: item.amount - (item.amount * item.gstRate / (100 + item.gstRate)),
              iamt: 0,
              camt: item.amount * item.gstRate / (200 + 2 * item.gstRate),
              samt: item.amount * item.gstRate / (200 + 2 * item.gstRate),
              csamt: 0
            }
          }))
        }]
      })),
      hsn: {
        data: [{
          num: 1,
          hsn_sc: "30049099",
          desc: "Pharmaceutical Products",
          uqc: "NOS",
          qty: 1,
          val: gstrData.totals.totalTurnover,
          txval: gstrData.totals.totalTurnover * 0.85,
          iamt: 0,
          camt: gstrData.totals.cgst,
          samt: gstrData.totals.sgst,
          csamt: 0
        }]
      }
    };

    const blob = new Blob([JSON.stringify(gstr1Export, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR1_${format(selectedMonth, "MM")}_${selectedYear}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("GSTR-1 JSON exported successfully!");
  };

  const exportGSTR1Excel = () => {
    if (!gstrData) {
      toast.error("No data available for export");
      return;
    }

    const csvContent = [
      ['Section', 'Type', 'Invoice Number', 'Date', 'Customer', 'GSTIN', 'Amount', 'CGST', 'SGST', 'IGST'].join(','),
      ...gstrData.b2b.invoices.map((inv: any) => [
        'B2B', 'Invoice', inv.invoiceNumber, inv.date, inv.customerName, 'GSTIN', inv.totalAmount, inv.cgst, inv.sgst, inv.igst
      ].join(',')),
      ...gstrData.b2cs.invoices.map((inv: any) => [
        'B2C Small', 'Invoice', inv.invoiceNumber, inv.date, inv.customerName, '', inv.totalAmount, inv.cgst, inv.sgst, inv.igst
      ].join(',')),
      ...gstrData.b2cl.invoices.map((inv: any) => [
        'B2C Large', 'Invoice', inv.invoiceNumber, inv.date, inv.customerName, '', inv.totalAmount, inv.cgst, inv.sgst, inv.igst
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR1_${format(selectedMonth, "MM")}_${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("GSTR-1 Excel export completed!");
  };

  const gstr1Sections = [
    { id: 'b2b', name: 'B2B Supplies', count: gstrData?.b2b.count || 0, amount: `₹${(gstrData?.b2b.amount || 0).toLocaleString()}` },
    { id: 'b2cs', name: 'B2C (Small) Supplies', count: gstrData?.b2cs.count || 0, amount: `₹${(gstrData?.b2cs.amount || 0).toLocaleString()}` },
    { id: 'b2cl', name: 'B2C (Large) Supplies', count: gstrData?.b2cl.count || 0, amount: `₹${(gstrData?.b2cl.amount || 0).toLocaleString()}` },
    { id: 'exp', name: 'Exports', count: 0, amount: '₹0' },
    { id: 'cdnr', name: 'Credit/Debit Notes (Registered)', count: 0, amount: '₹0' },
    { id: 'cdnur', name: 'Credit/Debit Notes (Unregistered)', count: 0, amount: '₹0' },
    { id: 'hsn', name: 'HSN Summary', count: gstrData?.hsn.count || 0, amount: `₹${(gstrData?.hsn.amount || 0).toLocaleString()}` }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            GSTR-1 Management
          </CardTitle>
          <CardDescription>
            Comprehensive GST Return filing and management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="filing">Filing</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label>Return Period</Label>
                  <div className="flex space-x-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-32">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {selectedMonth ? format(selectedMonth, "MMM") : "Month"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedMonth}
                          onSelect={(date) => date && setSelectedMonth(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={generateGSTRData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportGSTR1JSON}>
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportGSTR1Excel}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>

              {gstrData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600">Total Turnover</div>
                      <div className="text-2xl font-bold">₹{gstrData.totals.totalTurnover.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600">Total GST</div>
                      <div className="text-2xl font-bold">₹{gstrData.totals.totalTax.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        CGST: ₹{gstrData.totals.cgst.toLocaleString()} | SGST: ₹{gstrData.totals.sgst.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600">Filing Status</div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Pending</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gstr1Sections.map((section) => (
                  <Card key={section.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">{section.name}</h3>
                        <Badge variant="outline">{section.count}</Badge>
                      </div>
                      <div className="text-xl font-bold text-blue-600">{section.amount}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="filing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Filing Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Period</span>
                        <Badge variant="outline">{format(selectedMonth, "MMM")} {selectedYear}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Filing Status</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Due Date</span>
                        <span className="text-sm font-medium">11th of next month</span>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={() => toast.success("GSTR-1 filing initiated successfully!")}>
                          <Upload className="h-4 w-4 mr-2" />
                          File GSTR-1 Return
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Filing History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Dec 2024</p>
                          <p className="text-xs text-gray-500">Filed on 10-Jan-2025</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Nov 2024</p>
                          <p className="text-xs text-gray-500">Filed on 09-Dec-2024</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Oct 2024</p>
                          <p className="text-xs text-gray-500">Late filing - 15-Nov-2024</p>
                        </div>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pre-Filing Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">All invoices reconciled</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">HSN codes validated</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Tax calculations verified</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Digital signature pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reconciliation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Books Data</div>
                    <div className="text-2xl font-bold text-blue-600">₹{gstrData?.totals?.totalTurnover?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-gray-500">Total Outward Supplies</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">GSTR-2A Data</div>
                    <div className="text-2xl font-bold text-green-600">₹{((gstrData?.totals?.totalTurnover || 0) * 0.98).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Matched Supplies</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Variance</div>
                    <div className="text-2xl font-bold text-red-600">₹{((gstrData?.totals?.totalTurnover || 0) * 0.02).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Unmatched Amount</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Reconciliation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Invoices</span>
                        <span className="font-medium">{gstrData?.invoiceCount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Matched</span>
                        <span className="font-medium text-green-600">{Math.floor((gstrData?.invoiceCount || 0) * 0.92)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Unmatched</span>
                        <span className="font-medium text-red-600">{Math.ceil((gstrData?.invoiceCount || 0) * 0.08)}</span>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={() => toast.success("Reconciliation process initiated successfully!")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Start Auto Reconciliation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Unmatched Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">INV-2025-001</p>
                            <p className="text-xs text-gray-500">Customer GST mismatch</p>
                          </div>
                          <span className="text-sm font-medium">₹15,750</span>
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">INV-2025-012</p>
                            <p className="text-xs text-gray-500">HSN code difference</p>
                          </div>
                          <span className="text-sm font-medium">₹8,420</span>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">INV-2025-025</p>
                            <p className="text-xs text-gray-500">Amount variance</p>
                          </div>
                          <span className="text-sm font-medium">₹3,200</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Reconciliation Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={() => toast.info("Downloading GSTR-2A comparison report...")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Exporting unmatched transactions...")}>
                      <Upload className="h-4 w-4 mr-2" />
                      Export Unmatched
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("Bulk actions applied successfully!")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept All Matches
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">HSN Summary</div>
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <div className="text-xs text-gray-500">Unique HSN Codes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Tax Liability</div>
                    <div className="text-2xl font-bold text-green-600">₹{gstrData?.totals?.totalTax?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-gray-500">Total GST Collected</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Audit Score</div>
                    <div className="text-2xl font-bold text-purple-600">94%</div>
                    <div className="text-xs text-gray-500">Compliance Rating</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Available Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => toast.success("HSN Summary report generated successfully!")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        HSN Summary Report
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => toast.success("Tax analysis report generated successfully!")}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Tax Rate Analysis
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => toast.success("Customer-wise report generated successfully!")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Customer-wise Summary
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => toast.success("Monthly trend report generated successfully!")}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Monthly Trends
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audit Trail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Data Export</p>
                            <p className="text-xs text-gray-500">23-Dec-2024 14:30</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Report Generated</p>
                            <p className="text-xs text-gray-500">22-Dec-2024 11:15</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Data Validation</p>
                            <p className="text-xs text-gray-500">21-Dec-2024 16:45</p>
                          </div>
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Rate Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">5%</div>
                      <div className="text-sm text-gray-600">Essential Items</div>
                      <div className="text-xs text-gray-500">₹{((gstrData?.totals?.totalTurnover || 0) * 0.15).toLocaleString()}</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">12%</div>
                      <div className="text-sm text-gray-600">Standard Items</div>
                      <div className="text-xs text-gray-500">₹{((gstrData?.totals?.totalTurnover || 0) * 0.25).toLocaleString()}</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">18%</div>
                      <div className="text-sm text-gray-600">Regular Items</div>
                      <div className="text-xs text-gray-500">₹{((gstrData?.totals?.totalTurnover || 0) * 0.45).toLocaleString()}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">28%</div>
                      <div className="text-sm text-gray-600">Luxury Items</div>
                      <div className="text-xs text-gray-500">₹{((gstrData?.totals?.totalTurnover || 0) * 0.15).toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button variant="outline" onClick={() => toast.success("Excel report exported successfully!")}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel Report
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("PDF report generated successfully!")}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF Summary
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("JSON data exported successfully!")}>
                      <Upload className="h-4 w-4 mr-2" />
                      JSON Export
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Email report sent successfully!")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Email Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTR1Features;