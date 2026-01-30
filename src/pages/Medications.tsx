import { Card, CardContent } from "@/components/ui/card";
import { Pill, Plus, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const medications = [
  {
    id: 1,
    name: "Vitamin D Supplement",
    dosage: "1000 IU",
    frequency: "Once daily",
    time: "Morning",
    status: "active",
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil",
    dosage: "1000 mg",
    frequency: "Twice daily",
    time: "With meals",
    status: "active",
  },
];

const Medications = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Medications</h1>
          <p className="text-muted-foreground">Track and manage your medications</p>
        </div>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 gap-2 px-3 sm:px-4">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Medication</span>
        </Button>
      </div>

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((med) => (
          <Card key={med.id} className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {med.frequency}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Check className="h-4 w-4" />
                      {med.time}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state if no medications */}
      {medications.length === 0 && (
        <Card className="shadow-card border-0">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Pill className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No medications added</h3>
            <p className="text-muted-foreground mb-6">Start tracking your medications by adding them here.</p>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Medication
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Medications;
