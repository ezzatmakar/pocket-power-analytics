import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Bell, 
  Fingerprint, 
  Database, 
  FileJson, 
  ArrowDownToLine,
  Save,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, signOut } = useAuth();
  
  const displayName = user?.user_metadata?.name || 
                      user?.user_metadata?.full_name || 
                      user?.email?.split('@')[0] || 
                      'User';
  
  const [profileForm, setProfileForm] = useState({
    name: displayName,
    email: user?.email || '',
    isSubmitting: false
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    monthlyReports: true,
    darkMode: false,
    forecastAlerts: true
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    setProfileForm(prev => ({ ...prev, isSubmitting: true }));
    
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setProfileForm(prev => ({ ...prev, isSubmitting: false }));
    }, 1000);
  };
  
  const handlePreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Preferences Saved",
      description: "Your notification and display preferences have been updated.",
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your data is being prepared for download.",
    });
    
    setTimeout(() => {
      toast({
        title: "Data Export Ready",
        description: "Your data has been exported successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileUpdate}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={profileForm.name}
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      placeholder="Your name" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                      placeholder="your.email@example.com" 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={profileForm.isSubmitting}>
                  {profileForm.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={signOut}
                >
                  Log Out
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handlePreferencesUpdate}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you would like to be notified about your income and forecasts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={checked => 
                      setPreferences({...preferences, emailNotifications: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="monthly-reports">Monthly Income Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a monthly email with your income summary
                    </p>
                  </div>
                  <Switch
                    id="monthly-reports"
                    checked={preferences.monthlyReports}
                    onCheckedChange={checked => 
                      setPreferences({...preferences, monthlyReports: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="forecast-alerts">Forecast Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when forecast projects are ready to start
                    </p>
                  </div>
                  <Switch
                    id="forecast-alerts"
                    checked={preferences.forecastAlerts}
                    onCheckedChange={checked => 
                      setPreferences({...preferences, forecastAlerts: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={preferences.darkMode}
                    onCheckedChange={checked => 
                      setPreferences({...preferences, darkMode: checked})
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Preferences</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export your data or manage your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <FileJson className="h-5 w-5 mr-2 text-money-primary" />
                  Export Data
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download your income data in JSON format for backup or analysis
                </p>
                <Button 
                  className="flex items-center" 
                  variant="outline" 
                  onClick={handleExportData}
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Export Income Data
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Fingerprint className="h-5 w-5 mr-2 text-money-primary" />
                  Account Security
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account security and password
                </p>
                <Button className="mr-4">Change Password</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
