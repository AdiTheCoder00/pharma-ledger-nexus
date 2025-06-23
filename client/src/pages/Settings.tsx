
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
      default:
        return { title: 'Settings', description: 'Manage your account and system preferences', icon: SettingsIcon };
    }
  };

  const { title, description, icon: Icon } = getPageInfo();

  const renderAccountingContent = () => {
    return (
      <div className="text-center py-12">
        <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Accounting Feature Coming Soon</h3>
        <p className="text-gray-500 mb-6">This accounting feature is under development and will be available soon</p>
      </div>
    );
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
