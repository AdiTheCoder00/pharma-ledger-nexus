import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UserCheck, Edit, Save, X, Building, Phone, Mail, MapPin, Hash } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface UserProfileData {
  userName: string;
  email: string;
  companyName: string;
  gstNumber: string;
  phoneNumber: string;
  address: string;
  businessType: string;
  licenseNumber: string;
}

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    userName: 'Pharmacy Admin',
    email: '',
    companyName: '',
    gstNumber: '',
    phoneNumber: '',
    address: '',
    businessType: 'Retail Pharmacy',
    licenseNumber: ''
  });
  const [tempData, setTempData] = useState<UserProfileData>(profileData);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfileData(parsedProfile);
      setTempData(parsedProfile);
    }
  };

  const handleSave = () => {
    setProfileData(tempData);
    localStorage.setItem('userProfile', JSON.stringify(tempData));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const updateTempData = (field: keyof UserProfileData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            User Profile
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardTitle>
        <CardDescription>Manage your account information and business details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Name</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={tempData.userName}
                  onChange={(e) => updateTempData('userName', e.target.value)}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{profileData.userName}</span>
                  <Badge variant="secondary">Administrator</Badge>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? tempData.email : profileData.email}
                  onChange={(e) => updateTempData('email', e.target.value)}
                  placeholder="Enter email address"
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  value={isEditing ? tempData.phoneNumber : profileData.phoneNumber}
                  onChange={(e) => updateTempData('phoneNumber', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={isEditing ? tempData.businessType : profileData.businessType}
                onChange={(e) => updateTempData('businessType', e.target.value)}
                placeholder="e.g., Retail Pharmacy"
                disabled={!isEditing}
              />
            </div>
          </div>
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
              <Label htmlFor="companyName">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="companyName"
                  value={isEditing ? tempData.companyName : profileData.companyName}
                  onChange={(e) => updateTempData('companyName', e.target.value)}
                  placeholder="Enter company name"
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="gstNumber"
                  value={isEditing ? tempData.gstNumber : profileData.gstNumber}
                  onChange={(e) => updateTempData('gstNumber', e.target.value)}
                  placeholder="Enter GST number"
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="licenseNumber">Drug License Number</Label>
              <Input
                id="licenseNumber"
                value={isEditing ? tempData.licenseNumber : profileData.licenseNumber}
                onChange={(e) => updateTempData('licenseNumber', e.target.value)}
                placeholder="Enter drug license number"
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Business Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Textarea
                  id="address"
                  value={isEditing ? tempData.address : profileData.address}
                  onChange={(e) => updateTempData('address', e.target.value)}
                  placeholder="Enter complete business address"
                  disabled={!isEditing}
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-2 pt-4 border-t">
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
      </CardContent>
    </Card>
  );
};

export default UserProfile;