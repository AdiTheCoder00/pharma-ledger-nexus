import { db } from "./db";
import { customers, stockItems, salesInvoices, salesInvoiceItems, hsnMaster } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface BusyCustomerImport {
  customer_code?: string;
  customer_name: string;
  phone?: string;
  email?: string;
  address: string;
  gst_number?: string;
  credit_limit?: number;
  opening_balance?: number;
}

export interface BusyStockImport {
  item_code?: string;
  item_name: string;
  manufacturer?: string;
  category?: string;
  batch_number?: string;
  expiry_date?: string;
  quantity?: number;
  mrp?: number;
  purchase_rate?: number;
  hsn_code?: string;
  rack_location?: string;
}

export interface BusyTransactionImport {
  transaction_number?: string;
  invoice_number?: string;
  voucher_number?: string;
  transaction_type?: string; // sale, purchase, sale_return, purchase_return, debit_note, credit_note
  transaction_date?: string;
  invoice_date?: string;
  voucher_date?: string;
  party_name?: string;
  customer_name?: string;
  supplier_name?: string;
  party_gst?: string;
  reference_number?: string;
  item_name?: string;
  product_name?: string;
  description?: string;
  batch?: string;
  batch_number?: string;
  hsn_code?: string;
  hsn?: string;
  quantity?: number;
  rate?: number;
  unit_price?: number;
  discount?: number;
  discount_amount?: number;
  gst_rate?: number;
  tax_rate?: number;
  taxable_amount?: number;
  amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  total_amount?: number;
  payment_status?: string;
  remarks?: string;
  narration?: string;
}

export interface BusyInvoiceImport {
  invoice_number: string;
  invoice_date: string;
  customer_name: string;
  customer_gst?: string;
  item_name: string;
  batch?: string;
  hsn_code?: string;
  quantity: number;
  rate: number;
  discount?: number;
  gst_rate?: number;
  taxable_amount: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  total_amount: number;
}

export class ImportService {
  // Import customers from Busy format
  async importCustomers(busyCustomers: BusyCustomerImport[]): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    for (const busyCustomer of busyCustomers) {
      try {
        const customerData = {
          name: busyCustomer.customer_name,
          phone: busyCustomer.phone || "0000000000",
          email: busyCustomer.email || null,
          address: busyCustomer.address,
          gstNumber: busyCustomer.gst_number || null,
          customerType: busyCustomer.gst_number ? "B2B" as const : "B2C" as const,
          creditLimit: String(busyCustomer.credit_limit || 0),
          outstandingAmount: String(busyCustomer.opening_balance || 0),
        };

        await db.insert(customers).values(customerData).onConflictDoNothing();
        success++;
      } catch (error) {
        errors.push(`Customer ${busyCustomer.customer_name}: ${error.message}`);
      }
    }

