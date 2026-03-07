import { useState } from 'react';
import { Student } from '../types';
import { StudyGroup } from '../types/admin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { FolderKanban, BookOpen } from 'lucide-react';

interface ManageAccessDialogProps {
  open: boolean;
  onClose: () => void;
  user: Student;
  projects: Array<{ id: string; name: string }>;
  studyGroups: StudyGroup[];
  onUpdate: (projectIds: string[], studyGroupIds: string[]) => void;
}

export function ManageAccessDialog({
  open,
  onClose,
  user,
  projects,
  studyGroups,
  onUpdate,
}: ManageAccessDialogProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>(
    user.assignedProjects || []
  );
  const [selectedStudyGroups, setSelectedStudyGroups] = useState<string[]>(
    user.assignedStudyGroups || []
  );

  const handleSubmit = () => {
    onUpdate(selectedProjects, selectedStudyGroups);
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleStudyGroup = (groupId: string) => {
    setSelectedStudyGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Access - {user.name}</DialogTitle>
          <DialogDescription>
            Manage project and study group access for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Projects Access */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <FolderKanban className="h-5 w-5" />
              Project Access
            </Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No projects available
                  </p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md"
                    >
                      <Checkbox
                        id={`project-${project.id}`}
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => toggleProject(project.id)}
                      />
                      <label
                        htmlFor={`project-${project.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {project.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              {selectedProjects.length} of {projects.length} projects selected
            </p>
          </div>

          {/* Study Groups Access */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5" />
              Study Group Access
            </Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-3">
                {studyGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No study groups available
                  </p>
                ) : (
                  studyGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-start space-x-3 p-2 hover:bg-muted rounded-md"
                    >
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={selectedStudyGroups.includes(group.id)}
                        onCheckedChange={() => toggleStudyGroup(group.id)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`group-${group.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {group.description}
                        </p>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              {selectedStudyGroups.length} of {studyGroups.length} study groups
              selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSubmit}>Update Access</Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}