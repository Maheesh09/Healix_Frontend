import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Pill,
  Plus,
  Clock,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Activity,
  Calendar,
} from "lucide-react";
import { apiService, Medication } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Medications = () => {
  const { patient, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    dosage_mg: "",
    frequency_per_day: "",
    instructions: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !patient) {
      navigate("/login");
    }
  }, [authLoading, patient, navigate]);

  // Fetch medications on component mount
  useEffect(() => {
    if (patient) {
      fetchMedications();
    }
  }, [patient]);

  const fetchMedications = async () => {
    setLoading(true);
    setError(null);
    const response = await apiService.getMedications();

    if (response.success && response.data) {
      setMedications(response.data);
    } else {
      setError(response.error || "Failed to load medications");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dosage_mg: "",
      frequency_per_day: "",
      instructions: "",
    });
  };

  const handleAddMedication = async () => {
    if (!formData.name || !formData.dosage_mg || !formData.frequency_per_day) {
      setError("Please fill in all required fields");
      return;
    }

    const dosage = parseInt(formData.dosage_mg);
    const frequency = parseInt(formData.frequency_per_day);

    if (dosage <= 0 || frequency <= 0 || frequency > 24) {
      setError("Invalid dosage or frequency values");
      return;
    }

    setSubmitting(true);
    setError(null);

    if (!patient) {
      setError("User not authenticated");
      setSubmitting(false);
      return;
    }

    const response = await apiService.createMedication({
      patient_id: patient.id,
      name: formData.name,
      dosage_mg: dosage,
      frequency_per_day: frequency,
      instructions: formData.instructions || undefined,
    });

    if (response.success && response.data) {
      setMedications([response.data, ...medications]);
      setSuccessMessage("Medication added successfully!");
      resetForm();
      setIsAddDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || "Failed to add medication");
    }

    setSubmitting(false);
  };

  const handleUpdateMedication = async () => {
    if (!editingMedication || !formData.name || !formData.dosage_mg || !formData.frequency_per_day) {
      setError("Please fill in all required fields");
      return;
    }

    const dosage = parseInt(formData.dosage_mg);
    const frequency = parseInt(formData.frequency_per_day);

    if (dosage <= 0 || frequency <= 0 || frequency > 24) {
      setError("Invalid dosage or frequency values");
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await apiService.updateMedication(editingMedication.id, {
      name: formData.name,
      dosage_mg: dosage,
      frequency_per_day: frequency,
      instructions: formData.instructions || undefined,
    });

    if (response.success && response.data) {
      setMedications(medications.map(m => m.id === editingMedication.id ? response.data! : m));
      setSuccessMessage("Medication updated successfully!");
      resetForm();
      setEditingMedication(null);
      setIsEditDialogOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || "Failed to update medication");
    }

    setSubmitting(false);
  };

  const handleDeleteMedication = async (medicationId: string, medicationName: string) => {
    if (!confirm(`Are you sure you want to delete ${medicationName}?`)) {
      return;
    }

    setError(null);
    const response = await apiService.deleteMedication(medicationId);

    if (response.success) {
      setMedications(medications.filter(m => m.id !== medicationId));
      setSuccessMessage("Medication deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(response.error || "Failed to delete medication");
    }
  };

  const openEditDialog = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      dosage_mg: medication.dosage_mg.toString(),
      frequency_per_day: medication.frequency_per_day.toString(),
      instructions: medication.instructions || "",
    });
    setIsEditDialogOpen(true);
  };

  const getFrequencyText = (frequency: number) => {
    if (frequency === 1) return "Once daily";
    if (frequency === 2) return "Twice daily";
    if (frequency === 3) return "Three times daily";
    return `${frequency} times daily`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Added today";
    if (diffDays === 1) return "Added yesterday";
    if (diffDays < 7) return `Added ${diffDays} days ago`;
    return `Added ${date.toLocaleDateString()}`;
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Will redirect if not authenticated
  if (!patient) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Track and manage your medications</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Medication</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Medication Name *</Label>
                <Input
                  id="add-name"
                  placeholder="e.g., Vitamin D Supplement"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-dosage">Dosage (mg) *</Label>
                  <Input
                    id="add-dosage"
                    type="number"
                    min="1"
                    placeholder="e.g., 1000"
                    value={formData.dosage_mg}
                    onChange={(e) => setFormData({ ...formData, dosage_mg: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-frequency">Frequency/Day *</Label>
                  <Input
                    id="add-frequency"
                    type="number"
                    min="1"
                    max="24"
                    placeholder="e.g., 2"
                    value={formData.frequency_per_day}
                    onChange={(e) => setFormData({ ...formData, frequency_per_day: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-instructions">Instructions (Optional)</Label>
                <Textarea
                  id="add-instructions"
                  placeholder="e.g., Take with meals"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleAddMedication} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Medication"
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
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{medications.length}</p>
              <p className="text-sm text-muted-foreground">Active Medications</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {medications.reduce((sum, med) => sum + med.frequency_per_day, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Daily Doses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(medications.reduce((sum, med) => sum + med.dosage_mg, 0) / (medications.length || 1))}
              </p>
              <p className="text-sm text-muted-foreground">Avg Dosage (mg)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : medications.length === 0 ? (
        <Card className="shadow-card border-0">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Pill className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No medications added</h3>
            <p className="text-muted-foreground mb-6">Start tracking your medications by adding them here.</p>
            <Button
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Your First Medication
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <Card key={med.id} className="shadow-card border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg">{med.name}</h3>
                      <p className="text-sm text-muted-foreground">{med.dosage_mg} mg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => openEditDialog(med)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteMedication(med.id, med.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{getFrequencyText(med.frequency_per_day)}</span>
                  </div>
                  {med.instructions && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{med.instructions}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-muted">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(med.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Medication Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Vitamin D Supplement"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dosage">Dosage (mg) *</Label>
                <Input
                  id="edit-dosage"
                  type="number"
                  min="1"
                  placeholder="e.g., 1000"
                  value={formData.dosage_mg}
                  onChange={(e) => setFormData({ ...formData, dosage_mg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-frequency">Frequency/Day *</Label>
                <Input
                  id="edit-frequency"
                  type="number"
                  min="1"
                  max="24"
                  placeholder="e.g., 2"
                  value={formData.frequency_per_day}
                  onChange={(e) => setFormData({ ...formData, frequency_per_day: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instructions">Instructions (Optional)</Label>
              <Textarea
                id="edit-instructions"
                placeholder="e.g., Take with meals"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setEditingMedication(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateMedication} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Medication"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;