    return { success, errors };
  }

  // Import stock items from Busy format
  async importStockItems(busyStock: BusyStockImport[]): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    for (const busyItem of busyStock) {
      try {
        const stockData = {
          drugName: busyItem.item_name,
          manufacturer: busyItem.manufacturer || "Unknown",
          category: busyItem.category || "General",
          batch: busyItem.batch_number || "BATCH001",
          expiryDate: busyItem.expiry_date ? new Date(busyItem.expiry_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          quantity: busyItem.quantity || 0,
          mrp: String(busyItem.mrp || 0),
          purchasePrice: String(busyItem.purchase_rate || 0),
          hsnCode: busyItem.hsn_code || "30049000",
          minStockLevel: 10,
          rackLocation: busyItem.rack_location || null,
        };

        await db.insert(stockItems).values(stockData);
        success++;
      } catch (error) {
        errors.push(`Stock item ${busyItem.item_name}: ${error.message}`);
      }
    }

    return { success, errors };
  }

  // Import invoices from Busy format (consolidated by invoice)
  async importInvoices(busyInvoices: BusyInvoiceImport[]): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let success = 0;

    // Group items by invoice number
    const invoiceGroups = new Map<string, BusyInvoiceImport[]>();
    busyInvoices.forEach(item => {
      const invoiceNumber = item.invoice_number;
      if (!invoiceGroups.has(invoiceNumber)) {
        invoiceGroups.set(invoiceNumber, []);
      }
      invoiceGroups.get(invoiceNumber)!.push(item);
    });

    for (const [invoiceNumber, items] of invoiceGroups) {
      try {
        const firstItem = items[0];
        
        // Find or create customer
        const customerName = firstItem.customer_name || "Unknown Customer";
        let customer = await db.select().from(customers).where(eq(customers.name, customerName)).limit(1);
        if (customer.length === 0) {
          const newCustomer = await db.insert(customers).values({
            name: customerName,
            phone: "0000000000",
            address: "Imported Address",
            gstNumber: firstItem.customer_gst || null,
            customerType: firstItem.customer_gst ? "B2B" as const : "B2C" as const,
            creditLimit: "0",
            outstandingAmount: "0",
          }).returning();
          customer = newCustomer;
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.taxable_amount, 0);
        const cgstTotal = items.reduce((sum, item) => sum + (item.cgst_amount || 0), 0);
        const sgstTotal = items.reduce((sum, item) => sum + (item.sgst_amount || 0), 0);
        const igstTotal = items.reduce((sum, item) => sum + (item.igst_amount || 0), 0);
        const totalAmount = items.reduce((sum, item) => sum + item.total_amount, 0);

        // Create invoice
        const invoiceData = {
          invoiceNumber: invoiceNumber,
          customerId: customer[0].id,
          customerName: customerName,
          customerType: firstItem.customer_gst ? "B2B" as const : "B2C" as const,
          customerGstin: firstItem.customer_gst || null,
          invoiceDate: new Date(firstItem.invoice_date),
          subtotal: String(subtotal),
          cgst: String(cgstTotal),
          sgst: String(sgstTotal),
          igst: String(igstTotal),
          totalAmount: String(totalAmount),
          paymentStatus: "paid",
        };

        const createdInvoice = await db.insert(salesInvoices).values(invoiceData).returning();

        // Create invoice items
        for (const item of items) {
          // Find stock item or create dummy reference
          let stockItem = await db.select().from(stockItems).where(eq(stockItems.drugName, item.item_name)).limit(1);
          let stockItemId = 1; // Default fallback
          
          if (stockItem.length > 0) {
            stockItemId = stockItem[0].id;
          }

          const itemData = {
            invoiceId: createdInvoice[0].id,
            stockItemId: stockItemId,
            drugName: item.item_name,
            batch: item.batch || "BATCH001",
            hsnCode: item.hsn_code || "30049000",
            quantity: item.quantity,
            rate: String(item.rate),
            discount: String(item.discount || 0),
            gstRate: String(item.gst_rate || 12),
            taxableAmount: String(item.taxable_amount),
            cgstAmount: String(item.cgst_amount || 0),
            sgstAmount: String(item.sgst_amount || 0),
            igstAmount: String(item.igst_amount || 0),
            totalAmount: String(item.total_amount),
          };

          await db.insert(salesInvoiceItems).values(itemData);
        }

        success++;
      } catch (error) {
        errors.push(`Invoice ${invoiceNumber}: ${error.message}`);
      }
    }

    return { success, errors };
  }

  async importTransactions(busyTransactions: BusyTransactionImport[]): Promise<{ success: number; errors: string[] }> {
    const success = 0;
    const errors: string[] = [];
    
    // Group transactions by invoice/voucher number to create consolidated records
    const invoiceMap = new Map<string, any>();
    
    for (const transaction of busyTransactions) {
      try {
        const invoiceNumber = transaction.invoice_number || transaction.voucher_number || transaction.transaction_number || `TXN-${Date.now()}`;
        const transactionDate = transaction.transaction_date || transaction.invoice_date || transaction.voucher_date || new Date().toISOString().split('T')[0];
        const customerName = transaction.party_name || transaction.customer_name || transaction.supplier_name || 'Unknown Customer';
        const itemName = transaction.item_name || transaction.product_name || transaction.description || 'Unknown Item';
        
        if (!invoiceMap.has(invoiceNumber)) {
          invoiceMap.set(invoiceNumber, {
            invoiceNumber,
            date: transactionDate,
            customerName,
            customerGst: transaction.party_gst || '',
            items: [],
            subtotal: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            totalAmount: 0,
            paymentStatus: transaction.payment_status || 'pending'
          });
        }
        
        const invoice = invoiceMap.get(invoiceNumber);
        const quantity = Number(transaction.quantity) || 1;
        const rate = Number(transaction.rate || transaction.unit_price) || 0;
        const discount = Number(transaction.discount || transaction.discount_amount) || 0;
        const gstRate = Number(transaction.gst_rate || transaction.tax_rate) || 0;
        const taxableAmount = Number(transaction.taxable_amount) || (quantity * rate - discount);
        const cgstAmount = Number(transaction.cgst_amount) || 0;
        const sgstAmount = Number(transaction.sgst_amount) || 0;
        const igstAmount = Number(transaction.igst_amount) || 0;
        const totalAmount = Number(transaction.total_amount) || (taxableAmount + cgstAmount + sgstAmount + igstAmount);
        
        invoice.items.push({
          item_name: itemName,
          batch: transaction.batch || transaction.batch_number || 'BATCH001',
          hsn_code: transaction.hsn_code || transaction.hsn || '30049000',
          quantity,
          rate,
          discount,
          gst_rate: gstRate,
          taxable_amount: taxableAmount,
          cgst_amount: cgstAmount,
          sgst_amount: sgstAmount,
          igst_amount: igstAmount,
          total_amount: totalAmount
        });
        
        invoice.subtotal += taxableAmount;
        invoice.cgst += cgstAmount;
        invoice.sgst += sgstAmount;
        invoice.igst += igstAmount;
        invoice.totalAmount += totalAmount;
        
      } catch (error) {
        errors.push(`Transaction processing error: ${error.message}`);
      }
    }
    
    // Convert grouped transactions to invoices and import them
    const invoices = Array.from(invoiceMap.values());
    const result = await this.importInvoices(invoices);
    
    return result;
  }

  // Parse XML data to appropriate format
  async parseXML(xmlContent: string, type: 'customers' | 'stock' | 'invoices' | 'transactions') {
    const data = [];
    try {
      // Server-side XML parsing using xmldom
      const xmldom = await import('@xmldom/xmldom');
      const parser = new xmldom.DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      let records: any[] = [];
      const selectors = {
        customers: ['Customer', 'Party', 'Account', 'Ledger'],
        stock: ['Item', 'Product', 'Stock', 'Inventory'],
        invoices: ['Invoice', 'Bill', 'SaleInvoice'],
        transactions: ['Transaction', 'Voucher', 'Entry', 'Sale', 'Purchase', 'Return', 'Note']
      };

      // Try different element selectors
      for (const selector of selectors[type]) {
        const elements = xmlDoc.getElementsByTagName(selector);
        if (elements && elements.length > 0) {
          records = Array.from(elements);
          break;
        }
      }

      records.forEach((record: any) => {
        const item: any = {};
        
        // Extract data from XML attributes
        if (record.attributes) {
          Array.from(record.attributes).forEach((attr: any) => {
            const key = attr.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            item[key] = attr.value;
          });
        }
        
        // Extract data from child elements
        if (record.childNodes) {
          Array.from(record.childNodes).forEach((child: any) => {
            if (child.nodeType === 1) { // Element node
              const key = child.tagName.toLowerCase().replace(/[^a-z0-9]/g, '_');
              item[key] = child.textContent || child.getAttribute('value') || '';
            }
          });
        }
        
        data.push(this.normalizeRecord(item, type));
      });
    } catch (error) {
      throw new Error(`XML parsing failed: ${error.message}`);
    }
    
    return data;
  }

  // Parse DAT (pipe-delimited) data to appropriate format
  parseDAT(datContent: string, type: 'customers' | 'stock' | 'invoices' | 'transactions') {
    const lines = datContent.trim().split('\n');
    const headers = lines[0].split('|').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('|');
      const record: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/['"]/g, '');
        record[header] = value;
      });

      data.push(this.normalizeRecord(record, type));
    }

    return data;
  }

  // Parse CSV data to appropriate format
  parseCSV(csvContent: string, type: 'customers' | 'stock' | 'invoices' | 'transactions') {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const record: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/['"]/g, '');
        record[header] = value;
      });

      data.push(this.normalizeRecord(record, type));
    }

    return data;
  }

  // Normalize record data based on type
  private normalizeRecord(record: any, type: 'customers' | 'stock' | 'invoices' | 'transactions'): any {

    // Map common Busy field names to our format
    if (type === 'customers') {
      return {
        customer_name: record.customer_name || record.name || record.party_name || record.accountname || record.ledgername,
        phone: record.phone || record.mobile || record.contact || record.mobileno,
        email: record.email || record.emailid,
        address: record.address || record.mailingaddress || 'Imported Address',
        gst_number: record.gst_number || record.gstin || record.gst_no || record.gstnumber || record.vatno,
        credit_limit: parseFloat(record.credit_limit || record.credit || record.creditlimit || '0'),
        opening_balance: parseFloat(record.opening_balance || record.balance || record.openingbalance || '0'),
      };
    } else if (type === 'stock') {
      return {
        item_name: record.item_name || record.name || record.product_name || record.itemname || record.description || record.drug_name || record.drugname,
        manufacturer: record.manufacturer || record.company || record.brand || record.mfr,
        category: record.category || record.group || record.itemgroup || record.type,
        batch_number: record.batch_number || record.batch || record.batchno || record.batch_no,
        expiry_date: record.expiry_date || record.expiry || record.expirydate || record.exp_date,
        quantity: parseInt(record.quantity || record.stock || record.qty || record.closingstock || record.current_stock || '0'),
        mrp: parseFloat(record.mrp || record.selling_price || record.saleprice || record.retailprice || record.sale_rate || '0'),
        purchase_rate: parseFloat(record.purchase_rate || record.cost_price || record.purchaseprice || record.costprice || record.purchase_price || '0'),
        hsn_code: record.hsn_code || record.hsn || record.hsncode || record.servicecode || record.hsn_sac,
        rack_location: record.rack_location || record.location || record.binlocation || record.rack,
      };
    } else if (type === 'transactions') {
      return {
        transaction_number: record.transaction_number || record.invoice_number || record.voucher_number || record.invoice_no || record.bill_no || record.voucherno,
        transaction_type: record.transaction_type || record.voucher_type || record.type || 'sale',
        transaction_date: record.transaction_date || record.invoice_date || record.voucher_date || record.date || record.billdate,
        party_name: record.party_name || record.customer_name || record.supplier_name || record.partyname || record.buyername || record.sellername,
        party_gst: record.party_gst || record.customer_gst || record.supplier_gst || record.partygstin || record.buyergstin,
        reference_number: record.reference_number || record.ref_no || record.referenceno,
        item_name: record.item_name || record.product_name || record.itemname || record.productname || record.description,
        batch: record.batch || record.batch_number || record.batchno,
        hsn_code: record.hsn_code || record.hsn || record.hsncode,
        quantity: parseInt(record.quantity || record.qty || '1'),
        rate: parseFloat(record.rate || record.price || record.unit_price || record.unitprice || '0'),
        discount: parseFloat(record.discount || record.discount_amount || record.discountamount || '0'),
        gst_rate: parseFloat(record.gst_rate || record.tax_rate || record.gstrate || record.taxrate || '0'),
        taxable_amount: parseFloat(record.taxable_amount || record.taxable_value || record.taxableamount || record.amount || '0'),
        cgst_amount: parseFloat(record.cgst_amount || record.cgst || record.cgstamount || '0'),
        sgst_amount: parseFloat(record.sgst_amount || record.sgst || record.sgstamount || '0'),
        igst_amount: parseFloat(record.igst_amount || record.igst || record.igstamount || '0'),
        total_amount: parseFloat(record.total_amount || record.total || record.totalamount || record.billamount || record.amount || '0'),
        payment_status: record.payment_status || record.status || 'pending',
        remarks: record.remarks || record.narration || record.notes,
      };
    } else if (type === 'invoices') {
      return {
        invoice_number: record.invoice_number || record.invoice_no || record.bill_no || record.billno || record.voucherno,
        invoice_date: record.invoice_date || record.date || record.billdate || record.voucherdate,
        customer_name: record.customer_name || record.party_name || record.partyname || record.buyername,
        customer_gst: record.customer_gst || record.party_gstin || record.partygstin || record.buyergstin,
        item_name: record.item_name || record.product_name || record.itemname || record.productname,
        batch: record.batch || record.batchno,
        hsn_code: record.hsn_code || record.hsn || record.hsncode,
        quantity: parseInt(record.quantity || record.qty || '1'),
        rate: parseFloat(record.rate || record.price || record.unitprice || '0'),
        discount: parseFloat(record.discount || record.discountamount || '0'),
        gst_rate: parseFloat(record.gst_rate || record.gstrate || record.taxrate || '12'),
        taxable_amount: parseFloat(record.taxable_amount || record.taxable_value || record.taxableamount || '0'),
        cgst_amount: parseFloat(record.cgst_amount || record.cgst || record.cgstamount || '0'),
        sgst_amount: parseFloat(record.sgst_amount || record.sgst || record.sgstamount || '0'),
        igst_amount: parseFloat(record.igst_amount || record.igst || record.igstamount || '0'),
        total_amount: parseFloat(record.total_amount || record.total || record.totalamount || record.billamount || '0'),
      };
    }
  }

  // Auto-detect file format and parse accordingly
  async parseFile(fileContent: string, type: 'customers' | 'stock' | 'invoices' | 'transactions', format?: string) {
    if (!format) {
      // Auto-detect format
      if (fileContent.trim().startsWith('<?xml') || fileContent.includes('<')) {
        format = 'xml';
      } else if (fileContent.includes('|')) {
        format = 'dat';
      } else {
        format = 'csv';
      }
    }

    switch (format.toLowerCase()) {
      case 'xml':
        return await this.parseXML(fileContent, type);
      case 'dat':
        return this.parseDAT(fileContent, type);
      case 'csv':
      default:
        return this.parseCSV(fileContent, type);
    }
  }

  // Generate import template
  generateTemplate(type: 'customers' | 'stock' | 'invoices' | 'transactions') {
    const templates = {
      customers: 'customer_name,phone,email,address,gst_number,credit_limit,opening_balance\n"Sample Pharmacy","9876543210","sample@example.com","123 Main St","29ABCDE1234F1Z5","50000","0"',
      stock: 'item_name,manufacturer,category,batch_number,expiry_date,quantity,mrp,purchase_rate,hsn_code,rack_location\n"Paracetamol 500mg","Cipla Ltd","Tablet","PC001","2025-12-31","100","5.00","3.50","30049000","A1"',
      invoices: 'invoice_number,invoice_date,customer_name,customer_gst,item_name,batch,hsn_code,quantity,rate,discount,gst_rate,taxable_amount,cgst_amount,sgst_amount,igst_amount,total_amount\n"INV001","2024-12-01","Sample Customer","29ABCDE1234F1Z5","Paracetamol","PC001","30049000","10","5.00","0","12","50.00","3.00","3.00","0","56.00"',
      transactions: 'transaction_number,transaction_type,transaction_date,party_name,party_gst,item_name,batch,hsn_code,quantity,rate,discount,gst_rate,taxable_amount,cgst_amount,sgst_amount,igst_amount,total_amount,payment_status\n"TXN001","sale","2024-12-01","Sample Customer","29ABCDE1234F1Z5","Paracetamol","PC001","30049000","10","5.00","0","12","50.00","3.00","3.00","0","56.00","paid"'
    };
    
    return templates[type];
  }
}

export const importService = new ImportService();