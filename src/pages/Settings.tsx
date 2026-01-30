import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Smartphone, 
  Shield, 
  Download, 
  Database,
  ChevronRight,
  LogOut,
  Trash2
} from "lucide-react";

const securitySettings = [
  {
    icon: Lock,
    title: "Change Password",
    description: "Update your account password",
  },
  {
    icon: Smartphone,
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security",
  },
  {
    icon: Shield,
    title: "Data Privacy",
    description: "Your health data is encrypted and stored securely. Only you have access to your complete medical records. We never share your data with third parties without your explicit consent.",
  },
];

const dataSettings = [
  {
    icon: Download,
    title: "Export Data",
    description: "Download all your health records",
  },
  {
    icon: Database,
    title: "Data Storage",
    description: "Manage your stored data",
  },
];

const Settings = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and account settings</p>
      </div>

      {/* Privacy & Security */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Privacy & Security</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your data and security settings</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securitySettings.map((setting, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <setting.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
          <p className="text-sm text-muted-foreground">Export or manage your health data</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dataSettings.map((setting, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                    <setting.icon className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full h-12 rounded-xl gap-2 justify-center">
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-xl gap-2 justify-center border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <Trash2 className="h-5 w-5" />
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Settings;
