
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

  // Empty data arrays
  const salesData: any[] = [];
  const expiryData: any[] = [];
  const stockAlerts: any[] = [];

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
              <div className="text-2xl font-bold text-gray-900">₹0</div>
              <p className="text-xs text-gray-500">No sales data yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹0</div>
              <p className="text-xs text-gray-500">No purchase data yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500">No customers added yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Items</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500">No stock items added yet</p>
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
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No sales or purchase data to display</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Expiry Analysis</CardTitle>
              <CardDescription>Distribution of stock by expiry timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No stock data to analyze</p>
                </div>
              </div>
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
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No stock alerts at the moment</p>
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
                  <p className="text-2xl font-bold text-green-600">₹0</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">SGST Collected</p>
                  <p className="text-2xl font-bold text-green-600">₹0</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">IGST Collected</p>
                  <p className="text-2xl font-bold text-green-600">₹0</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Net GST Payable</p>
                  <p className="text-2xl font-bold text-blue-600">₹0</p>
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
