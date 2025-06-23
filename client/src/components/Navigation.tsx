
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Bell
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState(['inventory', 'sales', 'accounting']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleNavigation = (itemId: string) => {
    setActiveSection(itemId);
    
    // Navigate to different pages based on the item
    switch (itemId) {
      case 'dashboard':
        navigate('/');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'stock-items':
        navigate('/inventory/stock-items');
        break;
      case 'sales-invoice':
        navigate('/sales/invoice');
        break;
      case 'customers':
        navigate('/parties/customers');
        break;
      case 'ledgers':
        navigate('/accounting/ledgers');
        break;
      case 'profit-loss':
        navigate('/reports/profit-loss');
        break;
      default:
        // For other items, show a coming soon alert
        alert(`${itemId.replace('-', ' ')} feature is coming soon!`);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: activeSection === 'dashboard'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      children: [
        { id: 'stock-items', label: 'Stock Items' },
        { id: 'batch-tracking', label: 'Batch Tracking' },
        { id: 'expiry-management', label: 'Expiry Management' },
        { id: 'stock-adjustment', label: 'Stock Adjustment' },
        { id: 'low-stock-alerts', label: 'Low Stock Alerts' }
      ]
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: ShoppingCart,
      children: [
        { id: 'sales-invoice', label: 'Sales Invoice' },
        { id: 'sales-return', label: 'Sales Return' },
        { id: 'delivery-notes', label: 'Delivery Notes' },
        { id: 'quotations', label: 'Quotations' }
      ]
    },
    {
      id: 'purchase',
      label: 'Purchase',
      icon: FileText,
      children: [
        { id: 'purchase-order', label: 'Purchase Order' },
        { id: 'purchase-invoice', label: 'Purchase Invoice' },
        { id: 'purchase-return', label: 'Purchase Return' },
        { id: 'goods-receipt', label: 'Goods Receipt' }
      ]
    },
    {
      id: 'parties',
      label: 'Parties',
      icon: Users,
      children: [
        { id: 'customers', label: 'Customers' },
        { id: 'suppliers', label: 'Suppliers' },
        { id: 'drug-licenses', label: 'Drug Licenses' },
        { id: 'credit-limits', label: 'Credit Limits' }
      ]
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: Calculator,
      children: [
        { id: 'ledgers', label: 'Ledgers' },
        { id: 'journal-entries', label: 'Journal Entries' },
        { id: 'payment-receipt', label: 'Payment/Receipt' },
        { id: 'credit-debit-notes', label: 'Credit/Debit Notes' },
        { id: 'bank-reconciliation', label: 'Bank Reconciliation' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      children: [
        { id: 'profit-loss', label: 'Profit & Loss' },
        { id: 'balance-sheet', label: 'Balance Sheet' },
        { id: 'gst-reports', label: 'GST Reports' },
        { id: 'stock-reports', label: 'Stock Reports' },
        { id: 'party-reports', label: 'Party Reports' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      active: activeSection === 'settings'
    }
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
            <h1 className="font-bold text-lg text-gray-900">PharmaTech</h1>
            <p className="text-xs text-gray-500">Distributor Pro</p>
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
            <p className="text-sm font-medium text-gray-900">User Name</p>
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
                  item.active && "bg-blue-50 text-blue-700"
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
                {item.children && (
                  expandedSections.includes(item.id) ? 
                    <ChevronDown className="h-4 w-4 ml-2" /> : 
                    <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </Button>
              
              {item.children && expandedSections.includes(item.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.id}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 text-sm text-gray-600 hover:text-gray-900"
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
