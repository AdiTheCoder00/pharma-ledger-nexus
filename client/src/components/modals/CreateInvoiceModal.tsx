import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Plus, Trash2 } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import { SalesInvoice, SalesInvoiceItem, Customer, StockItem } from '@/types';

interface CreateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated: (invoice: SalesInvoice) => void;
}

const CreateInvoiceModal = ({ open, onOpenChange, onInvoiceCreated }: CreateInvoiceModalProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<Omit<SalesInvoiceItem, 'id'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCustomers(dataStore.getCustomers());
      setStockItems(dataStore.getStockItems());
    }
  }, [open]);

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, {
      stockItemId: '',
      drugName: '',
      batch: '',
      quantity: 1,
      rate: 0,
      discount: 0,
      gstRate: 0,
      amount: 0,
    }]);
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'stockItemId') {
      const stockItem = stockItems.find(item => item.id === value);
      if (stockItem) {
        updatedItems[index].drugName = stockItem.drugName;
        updatedItems[index].batch = stockItem.batch;
        updatedItems[index].rate = stockItem.mrp;
        updatedItems[index].gstRate = stockItem.gstRate;
      }
    }

    // Calculate amount
    const item = updatedItems[index];
    const baseAmount = item.quantity * item.rate;
    const discountAmount = (baseAmount * item.discount) / 100;
    const taxableAmount = baseAmount - discountAmount;
    const gstAmount = (taxableAmount * item.gstRate) / 100;
    updatedItems[index].amount = taxableAmount + gstAmount;

    setInvoiceItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => {
      const baseAmount = item.quantity * item.rate;
      const discountAmount = (baseAmount * item.discount) / 100;
      return sum + (baseAmount - discountAmount);
    }, 0);

    const totalGst = invoiceItems.reduce((sum, item) => {
      const baseAmount = item.quantity * item.rate;
      const discountAmount = (baseAmount * item.discount) / 100;
      const taxableAmount = baseAmount - discountAmount;
      return sum + (taxableAmount * item.gstRate) / 100;
    }, 0);

    return {
      subtotal,
      cgst: totalGst / 2,
      sgst: totalGst / 2,
      igst: 0,
      totalAmount: subtotal + totalGst,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    setIsLoading(true);

    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      const totals = calculateTotals();
      
      const invoice = dataStore.addSalesInvoice({
        customerId: selectedCustomer,
        customerName: customer?.name || '',
        date: new Date().toISOString().split('T')[0],
        items: invoiceItems.map((item, index) => ({
          ...item,
          id: `item-${index}`,
        })),
        ...totals,
        paymentStatus: 'pending',
      });

      onInvoiceCreated(invoice);
      toast.success("Invoice created successfully!");
      onOpenChange(false);
      
      // Reset form
      setSelectedCustomer('');
      setInvoiceItems([]);
    } catch (error) {
      toast.error("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Sales Invoice</DialogTitle>
          <DialogDescription>
            Create a new sales invoice for your customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={new Date().toISOString().split('T')[0]}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button type="button" onClick={addInvoiceItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {invoiceItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drug</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Disc%</TableHead>
                      <TableHead>GST%</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={item.stockItemId}
                            onValueChange={(value) => updateInvoiceItem(index, 'stockItemId', value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select drug" />
                            </SelectTrigger>
                            <SelectContent>
                              {stockItems.map(stock => (
                                <SelectItem key={stock.id} value={stock.id}>
                                  {stock.drugName} ({stock.batch})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateInvoiceItem(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => updateInvoiceItem(index, 'discount', parseFloat(e.target.value) || 0)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.gstRate}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">₹{item.amount.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInvoiceItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {invoiceItems.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium ml-2">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">CGST:</span>
                  <span className="font-medium ml-2">₹{totals.cgst.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">SGST:</span>
                  <span className="font-medium ml-2">₹{totals.sgst.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold ml-2 text-lg">₹{totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || invoiceItems.length === 0}>
              {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceModal;