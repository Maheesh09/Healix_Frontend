import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, Image, ArrowRight, Check, MessageCircle } from "lucide-react";

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Upload Report</h1>
        <p className="text-muted-foreground">Add new medical reports to your health profile</p>
      </div>

      {/* Upload Area */}
      <Card className="shadow-card border-0">
        <CardContent className="p-8">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
              <UploadIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">
              Drag & drop your report
            </h3>
            <p className="text-muted-foreground mb-6">
              or click to browse from your device
            </p>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="rounded-xl gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" className="rounded-xl gap-2">
                <Image className="h-4 w-4" />
                Images
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">Or forward from WhatsApp</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* WhatsApp Upload */}
      <Card className="shadow-card border-2 border-success/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-success-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">WhatsApp Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Forward reports directly from your chats
                </p>
              </div>
            </div>
            
            {/* Progress steps */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <ArrowRight className="h-4 w-4" />
                Forward
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <FileText className="h-4 w-4" />
                Scan
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <Check className="h-4 w-4" />
                Done
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="rounded-full bg-success/10 hover:bg-success/20">
              <ArrowRight className="h-5 w-5 text-success" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
