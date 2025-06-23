
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, FileText, Calculator, CreditCard, DollarSign, BarChart3 } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import GSTR1Features from '@/components/GSTR1Features';
import Navigation from '@/components/Navigation';

const Settings = () => {
  const location = useLocation();

  // Get page info based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/settings':
        return { title: 'Settings', description: 'Manage your account and system preferences', icon: SettingsIcon };
      case '/accounting/ledgers':
        return { title: 'Ledgers', description: 'Manage chart of accounts and ledger entries', icon: BarChart3 };
      case '/accounting/journal-entries':
        return { title: 'Journal Entries', description: 'Record manual journal entries and adjustments', icon: FileText };
      case '/accounting/payment-receipt':
        return { title: 'Payment/Receipt', description: 'Track payments and receipts', icon: DollarSign };
      case '/accounting/credit-debit-notes':
        return { title: 'Credit/Debit Notes', description: 'Manage credit and debit note transactions', icon: CreditCard };
      case '/accounting/bank-reconciliation':
        return { title: 'Bank Reconciliation', description: 'Reconcile bank statements with accounts', icon: Calculator };
      case '/gst-compliance/gstr1-reports':
        return { title: 'GSTR-1 Reports', description: 'Generate and manage GSTR-1 reports', icon: FileText };
      case '/gst-compliance/gstr2a-reconciliation':
        return { title: 'GSTR-2A Reconciliation', description: 'Reconcile purchase data with GSTR-2A', icon: BarChart3 };
      case '/gst-compliance/gstr3b-filing':
        return { title: 'GSTR-3B Filing', description: 'File monthly GSTR-3B returns', icon: FileText };
      case '/gst-compliance/hsn-summary':
        return { title: 'HSN Summary', description: 'Generate HSN-wise summary reports', icon: BarChart3 };
      case '/gst-compliance/gst-audit-trail':
        return { title: 'GST Audit Trail', description: 'Track all GST-related transactions', icon: FileText };
      default:
        return { title: 'Settings', description: 'Manage your account and system preferences', icon: SettingsIcon };
    }
  };

  const { title, description, icon: Icon } = getPageInfo();

  const renderAccountingContent = () => {
    const path = location.pathname;
    
    if (path.startsWith('/gst-compliance/')) {
      return <GSTR1Features />;
    }
    
    // Accounting features
    switch (path) {
      case '/accounting/ledgers':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Accounts</p>
                <p className="text-2xl font-bold text-blue-900">45</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Assets</p>
                <p className="text-2xl font-bold text-green-900">₹12,45,000</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Liabilities</p>
                <p className="text-2xl font-bold text-orange-900">₹8,75,000</p>
              </div>
            </div>
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chart of Accounts</h3>
              <p className="text-gray-500 mb-6">Manage your accounting ledgers and account structure</p>
            </div>
          </div>
        );
      
      case '/accounting/journal-entries':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Entries</p>
                <p className="text-2xl font-bold text-blue-900">156</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">This Month</p>
                <p className="text-2xl font-bold text-green-900">23</p>
              </div>
            </div>
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Journal Entries</h3>
              <p className="text-gray-500 mb-6">Record manual accounting entries and adjustments</p>
            </div>
          </div>
        );
      
      case '/accounting/payment-receipt':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Payments</p>
                <p className="text-2xl font-bold text-blue-900">₹45,200</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Receipts</p>
                <p className="text-2xl font-bold text-green-900">₹67,800</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">₹12,500</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Net Cash Flow</p>
                <p className="text-2xl font-bold text-purple-900">₹22,600</p>
              </div>
            </div>
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment & Receipt Tracking</h3>
              <p className="text-gray-500 mb-6">Monitor cash flow and payment transactions</p>
            </div>
          </div>
        );
      
      case '/accounting/credit-debit-notes':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Credit Notes</p>
                <p className="text-2xl font-bold text-red-900">8</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Debit Notes</p>
                <p className="text-2xl font-bold text-blue-900">5</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Value</p>
                <p className="text-2xl font-bold text-green-900">₹15,400</p>
              </div>
            </div>
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Credit & Debit Notes</h3>
              <p className="text-gray-500 mb-6">Manage return and adjustment transactions</p>
            </div>
          </div>
        );
      
      case '/accounting/bank-reconciliation':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Bank Balance</p>
                <p className="text-2xl font-bold text-blue-900">₹1,25,450</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Book Balance</p>
                <p className="text-2xl font-bold text-green-900">₹1,23,200</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Unreconciled</p>
                <p className="text-2xl font-bold text-yellow-900">₹2,250</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-900">3</p>
              </div>
            </div>
            <div className="text-center py-8">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Reconciliation</h3>
              <p className="text-gray-500 mb-6">Reconcile bank statements with book records</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Accounting Dashboard</h3>
            <p className="text-gray-500 mb-6">Access accounting features from the navigation menu</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Icon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <Badge variant="outline" className="ml-2">
              {location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Show different content based on route */}
        {location.pathname === '/settings' ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="gstr1" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                GSTR-1
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <UserProfile />
            </TabsContent>

            <TabsContent value="gstr1" className="mt-6">
              <GSTR1Features />
            </TabsContent>
          </Tabs>
        ) : (
          renderAccountingContent()
        )}
      </div>
    </div>
  );
};

export default Settings;
