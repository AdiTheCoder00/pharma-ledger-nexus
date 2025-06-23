import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Download, Edit, Trash2, Phone, Mail, MapPin, FileText, CreditCard } from 'lucide-react';
import AddCustomerModal from '@/components/modals/AddCustomerModal';
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

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const customerList = await response.json();
      setCustomers(customerList);
      setFilteredCustomers(customerList);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const handleCustomerAdded = (customer: Customer) => {
    loadCustomers();
    setShowAddModal(false);
  };

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

  const renderPartiesContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/parties/customers':
        return renderCustomersContent();
      
      case '/parties/suppliers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Suppliers</p>
                <p className="text-2xl font-bold text-blue-900">28</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">25</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-900">₹45,600</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">This Month</p>
                <p className="text-2xl font-bold text-purple-900">₹1,25,400</p>
              </div>
            </div>
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Supplier Management</h3>
              <p className="text-gray-500 mb-6">Manage supplier relationships and purchase history</p>
            </div>
          </div>
        );
      
      case '/parties/drug-licenses':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Valid Licenses</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-900">2</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Expired</p>
                <p className="text-2xl font-bold text-red-900">0</p>
              </div>
            </div>
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Drug License Management</h3>
              <p className="text-gray-500 mb-6">Track and manage pharmaceutical licenses and compliance</p>
            </div>
          </div>
        );
      
      case '/parties/credit-limits':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Credit</p>
                <p className="text-2xl font-bold text-blue-900">₹5,45,000</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Available</p>
                <p className="text-2xl font-bold text-green-900">₹3,78,500</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Utilized</p>
                <p className="text-2xl font-bold text-yellow-900">₹1,66,500</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900">₹12,300</p>
              </div>
            </div>
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Credit Limit Management</h3>
              <p className="text-gray-500 mb-6">Monitor customer credit limits and outstanding amounts</p>
            </div>
          </div>
        );
      
      default:
        return renderCustomersContent();
    }
  };

  const renderCustomersContent = () => {
    return (
      <>
        {/* Customer Management Content */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const { status, color } = getCreditStatus(customer);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{customer.gstNumber || 'N/A'}</TableCell>
                      <TableCell>₹{customer.creditLimit.toLocaleString()}</TableCell>
                      <TableCell>₹{customer.outstandingAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={color}>{status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first customer</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Customer
            </Button>
          </div>
        )}
      </>
    );
  };

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

        {/* Summary Stats for Customers page only */}
        {location.pathname === '/parties/customers' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Customers</p>
              <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">{customers.filter(c => c.outstandingAmount <= c.creditLimit).length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Total Credit</p>
              <p className="text-2xl font-bold text-yellow-900">₹{customers.reduce((sum, c) => sum + c.creditLimit, 0).toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-900">₹{customers.reduce((sum, c) => sum + c.outstandingAmount, 0).toLocaleString()}</p>
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
              {location.pathname === '/parties/customers' && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {renderPartiesContent()}
          </CardContent>
        </Card>
      </div>

      {location.pathname === '/parties/customers' && (
        <AddCustomerModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal}
          onCustomerAdded={handleCustomerAdded}
        />
      )}
    </div>
  );
};

export default Customers;