import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gstr1Service } from "./gstr1-service";
import { db } from "./db";
import * as schema from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GSTR-1 HSN Categorization Routes
  app.get("/api/gstr1/hsn-categorization", async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "fromDate and toDate are required" });
      }
      
      const data = await gstr1Service.getHSNCategorization(
        fromDate as string,
        toDate as string
      );
      res.json(data);
    } catch (error) {
      console.error("Error generating HSN categorization:", error);
      res.status(500).json({ error: "Failed to generate HSN categorization" });
    }
  });

  app.get("/api/gstr1/hsn-summary", async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "fromDate and toDate are required" });
      }
      
      const data = await gstr1Service.generateHSNSummary(
        fromDate as string,
        toDate as string
      );
      res.json(data);
    } catch (error) {
      console.error("Error generating HSN summary:", error);
      res.status(500).json({ error: "Failed to generate HSN summary" });
    }
  });

  app.get("/api/gstr1/b2b-summary", async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "fromDate and toDate are required" });
      }
      
      const data = await gstr1Service.generateB2BSummary(
        fromDate as string,
        toDate as string
      );
      res.json(data);
    } catch (error) {
      console.error("Error generating B2B summary:", error);
      res.status(500).json({ error: "Failed to generate B2B summary" });
    }
  });

  app.get("/api/gstr1/b2c-summary", async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "fromDate and toDate are required" });
      }
      
      const data = await gstr1Service.generateB2CSummary(
        fromDate as string,
        toDate as string
      );
      res.json(data);
    } catch (error) {
      console.error("Error generating B2C summary:", error);
      res.status(500).json({ error: "Failed to generate B2C summary" });
    }
  });

  // Initialize pharmaceutical HSN codes
  app.post("/api/gstr1/seed-hsn", async (req, res) => {
    try {
      await gstr1Service.seedPharmaceuticalHSNCodes();
      res.json({ message: "HSN codes seeded successfully" });
    } catch (error) {
      console.error("Error seeding HSN codes:", error);
      res.status(500).json({ error: "Failed to seed HSN codes" });
    }
  });

  // Seed sample data for demonstration
  app.post("/api/sample-data/seed", async (req, res) => {
    try {
      const { seedSampleData } = await import("./sample-data");
      const result = await seedSampleData();
      res.json(result);
    } catch (error) {
      console.error("Error seeding sample data:", error);
      res.status(500).json({ error: "Failed to seed sample data" });
    }
  });

  // Import data from Busy Accounting
  app.post("/api/import/customers", async (req, res) => {
    try {
      const { importService } = await import("./import-service");
      const { fileData, format } = req.body;
      
      if (!fileData) {
        return res.status(400).json({ error: "File data is required" });
      }

      const customers = await importService.parseFile(fileData, 'customers', format);
      const result = await importService.importCustomers(customers);
      res.json(result);
    } catch (error) {
      console.error("Error importing customers:", error);
      res.status(500).json({ error: "Failed to import customers: " + error.message });
    }
  });

  app.post("/api/import/stock", async (req, res) => {
    try {
      const { importService } = await import("./import-service");
      const { fileData, format } = req.body;
      
      if (!fileData) {
        return res.status(400).json({ error: "File data is required" });
      }

      const stockItems = await importService.parseFile(fileData, 'stock', format);
      const result = await importService.importStockItems(stockItems);
      res.json(result);
    } catch (error) {
      console.error("Error importing stock items:", error);
      res.status(500).json({ error: "Failed to import stock items: " + error.message });
    }
  });

  app.post("/api/import/transactions", async (req, res) => {
    try {
      const { importService } = await import("./import-service");
      const { fileData, format } = req.body;
      
      if (!fileData) {
        return res.status(400).json({ error: "File data is required" });
      }

      const transactions = await importService.parseFile(fileData, 'transactions', format);
      const result = await importService.importTransactions(transactions);
      res.json(result);
    } catch (error) {
      console.error("Error importing transactions:", error);
      res.status(500).json({ error: "Failed to import transactions: " + error.message });
    }
  });

  app.post("/api/import/invoices", async (req, res) => {
    try {
      const { importService } = await import("./import-service");
      const { fileData, format } = req.body;
      
      if (!fileData) {
        return res.status(400).json({ error: "File data is required" });
      }

      const invoices = await importService.parseFile(fileData, 'invoices', format);
      const result = await importService.importInvoices(invoices);
      res.json(result);
    } catch (error) {
      console.error("Error importing invoices:", error);
      res.status(500).json({ error: "Failed to import invoices: " + error.message });
    }
  });

  // Get import templates
  app.get("/api/import/template/:type", async (req, res) => {
    try {
      const { importService } = await import("./import-service");
      const { type } = req.params;
      
      if (!['customers', 'stock', 'invoices', 'transactions'].includes(type)) {
        return res.status(400).json({ error: "Invalid template type" });
      }

      const template = importService.generateTemplate(type as any);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_template.csv`);
      res.send(template);
    } catch (error) {
      console.error("Error generating template:", error);
      res.status(500).json({ error: "Failed to generate template" });
    }
  });

  // Get customers from database
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await db.select().from(schema.customers).orderBy(schema.customers.createdAt);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Get stock items from database
  app.get("/api/stock-items", async (req, res) => {
    try {
      const stockItems = await db.select().from(schema.stockItems).orderBy(schema.stockItems.createdAt);
      res.json(stockItems);
    } catch (error) {
      console.error("Error fetching stock items:", error);
      res.status(500).json({ error: "Failed to fetch stock items" });
    }
  });

  // Get sales invoices from database
  app.get("/api/sales-invoices", async (req, res) => {
    try {
      const salesInvoices = await db.select().from(schema.salesInvoices).orderBy(schema.salesInvoices.createdAt);
      res.json(salesInvoices);
    } catch (error) {
      console.error("Error fetching sales invoices:", error);
      res.status(500).json({ error: "Failed to fetch sales invoices" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
