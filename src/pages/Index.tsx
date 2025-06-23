
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, DollarSign, Calendar, FileText } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 45000, purchases: 35000 },
    { name: 'Feb', sales: 52000, purchases: 38000 },
    { name: 'Mar', sales: 48000, purchases: 42000 },
    { name: 'Apr', sales: 61000, purchases: 45000 },
    { name: 'May', sales: 55000, purchases: 40000 },
    { name: 'Jun', sales: 67000, purchases: 48000 },
  ];

  const expiryData = [
    { name: 'This Month', value: 15, color: '#ef4444' },
    { name: 'Next Month', value: 28, color: '#f97316' },
    { name: 'Next 3 Months', value: 45, color: '#eab308' },
    { name: 'Safe Stock', value: 312, color: '#22c55e' },
  ];

  const stockAlerts = [
    { drug: 'Paracetamol 500mg', batch: 'PCM2024A', expiry: '2024-08-15', quantity: 150, level: 'critical' },
    { drug: 'Amoxicillin 250mg', batch: 'AMX2024B', expiry: '2024-09-10', quantity: 75, level: 'warning' },
    { drug: 'Crocin Advance', batch: 'CRC2024C', expiry: '2024-07-28', quantity: 200, level: 'critical' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your business overview.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹3,28,000</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹2,48,000</div>
              <p className="text-xs text-blue-600">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <p className="text-xs text-purple-600">+5 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Items</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2,156</div>
              <p className="text-xs text-red-600 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                43 expiring soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
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
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                  <Bar dataKey="purchases" fill="#ef4444" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Expiry Analysis</CardTitle>
              <CardDescription>Distribution of stock by expiry timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
            </CardContent>
          </Card>
        </div>

        {/* Stock Alerts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Stock Alerts
              </CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockAlerts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.drug}</p>
                      <p className="text-sm text-gray-600">Batch: {item.batch}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.level === 'critical' ? 'destructive' : 'secondary'}>
                        {item.level === 'critical' ? 'Critical' : 'Warning'}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{item.expiry}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  New Sale
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  New Purchase
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Package className="h-6 w-6 mb-2" />
                  Stock Entry
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  Add Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GST Summary */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>GST Summary - Current Month</CardTitle>
              <CardDescription>Tax collection and payment overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">CGST Collected</p>
                  <p className="text-2xl font-bold text-green-600">₹15,240</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">SGST Collected</p>
                  <p className="text-2xl font-bold text-green-600">₹15,240</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">IGST Collected</p>
                  <p className="text-2xl font-bold text-green-600">₹8,960</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Net GST Payable</p>
                  <p className="text-2xl font-bold text-blue-600">₹28,640</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
