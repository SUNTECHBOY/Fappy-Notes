import { useState } from 'react';
import { Student, TaskStatus } from '../types';
import { aiService } from '../utils/aiService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Sparkles, Loader2, Wand2, Clock, TrendingUp } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface NaturalLanguageProjectDialogProps {
  students: Student[];
  onCreateProject: (project: {
    name: string;
    description: string;
    students: string[];
    tasks: Array<{
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }>;
  }) => void;
}

export function NaturalLanguageProjectDialog({
  students,
  onCreateProject,
}: NaturalLanguageProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    name: string;
    description: string;
    suggestedTasks: Array<{
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }>;
    estimatedDuration: string;
    difficulty: string;
  } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [editedTasks, setEditedTasks] = useState<
    Array<{
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }>
  >([]);

  const handleGenerateProject = async () => {
    if (!naturalLanguageInput.trim()) return;

    setIsProcessing(true);
    try {
      const suggestion = await aiService.parseProjectFromNaturalLanguage(
        naturalLanguageInput
      );
      setAiSuggestion(suggestion);
      setEditedTasks(suggestion.suggestedTasks);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateProject = () => {
    if (!aiSuggestion) return;

    onCreateProject({
      name: aiSuggestion.name,
      description: aiSuggestion.description,
      students: selectedStudents,
      tasks: editedTasks,
    });

    // Reset state
    setOpen(false);
    setNaturalLanguageInput('');
    setAiSuggestion(null);
    setSelectedStudents([]);
    setEditedTasks([]);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const updateTaskAssignment = (index: number, studentId: string) => {
    setEditedTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, assignedTo: studentId } : task))
    );
  };

  const examplePrompts = [
    'Create a web application for task management with user authentication',
    'Build a mobile app for fitness tracking with social features',
    'Develop an AI chatbot for customer support',
    'Design a dashboard for data analytics and visualization',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Wand2 className="h-4 w-4 mr-2" />
          AI Project Creator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Natural Language Project Creation
          </DialogTitle>
          <DialogDescription>
            Describe your project in natural language and let AI create it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1: Natural Language Input */}
          {!aiSuggestion && (
            <>
              <div className="space-y-2">
                <Label>Describe your project idea</Label>
                <Textarea
                  placeholder="E.g., 'I want to build a web application for students to share study materials and collaborate on projects. It should have user authentication, file uploads, and a messaging system.'"
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Example prompts:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setNaturalLanguageInput(prompt)}
                      className="text-xs justify-start h-auto py-2 px-3"
                    >
                      <Sparkles className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-left">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerateProject}
                disabled={!naturalLanguageInput.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI is creating your project...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Project with AI
                  </>
                )}
              </Button>
            </>
          )}

          {/* Step 2: Review AI Suggestion */}
          {aiSuggestion && (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{aiSuggestion.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {aiSuggestion.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAiSuggestion(null);
                      setEditedTasks([]);
                    }}
                  >
                    Edit Description
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Badge className="bg-blue-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {aiSuggestion.estimatedDuration}
                  </Badge>
                  <Badge className="bg-purple-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {aiSuggestion.difficulty} Difficulty
                  </Badge>
                  <Badge className="bg-green-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {editedTasks.length} Tasks Generated
                  </Badge>
                </div>
              </div>

              {/* Team Selection */}
              <div className="space-y-3">
                <Label>Select Team Members</Label>
                <ScrollArea className="h-[150px] border rounded-md p-4">
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md"
                      >
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <label
                          htmlFor={`student-${student.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {student.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* AI-Generated Tasks */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  AI-Generated Tasks
                </Label>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-3">
                    {editedTasks.map((task, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 space-y-3 bg-card"
                      >
                        <div className="font-medium text-sm">{task.name}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Assign To</Label>
                            <Select
                              value={task.assignedTo}
                              onValueChange={(value) =>
                                updateTaskAssignment(index, value)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Unassigned" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Unassigned</SelectItem>
                                {selectedStudents.map((studentId) => {
                                  const student = students.find(
                                    (s) => s.id === studentId
                                  );
                                  return student ? (
                                    <SelectItem key={student.id} value={student.id}>
                                      {student.name}
                                    </SelectItem>
                                  ) : null;
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Deadline</Label>
                            <input
                              type="date"
                              value={task.deadline}
                              onChange={(e) =>
                                setEditedTasks((prev) =>
                                  prev.map((t, i) =>
                                    i === index
                                      ? { ...t, deadline: e.target.value }
                                      : t
                                  )
                                )
                              }
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleCreateProject} className="flex-1">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setNaturalLanguageInput('');
                    setAiSuggestion(null);
                    setSelectedStudents([]);
                    setEditedTasks([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}