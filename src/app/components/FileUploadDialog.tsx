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
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, Youtube } from 'lucide-react';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  onUpload: (material: {
    name: string;
    type: FileType;
    subject: string;
    uploadedBy: string;
    url: string;
    thumbnail?: string;
    size?: string;
  }) => void;
}

export function FileUploadDialog({
  open,
  onClose,
  subjects,
  onUpload,
}: FileUploadDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'pdf' as FileType,
    subject: '',
    url: '',
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    // Simulate file upload - in real app, upload to storage
    const fileUrl = URL.createObjectURL(file);
    let fileType: FileType = 'text';

    if (file.type.includes('pdf')) {
      fileType = 'pdf';
    } else if (file.type.includes('image')) {
      fileType = 'image';
    }

    setFormData({
      ...formData,
      name: file.name,
      type: fileType,
      url: fileUrl,
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.subject && formData.url) {
      // Simulate AI-generated summary
      const aiSummaries = [
        'Comprehensive study material covering key concepts with detailed examples and practice problems.',
        'Well-structured notes with clear explanations and visual diagrams to enhance understanding.',
        'In-depth resource providing theoretical foundations and practical applications.',
        'Detailed reference material with step-by-step explanations and real-world use cases.',
      ];

      onUpload({
        ...formData,
        uploadedBy: '1', // Current user
        thumbnail:
          formData.type === 'image'
            ? formData.url
            : formData.type === 'youtube'
            ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'
            : undefined,
        size: formData.type === 'pdf' ? '2.3 MB' : undefined,
      });

      setFormData({
        name: '',
        type: 'pdf',
        subject: '',
        url: '',
      });
    }
  };

  const getTypeIcon = (type: FileType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'link':
        return <LinkIcon className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Study Material</DialogTitle>
          <DialogDescription>
            Upload study materials to help your peers learn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
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
              accept=".pdf,.jpg,.jpeg,.png,.txt"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Material Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Linear Algebra Notes"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as FileType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF Document
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image/Photo
                    </div>
                  </SelectItem>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Text Notes
                    </div>
                  </SelectItem>
                  <SelectItem value="link">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Web Link
                    </div>
                  </SelectItem>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube Video
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) =>
                setFormData({ ...formData, subject: value })
              }
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

          {(formData.type === 'link' || formData.type === 'youtube') && (
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.subject}>
              Upload Material
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}