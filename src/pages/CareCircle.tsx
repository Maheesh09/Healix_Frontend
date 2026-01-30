import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Shield, 
  MessageCircle, 
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

const circleMembers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "dr.sarah@hospital.com",
    access: "Full Access",
    reportsShared: 12,
    lastActive: "2 hours ago",
    icon: Stethoscope,
  },
  {
    id: 2,
    name: "Mom",
    email: "mom@email.com",
    access: "View Only",
    reportsShared: 5,
    lastActive: "Yesterday",
    icon: Heart,
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    email: "dr.chen@clinic.com",
    access: "Full Access",
    reportsShared: 8,
    lastActive: "3 days ago",
    icon: Stethoscope,
  },
];

const recentShares = [
  { report: "Blood Test Results", sharedWith: "Dr. Sarah Johnson", time: "Today" },
  { report: "X-Ray Report", sharedWith: "Mom", time: "Yesterday" },
  { report: "Annual Checkup", sharedWith: "Dr. Michael Chen", time: "3 days ago" },
];

const CareCircle = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Care Circle</h1>
        <p className="text-muted-foreground">Share your health reports with trusted doctors and family members</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
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
              {circleMembers.map((member) => (
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
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            member.access === "Full Access"
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </Button>
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
              <div className="flex gap-4">
                <Button className="flex-1 h-16 flex-col gap-1 rounded-xl bg-success hover:bg-success/90">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                <Button className="flex-1 h-16 flex-col gap-1 rounded-xl bg-info hover:bg-info/90">
                  <Mail className="h-5 w-5" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button className="flex-1 h-16 flex-col gap-1 rounded-xl bg-primary hover:bg-primary/90">
                  <LinkIcon className="h-5 w-5" />
                  <span className="text-xs">Secure Link</span>
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
