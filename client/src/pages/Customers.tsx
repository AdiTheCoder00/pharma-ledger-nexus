import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Download, Edit, Trash2, Phone, Mail, MapPin, FileText, CreditCard } from 'lucide-react';
import AddCustomerModal from '@/components/modals/AddCustomerModal';
import { dataStore } from '@/store/dataStore';
import { Customer } from '@/types';
import { toast } from "@/components/ui/sonner";

const Customers = () => {
  const location = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get page info based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/parties/customers':
        return { title: 'Customers', description: 'Manage customer information and profiles', icon: Users };
      case '/parties/suppliers':
        return { title: 'Suppliers', description: 'Manage supplier information and contacts', icon: Users };
      case '/parties/drug-licenses':
        return { title: 'Drug Licenses', description: 'Track drug licenses and regulatory compliance', icon: FileText };
      case '/parties/credit-limits':
        return { title: 'Credit Limits', description: 'Manage customer credit limits and terms', icon: CreditCard };
      default:
        return { title: 'Customers', description: 'Manage customer information and profiles', icon: Users };
    }
  };

  const loadCustomers = () => {
    const customerList = dataStore.getCustomers();
    setCustomers(customerList);
    setFilteredCustomers(customerList);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchTerm]);

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dataStore.deleteCustomer(id);
      loadCustomers();
      toast.success("Customer deleted successfully!");
    }
  };

  const getCreditStatus = (customer: Customer) => {
    if (customer.outstandingAmount > customer.creditLimit) {
      return { status: 'Over Limit', color: 'destructive' as const };
    } else if (customer.outstandingAmount > customer.creditLimit * 0.8) {
      return { status: 'Near Limit', color: 'secondary' as const };
    } else {
      return { status: 'Good', color: 'default' as const };
    }
  };

  const { title, description, icon: Icon } = getPageInfo();

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
          <p className="text-gray-600">Manage your customer database</p>
        </div>

        <AnimatedCard>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Add and manage your customers with credit tracking</CardDescription>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Customers Table */}
            {filteredCustomers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Details</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Credit Info</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => {
                      const creditStatus = getCreditStatus(customer);
                      return (
                        <TableRow key={customer.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              {customer.gstNumber && (
                                <p className="text-sm text-gray-600">GST: {customer.gstNumber}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Added: {new Date(customer.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1" />
                                {customer.phone}
                              </div>
                              {customer.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {customer.email}
                                </div>
                              )}
                              <div className="flex items-start text-sm text-gray-600">
                                <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                                <span className="line-clamp-2">{customer.address}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">₹{customer.creditLimit.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Credit Limit</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">₹{customer.outstandingAmount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Outstanding</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={creditStatus.color}>
                              {creditStatus.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {customers.length === 0 ? 'No customers added yet' : 'No customers match your search'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {customers.length === 0 
                    ? 'Get started by adding your first customer'
                    : 'Try adjusting your search criteria'
                  }
                </p>
                {customers.length === 0 && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Customer
                  </Button>
                )}
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Credit Limit</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{customers.reduce((sum, customer) => sum + customer.creditLimit, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Outstanding Amount</p>
                <p className="text-2xl font-bold text-yellow-900">
                  ₹{customers.reduce((sum, customer) => sum + customer.outstandingAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Over Limit</p>
                <p className="text-2xl font-bold text-red-900">
                  {customers.filter(customer => customer.outstandingAmount > customer.creditLimit).length}
                </p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <AddCustomerModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onCustomerAdded={loadCustomers}
      />
    </div>
  );
};

export default Customers;