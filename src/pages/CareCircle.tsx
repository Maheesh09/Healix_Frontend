import { useState, useEffect } from "react";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  Shield,
  Send,
  Mail,
  Link as LinkIcon,
  Stethoscope,
  Heart,
  UserPlus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { apiService, CareCircleMember } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const recentShares = [
  { report: "Blood Test Results", sharedWith: "Dr. Priyantha Silva", time: "Today" },
  { report: "X-Ray Report", sharedWith: "Amma", time: "Yesterday" },
  { report: "Annual Checkup", sharedWith: "Dr. Nimal Perera", time: "3 days ago" },
];

const CareCircle = () => {
  const [members, setMembers] = useState<CareCircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CareCircleMember | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    const response = await apiService.getCareCircleMembers();

    if (response.success && response.data) {
      setMembers(response.data);
    } else {
      setError(response.error || "Failed to load members");
    }
    setLoading(false);
  };

  const handleAddMember = async () => {
    if (!formData.name || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await apiService.createCareCircleMember(formData);

    if (response.success && response.data) {
      setMembers([response.data, ...members]);
      setSuccessMessage("Member added successfully!");
      setFormData({ name: "", email: "" });
      setIsAddDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || "Failed to add member");
    }

    setSubmitting(false);
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !formData.name || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await apiService.updateCareCircleMember(editingMember.id, formData);

    if (response.success && response.data) {
      setMembers(members.map(m => m.id === editingMember.id ? response.data! : m));
      setSuccessMessage("Member updated successfully!");
      setFormData({ name: "", email: "" });
      setEditingMember(null);
      setIsEditDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || "Failed to update member");
    }

    setSubmitting(false);
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from your care circle?`)) {
      return;
    }

    setError(null);
    const response = await apiService.deleteCareCircleMember(memberId);

    if (response.success) {
      setMembers(members.filter(m => m.id !== memberId));
      setSuccessMessage("Member removed successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || "Failed to delete member");
    }
  };

  const openEditDialog = (member: CareCircleMember) => {
    setEditingMember(member);
    setFormData({ name: member.name, email: member.email });
    setIsEditDialogOpen(true);
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
        setSuccessMessage("Link copied to clipboard!");
        setTimeout(() => setSuccessMessage(null), 3000);
        break;
    }
  };

  const getMemberIcon = (email: string) => {
    if (email.includes("dr.") || email.includes("doctor")) return Stethoscope;
    if (email.includes("amma") || email.includes("family")) return Heart;
    return Users;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Care Circle</h1>
          <p className="text-muted-foreground">Share your health reports with trusted doctors and family members</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email Address</Label>
                <Input
                  id="add-email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setFormData({ name: "", email: "" })}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAddMember} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-success/10 border-success text-success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{members.length}</p>
              <p className="text-sm text-muted-foreground">Circle Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">25</p>
              <p className="text-sm text-muted-foreground">Reports Shared</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {members.filter(m => m.email.includes("dr.")).length}
              </p>
              <p className="text-sm text-muted-foreground">Medical Professionals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Circle Members */}
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Circle Members</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No members in your care circle yet.</p>
                <p className="text-sm text-muted-foreground">Click "Add Member" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => {
                  const Icon = getMemberIcon(member.email);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {formatDate(member.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({ name: "", email: "" });
                  setEditingMember(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateMember} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareCircle;
