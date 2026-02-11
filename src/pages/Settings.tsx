import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Lock,
  Bell,
  Download,
  LogOut,
  Trash2,
  Loader2,
  AlertCircle,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  const { patient, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State management
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password Change Dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Delete Account Dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    medicationReminders: true,
    appointmentReminders: true,
  });

  // Export Data State
  const [exporting, setExporting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !patient) {
      navigate("/login");
    }
  }, [authLoading, patient, navigate]);

  // Handle Password Change
  const handlePasswordChange = async () => {
    if (!patient) return;

    // Validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      setError("All password fields are required");
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    setError(null);

    try {
      // Note: This endpoint needs to be created on the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/${patient.id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage("Password changed successfully!");
        setShowPasswordDialog(false);
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error || "Failed to change password");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (!patient) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await apiService.deletePatient(patient.id);

      if (response.success) {
        logout();
        navigate("/");
      } else {
        setError(response.error || "Failed to delete account");
        setShowDeleteDialog(false);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  // Handle Notification Toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    setSuccessMessage("Notification preferences updated!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle Export Data
  const handleExportData = async () => {
    if (!patient) return;

    setExporting(true);
    setError(null);

    try {
      // Simulate data export (in real app, call backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a mock export file
      const exportData = {
        patient: {
          id: patient.id,
          full_name: patient.full_name,
          email: patient.email,
          phone: patient.phone,
          nic: patient.nic,
          created_at: patient.created_at,
        },
        exported_at: new Date().toISOString(),
        note: "This is a sample export. In production, this would include all your health data, medications, reports, etc.",
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healix-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage("Data exported successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and account settings</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-success/10 border-success text-success">
          <CheckCircle className="h-4 w-4" />
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


      {/* Notifications */}

      <Card className="shadow-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={() => handleNotificationToggle("email")}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={() => handleNotificationToggle("push")}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Medication Reminders</h4>
                  <p className="text-sm text-muted-foreground">Get reminded to take medications</p>
                </div>
              </div>
              <Switch
                checked={notifications.medicationReminders}
                onCheckedChange={() => handleNotificationToggle("medicationReminders")}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Appointment Reminders</h4>
                  <p className="text-sm text-muted-foreground">Get reminded about appointments</p>
                </div>
              </div>
              <Switch
                checked={notifications.appointmentReminders}
                onCheckedChange={() => handleNotificationToggle("appointmentReminders")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Privacy & Security</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your data and security settings</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Change Password */}
            <div
              onClick={() => setShowPasswordDialog(true)}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
              </div>
            </div>

            {/* Data Privacy Info */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Data Privacy</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your health data is encrypted and stored securely. Only you have access to your
                  complete medical records. We never share your data with third parties without your
                  explicit consent.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
          <p className="text-sm text-muted-foreground">Export or manage your health data</p>
        </CardHeader>
        <CardContent>
          <div
            onClick={handleExportData}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                {exporting ? (
                  <Loader2 className="h-5 w-5 text-info animate-spin" />
                ) : (
                  <Download className="h-5 w-5 text-info" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-foreground">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  {exporting ? "Exporting your data..." : "Download all your health records"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Account Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your account</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full h-12 rounded-xl gap-2 justify-center"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>

            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="w-full h-12 rounded-xl gap-2 justify-center border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, current_password: e.target.value })
                  }
                  className="pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="pr-10"
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirm_password: e.target.value })
                  }
                  className="pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handlePasswordChange} disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all
              your data from our servers, including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Personal information</li>
                <li>Medical records</li>
                <li>Medications</li>
                <li>Care circle members</li>
                <li>All uploaded reports</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete My Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
