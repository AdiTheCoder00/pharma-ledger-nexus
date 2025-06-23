import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, Filter, Download, Edit, Trash2, AlertTriangle } from 'lucide-react';
import AddStockItemModal from '@/components/modals/AddStockItemModal';
import { dataStore } from '@/store/dataStore';
import { StockItem } from '@/types';
import { toast } from "@/components/ui/sonner";

const StockItems = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const loadStockItems = () => {
    const items = dataStore.getStockItems();
    setStockItems(items);
    setFilteredItems(items);
  };

  useEffect(() => {
    loadStockItems();
  }, []);

  useEffect(() => {
    let filtered = stockItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batch.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    setFilteredItems(filtered);
  }, [stockItems, searchTerm, filterCategory]);

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dataStore.deleteStockItem(id);
      loadStockItems();
      toast.success("Stock item deleted successfully!");
    }
  };

  const getStockStatus = (item: StockItem) => {
    const now = new Date();
    const expiryDate = new Date(item.expiryDate);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiryDate < now) {
      return { status: 'Expired', color: 'destructive' as const };
    } else if (expiryDate < thirtyDaysFromNow) {
      return { status: 'Expiring Soon', color: 'secondary' as const };
    } else if (item.quantity <= item.minStockLevel) {
      return { status: 'Low Stock', color: 'secondary' as const };
    } else {
      return { status: 'Good', color: 'default' as const };
    }
  };

  const categories = [...new Set(stockItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 mr-3" />
            Stock Items
          </h1>
          <p className="text-gray-600">Manage your pharmaceutical inventory</p>
        </div>

        <AnimatedCard>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Add and manage your stock items with batch tracking</CardDescription>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by drug name, manufacturer, or batch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Stock Items Table */}
            {filteredItems.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drug Details</TableHead>
                      <TableHead>Batch Info</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const stockStatus = getStockStatus(item);
                      return (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.drugName}</p>
                              <p className="text-sm text-gray-600">{item.manufacturer}</p>
                              <Badge variant="outline" className="mt-1">{item.category}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.batch}</p>
                              {item.rackLocation && (
                                <p className="text-sm text-gray-600">Rack: {item.rackLocation}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.quantity} units</p>
                              <p className="text-sm text-gray-600">Min: {item.minStockLevel}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">₹{item.mrp}</p>
                              <p className="text-sm text-gray-600">Cost: ₹{item.purchasePrice}</p>
                              <p className="text-xs text-gray-500">GST: {item.gstRate}%</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.color}>
                              {stockStatus.status}
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
                                onClick={() => handleDeleteItem(item.id)}
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
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {stockItems.length === 0 ? 'No inventory items' : 'No items match your search'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {stockItems.length === 0 
                    ? 'Get started by adding your first stock item'
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {stockItems.length === 0 && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Stock Item
                  </Button>
                )}
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-900">{stockItems.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{stockItems.reduce((sum, item) => sum + (item.quantity * item.mrp), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stockItems.filter(item => item.quantity <= item.minStockLevel).length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-red-900">
                  {stockItems.filter(item => {
                    const expiryDate = new Date(item.expiryDate);
                    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    return expiryDate <= thirtyDaysFromNow;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <AddStockItemModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onStockAdded={loadStockItems}
      />
    </div>
  );
};

export default StockItems;