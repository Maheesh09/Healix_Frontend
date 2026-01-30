import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, Image, ArrowRight, Check, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/motion/MotionWrappers";

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
    <PageTransition className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0.8, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Upload Report</h1>
        <p className="text-muted-foreground">Add new medical reports to your health profile</p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0.9, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="shadow-card border-0">
          <CardContent className="p-8">
            {/* Drag and Drop Zone */}
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              whileHover={{ borderColor: "hsl(var(--primary) / 0.5)" }}
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <UploadIcon className="h-8 w-8 text-primary-foreground" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                Drag & drop your report
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse from your device
              </p>
              
              <div className="flex justify-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="rounded-xl gap-2 transition-colors duration-300 hover:border-primary">
                    <FileText className="h-4 w-4" />
                    PDF
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="rounded-xl gap-2 transition-colors duration-300 hover:border-primary">
                    <Image className="h-4 w-4" />
                    Image
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Supported formats */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Supported: PDF, JPG, PNG, HEIC • Max 25MB
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* WhatsApp Upload */}
      <motion.div
        initial={{ opacity: 0.9, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="shadow-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Left side - WhatsApp info */}
              <div className="flex-1 p-8 bg-[#25D366]/10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-foreground">WhatsApp Upload</h3>
                    <p className="text-sm text-muted-foreground">Forward reports directly</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {["Save Healix number", "Forward your report", "Done! We'll process it"].map((step, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0.7, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <span className="text-sm text-foreground">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right side - QR/Action */}
              <div className="flex-1 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">QR Code</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button className="rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 gap-2 transition-shadow duration-300 hover:shadow-lg">
                      Open WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.p 
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        🔒 Your data is encrypted and securely stored. Healix provides informational insights only.
      </motion.p>
    </PageTransition>
  );
};

export default UploadPage;
