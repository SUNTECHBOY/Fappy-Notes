import { useState, useRef } from 'react';
import { Subject, FileType } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const STORAGE_BUCKET = 'study-materials';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  currentUserId: string | null;
  onUpload: (material: {
    name: string;
    type: FileType;
    subject: string;
    uploadedBy: string;
    url: string;
    thumbnail?: string;
    size?: string;
  }) => Promise<void> | void;
}

export function FileUploadDialog({
  open,
  onClose,
  subjects,
  currentUserId,
  onUpload,
}: FileUploadDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'pdf' as FileType,
    subject: '',
    url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelect(files[0]);
  };

  const handleFileSelect = (file: File) => {
    let fileType: FileType = 'text';
    if (file.type.includes('pdf')) fileType = 'pdf';
    else if (file.type.includes('image')) fileType = 'image';

    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(null);
    setFormData((prev) => ({
      ...prev,
      name: prev.name || file.name.replace(/\.[^.]+$/, ''),
      type: fileType,
      url: '',
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /** Upload file to Supabase Storage and return the public URL. */
  const uploadFileToStorage = async (file: File): Promise<string> => {
    if (!currentUserId) throw new Error('You must be logged in to upload files.');

    const fileName = `${currentUserId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, { upsert: true });

    if (error) {
      // Give a clear, actionable error message
      if (
        error.message.toLowerCase().includes('bucket') ||
        error.message.toLowerCase().includes('not found') ||
        (error as any).statusCode === '404' ||
        (error as any).statusCode === 404
      ) {
        throw new Error(
          `Storage bucket "${STORAGE_BUCKET}" not found. ` +
          `Please create it in your Supabase Dashboard:\n` +
          `Storage → New Bucket → Name: "${STORAGE_BUCKET}" → Enable Public → Save`
        );
      }
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.subject) return;
    if (!currentUserId) {
      setUploadError('You must be logged in to upload materials.');
      return;
    }

    // For link/youtube types, url must be filled in
    if ((formData.type === 'link' || formData.type === 'youtube') && !formData.url) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      let finalUrl = formData.url;
      let sizeStr: string | undefined;

      // Upload file to Supabase Storage
      if (selectedFile && formData.type !== 'link' && formData.type !== 'youtube') {
        finalUrl = await uploadFileToStorage(selectedFile);
        sizeStr = formatFileSize(selectedFile.size);
        setUploadSuccess(`File uploaded successfully!`);
      }

      // Await the DB save — this throws if saving fails
      await onUpload({
        name: formData.name,
        type: formData.type,
        subject: formData.subject,
        uploadedBy: currentUserId,
        url: finalUrl,
        thumbnail:
          formData.type === 'image'
            ? finalUrl
            : formData.type === 'youtube'
            ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'
            : undefined,
        size: sizeStr,
      });

      // Only reset form after successful save
      setFormData({ name: '', type: 'pdf', subject: '', url: '' });
      setSelectedFile(null);
      setUploadError(null);
      setUploadSuccess(null);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getTypeIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':    return <FileText className="h-5 w-5" />;
      case 'image':  return <ImageIcon className="h-5 w-5" />;
      case 'link':   return <LinkIcon className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      default:       return <FileText className="h-5 w-5" />;
    }
  };

  const isFileType = formData.type !== 'link' && formData.type !== 'youtube';

  // For file types: need a selected file (or pre-existing url)
  // For link/youtube: need a url
  const canSubmit =
    !uploading &&
    !!formData.name &&
    !!formData.subject &&
    !!currentUserId &&
    (isFileType ? !!selectedFile || !!formData.url : !!formData.url);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Study Material</DialogTitle>
          <DialogDescription>
            Upload PDFs, images, links, or YouTube videos to help your peers learn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">

          {/* Not logged-in warning */}
          {!currentUserId && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive">You must be signed in to upload materials.</p>
            </div>
          )}

          {/* Drag and Drop Area — only for file types */}
          {isFileType && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  {getTypeIcon(formData.type)}
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setFormData((prev) => ({ ...prev, url: '' }));
                      setUploadError(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your file here, or
                  </p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.txt"
                  />
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported: PDF, Images, Text files
                  </p>
                </>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Linear Algebra Notes"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as FileType, url: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> PDF Document</div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Image/Photo</div>
                  </SelectItem>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> Text Notes</div>
                  </SelectItem>
                  <SelectItem value="link">
                    <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Web Link</div>
                  </SelectItem>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2"><Youtube className="h-4 w-4" /> YouTube Video</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex items-center gap-2">
                      <span>{subject.icon}</span>
                      <span>{subject.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL field for links/youtube */}
          {(formData.type === 'link' || formData.type === 'youtube') && (
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          )}

          {/* Error message */}
          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive whitespace-pre-line">{uploadError}</p>
            </div>
          )}

          {/* Success message */}
          {uploadSuccess && (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-700 dark:text-green-300">{uploadSuccess}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {uploading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" /> Upload Material</>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}