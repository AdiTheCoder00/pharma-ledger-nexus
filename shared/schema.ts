import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// HSN Master table for categorization
export const hsnMaster = pgTable("hsn_master", {
  id: serial("id").primaryKey(),
  hsnCode: varchar("hsn_code", { length: 8 }).notNull().unique(),
  description: text("description").notNull(),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // pharma, medical_device, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stock Items with HSN categorization
export const stockItems = pgTable("stock_items", {
  id: serial("id").primaryKey(),
  drugName: text("drug_name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  category: text("category").notNull(),
  batch: text("batch").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  quantity: integer("quantity").notNull(),
  mrp: decimal("mrp", { precision: 10, scale: 2 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  hsnCode: varchar("hsn_code", { length: 8 }).notNull(),
  minStockLevel: integer("min_stock_level").default(0),
  rackLocation: text("rack_location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customers with GST classification
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  email: text("email"),
  address: text("address").notNull(),
  gstNumber: varchar("gst_number", { length: 15 }),
  customerType: varchar("customer_type", { length: 10 }).notNull(), // B2B or B2C
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default('0'),
  outstandingAmount: decimal("outstanding_amount", { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sales Invoices
export const salesInvoices = pgTable("sales_invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  customerId: integer("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerType: varchar("customer_type", { length: 10 }).notNull(),
  customerGstin: varchar("customer_gstin", { length: 15 }),
  invoiceDate: timestamp("invoice_date").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  cgst: decimal("cgst", { precision: 12, scale: 2 }).default('0'),
  sgst: decimal("sgst", { precision: 12, scale: 2 }).default('0'),
  igst: decimal("igst", { precision: 12, scale: 2 }).default('0'),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sales Invoice Items with HSN details
export const salesInvoiceItems = pgTable("sales_invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  stockItemId: integer("stock_item_id").notNull(),
  drugName: text("drug_name").notNull(),
  batch: text("batch").notNull(),
  hsnCode: varchar("hsn_code", { length: 8 }).notNull(),
  quantity: integer("quantity").notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull(),
  taxableAmount: decimal("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  cgstAmount: decimal("cgst_amount", { precision: 12, scale: 2 }).default('0'),
  sgstAmount: decimal("sgst_amount", { precision: 12, scale: 2 }).default('0'),
  igstAmount: decimal("igst_amount", { precision: 12, scale: 2 }).default('0'),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
});

// GSTR-1 HSN Summary for B2B and B2C categorization
export const gstr1HsnSummary = pgTable("gstr1_hsn_summary", {
  id: serial("id").primaryKey(),
  period: varchar("period", { length: 7 }).notNull(), // YYYY-MM format
  hsnCode: varchar("hsn_code", { length: 8 }).notNull(),
  description: text("description").notNull(),
  uom: varchar("uom", { length: 10 }).default('NOS'), // Unit of Measurement
  totalQuantity: decimal("total_quantity", { precision: 15, scale: 3 }).notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  taxableValue: decimal("taxable_value", { precision: 15, scale: 2 }).notNull(),
  integratedTax: decimal("integrated_tax", { precision: 15, scale: 2 }).default('0'),
  centralTax: decimal("central_tax", { precision: 15, scale: 2 }).default('0'),
  stateTax: decimal("state_tax", { precision: 15, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHsnMasterSchema = createInsertSchema(hsnMaster).omit({
  id: true,
  createdAt: true,
});

export const insertStockItemSchema = createInsertSchema(stockItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSalesInvoiceSchema = createInsertSchema(salesInvoices).omit({
  id: true,
  createdAt: true,
});

export const insertSalesInvoiceItemSchema = createInsertSchema(salesInvoiceItems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HsnMaster = typeof hsnMaster.$inferSelect;
export type InsertHsnMaster = z.infer<typeof insertHsnMasterSchema>;
export type StockItem = typeof stockItems.$inferSelect;
export type InsertStockItem = z.infer<typeof insertStockItemSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type TransactionItem = typeof transactionItems.$inferSelect;
export type InsertTransactionItem = z.infer<typeof insertTransactionItemSchema>;
export type SalesInvoice = typeof salesInvoices.$inferSelect;
export type InsertSalesInvoice = z.infer<typeof insertSalesInvoiceSchema>;
export type SalesInvoiceItem = typeof salesInvoiceItems.$inferSelect;
export type InsertSalesInvoiceItem = z.infer<typeof insertSalesInvoiceItemSchema>;
export type Gstr1HsnSummary = typeof gstr1HsnSummary.$inferSelect;
