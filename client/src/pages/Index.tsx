import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, DollarSign, Calendar, FileText, Plus, BarChart3, Calculator } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AddStockItemModal from '@/components/modals/AddStockItemModal';
import AddCustomerModal from '@/components/modals/AddCustomerModal';
import CreateInvoiceModal from '@/components/modals/CreateInvoiceModal';
import { dataStore } from '@/store/dataStore';
import { DashboardStats, StockAlert } from '@/types';

const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchases: 0,
    activeCustomers: 0,
    stockItems: 0,
    lowStockItems: 0,
    expiringItems: 0,
    monthlyGrowth: 0,
    gstCollected: { cgst: 0, sgst: 0, igst: 0 }
  });
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Get page info based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/reports/profit-loss':
        return { title: 'Profit & Loss Report', description: 'View comprehensive profit and loss statements', icon: BarChart3 };
      case '/reports/balance-sheet':
        return { title: 'Balance Sheet', description: 'Assets, liabilities and equity overview', icon: Calculator };
      case '/reports/stock-reports':
        return { title: 'Stock Reports', description: 'Inventory and stock movement analysis', icon: Package };
      case '/reports/party-reports':
        return { title: 'Party Reports', description: 'Customer and supplier transaction reports', icon: Users };
      default:
        return { title: 'Dashboard', description: 'Welcome back! Here\'s your business overview.', icon: TrendingUp };
    }
  };

  const refreshData = () => {
    setStats(dataStore.getDashboardStats());
    setAlerts(dataStore.generateStockAlerts());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sample data for charts when we have actual data
  const salesData = stats.totalSales > 0 ? [
    { month: 'Jan', sales: stats.totalSales * 0.8, purchases: stats.totalPurchases * 0.9 },
    { month: 'Feb', sales: stats.totalSales * 0.9, purchases: stats.totalPurchases * 0.8 },
    { month: 'Mar', sales: stats.totalSales, purchases: stats.totalPurchases },
  ] : [];

  const expiryData = alerts.length > 0 ? [
    { name: 'Expired', value: alerts.filter(a => a.type === 'expired').length, color: '#ef4444' },
    { name: 'Expiring Soon', value: alerts.filter(a => a.type === 'expiry_soon').length, color: '#f59e0b' },
    { name: 'Good', value: Math.max(0, stats.stockItems - stats.expiringItems), color: '#10b981' },
  ] : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const { title, description, icon: Icon } = getPageInfo();

  const renderReportsContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/reports/profit-loss':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">₹3,45,600</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900">₹2,15,400</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Gross Profit</p>
                <p className="text-2xl font-bold text-blue-900">₹1,30,200</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Net Profit</p>
                <p className="text-2xl font-bold text-purple-900">₹1,12,800</p>
              </div>
            </div>
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profit & Loss Statement</h3>
              <p className="text-gray-500 mb-6">Comprehensive income statement for the current period</p>
            </div>
          </div>
        );
      
      case '/reports/balance-sheet':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Assets</p>
                <p className="text-2xl font-bold text-blue-900">₹15,45,600</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Total Liabilities</p>
                <p className="text-2xl font-bold text-orange-900">₹8,75,400</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Equity</p>
                <p className="text-2xl font-bold text-green-900">₹6,70,200</p>
              </div>
            </div>
            <div className="text-center py-8">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Balance Sheet</h3>
              <p className="text-gray-500 mb-6">Financial position statement showing assets, liabilities and equity</p>
            </div>
          </div>
        );
      
      case '/reports/stock-reports':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-900">{stats.stockItems}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.lowStockItems}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Expiring</p>
                <p className="text-2xl font-bold text-red-900">{stats.expiringItems}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Stock Value</p>
                <p className="text-2xl font-bold text-green-900">₹{stats.totalPurchases.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Stock Analysis</h3>
              <p className="text-gray-500 mb-6">Detailed inventory reports and movement analysis</p>
            </div>
          </div>
        );
      
      case '/reports/party-reports':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900">{stats.activeCustomers}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Receivables</p>
                <p className="text-2xl font-bold text-green-900">₹45,600</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Payables</p>
                <p className="text-2xl font-bold text-yellow-900">₹32,400</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Net Position</p>
                <p className="text-2xl font-bold text-purple-900">₹13,200</p>
              </div>
            </div>
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Party Analysis</h3>
              <p className="text-gray-500 mb-6">Customer and supplier transaction reports</p>
            </div>
          </div>
        );
      
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => {
    return (
      <>
        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Active customer accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.stockItems}</div>
              <p className="text-xs text-muted-foreground">
                {stats.lowStockItems} low stock alerts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiringItems}</div>
              <p className="text-xs text-muted-foreground">
                Items expiring soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {salesData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales vs Purchases</CardTitle>
                <CardDescription>Monthly comparison of sales and purchase amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                    <Bar dataKey="purchases" fill="#82ca9d" name="Purchases" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {expiryData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Expiry Status</CardTitle>
                  <CardDescription>Distribution of items by expiry status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expiryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expiryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Stock Alerts */}
        {alerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'high' ? 'text-red-500' : 
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.drugName}</p>
                        <p className="text-sm text-gray-500">{alert.message}</p>
                      </div>
                    </div>
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used features for faster access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                onClick={() => setShowStockModal(true)}
              >
                <Package className="h-6 w-6 mb-2" />
                Add Stock Item
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                onClick={() => setShowInvoiceModal(true)}
              >
                <FileText className="h-6 w-6 mb-2" />
                Create Invoice
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                onClick={() => setShowCustomerModal(true)}
              >
                <Users className="h-6 w-6 mb-2" />
                Add Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GST Summary */}
        <Card>
          <CardHeader>
            <CardTitle>GST Summary - Current Month</CardTitle>
            <CardDescription>Tax collection and payment overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">CGST Collected</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.gstCollected.cgst.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">SGST Collected</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.gstCollected.sgst.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">IGST Collected</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.gstCollected.igst.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Net GST Payable</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{(stats.gstCollected.cgst + stats.gstCollected.sgst + stats.gstCollected.igst).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            {location.pathname.startsWith('/reports/') && (
              <Badge variant="outline" className="ml-2">
                REPORTS
              </Badge>
            )}
          </div>
          <p className="text-gray-600">{description}</p>
        </div>

        {location.pathname.startsWith('/reports/') ? (
          <Card>
            <CardContent className="p-6">
              {renderReportsContent()}
            </CardContent>
          </Card>
        ) : (
          renderDashboardContent()
        )}
      </div>

      {/* Modals */}
      <AddStockItemModal 
        open={showStockModal} 
        onOpenChange={setShowStockModal}
        onStockAdded={refreshData}
      />
      <AddCustomerModal 
        open={showCustomerModal} 
        onOpenChange={setShowCustomerModal}
        onCustomerAdded={refreshData}
      />
      <CreateInvoiceModal 
        open={showInvoiceModal} 
        onOpenChange={setShowInvoiceModal}
        onInvoiceCreated={refreshData}
      />
    </div>
  );
};

export default Dashboard;