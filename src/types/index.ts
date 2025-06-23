export interface StockItem {
  id: string;
  drugName: string;
  manufacturer: string;
  category: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  mrp: number;
  purchasePrice: number;
  gstRate: number;
  minStockLevel: number;
  rackLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  gstNumber?: string;
  creditLimit: number;
  outstandingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SalesInvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  createdAt: string;
}

export interface SalesInvoiceItem {
  id: string;
  stockItemId: string;
  drugName: string;
  batch: string;
  quantity: number;
  rate: number;
  discount: number;
  gstRate: number;
  amount: number;
}

export interface StockAlert {
  id: string;
  type: 'low_stock' | 'expiry_soon' | 'expired';
  stockItemId: string;
  drugName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  activeCustomers: number;
  stockItems: number;
  lowStockItems: number;
  expiringItems: number;
  monthlyGrowth: number;
  gstCollected: {
    cgst: number;
    sgst: number;
    igst: number;
  };
}