import { db } from "./db";
import { salesInvoices, salesInvoiceItems, customers, hsnMaster, gstr1HsnSummary } from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export interface GSTR1HSNSummary {
  hsnCode: string;
  description: string;
  uom: string;
  totalQuantity: number;
  totalValue: number;
  taxableValue: number;
  integratedTax: number;
  centralTax: number;
  stateTax: number;
}

export interface GSTR1B2BSummary {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGstin: string;
  placeOfSupply: string;
  reverseCharge: string;
  invoiceType: string;
  invoiceValue: number;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  hsnCode: string;
}

export interface GSTR1B2CSummary {
  placeOfSupply: string;
  taxRate: number;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
}

export class GSTR1Service {
  // Generate HSN Summary for both B2B and B2C transactions
  async generateHSNSummary(fromDate: string, toDate: string): Promise<GSTR1HSNSummary[]> {
    const hsnSummaryData = await db
      .select({
        hsnCode: salesInvoiceItems.hsnCode,
        description: sql<string>`COALESCE(${hsnMaster.description}, 'Unknown')`.as('description'),
        totalQuantity: sql<number>`SUM(${salesInvoiceItems.quantity})`.as('total_quantity'),
        totalValue: sql<number>`SUM(${salesInvoiceItems.totalAmount})`.as('total_value'),
        taxableValue: sql<number>`SUM(${salesInvoiceItems.taxableAmount})`.as('taxable_value'),
        integratedTax: sql<number>`SUM(${salesInvoiceItems.igstAmount})`.as('integrated_tax'),
        centralTax: sql<number>`SUM(${salesInvoiceItems.cgstAmount})`.as('central_tax'),
        stateTax: sql<number>`SUM(${salesInvoiceItems.sgstAmount})`.as('state_tax'),
      })
      .from(salesInvoiceItems)
      .innerJoin(salesInvoices, eq(salesInvoiceItems.invoiceId, salesInvoices.id))
      .leftJoin(hsnMaster, eq(salesInvoiceItems.hsnCode, hsnMaster.hsnCode))
      .where(
        and(
          gte(salesInvoices.invoiceDate, new Date(fromDate)),
          lte(salesInvoices.invoiceDate, new Date(toDate))
        )
      )
      .groupBy(salesInvoiceItems.hsnCode, hsnMaster.description)
      .orderBy(salesInvoiceItems.hsnCode);

    return hsnSummaryData.map(item => ({
      hsnCode: item.hsnCode,
      description: item.description,
      uom: 'NOS', // Default unit of measurement
      totalQuantity: Number(item.totalQuantity),
      totalValue: Number(item.totalValue),
      taxableValue: Number(item.taxableValue),
      integratedTax: Number(item.integratedTax),
      centralTax: Number(item.centralTax),
      stateTax: Number(item.stateTax),
    }));
  }

