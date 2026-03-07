import { useState } from 'react';
import { StudyMaterial, Subject, Student, UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Folder,
  Upload,
  Search,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube,
  Sparkles,
  Eye,
  Trash2,
  Brain,
  Code,
  Calculator,
  Atom,
  Dna,
  Palette,
  Globe,
  BookOpen,
  Microscope,
} from 'lucide-react';
import { FileUploadDialog } from './FileUploadDialog';
import { FilePreviewDialog } from './FilePreviewDialog';
import { AIStudyAssistant } from './AIStudyAssistant';

interface StudyMaterialsBoardProps {
  materials: StudyMaterial[];
  subjects: Subject[];
  students: Student[];
  currentUserId: string;
  userRole: UserRole;
  onUploadMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => void;
  onDeleteMaterial: (materialId: string) => void;
  onDeleteSubject?: (subjectId: string) => void;
}

// Helper function to auto-generate icons based on subject name
const getSubjectIcon = (subjectName: string) => {
  const name = subjectName.toLowerCase();
  
  if (name.includes('computer') || name.includes('programming') || name.includes('software')) {
    return <Code className="h-8 w-8" />;
  } else if (name.includes('math') || name.includes('calculus') || name.includes('algebra')) {
    return <Calculator className="h-8 w-8" />;
  } else if (name.includes('physics') || name.includes('mechanics')) {
    return <Atom className="h-8 w-8" />;
  } else if (name.includes('biology') || name.includes('anatomy') || name.includes('life')) {
    return <Dna className="h-8 w-8" />;
  } else if (name.includes('chemistry')) {
    return <Microscope className="h-8 w-8" />;
  } else if (name.includes('art') || name.includes('design')) {
    return <Palette className="h-8 w-8" />;
  } else if (name.includes('geography') || name.includes('history') || name.includes('social')) {
    return <Globe className="h-8 w-8" />;
  } else if (name.includes('literature') || name.includes('english') || name.includes('language')) {
    return <BookOpen className="h-8 w-8" />;
  } else {
    // Default icon for any other subject
    return <BookOpen className="h-8 w-8" />;
  }
};

export function StudyMaterialsBoard({
  materials,
  subjects,
  students,
  currentUserId,
  userRole,
  onUploadMaterial,
  onDeleteMaterial,
  onDeleteSubject,
}: StudyMaterialsBoardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'link':
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSubject = !selectedSubject || material.subject === selectedSubject;
    const matchesSearch =
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      students.find((s) => s.id === material.uploadedBy)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || material.type === fileTypeFilter;
    return matchesSubject && matchesSearch && matchesType;
  });

  const getStudent = (id: string) => students.find((s) => s.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Study Materials</h2>
          <p className="text-muted-foreground mt-1">
            Collaborative learning resources organized by subject
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Subjects Grid */}
      {!selectedSubject && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group relative"
            >
              <CardContent className="p-6" onClick={() => setSelectedSubject(subject.id)}>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`${subject.color} rounded-lg p-4 text-4xl`}>
                    {getSubjectIcon(subject.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {materials.filter((m) => m.subject === subject.id).length} materials
                    </p>
                  </div>
                </div>
              </CardContent>
              {userRole === 'Admin' && onDeleteSubject && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${subject.name}"? All materials in this subject will also be deleted.`)) {
                      onDeleteSubject(subject.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Materials View */}
      {selectedSubject && (
        <div className="space-y-6">
          {/* Back Button and Filters */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedSubject(null)}
            >
              ← Back to Subjects
            </Button>
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="text">Notes</SelectItem>
                  <SelectItem value="link">Links</SelectItem>
                  <SelectItem value="youtube">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No materials found. Upload your first material to get started!
              </div>
            ) : (
              filteredMaterials.map((material) => {
                const uploader = getStudent(material.uploadedBy);
                return (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(material.type)}
                          <CardTitle className="text-base">{material.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{material.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Thumbnail */}
                      {material.thumbnail && (
                        <div className="w-full h-40 bg-muted rounded-md overflow-hidden">
                          <img
                            src={material.thumbnail}
                            alt={material.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* AI Summary */}
                      {material.aiSummary && (
                        <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-purple-800">{material.aiSummary}</p>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="space-y-2 text-sm">
                        {material.size && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{material.size}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Uploaded by:</span>
                          <span>{uploader?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>
                            {new Date(material.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setPreviewMaterial(material)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        {userRole === 'Admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteMaterial(material.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        subjects={subjects}
        onUpload={(material) => {
          onUploadMaterial(material);
          setUploadDialogOpen(false);
        }}
      />

      {/* Preview Dialog */}
      <FilePreviewDialog
        material={previewMaterial}
        students={students}
        open={!!previewMaterial}
        onClose={() => setPreviewMaterial(null)}
      />

      {/* AI Study Assistant */}
      <AIStudyAssistant
        open={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        materials={materials}
      />

      {/* Floating AI Assistant Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        size="icon"
        onClick={() => setAiAssistantOpen(true)}
      >
        <Brain className="h-6 w-6" />
      </Button>
    </div>
  );
}