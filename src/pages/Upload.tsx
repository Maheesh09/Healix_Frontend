import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, Image, ArrowRight, Check, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/motion/MotionWrappers";

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <PageTransition className="p-4 sm:p-6 lg:p-8 space-y-6">
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
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.heic"
            />
            
            {/* Drag and Drop Zone */}
            <motion.div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              whileHover={{ borderColor: "hsl(var(--primary) / 0.5)" }}
            >
              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 relative group">
                      <FileText className="h-8 w-8 text-primary" />
                      <button 
                        onClick={removeFile}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={(e) => { e.stopPropagation(); handleClick(); }}
                      >
                        Change File
                      </Button>
                      <Button onClick={(e) => e.stopPropagation()}>
                        Upload Report
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                        <Button 
                          variant="outline" 
                          className="rounded-xl gap-2 transition-colors duration-300 hover:border-primary"
                          onClick={(e) => { e.stopPropagation(); handleClick(); }}
                        >
                          <FileText className="h-4 w-4" />
                          PDF
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          variant="outline" 
                          className="rounded-xl gap-2 transition-colors duration-300 hover:border-primary"
                          onClick={(e) => { e.stopPropagation(); handleClick(); }}
                        >
                          <Image className="h-4 w-4" />
                          Image
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              {/* Left side - Telegram info */}
              <div className="flex-1 p-8 bg-[#229ED9]/10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-[#229ED9] flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-foreground">Telegram Upload</h3>
                    <p className="text-sm text-muted-foreground">Forward reports directly</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {["Save Healix contact", "Forward your report", "Done! We'll process it"].map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0.7, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#229ED9] flex items-center justify-center">
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
                    <Button className="rounded-xl bg-[#229ED9] hover:bg-[#229ED9]/90 gap-2 transition-shadow duration-300 hover:shadow-lg">
                      Open Telegram
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