  // Generate B2B Summary (customers with GST registration)
  async generateB2BSummary(fromDate: string, toDate: string): Promise<GSTR1B2BSummary[]> {
    const b2bData = await db
      .select({
        invoiceNumber: salesInvoices.invoiceNumber,
        invoiceDate: salesInvoices.invoiceDate,
        customerName: salesInvoices.customerName,
        customerGstin: salesInvoices.customerGstin,
        invoiceValue: salesInvoices.totalAmount,
        taxableValue: sql<number>`SUM(${salesInvoiceItems.taxableAmount})`.as('taxable_value'),
        igstAmount: sql<number>`SUM(${salesInvoiceItems.igstAmount})`.as('igst_amount'),
        cgstAmount: sql<number>`SUM(${salesInvoiceItems.cgstAmount})`.as('cgst_amount'),
        sgstAmount: sql<number>`SUM(${salesInvoiceItems.sgstAmount})`.as('sgst_amount'),
        hsnCode: salesInvoiceItems.hsnCode,
      })
      .from(salesInvoices)
      .innerJoin(salesInvoiceItems, eq(salesInvoices.id, salesInvoiceItems.invoiceId))
      .where(
        and(
          eq(salesInvoices.customerType, 'B2B'),
          gte(salesInvoices.invoiceDate, new Date(fromDate)),
          lte(salesInvoices.invoiceDate, new Date(toDate))
        )
      )
      .groupBy(
        salesInvoices.id,
        salesInvoices.invoiceNumber,
        salesInvoices.invoiceDate,
        salesInvoices.customerName,
        salesInvoices.customerGstin,
        salesInvoices.totalAmount,
        salesInvoiceItems.hsnCode
      )
      .orderBy(salesInvoices.invoiceDate, salesInvoices.invoiceNumber);

    return b2bData.map(item => ({
      invoiceNumber: item.invoiceNumber,
      invoiceDate: item.invoiceDate.toISOString().split('T')[0],
      customerName: item.customerName,
      customerGstin: item.customerGstin || '',
      placeOfSupply: '27', // Default to Karnataka, should be configurable
      reverseCharge: 'N',
      invoiceType: 'Regular',
      invoiceValue: Number(item.invoiceValue),
      taxableValue: Number(item.taxableValue),
      igstAmount: Number(item.igstAmount),
      cgstAmount: Number(item.cgstAmount),
      sgstAmount: Number(item.sgstAmount),
      hsnCode: item.hsnCode,
    }));
  }

  // Generate B2C Summary (customers without GST registration or retail sales)
  async generateB2CSummary(fromDate: string, toDate: string): Promise<GSTR1B2CSummary[]> {
    const b2cData = await db
      .select({
        taxRate: salesInvoiceItems.gstRate,
        taxableValue: sql<number>`SUM(${salesInvoiceItems.taxableAmount})`.as('taxable_value'),
        igstAmount: sql<number>`SUM(${salesInvoiceItems.igstAmount})`.as('igst_amount'),
        cgstAmount: sql<number>`SUM(${salesInvoiceItems.cgstAmount})`.as('cgst_amount'),
        sgstAmount: sql<number>`SUM(${salesInvoiceItems.sgstAmount})`.as('sgst_amount'),
      })
      .from(salesInvoices)
      .innerJoin(salesInvoiceItems, eq(salesInvoices.id, salesInvoiceItems.invoiceId))
      .where(
        and(
          eq(salesInvoices.customerType, 'B2C'),
          gte(salesInvoices.invoiceDate, new Date(fromDate)),
          lte(salesInvoices.invoiceDate, new Date(toDate))
        )
      )
      .groupBy(salesInvoiceItems.gstRate)
      .orderBy(salesInvoiceItems.gstRate);

    return b2cData.map(item => ({
      placeOfSupply: '27', // Default to Karnataka, should be configurable
      taxRate: Number(item.taxRate),
      taxableValue: Number(item.taxableValue),
      igstAmount: Number(item.igstAmount),
      cgstAmount: Number(item.cgstAmount),
      sgstAmount: Number(item.sgstAmount),
    }));
  }

