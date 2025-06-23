
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { format } from "date-fns";

const GSTR1Features = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const gstr1Sections = [
    { id: 'b2b', name: 'B2B Supplies', count: 0, amount: '₹0' },
    { id: 'b2cs', name: 'B2C (Small) Supplies', count: 0, amount: '₹0' },
    { id: 'b2cl', name: 'B2C (Large) Supplies', count: 0, amount: '₹0' },
    { id: 'exp', name: 'Exports', count: 0, amount: '₹0' },
    { id: 'cdnr', name: 'Credit/Debit Notes (Registered)', count: 0, amount: '₹0' },
    { id: 'cdnur', name: 'Credit/Debit Notes (Unregistered)', count: 0, amount: '₹0' },
    { id: 'hsn', name: 'HSN Summary', count: 0, amount: '₹0' }
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
              {/* Period Selection */}
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
                          onSelect={setSelectedMonth}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
                </div>
              </div>

              {/* GSTR1 Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gstr1Sections.map((section) => (
                  <Card key={section.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{section.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold">{section.count}</p>
                          <p className="text-sm text-gray-600">Invoices</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{section.amount}</p>
                          <p className="text-sm text-gray-600">Amount</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Return Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Taxable Value</p>
                      <p className="text-2xl font-bold">₹0</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total CGST</p>
                      <p className="text-2xl font-bold text-blue-600">₹0</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total SGST</p>
                      <p className="text-2xl font-bold text-blue-600">₹0</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total IGST</p>
                      <p className="text-2xl font-bold text-blue-600">₹0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="filing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Filing Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span>Not Filed</span>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      File GSTR-1
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download JSON
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reconciliation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Reconciliation</CardTitle>
                  <CardDescription>
                    Compare your books with GSTR-2A and identify mismatches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No reconciliation data</p>
                    <p className="text-sm">Upload GSTR-2A data to start reconciliation</p>
                    <Button className="mt-4">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload GSTR-2A
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="b2b">B2B Only</SelectItem>
                    <SelectItem value="b2c">B2C Only</SelectItem>
                    <SelectItem value="exports">Exports Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No transaction data</p>
                    <p className="text-sm">Add sales invoices to generate detailed reports</p>
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
