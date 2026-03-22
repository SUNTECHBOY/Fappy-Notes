import { Project, Student } from '../types';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle2, Clock, Minus, Trash2, Users } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  students: Student[];
  onClick: () => void;
  isAdmin?: boolean;
  onDelete?: (projectId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; gradient: string; progress: string; icon: typeof Clock; badge: string }> = {
  'Not Started': {
    label: 'Not Started',
    gradient: 'from-slate-100 to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60',
    progress: 'from-slate-400 to-slate-500',
    icon: Minus,
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
  },
  'In Progress': {
    label: 'In Progress',
    gradient: 'from-blue-50 via-indigo-50/60 to-purple-50/40 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20',
    progress: 'from-blue-500 via-indigo-500 to-purple-600',
    icon: Clock,
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  },
  'Completed': {
    label: 'Completed',
    gradient: 'from-emerald-50 via-teal-50/60 to-cyan-50/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/20',
    progress: 'from-emerald-400 via-teal-500 to-cyan-500',
    icon: CheckCircle2,
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  },
};

export function ProjectCard({ project, students, onClick, isAdmin, onDelete }: ProjectCardProps) {
  const projectStudents = students.filter((s) => project.students.includes(s.id));
  const config = STATUS_CONFIG[project.status] || STATUS_CONFIG['Not Started'];
  const StatusIcon = config.icon;
  const doneTasks = project.tasks.filter((t) => t.status === 'Done').length;
  const totalTasks = project.tasks.length;
  const MAX_AVATARS = 4;
  const extraStudents = Math.max(0, projectStudents.length - MAX_AVATARS);

  return (
    <div
      onClick={onClick}
      className={`
        group relative cursor-pointer rounded-2xl overflow-hidden border border-border/60
        bg-gradient-to-br ${config.gradient}
        shadow-sm hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1.5
        transition-all duration-300 ease-out
      `}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${config.progress} opacity-80`} />

      {/* Glass overlay on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 dark:group-hover:bg-white/5 transition-all duration-300 rounded-2xl" />

      <div className="relative p-5 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight text-foreground truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>
          <Badge className={`shrink-0 flex items-center gap-1 border text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-foreground tabular-nums">{project.progress}%</span>
          </div>
          {/* Custom gradient progress bar */}
          <div className="h-2 bg-black/8 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${config.progress} transition-all duration-700 ease-out`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Team + Task Stats */}
        <div className="flex items-center justify-between">
          {/* Stacked Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {projectStudents.slice(0, MAX_AVATARS).map((student) => (
                <Avatar key={student.id} className="h-8 w-8 border-2 border-background ring-1 ring-white/30 shadow-sm">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                    {student.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extraStudents > 0 && (
                <div className="h-8 w-8 border-2 border-background rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm ring-1 ring-white/30">
                  +{extraStudents}
                </div>
              )}
            </div>
            {projectStudents.length === 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>No members</span>
              </div>
            )}
          </div>

          {/* Task counter pill */}
          <div className="flex items-center gap-1.5 bg-background/60 dark:bg-black/20 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-foreground">{doneTasks}</span>
            <span className="text-muted-foreground">/ {totalTasks} tasks</span>
          </div>
        </div>

        {/* AI Alert */}
        {project.aiAlerts && project.aiAlerts.length > 0 && (
          <div className="flex items-start gap-2.5 p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-700/40 rounded-xl backdrop-blur-sm">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{project.aiAlerts[0]}</p>
          </div>
        )}

        {/* Delete button */}
        {isAdmin && onDelete && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-1 text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/40 rounded-xl text-xs font-semibold transition-all"
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete Project
          </Button>
        )}
      </div>
    </div>
  );
}