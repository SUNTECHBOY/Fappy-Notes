import { useState } from 'react';
import { StudyMaterial, Subject, Student, UserRole } from '../types';
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
  ArrowLeft,
  Files,
  Clock,
} from 'lucide-react';
import { FileUploadDialog } from './FileUploadDialog';
import { FilePreviewDialog } from './FilePreviewDialog';
import { AIStudyAssistant } from './AIStudyAssistant';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface StudyMaterialsBoardProps {
  materials: StudyMaterial[];
  subjects: Subject[];
  students: Student[];
  currentUserId: string | null;
  userRole: UserRole;
  onUploadMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => void;
  onDeleteMaterial: (materialId: string) => void;
  onDeleteSubject?: (subjectId: string) => void;
}

// Subject → gradient & color config
const getSubjectConfig = (name: string): { icon: JSX.Element; gradient: string; iconBg: string; glow: string } => {
  const n = name.toLowerCase();
  if (n.includes('computer') || n.includes('programming') || n.includes('software'))
    return { icon: <Code className="h-7 w-7" />, gradient: 'from-indigo-500/15 via-blue-500/10 to-indigo-600/5 dark:from-indigo-500/25 dark:via-blue-500/15 dark:to-indigo-600/10', iconBg: 'bg-indigo-500/15 border-indigo-300/40 text-indigo-600 dark:text-indigo-400', glow: 'hover:shadow-indigo-500/20' };
  if (n.includes('math') || n.includes('calculus') || n.includes('algebra'))
    return { icon: <Calculator className="h-7 w-7" />, gradient: 'from-blue-500/15 via-cyan-500/10 to-blue-600/5 dark:from-blue-500/25 dark:via-cyan-500/15 dark:to-blue-600/10', iconBg: 'bg-blue-500/15 border-blue-300/40 text-blue-600 dark:text-blue-400', glow: 'hover:shadow-blue-500/20' };
  if (n.includes('physics') || n.includes('mechanics'))
    return { icon: <Atom className="h-7 w-7" />, gradient: 'from-amber-500/15 via-orange-500/10 to-amber-600/5 dark:from-amber-500/25 dark:via-orange-500/15 dark:to-amber-600/10', iconBg: 'bg-amber-500/15 border-amber-300/40 text-amber-600 dark:text-amber-400', glow: 'hover:shadow-amber-500/20' };
  if (n.includes('biology') || n.includes('anatomy') || n.includes('life'))
    return { icon: <Dna className="h-7 w-7" />, gradient: 'from-emerald-500/15 via-teal-500/10 to-emerald-600/5 dark:from-emerald-500/25 dark:via-teal-500/15 dark:to-emerald-600/10', iconBg: 'bg-emerald-500/15 border-emerald-300/40 text-emerald-600 dark:text-emerald-400', glow: 'hover:shadow-emerald-500/20' };
  if (n.includes('chemistry'))
    return { icon: <Microscope className="h-7 w-7" />, gradient: 'from-purple-500/15 via-violet-500/10 to-purple-600/5 dark:from-purple-500/25 dark:via-violet-500/15 dark:to-purple-600/10', iconBg: 'bg-purple-500/15 border-purple-300/40 text-purple-600 dark:text-purple-400', glow: 'hover:shadow-purple-500/20' };
  if (n.includes('art') || n.includes('design'))
    return { icon: <Palette className="h-7 w-7" />, gradient: 'from-pink-500/15 via-rose-500/10 to-pink-600/5 dark:from-pink-500/25 dark:via-rose-500/15 dark:to-pink-600/10', iconBg: 'bg-pink-500/15 border-pink-300/40 text-pink-600 dark:text-pink-400', glow: 'hover:shadow-pink-500/20' };
  if (n.includes('geography') || n.includes('history') || n.includes('social'))
    return { icon: <Globe className="h-7 w-7" />, gradient: 'from-teal-500/15 via-cyan-500/10 to-teal-600/5 dark:from-teal-500/25 dark:via-cyan-500/15 dark:to-teal-600/10', iconBg: 'bg-teal-500/15 border-teal-300/40 text-teal-600 dark:text-teal-400', glow: 'hover:shadow-teal-500/20' };
  return { icon: <BookOpen className="h-7 w-7" />, gradient: 'from-slate-500/15 via-gray-500/10 to-slate-600/5 dark:from-slate-500/25 dark:via-gray-500/15 dark:to-slate-600/10', iconBg: 'bg-slate-500/15 border-slate-300/40 text-slate-600 dark:text-slate-400', glow: 'hover:shadow-slate-500/20' };
};

