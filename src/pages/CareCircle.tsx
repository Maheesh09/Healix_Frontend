import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  Shield,
  Send,
  Mail,
  Link as LinkIcon,
  Share2,
  Settings,
  Stethoscope,
  Heart
} from "lucide-react";

const summaryCards = [
  { icon: Users, label: "Circle Members", value: "3", color: "bg-primary/10 text-primary" },
  { icon: FileText, label: "Reports Shared", value: "25", color: "bg-info/10 text-info" },
  { icon: Shield, label: "Full Access", value: "2", color: "bg-success/10 text-success" },
];

const initialMembers = [
  {
    id: 1,
    name: "Dr. Priyantha Silva",
    email: "dr.priyantha@hospital.lk",
    access: "Full Access",
    reportsShared: 12,
    lastActive: "2 hours ago",
    icon: Stethoscope,
  },
  {
    id: 2,
    name: "Amma",
    email: "amma@gmail.com",
    access: "View Only",
    reportsShared: 5,
    lastActive: "Yesterday",
    icon: Heart,
  },
  {
    id: 3,
    name: "Dr. Nimal Perera",
    email: "dr.nimal@clinic.lk",
    access: "Full Access",
    reportsShared: 8,
    lastActive: "3 days ago",
    icon: Stethoscope,
  },
];

const recentShares = [
  { report: "Blood Test Results", sharedWith: "Dr. Priyantha Silva", time: "Today" },
  { report: "X-Ray Report", sharedWith: "Amma", time: "Yesterday" },
  { report: "Annual Checkup", sharedWith: "Dr. Nimal Perera", time: "3 days ago" },
];

const CareCircle = () => {
  const [members, setMembers] = useState(initialMembers);
  const [editingMember, setEditingMember] = useState<typeof initialMembers[0] | null>(null);

  const handleUpdateMember = (id: number, field: string, value: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
    if (editingMember && editingMember.id === id) {
      setEditingMember({ ...editingMember, [field]: value });
    }
  };

  const handleShare = (platform: string) => {
    const url = "https://healix.app/share/123"; // Mock URL
    const text = "Check out my health report on Healix";
    
    switch (platform) {
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case "email":
        window.location.href = `mailto:?subject=Health Report Shared via Healix&body=${text}: ${url}`;
        break;
      case "link":
        navigator.clipboard.writeText(url);
        // Toast would be good here, but console for now
        console.log("Link copied to clipboard");
        break;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Care Circle</h1>
        <p className="text-muted-foreground">Share your health reports with trusted doctors and family members</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="shadow-card border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Circle Members */}
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Circle Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <member.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${member.access === "Full Access"
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {member.access}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.reportsShared} reports shared • {member.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setEditingMember(member)}
                        >
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Member Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              value={editingMember?.id === member.id ? editingMember.name : member.name} 
                              onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              value={editingMember?.id === member.id ? editingMember.email : member.email} 
                              onChange={(e) => handleUpdateMember(member.id, 'email', e.target.value)}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Share */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Share</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  onClick={() => handleShare('telegram')}
                  className="h-20 flex-col gap-2 rounded-xl bg-[#229ED9] hover:bg-[#229ED9]/90 p-0"
                >
                  <Send className="h-6 w-6" />
                  <span className="text-xs font-medium">Telegram</span>
                </Button>
                <Button 
                  onClick={() => handleShare('email')}
                  className="h-20 flex-col gap-2 rounded-xl bg-info hover:bg-info/90 p-0"
                >
                  <Mail className="h-6 w-6" />
                  <span className="text-xs font-medium">Email</span>
                </Button>
                <Button 
                  onClick={() => handleShare('link')}
                  className="h-20 flex-col gap-2 rounded-xl bg-primary hover:bg-primary/90 p-0"
                >
                  <LinkIcon className="h-6 w-6" />
                  <span className="text-xs font-medium">Secure Link</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Shares */}
          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Recent Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentShares.map((share, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {share.report}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Shared with {share.sharedWith}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {share.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareCircle;
