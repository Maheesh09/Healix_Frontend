import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  User,
  Mail,
  Phone,
  CreditCard,
  Edit,
  Loader2,
  AlertCircle,
  Trash2,
  Save,
  X,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Profile = () => {
  const { patient, updatePatient, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    nic: "",
  });

  // Load patient data into form when available
  useEffect(() => {
    if (patient) {
      setFormData({
        full_name: patient.full_name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        nic: patient.nic || "",
      });
    }
  }, [patient]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !patient) {
      navigate("/login");
    }
  }, [authLoading, patient, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    // Reset form to original patient data
    if (patient) {
      setFormData({
        full_name: patient.full_name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        nic: patient.nic || "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!patient) return;

    // Validation
    if (!formData.full_name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare update data (only send changed fields)
      const updateData: any = {};
      if (formData.full_name !== patient.full_name) updateData.full_name = formData.full_name;
      if (formData.email !== patient.email) updateData.email = formData.email;
      if (formData.phone !== patient.phone) updateData.phone = formData.phone || null;
      if (formData.nic !== patient.nic) updateData.nic = formData.nic || null;

      // If nothing changed
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        setSuccessMessage("No changes to save");
        setTimeout(() => setSuccessMessage(null), 3000);
        return;
      }

      const response = await apiService.updatePatient(patient.id, updateData);

      if (response.success && response.data) {
        // Update auth context with new patient data
        const updatedPatient = {
          ...patient,
          ...response.data,
        };
        updatePatient(updatedPatient);

        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || "Failed to update profile");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!patient) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await apiService.deletePatient(patient.id);

      if (response.success) {
        // Logout and redirect to home
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return null; // Will redirect
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} className="gap-2 bg-primary hover:bg-primary/90">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
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

      {/* Profile Information Card */}
      <Card className="shadow-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-primary" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="h-11"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-foreground font-medium pl-6">{patient.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-foreground font-medium pl-6">{patient.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-foreground font-medium pl-6">{patient.phone || "Not provided"}</p>
              )}
            </div>

            {/* NIC */}
            <div className="space-y-2">
              <Label htmlFor="nic" className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4 text-primary" />
                National Identity Card (NIC)
              </Label>
              {isEditing ? (
                <Input
                  id="nic"
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  className="h-11"
                  placeholder="Enter your NIC"
                />
              ) : (
                <p className="text-foreground font-medium pl-6">{patient.nic || "Not provided"}</p>
              )}
            </div>

            {/* Account Created Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                Account Created
              </Label>
              <p className="text-muted-foreground pl-6">{formatDate(patient.created_at)}</p>
            </div>

            {/* Account ID */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                Account ID
              </Label>
              <p className="text-muted-foreground text-xs pl-6 font-mono">{patient.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="shadow-card border-destructive/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div>
              <h4 className="font-medium text-foreground">Delete Account</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2 ml-4"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data
              from our servers, including:
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

export default Profile;
