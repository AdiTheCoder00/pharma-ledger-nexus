
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from 'lucide-react';

const StockItems = () => {
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

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Add and manage your stock items</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No stock items added yet</p>
              <p className="text-sm">Click "Add Stock Item" to get started</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockItems;
