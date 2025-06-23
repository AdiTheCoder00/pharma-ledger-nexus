import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Calculator,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCheck,
  LogOut,
  Bell,
} from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedSections, setExpandedSections] = useState([
    "inventory",
    "sales",
    "accounting",
  ]);

  useEffect(() => {
    // Update active section based on current route
    const path = location.pathname;
    if (path === "/") {
      setActiveSection("dashboard");
    } else if (path === "/settings") {
      setActiveSection("settings");
    } else if (path === "/inventory/stock-items") {
      setActiveSection("stock-items");
      setExpandedSections((prev) =>
        prev.includes("inventory") ? prev : [...prev, "inventory"],
      );
    } else if (path === "/inventory/batch-tracking") {
      setActiveSection("batch-tracking");
      setExpandedSections((prev) =>
        prev.includes("inventory") ? prev : [...prev, "inventory"],
      );
    } else if (path === "/inventory/expiry-management") {
      setActiveSection("expiry-management");
      setExpandedSections((prev) =>
        prev.includes("inventory") ? prev : [...prev, "inventory"],
      );
    } else if (path === "/inventory/stock-adjustment") {
      setActiveSection("stock-adjustment");
      setExpandedSections((prev) =>
        prev.includes("inventory") ? prev : [...prev, "inventory"],
      );
    } else if (path === "/inventory/low-stock-alerts") {
      setActiveSection("low-stock-alerts");
      setExpandedSections((prev) =>
        prev.includes("inventory") ? prev : [...prev, "inventory"],
      );
    } else if (path === "/sales/invoice") {
      setActiveSection("sales-invoice");
      setExpandedSections((prev) =>
        prev.includes("sales") ? prev : [...prev, "sales"],
      );
    } else if (path === "/sales/sales-return") {
      setActiveSection("sales-return");
      setExpandedSections((prev) =>
        prev.includes("sales") ? prev : [...prev, "sales"],
      );
    } else if (path === "/sales/delivery-notes") {
      setActiveSection("delivery-notes");
      setExpandedSections((prev) =>
        prev.includes("sales") ? prev : [...prev, "sales"],
      );
    } else if (path === "/sales/quotations") {
      setActiveSection("quotations");
      setExpandedSections((prev) =>
        prev.includes("sales") ? prev : [...prev, "sales"],
      );
    } else if (path === "/purchase/purchase-order") {
      setActiveSection("purchase-order");
      setExpandedSections((prev) =>
        prev.includes("purchase") ? prev : [...prev, "purchase"],
      );
    } else if (path === "/purchase/purchase-invoice") {
      setActiveSection("purchase-invoice");
      setExpandedSections((prev) =>
        prev.includes("purchase") ? prev : [...prev, "purchase"],
      );
    } else if (path === "/purchase/purchase-return") {
      setActiveSection("purchase-return");
      setExpandedSections((prev) =>
        prev.includes("purchase") ? prev : [...prev, "purchase"],
      );
    } else if (path === "/purchase/goods-receipt") {
      setActiveSection("goods-receipt");
      setExpandedSections((prev) =>
        prev.includes("purchase") ? prev : [...prev, "purchase"],
      );
    } else if (path === "/parties/customers") {
      setActiveSection("customers");
      setExpandedSections((prev) =>
        prev.includes("parties") ? prev : [...prev, "parties"],
      );
    } else if (path === "/parties/suppliers") {
      setActiveSection("suppliers");
      setExpandedSections((prev) =>
        prev.includes("parties") ? prev : [...prev, "parties"],
      );
    } else if (path === "/parties/drug-licenses") {
      setActiveSection("drug-licenses");
      setExpandedSections((prev) =>
        prev.includes("parties") ? prev : [...prev, "parties"],
      );
    } else if (path === "/parties/credit-limits") {
      setActiveSection("credit-limits");
      setExpandedSections((prev) =>
        prev.includes("parties") ? prev : [...prev, "parties"],
      );
    } else if (path === "/accounting/ledgers") {
      setActiveSection("ledgers");
      setExpandedSections((prev) =>
        prev.includes("accounting") ? prev : [...prev, "accounting"],
      );
    } else if (path === "/accounting/journal-entries") {
      setActiveSection("journal-entries");
      setExpandedSections((prev) =>
        prev.includes("accounting") ? prev : [...prev, "accounting"],
      );
    } else if (path === "/accounting/payment-receipt") {
      setActiveSection("payment-receipt");
      setExpandedSections((prev) =>
        prev.includes("accounting") ? prev : [...prev, "accounting"],
      );
    } else if (path === "/accounting/credit-debit-notes") {
      setActiveSection("credit-debit-notes");
      setExpandedSections((prev) =>
        prev.includes("accounting") ? prev : [...prev, "accounting"],
      );
    } else if (path === "/accounting/bank-reconciliation") {
      setActiveSection("bank-reconciliation");
      setExpandedSections((prev) =>
        prev.includes("accounting") ? prev : [...prev, "accounting"],
      );
    } else if (path === "/reports/profit-loss") {
      setActiveSection("profit-loss");
      setExpandedSections((prev) =>
        prev.includes("reports") ? prev : [...prev, "reports"],
      );
    } else if (path === "/reports/balance-sheet") {
      setActiveSection("balance-sheet");
      setExpandedSections((prev) =>
        prev.includes("reports") ? prev : [...prev, "reports"],
      );
    } else if (path === "/reports/gst-reports") {
      setActiveSection("gst-reports");
      setExpandedSections((prev) =>
        prev.includes("reports") ? prev : [...prev, "reports"],
      );
    } else if (path === "/reports/stock-reports") {
      setActiveSection("stock-reports");
      setExpandedSections((prev) =>
        prev.includes("reports") ? prev : [...prev, "reports"],
      );
    } else if (path === "/reports/party-reports") {
      setActiveSection("party-reports");
      setExpandedSections((prev) =>
        prev.includes("reports") ? prev : [...prev, "reports"],
      );
    } else if (path === "/gst-compliance/gstr1-reports") {
      setActiveSection("gstr1-reports");
      setExpandedSections((prev) =>
        prev.includes("gst-compliance") ? prev : [...prev, "gst-compliance"],
      );
    } else if (path === "/gst-compliance/gstr2a-reconciliation") {
      setActiveSection("gstr2a-reconciliation");
      setExpandedSections((prev) =>
        prev.includes("gst-compliance") ? prev : [...prev, "gst-compliance"],
      );
    } else if (path === "/gst-compliance/gstr3b-filing") {
      setActiveSection("gstr3b-filing");
      setExpandedSections((prev) =>
        prev.includes("gst-compliance") ? prev : [...prev, "gst-compliance"],
      );
    } else if (path === "/gst-compliance/hsn-summary") {
      setActiveSection("hsn-summary");
      setExpandedSections((prev) =>
        prev.includes("gst-compliance") ? prev : [...prev, "gst-compliance"],
      );
    } else if (path === "/gst-compliance/gst-audit-trail") {
      setActiveSection("gst-audit-trail");
      setExpandedSections((prev) =>
        prev.includes("gst-compliance") ? prev : [...prev, "gst-compliance"],
      );
    }
  }, [location.pathname]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const handleNavigation = (itemId: string) => {
    setActiveSection(itemId);

    // Navigate to different pages based on the item
    switch (itemId) {
      case "dashboard":
        navigate("/");
        break;
      case "settings":
        navigate("/settings");
        break;
      // Inventory items
      case "stock-items":
        navigate("/inventory/stock-items");
        break;
      case "batch-tracking":
        navigate("/inventory/batch-tracking");
        break;
      case "expiry-management":
        navigate("/inventory/expiry-management");
        break;
      case "stock-adjustment":
        navigate("/inventory/stock-adjustment");
        break;
      case "low-stock-alerts":
        navigate("/inventory/low-stock-alerts");
        break;
      // Sales items
      case "sales-invoice":
        navigate("/sales/invoice");
        break;
      case "sales-return":
        navigate("/sales/sales-return");
        break;
      case "delivery-notes":
        navigate("/sales/delivery-notes");
        break;
      case "quotations":
        navigate("/sales/quotations");
        break;
      // Purchase items
      case "purchase-order":
        navigate("/purchase/purchase-order");
        break;
      case "purchase-invoice":
        navigate("/purchase/purchase-invoice");
        break;
      case "purchase-return":
        navigate("/purchase/purchase-return");
        break;
      case "goods-receipt":
        navigate("/purchase/goods-receipt");
        break;
      // Parties items
      case "customers":
        navigate("/parties/customers");
        break;
      case "suppliers":
        navigate("/parties/suppliers");
        break;
      case "drug-licenses":
        navigate("/parties/drug-licenses");
        break;
      case "credit-limits":
        navigate("/parties/credit-limits");
        break;
      // Accounting items
      case "ledgers":
        navigate("/accounting/ledgers");
        break;
      case "journal-entries":
        navigate("/accounting/journal-entries");
        break;
      case "payment-receipt":
        navigate("/accounting/payment-receipt");
        break;
      case "credit-debit-notes":
        navigate("/accounting/credit-debit-notes");
        break;
      case "bank-reconciliation":
        navigate("/accounting/bank-reconciliation");
        break;
      // Reports items
      case "profit-loss":
        navigate("/reports/profit-loss");
        break;
      case "balance-sheet":
        navigate("/reports/balance-sheet");
        break;
      case "stock-reports":
        navigate("/reports/stock-reports");
        break;
      case "party-reports":
        navigate("/reports/party-reports");
        break;
      // GST Compliance items
      case "gstr1-reports":
        navigate("/gst-compliance/gstr1-reports");
        break;
      case "gstr2a-reconciliation":
        navigate("/gst-compliance/gstr2a-reconciliation");
        break;
      case "gstr3b-filing":
        navigate("/gst-compliance/gstr3b-filing");
        break;
      case "hsn-summary":
        navigate("/gst-compliance/hsn-summary");
        break;
      case "gst-audit-trail":
        navigate("/gst-compliance/gst-audit-trail");
        break;
      default:
        navigate("/");
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: activeSection === "dashboard",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      children: [
        { id: "stock-items", label: "Stock Items" },
        { id: "batch-tracking", label: "Batch Tracking" },
        { id: "expiry-management", label: "Expiry Management" },
        { id: "stock-adjustment", label: "Stock Adjustment" },
        { id: "low-stock-alerts", label: "Low Stock Alerts" },
      ],
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      children: [
        { id: "sales-invoice", label: "Sales Invoice" },
        { id: "sales-return", label: "Sales Return" },
        { id: "delivery-notes", label: "Delivery Notes" },
        { id: "quotations", label: "Quotations" },
      ],
    },
    {
      id: "purchase",
      label: "Purchase",
      icon: FileText,
      children: [
        { id: "purchase-order", label: "Purchase Order" },
        { id: "purchase-invoice", label: "Purchase Invoice" },
        { id: "purchase-return", label: "Purchase Return" },
        { id: "goods-receipt", label: "Goods Receipt" },
      ],
    },
    {
      id: "parties",
      label: "Parties",
      icon: Users,
      children: [
        { id: "customers", label: "Customers" },
        { id: "suppliers", label: "Suppliers" },
        { id: "drug-licenses", label: "Drug Licenses" },
        { id: "credit-limits", label: "Credit Limits" },
      ],
    },
    {
      id: "accounting",
      label: "Accounting",
      icon: Calculator,
      children: [
        { id: "ledgers", label: "Ledgers" },
        { id: "journal-entries", label: "Journal Entries" },
        { id: "payment-receipt", label: "Payment/Receipt" },
        { id: "credit-debit-notes", label: "Credit/Debit Notes" },
        { id: "bank-reconciliation", label: "Bank Reconciliation" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      children: [
        { id: "profit-loss", label: "Profit & Loss" },
        { id: "balance-sheet", label: "Balance Sheet" },
        { id: "stock-reports", label: "Stock Reports" },
        { id: "party-reports", label: "Party Reports" },
      ],
    },
    {
      id: "gst-compliance",
      label: "GST & Compliance",
      icon: FileText,
      children: [
        { id: "gstr1-reports", label: "GSTR-1 Reports" },
        { id: "gstr2a-reconciliation", label: "GSTR-2A Reconciliation" },
        { id: "gstr3b-filing", label: "GSTR-3B Filing" },
        { id: "hsn-summary", label: "HSN Summary" },
        { id: "gst-audit-trail", label: "GST Audit Trail" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      active: activeSection === "settings",
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gray-900">Maini Trading</h1>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Sunit Kumar Maini
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3",
                  item.active && "bg-blue-50 text-blue-700",
                )}
                onClick={() => {
                  if (item.children) {
                    toggleSection(item.id);
                  } else {
                    handleNavigation(item.id);
                  }
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.children &&
                  (expandedSections.includes(item.id) ? (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-2" />
                  ))}
              </Button>

              {item.children && expandedSections.includes(item.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.id}
                      variant={
                        activeSection === child.id ? "secondary" : "ghost"
                      }
                      className={cn(
                        "w-full justify-start h-auto p-2 text-sm text-gray-600 hover:text-gray-900",
                        activeSection === child.id &&
                          "bg-blue-50 text-blue-700 font-medium",
                      )}
                      onClick={() => handleNavigation(child.id)}
                    >
                      {child.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* System Status */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>License: Active</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-2 justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
