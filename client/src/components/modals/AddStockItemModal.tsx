import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { dataStore } from '@/store/dataStore';
import { StockItem } from '@/types';

interface AddStockItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStockAdded: (stock: StockItem) => void;
}

const AddStockItemModal = ({ open, onOpenChange, onStockAdded }: AddStockItemModalProps) => {
  const [formData, setFormData] = useState({
    drugName: '',
    manufacturer: '',
    category: '',
    batch: '',
    expiryDate: '',
    quantity: '',
    mrp: '',
    purchasePrice: '',
    gstRate: '',
    minStockLevel: '',
    rackLocation: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const stockItem = dataStore.addStockItem({
        drugName: formData.drugName,
        manufacturer: formData.manufacturer,
        category: formData.category,
        batch: formData.batch,
        expiryDate: formData.expiryDate,
        quantity: parseInt(formData.quantity),
        mrp: parseFloat(formData.mrp),
        purchasePrice: parseFloat(formData.purchasePrice),
        gstRate: parseFloat(formData.gstRate),
        minStockLevel: parseInt(formData.minStockLevel),
        rackLocation: formData.rackLocation,
      });

      onStockAdded(stockItem);
      toast.success("Stock item added successfully!");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        drugName: '',
        manufacturer: '',
        category: '',
        batch: '',
        expiryDate: '',
        quantity: '',
        mrp: '',
        purchasePrice: '',
        gstRate: '',
        minStockLevel: '',
        rackLocation: '',
      });
    } catch (error) {
      toast.error("Failed to add stock item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Stock Item</DialogTitle>
          <DialogDescription>
            Enter the details of the new pharmaceutical item to add to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="drugName">Drug Name *</Label>
              <Input
                id="drugName"
                value={formData.drugName}
                onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analgesic">Analgesic</SelectItem>
                  <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                  <SelectItem value="Vitamin">Vitamin</SelectItem>
                  <SelectItem value="Antacid">Antacid</SelectItem>
                  <SelectItem value="Antiseptic">Antiseptic</SelectItem>
                  <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="Diabetes">Diabetes</SelectItem>
                  <SelectItem value="Respiratory">Respiratory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch">Batch Number *</Label>
              <Input
                id="batch"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mrp">MRP (₹) *</Label>
              <Input
                id="mrp"
                type="number"
                step="0.01"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₹) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%) *</Label>
              <Select value={formData.gstRate} onValueChange={(value) => setFormData({ ...formData, gstRate: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select GST rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Minimum Stock Level *</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rackLocation">Rack Location</Label>
              <Input
                id="rackLocation"
                value={formData.rackLocation}
                onChange={(e) => setFormData({ ...formData, rackLocation: e.target.value })}
                placeholder="e.g., A1-B2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Stock Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockItemModal;