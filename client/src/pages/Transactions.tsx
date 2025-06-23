import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Search, Filter, Download, Calendar, DollarSign, Users, Package } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Transaction {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerType: string;
  customerGstin: string | null;
  subtotal: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalAmount: string;
  paymentStatus: string;
  createdAt: string;
}

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/sales-invoices'],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await fetch('/api/sales-invoices');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    }
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.paymentStatus === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.customerType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.totalAmount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const totalTax = filteredTransactions.reduce((sum, t) => {
    const cgst = parseFloat(t.cgst) || 0;
    const sgst = parseFloat(t.sgst) || 0;
    const igst = parseFloat(t.igst) || 0;
    return sum + cgst + sgst + igst;
  }, 0);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Paid', variant: 'default' as const },
      pending: { label: 'Pending', variant: 'secondary' as const },
      partial: { label: 'Partial', variant: 'outline' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      B2B: { label: 'B2B', variant: 'default' as const },
      B2C: { label: 'B2C', variant: 'secondary' as const },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.B2C;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="ml-64 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading transactions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="ml-64 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">View and manage imported transaction data</p>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                {transactions.length} total imported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Gross transaction value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalTax.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                CGST + SGST + IGST
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(transactions.map(t => t.customerName)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Distinct customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by invoice number or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="B2B">B2B</SelectItem>
                  <SelectItem value="B2C">B2C</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {transactions.length === 0 
                    ? "Import transaction data using the Data Import section to see records here."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Invoice No.</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Customer</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Tax</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{transaction.invoiceNumber}</td>
                        <td className="p-4">
                          {new Date(transaction.invoiceDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{transaction.customerName}</div>
                            {transaction.customerGstin && (
                              <div className="text-xs text-gray-500">{transaction.customerGstin}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {getTypeBadge(transaction.customerType)}
                        </td>
                        <td className="p-4">
                          <div className="text-right">
                            <div className="font-medium">₹{(parseFloat(transaction.totalAmount) || 0).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">₹{(parseFloat(transaction.subtotal) || 0).toFixed(2)} + tax</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-right text-sm">
                            {parseFloat(transaction.cgst) > 0 && <div>CGST: ₹{parseFloat(transaction.cgst).toFixed(2)}</div>}
                            {parseFloat(transaction.sgst) > 0 && <div>SGST: ₹{parseFloat(transaction.sgst).toFixed(2)}</div>}
                            {parseFloat(transaction.igst) > 0 && <div>IGST: ₹{parseFloat(transaction.igst).toFixed(2)}</div>}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(transaction.paymentStatus)}
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}