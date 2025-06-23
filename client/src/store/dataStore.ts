import { StockItem, Customer, SalesInvoice, StockAlert, DashboardStats } from '@/types';

class DataStore {
  private static instance: DataStore;
  
  private constructor() {}
  
  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // Stock Items
  getStockItems(): StockItem[] {
    const items = localStorage.getItem('stockItems');
    return items ? JSON.parse(items) : [];
  }

  addStockItem(item: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>): StockItem {
    const stockItems = this.getStockItems();
    const newItem: StockItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stockItems.push(newItem);
    localStorage.setItem('stockItems', JSON.stringify(stockItems));
    return newItem;
  }

  updateStockItem(id: string, updates: Partial<StockItem>): StockItem | null {
    const stockItems = this.getStockItems();
    const index = stockItems.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    stockItems[index] = { ...stockItems[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem('stockItems', JSON.stringify(stockItems));
    return stockItems[index];
  }

  deleteStockItem(id: string): boolean {
    const stockItems = this.getStockItems();
    const filteredItems = stockItems.filter(item => item.id !== id);
    localStorage.setItem('stockItems', JSON.stringify(filteredItems));
    return filteredItems.length < stockItems.length;
  }

  // Customers
  getCustomers(): Customer[] {
    const customers = localStorage.getItem('customers');
    return customers ? JSON.parse(customers) : [];
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
    const customers = this.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) return null;
    
    customers[index] = { ...customers[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem('customers', JSON.stringify(customers));
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    localStorage.setItem('customers', JSON.stringify(filteredCustomers));
    return filteredCustomers.length < customers.length;
  }

  // Sales Invoices
  getSalesInvoices(): SalesInvoice[] {
    const invoices = localStorage.getItem('salesInvoices');
    return invoices ? JSON.parse(invoices) : [];
  }

  addSalesInvoice(invoice: Omit<SalesInvoice, 'id' | 'invoiceNumber' | 'createdAt'>): SalesInvoice {
    const invoices = this.getSalesInvoices();
    const invoiceNumber = `INV-${Date.now()}`;
    const newInvoice: SalesInvoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber,
      createdAt: new Date().toISOString(),
    };
    invoices.push(newInvoice);
    localStorage.setItem('salesInvoices', JSON.stringify(invoices));
    
    // Update stock quantities
    newInvoice.items.forEach(item => {
      const stockItem = this.getStockItems().find(stock => stock.id === item.stockItemId);
      if (stockItem) {
        this.updateStockItem(stockItem.id, { 
          quantity: stockItem.quantity - item.quantity 
        });
      }
    });
    
    return newInvoice;
  }

  // Stock Alerts
  generateStockAlerts(): StockAlert[] {
    const stockItems = this.getStockItems();
    const alerts: StockAlert[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    stockItems.forEach(item => {
      // Low stock alert
      if (item.quantity <= item.minStockLevel) {
        alerts.push({
          id: `low-${item.id}`,
          type: 'low_stock',
          stockItemId: item.id,
          drugName: item.drugName,
          message: `Low stock: Only ${item.quantity} units remaining`,
          severity: item.quantity === 0 ? 'high' : 'medium',
          createdAt: new Date().toISOString(),
        });
      }

      // Expiry alerts
      const expiryDate = new Date(item.expiryDate);
      if (expiryDate < now) {
        alerts.push({
          id: `expired-${item.id}`,
          type: 'expired',
          stockItemId: item.id,
          drugName: item.drugName,
          message: `Expired on ${expiryDate.toLocaleDateString()}`,
          severity: 'high',
          createdAt: new Date().toISOString(),
        });
      } else if (expiryDate < thirtyDaysFromNow) {
        alerts.push({
          id: `expiry-${item.id}`,
          type: 'expiry_soon',
          stockItemId: item.id,
          drugName: item.drugName,
          message: `Expires on ${expiryDate.toLocaleDateString()}`,
          severity: 'medium',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return alerts;
  }

  // Dashboard Stats
  getDashboardStats(): DashboardStats {
    const stockItems = this.getStockItems();
    const customers = this.getCustomers();
    const invoices = this.getSalesInvoices();
    const alerts = this.generateStockAlerts();

    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const gstCollected = invoices.reduce(
      (acc, invoice) => ({
        cgst: acc.cgst + invoice.cgst,
        sgst: acc.sgst + invoice.sgst,
        igst: acc.igst + invoice.igst,
      }),
      { cgst: 0, sgst: 0, igst: 0 }
    );

    return {
      totalSales,
      totalPurchases: 0, // Would be calculated from purchase invoices
      activeCustomers: customers.length,
      stockItems: stockItems.length,
      lowStockItems: alerts.filter(alert => alert.type === 'low_stock').length,
      expiringItems: alerts.filter(alert => alert.type === 'expiry_soon' || alert.type === 'expired').length,
      monthlyGrowth: 0, // Would be calculated based on historical data
      gstCollected,
    };
  }
}

export const dataStore = DataStore.getInstance();