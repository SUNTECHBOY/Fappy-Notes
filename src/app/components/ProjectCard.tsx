import { Project, Student } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Users, AlertCircle, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  students: Student[];
  onClick: () => void;
  isAdmin?: boolean;
  onDelete?: (projectId: string) => void;
}

export function ProjectCard({ project, students, onClick, isAdmin, onDelete }: ProjectCardProps) {
  const projectStudents = students.filter((s) => project.students.includes(s.id));

  const statusColors: Record<string, string> = {
    'Not Started': 'bg-[var(--chart-2)] text-white hover:bg-[var(--chart-2)]/90', // Orange
    'In Progress': 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90', // Blue
    'Completed': 'bg-[var(--chart-4)] text-white hover:bg-[var(--chart-4)]/90',   // Teal
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl border-none shadow-sm dark:bg-card dark:border"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <Badge className={statusColors[project.status] || 'bg-gray-500'}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        {/* Students */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Team Members ({projectStudents.length})</span>
          </div>
          <div className="flex -space-x-2">
            {projectStudents.map((student) => (
              <Avatar
                key={student.id}
                className="border-2 border-background w-10 h-10"
              >
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>
                  {student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {/* AI Alerts */}
        {project.aiAlerts && project.aiAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-800">
                {project.aiAlerts[0]}
              </div>
            </div>
          </div>
        )}

        {/* Task Summary */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span>{project.tasks.length} tasks</span>
          <span>•</span>
          <span>
            {project.tasks.filter((t) => t.status === 'Done').length} completed
          </span>
        </div>

        {/* Delete Button */}
        {isAdmin && onDelete && (
          <div className="mt-4">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}