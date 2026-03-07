import { useState } from 'react';
import { Project, Student, Task, TaskStatus } from '../types';
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
import { TaskTable } from './TaskTable';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Plus, TrendingUp, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProjectDetailsProps {
  project: Project | null;
  students: Student[];
  userRole: 'Admin' | 'User';
  currentUserId: string;
  open: boolean;
  onClose: () => void;
  onUpdateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  onAddComment: (projectId: string, taskId: string, comment: string) => void;
  onAddTask: (projectId: string, task: Omit<Task, 'id' | 'comments'>) => void;
  onDeleteProject?: (projectId: string) => void;
}

export function ProjectDetails({
  project,
  students,
  userRole,
  currentUserId,
  open,
  onClose,
  onUpdateTaskStatus,
  onAddComment,
  onAddTask,
  onDeleteProject,
}: ProjectDetailsProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    assignedTo: '',
    status: 'Pending' as TaskStatus,
    deadline: '',
  });

  if (!project) return null;

  const projectStudents = students.filter((s) => project.students.includes(s.id));

  const handleAddTask = () => {
    if (newTask.name && newTask.assignedTo && newTask.deadline) {
      onAddTask(project.id, newTask);
      setNewTask({
        name: '',
        assignedTo: '',
        status: 'Pending',
        deadline: '',
      });
      setShowAddTask(false);
    }
  };

  const handleAITaskBreakdown = () => {
    // Simulate AI-generated task breakdown
    const aiGeneratedTasks = [
      {
        name: 'Research and Planning',
        assignedTo: projectStudents[0]?.id || '',
        status: 'Pending' as TaskStatus,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        name: 'Implementation Phase 1',
        assignedTo: projectStudents[1]?.id || '',
        status: 'Pending' as TaskStatus,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        name: 'Testing and QA',
        assignedTo: projectStudents[2]?.id || projectStudents[0]?.id || '',
        status: 'Pending' as TaskStatus,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ];

    aiGeneratedTasks.forEach((task) => {
      if (task.assignedTo) {
        onAddTask(project.id, task);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Project details and management
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tasks" className="mt-4">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-insights">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {/* Add Task Section */}
            {userRole === 'Admin' && (
              <div className="space-y-4">
                {!showAddTask ? (
                  <div className="flex gap-2">
                    <Button onClick={() => setShowAddTask(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                    <Button variant="outline" onClick={handleAITaskBreakdown}>
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Task Breakdown
                    </Button>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Task</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Task Name</Label>
                          <Input
                            value={newTask.name}
                            onChange={(e) =>
                              setNewTask({ ...newTask, name: e.target.value })
                            }
                            placeholder="Enter task name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Assign To</Label>
                          <Select
                            value={newTask.assignedTo}
                            onValueChange={(value) =>
                              setNewTask({ ...newTask, assignedTo: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectStudents.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={newTask.status}
                            onValueChange={(value) =>
                              setNewTask({ ...newTask, status: value as TaskStatus })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Deadline</Label>
                          <Input
                            type="date"
                            value={newTask.deadline}
                            onChange={(e) =>
                              setNewTask({ ...newTask, deadline: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddTask}>Create Task</Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddTask(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Task Table */}
            <TaskTable
              tasks={project.tasks}
              students={students}
              userRole={userRole}
              currentUserId={currentUserId}
              onUpdateTaskStatus={(taskId, status) =>
                onUpdateTaskStatus(project.id, taskId, status)
              }
              onAddComment={(taskId, comment) =>
                onAddComment(project.id, taskId, comment)
              }
            />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{project.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge>{project.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Progress</Label>
                    <p className="mt-1 font-medium">{project.progress}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Team Size</Label>
                    <p className="mt-1 font-medium">{projectStudents.length} members</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Team Members</Label>
                  <div className="mt-2 space-y-2">
                    {projectStudents.map((student) => (
                      <div key={student.id} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>{student.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({student.email})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Progress Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.aiSummary}</p>
              </CardContent>
            </Card>

            {project.aiAlerts && project.aiAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Alerts & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.aiAlerts.map((alert, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md"
                      >
                        <div className="text-sm">{alert}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Task Completion Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Tasks</span>
                    <span className="font-medium">
                      {project.tasks.filter((t) => t.status === 'Done').length} /{' '}
                      {project.tasks.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">
                      {project.tasks.filter((t) => t.status === 'In Progress').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium">
                      {project.tasks.filter((t) => t.status === 'Pending').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {userRole === 'Admin' && onDeleteProject && (
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={() => onDeleteProject(project.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Project
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}