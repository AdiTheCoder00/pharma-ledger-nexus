import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Plus, Package2, Edit, Trash2 } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import { StockItem } from '@/types';
import { toast } from "@/components/ui/sonner";
import AddStockItemModal from '@/components/modals/AddStockItemModal';

interface InventoryTableProps {
  onAddStock?: () => void;
}

const InventoryTable = ({ onAddStock }: InventoryTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [inventory, setInventory] = useState<StockItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const items = dataStore.getStockItems();
    setInventory(items);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.drugName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batch?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dataStore.deleteStockItem(id);
      loadInventory();
      toast.success("Stock item deleted successfully!");
    }
  };

  const exportInventory = () => {
    const csvContent = [
      ['Drug Name', 'Manufacturer', 'Category', 'Batch', 'Quantity', 'MRP', 'Purchase Price', 'GST Rate', 'Expiry Date', 'Status'].join(','),
      ...filteredInventory.map(item => [
        item.drugName,
        item.manufacturer,
        item.category,
        item.batch,
        item.quantity.toString(),
        item.mrp.toString(),
        item.purchasePrice.toString(),
        item.gstRate.toString() + '%',
        item.expiryDate,
        getStockStatus(item).status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Inventory exported successfully!");
  };

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  const handleAddStock = () => {
    if (onAddStock) {
      onAddStock();
    } else {
      setShowAddModal(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventory Management
          <Button size="sm" onClick={handleAddStock}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your pharmaceutical inventory with batch tracking
        </CardDescription>
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
          <Button variant="outline" size="sm" onClick={exportInventory} disabled={filteredInventory.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Empty State */}
        {filteredInventory.length === 0 && inventory.length === 0 && (
          <div className="text-center py-12">
            <Package2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first stock item</p>
            <Button onClick={handleAddStock}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Stock Item
            </Button>
          </div>
        )}

        {/* No search results */}
        {filteredInventory.length === 0 && inventory.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No items match your search criteria</p>
          </div>
        )}

        {/* Inventory Table */}
        {filteredInventory.length > 0 && (
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
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.drugName}</p>
                          <p className="text-sm text-gray-500">{item.manufacturer}</p>
                          <Badge variant="outline" className="mt-1">{item.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.batch}</p>
                          {item.rackLocation && (
                            <p className="text-sm text-gray-500">Rack: {item.rackLocation}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.quantity} units</p>
                          <p className="text-sm text-gray-500">Min: {item.minStockLevel}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{item.mrp}</p>
                          <p className="text-sm text-gray-500">Cost: ₹{item.purchasePrice}</p>
                          <p className="text-sm text-gray-500">GST: {item.gstRate}%</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{new Date(item.expiryDate).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.color}>{status.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
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
        )}
      </CardContent>
      
      <AddStockItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onStockAdded={loadInventory}
      />
    </Card>
  );
};

export default InventoryTable;