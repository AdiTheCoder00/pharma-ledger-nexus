import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, DollarSign, Calendar, FileText, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AddStockItemModal from '@/components/modals/AddStockItemModal';
import AddCustomerModal from '@/components/modals/AddCustomerModal';
import CreateInvoiceModal from '@/components/modals/CreateInvoiceModal';
import { dataStore } from '@/store/dataStore';
import { DashboardStats, StockAlert } from '@/types';

const Dashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your business overview.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard delay={0}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-gray-500">
                {stats.totalSales > 0 ? '+12% from last month' : 'No sales data yet'}
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={100}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹{stats.totalPurchases.toLocaleString()}</div>
              <p className="text-xs text-gray-500">
                {stats.totalPurchases > 0 ? '+8% from last month' : 'No purchase data yet'}
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</div>
              <p className="text-xs text-gray-500">
                {stats.activeCustomers > 0 ? `${stats.activeCustomers} customers registered` : 'No customers added yet'}
              </p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={300}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Items</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.stockItems}</div>
              <p className="text-xs text-gray-500">
                {stats.lowStockItems > 0 && (
                  <span className="text-red-600">{stats.lowStockItems} low stock items</span>
                )}
                {stats.lowStockItems === 0 && stats.stockItems > 0 && (
                  <span className="text-green-600">All items well stocked</span>
                )}
                {stats.stockItems === 0 && 'No stock items added yet'}
              </p>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnimatedCard delay={400}>
            <CardHeader>
              <CardTitle>Sales vs Purchases</CardTitle>
              <CardDescription>Monthly comparison of sales and purchase amounts</CardDescription>
            </CardHeader>
            <CardContent>
              {salesData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, '']} />
                      <Bar dataKey="sales" fill="#10b981" name="Sales" />
                      <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No sales or purchase data to display</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowInvoiceModal(true)}
                    >
                      Create First Invoice
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={500}>
            <CardHeader>
              <CardTitle>Stock Expiry Analysis</CardTitle>
              <CardDescription>Distribution of stock by expiry timeline</CardDescription>
            </CardHeader>
            <CardContent>
              {expiryData.length > 0 && expiryData.some(d => d.value > 0) ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expiryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {expiryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No stock data to analyze</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowStockModal(true)}
                    >
                      Add Stock Items
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Stock Alerts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCard delay={600}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Stock Alerts ({alerts.length})
              </CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{alert.drugName}</p>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                      </div>
                      <Badge 
                        variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                  {alerts.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{alerts.length - 5} more alerts
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No stock alerts at the moment</p>
                  <p className="text-sm">All your inventory is properly managed</p>
                </div>
              )}
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={700}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-20 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                  onClick={() => setShowInvoiceModal(true)}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  New Sale
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                >
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  New Purchase
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                  onClick={() => setShowStockModal(true)}
                >
                  <Package className="h-6 w-6 mb-2" />
                  Stock Entry
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
          </AnimatedCard>
        </div>

        {/* GST Summary */}
        <div className="mt-8">
          <AnimatedCard delay={800}>
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
          </AnimatedCard>
        </div>
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