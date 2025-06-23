
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, Edit, Eye } from 'lucide-react';

const InventoryTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const inventory = [
    {
      id: 1,
      drugName: 'Paracetamol 500mg',
      manufacturer: 'Cipla Ltd',
      category: 'Analgesic',
      batch: 'PCM2024A',
      quantity: 1500,
      unit: 'Tablets',
      mrp: 25.00,
      purchaseRate: 18.50,
      expiryDate: '2024-08-15',
      location: 'Rack A-15',
      gstRate: 12,
      hsnCode: '30041090',
      status: 'expiring'
    },
    {
      id: 2,
      drugName: 'Amoxicillin 250mg',
      manufacturer: 'Sun Pharma',
      category: 'Antibiotic',
      batch: 'AMX2024B',
      quantity: 750,
      unit: 'Capsules',
      mrp: 85.00,
      purchaseRate: 68.00,
      expiryDate: '2025-03-20',
      location: 'Rack B-08',
      gstRate: 12,
      hsnCode: '30042090',
      status: 'active'
    },
    {
      id: 3,
      drugName: 'Crocin Advance',
      manufacturer: 'GSK',
      category: 'Analgesic',
      batch: 'CRC2024C',
      quantity: 2000,
      unit: 'Tablets',
      mrp: 45.00,
      purchaseRate: 34.20,
      expiryDate: '2025-01-10',
      location: 'Rack C-22',
      gstRate: 12,
      hsnCode: '30041090',
      status: 'active'
    },
    {
      id: 4,
      drugName: 'Azithromycin 500mg',
      manufacturer: 'Zydus',
      category: 'Antibiotic',
      batch: 'AZI2024D',
      quantity: 25,
      unit: 'Tablets',
      mrp: 125.00,
      purchaseRate: 95.00,
      expiryDate: '2024-12-15',
      location: 'Rack A-03',
      gstRate: 12,
      hsnCode: '30042090',
      status: 'low_stock'
    }
  ];

  const getStatusBadge = (status: string, quantity: number) => {
    if (status === 'expiring') {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    } else if (status === 'low_stock' || quantity < 50) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="outline">Active</Badge>;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventory Management
          <Button size="sm">
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
              <SelectItem value="Analgesic">Analgesic</SelectItem>
              <SelectItem value="Antibiotic">Antibiotic</SelectItem>
              <SelectItem value="Vitamin">Vitamin</SelectItem>
              <SelectItem value="Antacid">Antacid</SelectItem>
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

        {/* Inventory Table */}
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
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.drugName}</p>
                      <p className="text-sm text-gray-500">{item.manufacturer}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.batch}</p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                      <p className="text-xs text-gray-400">HSN: {item.hsnCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.quantity.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{item.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{item.mrp.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">CP: ₹{item.purchaseRate.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">GST: {item.gstRate}%</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{item.expiryDate}</p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.quantity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Items</p>
            <p className="text-2xl font-bold text-blue-900">{inventory.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Total Value</p>
            <p className="text-2xl font-bold text-green-900">₹2,45,670</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">Low Stock Items</p>
            <p className="text-2xl font-bold text-yellow-900">12</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">Expiring Soon</p>
            <p className="text-2xl font-bold text-red-900">5</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
