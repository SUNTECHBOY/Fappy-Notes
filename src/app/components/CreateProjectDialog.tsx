import { useState } from 'react';
import { Student } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Plus } from 'lucide-react';

interface CreateProjectDialogProps {
  students: Student[];
  onCreateProject: (project: {
    name: string;
    description: string;
    students: string[];
  }) => void;
}

export function CreateProjectDialog({
  students,
  onCreateProject,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    students: [] as string[],
  });

  const handleCreate = () => {
    if (newProject.name && newProject.description && newProject.students.length > 0) {
      onCreateProject(newProject);
      setNewProject({ name: '', description: '', students: [] });
      setOpen(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setNewProject((prev) => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter((id) => id !== studentId)
        : [...prev.students, studentId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new project to manage your team and tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="Describe the project goals and objectives"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Assign Team Members</Label>
            <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={student.id}
                    checked={newProject.students.includes(student.id)}
                    onCheckedChange={() => toggleStudent(student.id)}
                  />
                  <label
                    htmlFor={student.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {student.name} ({student.email})
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {newProject.students.length} student(s) selected
            </p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate}>Create Project</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}