import { useState } from 'react';
import { Task, Student, TaskStatus, Comment } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageSquare, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface TaskTableProps {
  tasks: Task[];
  students: Student[];
  userRole: 'Admin' | 'User';
  currentUserId: string;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onAddComment: (taskId: string, comment: string) => void;
}

export function TaskTable({
  tasks,
  students,
  userRole,
  currentUserId,
  onUpdateTaskStatus,
  onAddComment,
}: TaskTableProps) {
  const [commentDialogOpen, setCommentDialogOpen] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const getStudent = (id: string) => students.find((s) => s.id === id);

  const statusColors: Record<TaskStatus, string> = {
    Pending: 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    Done: 'bg-green-500',
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const handleAddComment = (taskId: string) => {
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment('');
      setCommentDialogOpen(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No tasks yet. Create your first task to get started!
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const assignedStudent = getStudent(task.assignedTo);
              const canUpdateStatus = userRole === 'Admin' || currentUserId === task.assignedTo;

              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={assignedStudent?.avatar} />
                        <AvatarFallback>
                          {assignedStudent?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignedStudent?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {canUpdateStatus ? (
                      <Select
                        value={task.status}
                        onValueChange={(value) =>
                          onUpdateTaskStatus(task.id, value as TaskStatus)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={`text-sm ${
                          isOverdue(task.deadline)
                            ? 'text-red-600 font-medium'
                            : isDeadlineSoon(task.deadline)
                            ? 'text-amber-600 font-medium'
                            : ''
                        }`}
                      >
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={commentDialogOpen === task.id}
                      onOpenChange={(open) =>
                        setCommentDialogOpen(open ? task.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {task.comments.length}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Comments for "{task.name}"</DialogTitle>
                          <DialogDescription>
                            Add or view comments for this task.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {/* Existing Comments */}
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {task.comments.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No comments yet. Be the first to add one!
                              </p>
                            ) : (
                              task.comments.map((comment) => {
                                const author = getStudent(comment.author);
                                return (
                                  <div
                                    key={comment.id}
                                    className="flex gap-3 p-3 bg-muted rounded-lg"
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={author?.avatar} />
                                      <AvatarFallback>
                                        {author?.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">
                                          {author?.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm mt-1">{comment.text}</p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Add Comment */}
                          <div className="space-y-2 pt-4 border-t">
                            <Textarea
                              placeholder="Add a comment or note..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              rows={3}
                            />
                            <Button
                              onClick={() => handleAddComment(task.id)}
                              disabled={!newComment.trim()}
                            >
                              Add Comment
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}