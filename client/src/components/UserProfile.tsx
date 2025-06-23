
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Edit, Save, X, Building, Phone, Mail } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('User Name');
  const [tempUserName, setTempUserName] = useState(userName);
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    setUserName(tempUserName);
    setIsEditing(false);
    // Here you would typically save to your backend/database
  };

  const handleCancel = () => {
    setTempUserName(userName);
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          User Profile
        </CardTitle>
        <CardDescription>Manage your account information and business details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Personal Information</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{userName}</span>
                  <Badge variant="secondary">Administrator</Badge>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input
                id="gst"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="Enter GST number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Settings</h3>
          <div className="flex space-x-4">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Two-Factor Authentication</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
