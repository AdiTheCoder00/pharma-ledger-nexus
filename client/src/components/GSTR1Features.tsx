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
  const [selectedYear, setSelectedYear] = useState('2024');
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
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">GST Filing</h3>
                <p className="text-gray-500 mb-6">File your GSTR-1 returns directly to the GST portal</p>
                <Button disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  File GSTR-1 (Coming Soon)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reconciliation" className="space-y-6">
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">GST Reconciliation</h3>
                <p className="text-gray-500 mb-6">Compare your books with GSTR-2A data</p>
                <Button disabled>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Start Reconciliation (Coming Soon)
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">GST Reports</h3>
                <p className="text-gray-500 mb-6">Generate detailed GST reports and analytics</p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" disabled>
                    HSN Summary
                  </Button>
                  <Button variant="outline" disabled>
                    Tax Analysis
                  </Button>
                  <Button variant="outline" disabled>
                    Audit Trail
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTR1Features;