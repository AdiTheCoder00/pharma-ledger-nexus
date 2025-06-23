
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, FileText } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import GSTR1Features from '@/components/GSTR1Features';
import Navigation from '@/components/Navigation';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3" />
            Settings
          </h1>
          <p className="text-gray-600">Manage your account and system preferences</p>
        </div>

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
      </div>
    </div>
  );
};

export default Settings;
