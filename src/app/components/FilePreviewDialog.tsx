import { StudyMaterial, Student } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, ExternalLink, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FilePreviewDialogProps {
  material: StudyMaterial | null;
  students: Student[];
  open: boolean;
  onClose: () => void;
}

export function FilePreviewDialog({
  material,
  students,
  open,
  onClose,
}: FilePreviewDialogProps) {
  if (!material) return null;

  const uploader = students.find((s) => s.id === material.uploadedBy);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{material.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{material.type}</Badge>
                {material.size && (
                  <span className="text-sm text-muted-foreground">{material.size}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={material.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="preview" className="mt-6">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="ai-insights">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            {material.type === 'image' && (
              <div className="w-full rounded-lg overflow-hidden border">
                <img
                  src={material.url}
                  alt={material.name}
                  className="w-full h-auto"
                />
              </div>
            )}

            {material.type === 'pdf' && (
              <div className="w-full h-[500px] border rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">PDF Preview</p>
                  <Button asChild>
                    <a href={material.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {(material.type === 'youtube' || material.type === 'link') && (
              <div className="space-y-4">
                {material.thumbnail && (
                  <div className="w-full h-64 rounded-lg overflow-hidden border">
                    <img
                      src={material.thumbnail}
                      alt={material.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button className="w-full" asChild>
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </a>
                </Button>
              </div>
            )}

            {material.type === 'text' && (
              <div className="border rounded-lg p-6 bg-muted min-h-[400px]">
                <p className="text-sm leading-relaxed">
                  {material.aiSummary || 'Text content preview...'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-4">
            {material.aiSummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{material.aiSummary}</p>
                </CardContent>
              </Card>
            )}

            {material.aiKeyPoints && material.aiKeyPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Points Extracted</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {material.aiKeyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-medium mt-0.5">•</span>
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ask questions about this material and get instant answers.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Q: What are the main topics covered?
                    </p>
                    <p className="text-sm text-blue-800">
                      A: This material covers fundamental concepts, practical examples,
                      and advanced applications in the subject area.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm font-medium text-green-900 mb-1">
                      Q: What are the prerequisites?
                    </p>
                    <p className="text-sm text-green-800">
                      A: Basic understanding of foundational concepts is recommended
                      before studying this material.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Uploaded By</p>
                    <p className="font-medium">{uploader?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upload Date</p>
                    <p className="font-medium">
                      {new Date(material.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{material.type}</p>
                  </div>
                  {material.size && (
                    <div>
                      <p className="text-sm text-muted-foreground">File Size</p>
                      <p className="font-medium">{material.size}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {uploader?.avatar ? (
                    <img
                      src={uploader.avatar}
                      alt={uploader.name}
                      className="h-12 w-12 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {uploader?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{uploader?.name}</p>
                    <p className="text-sm text-muted-foreground">{uploader?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}