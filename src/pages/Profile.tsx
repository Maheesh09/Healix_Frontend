import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Droplet, Calendar, Stethoscope, Heart, Pencil } from "lucide-react";

const personalInfo = [
  { icon: User, label: "Full Name", value: "Alex Johnson" },
  { icon: Mail, label: "Email Address", value: "alex.johnson@email.com" },
  { icon: Phone, label: "Phone Number", value: "+1 (555) 123-4567" },
  { icon: MapPin, label: "Address", value: "123 Health Street, Medical City, MC 12345" },
];

const medicalInfo = [
  { icon: Droplet, label: "Blood Type", value: "O+", color: "bg-destructive/10" },
  { icon: Calendar, label: "Last Checkup", value: "Nov 15, 2025", color: "bg-primary/10" },
  { icon: Stethoscope, label: "Primary Care Physician", value: "Dr. Sarah Chen", color: "bg-info/10" },
  { icon: Heart, label: "Emergency Contact", value: "Jane Johnson", subvalue: "+1 (555) 987-6543", color: "bg-warning/10" },
];

const Profile = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information</p>
      </div>

      {/* Personal Information */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    <p className="font-medium text-foreground">{info.value}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {medicalInfo.map((info, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${info.color} flex items-center gap-4`}
              >
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center">
                  <info.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{info.label}</p>
                  <p className="font-medium text-foreground">{info.value}</p>
                  {info.subvalue && (
                    <p className="text-sm text-muted-foreground">{info.subvalue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-6 h-11 rounded-xl">
            Update Medical Information
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