const FILE_TYPE_CONFIG: Record<string, { icon: JSX.Element; color: string; bg: string }> = {
  pdf:     { icon: <FileText className="h-5 w-5" />,  color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-700/40' },
  image:   { icon: <ImageIcon className="h-5 w-5" />, color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-700/40' },
  link:    { icon: <LinkIcon className="h-5 w-5" />,  color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-950/30 border-green-200/60 dark:border-green-700/40' },
  youtube: { icon: <Youtube className="h-5 w-5" />,   color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-700/40' },
  text:    { icon: <FileText className="h-5 w-5" />,  color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200/60 dark:border-purple-700/40' },
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

  const filteredMaterials = materials.filter((material) => {
    const matchesSubject = !selectedSubject || material.subject === selectedSubject;
    const matchesSearch =
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      students.find((s) => s.id === material.uploadedBy)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || material.type === fileTypeFilter;
    return matchesSubject && matchesSearch && matchesType;
  });

  const getStudent = (id: string) => students.find((s) => s.id === id);
  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject);

  const totalMaterials = materials.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Study Materials
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {totalMaterials} resource{totalMaterials !== 1 ? 's' : ''} across {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all shrink-0"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Subject Grid */}
      {!selectedSubject && (
        <>
          {subjects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-14 w-14 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No subjects yet</p>
              <p className="text-sm mt-1">Upload a material to create your first subject</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {subjects.map((subject) => {
                const count = materials.filter((m) => m.subject === subject.id).length;
                const config = getSubjectConfig(subject.name);
                return (
                  <div
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`
                      group relative cursor-pointer rounded-2xl overflow-hidden border border-border/60
                      bg-gradient-to-br ${config.gradient}
                      p-5 flex flex-col items-center text-center gap-4
                      hover:shadow-xl ${config.glow} hover:-translate-y-1
                      transition-all duration-300
                    `}
                  >
                    {/* Glow blob */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-50 bg-current group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                    {/* Icon */}
                    <div className={`relative z-10 p-4 rounded-2xl border ${config.iconBg} shadow-sm`}>
                      {config.icon}
                    </div>

                    {/* Name & count */}
                    <div className="relative z-10 space-y-1">
                      <h3 className="font-bold text-sm leading-tight">{subject.name}</h3>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Files className="h-3 w-3" />
                        <span>{count} file{count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Admin delete */}
                    {userRole === 'Admin' && onDeleteSubject && (
                      <button
                        className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-background/80 border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground hover:border-destructive text-muted-foreground z-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${subject.name}"? All materials will also be deleted.`)) {
                            onDeleteSubject(subject.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Materials View */}
      {selectedSubject && (
        <div className="space-y-5">
          {/* Sub-header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedSubject(null)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
              {selectedSubjectData && (
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{selectedSubjectData.name}</h3>
                  <Badge variant="secondary" className="text-xs">{filteredMaterials.length} file{filteredMaterials.length !== 1 ? 's' : ''}</Badge>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search materials..." className="pl-10 rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-36 rounded-xl">
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
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Files className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No materials found</p>
              <p className="text-sm mt-1">Upload your first material to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMaterials.map((material) => {
                const uploader = getStudent(material.uploadedBy);
                const ftc = FILE_TYPE_CONFIG[material.type] || FILE_TYPE_CONFIG['text'];
                return (
                  <div
                    key={material.id}
                    className="group relative rounded-2xl border border-border/60 bg-card hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top type color bar */}
                    <div className={`h-1 w-full ${
                      material.type === 'pdf' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                      material.type === 'image' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                      material.type === 'youtube' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                      material.type === 'link' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      'bg-gradient-to-r from-purple-400 to-violet-500'
                    }`} />

                    <div className="p-5 space-y-4">
                      {/* Title row */}
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border ${ftc.bg} shrink-0`}>
                          <span className={ftc.color}>{ftc.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm leading-tight truncate">{material.name}</h4>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-1 capitalize">{material.type}</Badge>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      {material.thumbnail && (
                        <div className="w-full h-36 rounded-xl bg-muted overflow-hidden">
                          <img src={material.thumbnail} alt={material.name} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* AI Summary */}
                      {material.aiSummary && (
                        <div className="flex items-start gap-2 p-3 bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-700/40 rounded-xl">
                          <Sparkles className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">{material.aiSummary}</p>
                        </div>
                      )}

                      {/* Storage Warning */}
                      {material.url === 'pending-upload' && (
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-700/40 rounded-xl">
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            ⚠️ File not stored — create a <strong>study-materials</strong> bucket in Supabase Storage and re-upload.
                          </p>
                        </div>
                      )}

                      {/* Uploader + date */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={uploader?.avatar} />
                            <AvatarFallback className="text-[9px] bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold">
                              {uploader?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">{uploader?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(material.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Size */}
                      {material.size && (
                        <p className="text-xs text-muted-foreground">{material.size}</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs group-hover:border-primary group-hover:text-primary transition-colors" onClick={() => setPreviewMaterial(material)}>
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Preview
                        </Button>
                        {userRole === 'Admin' && (
                          <Button variant="outline" size="sm" className="rounded-xl text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30" onClick={() => onDeleteMaterial(material.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        subjects={subjects}
        currentUserId={currentUserId}
        onUpload={async (material) => {
          await onUploadMaterial(material);
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

      {/* Floating AI Assistant button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-purple-500/30 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-200"
        size="icon"
        onClick={() => setAiAssistantOpen(true)}
      >
        <Brain className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}