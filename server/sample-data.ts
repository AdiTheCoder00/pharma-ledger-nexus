import { db } from "./db";
import { customers, stockItems, salesInvoices, salesInvoiceItems } from "@shared/schema";

// Sample data for demonstration purposes
export async function seedSampleData() {
  try {
    // Insert sample customers
    const sampleCustomers = [
      {
        name: "Apollo Pharmacy",
        phone: "9876543210",
        email: "apollo@example.com",
        address: "123 Main Street, Bangalore",
        gstNumber: "29ABCDE1234F1Z5",
        customerType: "B2B" as const,
        creditLimit: "50000.00",
        outstandingAmount: "0.00"
      },
      {
        name: "Retail Customer",
        phone: "9876543211",
        address: "456 Park Road, Bangalore",
        customerType: "B2C" as const,
        creditLimit: "0.00",
        outstandingAmount: "0.00"
      },
      {
        name: "MedPlus Health Services",
        phone: "9876543212",
        email: "medplus@example.com",
        address: "789 Health Avenue, Bangalore",
        gstNumber: "29FGHIJ5678K2L6",
        customerType: "B2B" as const,
        creditLimit: "75000.00",
        outstandingAmount: "0.00"
      }
    ];

    const insertedCustomers = await db.insert(customers).values(sampleCustomers).returning();
    console.log("Inserted customers:", insertedCustomers.length);

    // Insert sample stock items
    const sampleStockItems = [
      {
        drugName: "Paracetamol 500mg",
        manufacturer: "Cipla Ltd",
        category: "Tablet",
        batch: "PC001",
        expiryDate: new Date("2025-12-31"),
        quantity: 100,
        mrp: "5.00",
        purchasePrice: "3.50",
        hsnCode: "30049000",
        minStockLevel: 20,
        rackLocation: "A1"
      },
      {
        drugName: "Amoxicillin 250mg",
        manufacturer: "Sun Pharma",
        category: "Capsule",
        batch: "AMX001",
        expiryDate: new Date("2025-10-31"),
        quantity: 50,
        mrp: "12.00",
        purchasePrice: "8.50",
        hsnCode: "30042000",
        minStockLevel: 10,
        rackLocation: "A2"
      },
      {
        drugName: "Insulin Injection",
        manufacturer: "Novo Nordisk",
        category: "Injection",
        batch: "INS001",
        expiryDate: new Date("2025-08-31"),
        quantity: 25,
        mrp: "450.00",
        purchasePrice: "380.00",
        hsnCode: "30043100",
        minStockLevel: 5,
        rackLocation: "B1"
      }
    ];

    const insertedStockItems = await db.insert(stockItems).values(sampleStockItems).returning();
    console.log("Inserted stock items:", insertedStockItems.length);

    // Insert sample sales invoices
    const sampleInvoices = [
      {
        invoiceNumber: "INV-B2B-001",
        customerId: insertedCustomers[0].id,
        customerName: insertedCustomers[0].name,
        customerType: "B2B" as const,
        customerGstin: insertedCustomers[0].gstNumber,
        invoiceDate: new Date("2024-12-01"),
        subtotal: "100.00",
        cgst: "6.00",
        sgst: "6.00",
        igst: "0.00",
        totalAmount: "112.00",
        paymentStatus: "paid"
      },
      {
        invoiceNumber: "INV-B2C-001",
        customerId: insertedCustomers[1].id,
        customerName: insertedCustomers[1].name,
        customerType: "B2C" as const,
        customerGstin: null,
        invoiceDate: new Date("2024-12-02"),
        subtotal: "450.00",
        cgst: "27.00",
        sgst: "27.00",
        igst: "0.00",
        totalAmount: "504.00",
        paymentStatus: "paid"
      },
      {
        invoiceNumber: "INV-B2B-002",
        customerId: insertedCustomers[2].id,
        customerName: insertedCustomers[2].name,
        customerType: "B2B" as const,
        customerGstin: insertedCustomers[2].gstNumber,
        invoiceDate: new Date("2024-12-03"),
        subtotal: "60.00",
        cgst: "3.60",
        sgst: "3.60",
        igst: "0.00",
        totalAmount: "67.20",
        paymentStatus: "paid"
      }
    ];

    const insertedInvoices = await db.insert(salesInvoices).values(sampleInvoices).returning();
    console.log("Inserted invoices:", insertedInvoices.length);

    // Insert sample invoice items
    const sampleInvoiceItems = [
      {
        invoiceId: insertedInvoices[0].id,
        stockItemId: insertedStockItems[0].id,
        drugName: insertedStockItems[0].drugName,
        batch: insertedStockItems[0].batch,
        hsnCode: insertedStockItems[0].hsnCode,
        quantity: 20,
        rate: "5.00",
        discount: "0.00",
        gstRate: "12.00",
        taxableAmount: "100.00",
        cgstAmount: "6.00",
        sgstAmount: "6.00",
        igstAmount: "0.00",
        totalAmount: "112.00"
      },
      {
        invoiceId: insertedInvoices[1].id,
        stockItemId: insertedStockItems[2].id,
        drugName: insertedStockItems[2].drugName,
        batch: insertedStockItems[2].batch,
        hsnCode: insertedStockItems[2].hsnCode,
        quantity: 1,
        rate: "450.00",
        discount: "0.00",
        gstRate: "12.00",
        taxableAmount: "450.00",
        cgstAmount: "27.00",
        sgstAmount: "27.00",
        igstAmount: "0.00",
        totalAmount: "504.00"
      },
      {
        invoiceId: insertedInvoices[2].id,
        stockItemId: insertedStockItems[1].id,
        drugName: insertedStockItems[1].drugName,
        batch: insertedStockItems[1].batch,
        hsnCode: insertedStockItems[1].hsnCode,
        quantity: 5,
        rate: "12.00",
        discount: "0.00",
        gstRate: "12.00",
        taxableAmount: "60.00",
        cgstAmount: "3.60",
        sgstAmount: "3.60",
        igstAmount: "0.00",
        totalAmount: "67.20"
      }
    ];

    await db.insert(salesInvoiceItems).values(sampleInvoiceItems);
    console.log("Inserted invoice items:", sampleInvoiceItems.length);

    return { success: true, message: "Sample data seeded successfully" };
  } catch (error) {
    console.error("Error seeding sample data:", error);
    return { success: false, error: error.message };
  }
}