
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from 'lucide-react';

const SalesInvoice = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Sales Invoice
          </h1>
          <p className="text-gray-600">Create and manage sales invoices</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Management</CardTitle>
                <CardDescription>Create new invoices and track sales</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No invoices created yet</p>
              <p className="text-sm">Click "New Invoice" to create your first invoice</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesInvoice;
