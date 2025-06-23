
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import StockItems from "./pages/StockItems";
import SalesInvoice from "./pages/SalesInvoice";
import Customers from "./pages/Customers";
import GSTR1Dashboard from "./pages/GSTR1Dashboard";
import DataImport from "./pages/DataImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory/stock-items" element={<StockItems />} />
          <Route path="/inventory/batch-tracking" element={<StockItems />} />
          <Route path="/inventory/expiry-management" element={<StockItems />} />
          <Route path="/inventory/stock-adjustment" element={<StockItems />} />
          <Route path="/inventory/low-stock-alerts" element={<StockItems />} />
          <Route path="/sales/invoice" element={<SalesInvoice />} />
          <Route path="/sales/sales-return" element={<SalesInvoice />} />
          <Route path="/sales/delivery-notes" element={<SalesInvoice />} />
          <Route path="/sales/quotations" element={<SalesInvoice />} />
          <Route path="/purchase/purchase-order" element={<SalesInvoice />} />
          <Route path="/purchase/purchase-invoice" element={<SalesInvoice />} />
          <Route path="/purchase/purchase-return" element={<SalesInvoice />} />
          <Route path="/purchase/goods-receipt" element={<SalesInvoice />} />
          <Route path="/parties/customers" element={<Customers />} />
          <Route path="/parties/suppliers" element={<Customers />} />
          <Route path="/parties/drug-licenses" element={<Customers />} />
          <Route path="/parties/credit-limits" element={<Customers />} />
          <Route path="/accounting/ledgers" element={<Settings />} />
          <Route path="/accounting/journal-entries" element={<Settings />} />
          <Route path="/accounting/payment-receipt" element={<Settings />} />
          <Route path="/accounting/credit-debit-notes" element={<Settings />} />
          <Route path="/accounting/bank-reconciliation" element={<Settings />} />
          <Route path="/reports/profit-loss" element={<Index />} />
          <Route path="/reports/balance-sheet" element={<Index />} />
          <Route path="/reports/stock-reports" element={<Index />} />
          <Route path="/reports/party-reports" element={<Index />} />
          <Route path="/gst-compliance/gstr1-reports" element={<GSTR1Dashboard />} />
          <Route path="/gst-compliance/gstr2a-reconciliation" element={<Settings />} />
          <Route path="/gst-compliance/gstr3b-filing" element={<Settings />} />
          <Route path="/gst-compliance/hsn-summary" element={<GSTR1Dashboard />} />
          <Route path="/gst-compliance/gst-audit-trail" element={<Settings />} />
          <Route path="/data-import" element={<DataImport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
