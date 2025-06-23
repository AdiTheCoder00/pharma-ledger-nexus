import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Search, Download, Eye, Edit, Trash2, FileText } from 'lucide-react';
import CreateInvoiceModal from '@/components/modals/CreateInvoiceModal';
import { dataStore } from '@/store/dataStore';
import { SalesInvoice } from '@/types';
import { toast } from "@/components/ui/sonner";

const SalesInvoicePage = () => {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<SalesInvoice[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadInvoices = () => {
    const invoiceList = dataStore.getSalesInvoices();
    setInvoices(invoiceList);
    setFilteredInvoices(invoiceList);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.paymentStatus === filterStatus);
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'partial': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTotalStats = () => {
    return {
      totalAmount: invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0),
      paidAmount: invoices.filter(inv => inv.paymentStatus === 'paid').reduce((sum, invoice) => sum + invoice.totalAmount, 0),
      pendingAmount: invoices.filter(inv => inv.paymentStatus === 'pending').reduce((sum, invoice) => sum + invoice.totalAmount, 0),
      totalInvoices: invoices.length,
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Sales Invoice
          </h1>
          <p className="text-gray-600">Create and manage sales invoices</p>
        </div>

        <AnimatedCard>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Management</CardTitle>
                <CardDescription>Create new invoices and track sales</CardDescription>
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by invoice number or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Invoices Table */}
            {filteredInvoices.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Details</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-600">ID: {invoice.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.customerName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{invoice.items.length} items</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">₹{invoice.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">
                              Tax: ₹{(invoice.cgst + invoice.sgst + invoice.igst).toFixed(2)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(invoice.paymentStatus)}>
                            {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {invoices.length === 0 ? 'No invoices created yet' : 'No invoices match your search'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {invoices.length === 0 
                    ? 'Create your first invoice to get started'
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {invoices.length === 0 && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
                  </Button>
                )}
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalInvoices}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-900">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Paid Amount</p>
                <p className="text-2xl font-bold text-yellow-900">₹{stats.paidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Pending Amount</p>
                <p className="text-2xl font-bold text-red-900">₹{stats.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <CreateInvoiceModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
        onInvoiceCreated={loadInvoices}
      />
    </div>
  );
};

export default SalesInvoicePage;