  // Categorize HSN codes by transaction type
  async getHSNCategorization(fromDate: string, toDate: string) {
    const hsnB2BData = await db
      .select({
        hsnCode: salesInvoiceItems.hsnCode,
        description: sql<string>`COALESCE(${hsnMaster.description}, 'Unknown')`.as('description'),
        b2bValue: sql<number>`SUM(${salesInvoiceItems.totalAmount})`.as('b2b_value'),
        b2bQuantity: sql<number>`SUM(${salesInvoiceItems.quantity})`.as('b2b_quantity'),
      })
      .from(salesInvoiceItems)
      .innerJoin(salesInvoices, eq(salesInvoiceItems.invoiceId, salesInvoices.id))
      .leftJoin(hsnMaster, eq(salesInvoiceItems.hsnCode, hsnMaster.hsnCode))
      .where(
        and(
          eq(salesInvoices.customerType, 'B2B'),
          gte(salesInvoices.invoiceDate, new Date(fromDate)),
          lte(salesInvoices.invoiceDate, new Date(toDate))
        )
      )
      .groupBy(salesInvoiceItems.hsnCode, hsnMaster.description);

    const hsnB2CData = await db
      .select({
        hsnCode: salesInvoiceItems.hsnCode,
        description: sql<string>`COALESCE(${hsnMaster.description}, 'Unknown')`.as('description'),
        b2cValue: sql<number>`SUM(${salesInvoiceItems.totalAmount})`.as('b2c_value'),
        b2cQuantity: sql<number>`SUM(${salesInvoiceItems.quantity})`.as('b2c_quantity'),
      })
      .from(salesInvoiceItems)
      .innerJoin(salesInvoices, eq(salesInvoiceItems.invoiceId, salesInvoices.id))
      .leftJoin(hsnMaster, eq(salesInvoiceItems.hsnCode, hsnMaster.hsnCode))
      .where(
        and(
          eq(salesInvoices.customerType, 'B2C'),
          gte(salesInvoices.invoiceDate, new Date(fromDate)),
          lte(salesInvoices.invoiceDate, new Date(toDate))
        )
      )
      .groupBy(salesInvoiceItems.hsnCode, hsnMaster.description);

    // Combine B2B and B2C data
    const combinedData = new Map();
    
    hsnB2BData.forEach(item => {
      combinedData.set(item.hsnCode, {
        hsnCode: item.hsnCode,
        description: item.description,
        b2bValue: Number(item.b2bValue),
        b2bQuantity: Number(item.b2bQuantity),
        b2cValue: 0,
        b2cQuantity: 0,
      });
    });

    hsnB2CData.forEach(item => {
      const existing = combinedData.get(item.hsnCode) || {
        hsnCode: item.hsnCode,
        description: item.description,
        b2bValue: 0,
        b2bQuantity: 0,
        b2cValue: 0,
        b2cQuantity: 0,
      };
      
      existing.b2cValue = Number(item.b2cValue);
      existing.b2cQuantity = Number(item.b2cQuantity);
      combinedData.set(item.hsnCode, existing);
    });

    return Array.from(combinedData.values()).sort((a, b) => a.hsnCode.localeCompare(b.hsnCode));
  }

  // Populate common pharmaceutical HSN codes
  async seedPharmaceuticalHSNCodes() {
    const commonPharmaHSN = [
      { hsnCode: '30041000', description: 'Medicaments containing penicillins or derivatives thereof', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30042000', description: 'Medicaments containing antibiotics (other than penicillins)', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30043100', description: 'Medicaments containing insulin', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30043200', description: 'Medicaments containing corticosteroid hormones', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30043900', description: 'Other medicaments containing hormones', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30044000', description: 'Medicaments containing alkaloids', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30045000', description: 'Other medicaments containing vitamins', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30049000', description: 'Other medicaments', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '30051000', description: 'Adhesive dressings and other articles having an adhesive layer', gstRate: '12.00', category: 'medical_device' },
      { hsnCode: '30059090', description: 'Other pharmaceutical goods', gstRate: '12.00', category: 'pharma' },
      { hsnCode: '90211000', description: 'Orthopaedic appliances', gstRate: '5.00', category: 'medical_device' },
      { hsnCode: '90212100', description: 'Artificial teeth and dental fittings', gstRate: '12.00', category: 'medical_device' },
      { hsnCode: '90189099', description: 'Other medical instruments and appliances', gstRate: '12.00', category: 'medical_device' },
    ];

    for (const hsn of commonPharmaHSN) {
      try {
        await db.insert(hsnMaster).values(hsn).onConflictDoNothing();
      } catch (error) {
        console.log(`HSN ${hsn.hsnCode} already exists or error inserting:`, error);
      }
    }
  }
}

export const gstr1Service = new GSTR1Service();