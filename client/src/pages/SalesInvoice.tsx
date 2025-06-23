import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Search, Download, Eye, Edit, Trash2, FileText, Package2, TruckIcon, Calculator } from 'lucide-react';
import CreateInvoiceModal from '@/components/modals/CreateInvoiceModal';
import { dataStore } from '@/store/dataStore';
import { SalesInvoice } from '@/types';
import { toast } from "@/components/ui/sonner";

const SalesInvoicePage = () => {
  const location = useLocation();
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<SalesInvoice[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get page info based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/sales/invoice':
        return { 
          title: 'Sales Invoice', 
          description: 'Create and manage sales invoices', 
          icon: ShoppingCart,
          content: 'invoice'
        };
      case '/sales/sales-return':
        return { 
          title: 'Sales Return', 
          description: 'Process customer returns and refunds', 
          icon: FileText,
          content: 'return'
        };
      case '/sales/delivery-notes':
        return { 
          title: 'Delivery Notes', 
          description: 'Track delivery confirmations and receipts', 
          icon: TruckIcon,
          content: 'delivery'
        };
      case '/sales/quotations':
        return { 
          title: 'Quotations', 
          description: 'Create and manage price quotations', 
          icon: FileText,
          content: 'quotation'
        };
      case '/purchase/purchase-order':
        return { 
          title: 'Purchase Order', 
          description: 'Create and manage purchase orders', 
          icon: ShoppingCart,
          content: 'purchase-order'
        };
      case '/purchase/purchase-invoice':
        return { 
          title: 'Purchase Invoice', 
          description: 'Process supplier invoices and payments', 
          icon: FileText,
          content: 'purchase-invoice'
        };
      case '/purchase/purchase-return':
        return { 
          title: 'Purchase Return', 
          description: 'Return items to suppliers', 
          icon: Package2,
          content: 'purchase-return'
        };
      case '/purchase/goods-receipt':
        return { 
          title: 'Goods Receipt', 
          description: 'Record received inventory from suppliers', 
          icon: TruckIcon,
          content: 'goods-receipt'
        };
      default:
        return { 
          title: 'Sales Invoice', 
          description: 'Create and manage sales invoices', 
          icon: ShoppingCart,
          content: 'invoice'
        };
    }
  };

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

  const renderContent = (contentType: string) => {
    switch (contentType) {
      case 'invoice':
        return (
          <>
            {/* Invoice Management Content */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Invoices Table */}
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(invoice.paymentStatus)}>
                            {invoice.paymentStatus.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first invoice</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Invoice
                </Button>
              </div>
            )}
          </>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-500 mb-6">This feature is under development and will be available soon</p>
            <Button disabled variant="outline">
              Coming Soon
            </Button>
          </div>
        );
    }
  };

  const stats = getTotalStats();
  const { title, description, icon: Icon, content } = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Icon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <Badge variant="outline" className="ml-2">
              {location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Summary Stats for Invoice page */}
        {content === 'invoice' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Invoices</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalInvoices}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Total Amount</p>
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
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{title} Management</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              {content === 'invoice' && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {renderContent(content)}
          </CardContent>
        </Card>
      </div>

      {content === 'invoice' && (
        <CreateInvoiceModal 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal}
          onInvoiceCreated={loadInvoices}
        />
      )}
    </div>
  );
};

export default SalesInvoicePage;