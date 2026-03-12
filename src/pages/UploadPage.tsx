import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const { uploadResume, hasResume, resume } = usePortfolio();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'docx'].includes(ext)) return;
    setUploading(true);
    await uploadResume(file);
    setUploading(false);
    setDone(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Upload Your Resume</h1>
        <p className="mt-1 text-muted-foreground">Upload a PDF or DOCX file to get started.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {done || hasResume ? (
          <div className="glass-card neon-border p-10 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Resume Uploaded!</h2>
            <p className="text-sm text-muted-foreground">{resume?.original_filename || 'resume.pdf'}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/dashboard/edit')} className="btn-glow">Review & Edit</Button>
              <Button variant="outline" onClick={() => { setDone(false); }}>Upload Another</Button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`glass-card cursor-pointer border-2 border-dashed p-16 text-center transition-all ${dragging ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40'}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <p className="font-medium">Uploading & parsing...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="font-medium">Drag & drop your resume here</p>
                <p className="text-sm text-muted-foreground">or click to browse — PDF or DOCX</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {hasResume && !done && (
        <div className="glass-card p-4 flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{resume?.original_filename}</p>
            <p className="text-xs text-muted-foreground">Previously uploaded</p>
          </div>
        </div>
      )}
    </div>
  );
}
