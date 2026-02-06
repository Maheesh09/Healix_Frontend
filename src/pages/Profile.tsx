import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Droplet, Calendar, Stethoscope, Heart, Pencil } from "lucide-react";

const personalInfo = [
  { icon: User, label: "Full Name", value: "Shageeshan Thamodharam" },
  { icon: Mail, label: "Email Address", value: "shageejoxtyn@gmail.com" },
  { icon: Phone, label: "Phone Number", value: "+94771089061" },
  { icon: MapPin, label: "Address", value: "49/2 Melfort estate, Gemunupura Kothalawala" },
];

const medicalInfo = [
  { icon: Droplet, label: "Blood Type", value: "O+", color: "bg-destructive/10" },
  { icon: Calendar, label: "Last Checkup", value: "Nov 15, 2025", color: "bg-primary/10" },
  { icon: Stethoscope, label: "Primary Care Physician", value: "Doctor Hitha Hoda", color: "bg-info/10" },
  { icon: Heart, label: "Emergency Contact", value: "Maheesha", subvalue: "+94763658903", color: "bg-warning/10" },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalData, setPersonalData] = useState(personalInfo);
  const [medicalData, setMedicalData] = useState(medicalInfo);

  const handlePersonalChange = (index: number, newValue: string) => {
    const updated = [...personalData];
    updated[index].value = newValue;
    setPersonalData(updated);
  };

  const handleMedicalChange = (index: number, newValue: string) => {
    const updated = [...medicalData];
    updated[index].value = newValue;
    setMedicalData(updated);
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save updates to backend here
    console.log("Saving profile:", { personalData, medicalData });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          variant={isEditing ? "ghost" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Personal Information */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalData.map((info, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {isEditing ? (
                      <Input
                        value={info.value}
                        onChange={(e) => handlePersonalChange(index, e.target.value)}
                        className="mt-1 h-8 max-w-md"
                      />
                    ) : (
                      <p className="font-medium text-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
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
            {medicalData.map((info, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${info.color} flex items-center gap-4 transition-all duration-300 hover:shadow-sm`}
              >
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shrink-0">
                  <info.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">{info.label}</p>
                  {isEditing ? (
                    <Input
                      value={info.value}
                      onChange={(e) => handleMedicalChange(index, e.target.value)}
                      className="mt-1 h-8 bg-background/50"
                    />
                  ) : (
                    <p className="font-medium text-foreground truncate">{info.value}</p>
                  )}
                  {info.subvalue && !isEditing && (
                    <p className="text-sm text-muted-foreground">{info.subvalue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button 
            className="w-full mt-6 h-11 rounded-xl"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? "Save Changes" : "Update Medical Information"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
