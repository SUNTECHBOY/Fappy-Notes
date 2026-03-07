import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Target,
  Zap,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Student, TaskStatus } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'summary';
  suggestions?: string[];
}

interface AIProjectCreationAssistantProps {
  students: Student[];
  onCreateProject: (projectData: {
    name: string;
    description: string;
    students: string[];
    tasks?: Array<{
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }>;
  }) => void;
}

type ConversationStep =
  | 'initial'
  | 'project_name'
  | 'project_goal'
  | 'project_scope'
  | 'team_selection'
  | 'task_planning'
  | 'prioritization'
  | 'confirmation';

interface ProjectData {
  name: string;
  description: string;
  goal: string;
  scope: string;
  teamMembers: string[];
  tasks: Array<{
    name: string;
    assignedTo: string;
    status: TaskStatus;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export function AIProjectCreationAssistant({
  students,
  onCreateProject,
}: AIProjectCreationAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState<ConversationStep>('initial');
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    goal: '',
    scope: '',
    teamMembers: [],
    tasks: [],
  });
  const [isThinking, setIsThinking] = useState(false);

  const resetConversation = () => {
    setMessages([]);
    setCurrentStep('initial');
    setProjectData({
      name: '',
      description: '',
      goal: '',
      scope: '',
      teamMembers: [],
      tasks: [],
    });
    setCurrentInput('');
  };

  const addMessage = (role: 'user' | 'assistant', content: string, type: 'text' | 'suggestion' | 'summary' = 'text', suggestions?: string[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: new Date(),
      type,
      suggestions,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const generateAIResponse = (step: ConversationStep, userInput: string) => {
    setIsThinking(true);
    
    setTimeout(() => {
      switch (step) {
        case 'initial':
          addMessage(
            'assistant',
            `Great! Let me help you bring this project to life. 🎯\n\nFirst, let's give your project a name. What would you like to call it?\n\nThink of something that captures the essence of what you're building. It could be descriptive like "E-Commerce Platform" or creative like "ShopSphere" - whatever resonates with your vision!`,
            'text'
          );
          setCurrentStep('project_name');
          break;

        case 'project_name':
          setProjectData((prev) => ({ ...prev, name: userInput }));
          addMessage(
            'assistant',
            `"${userInput}" - I love it! That's a compelling name. ✨\n\nNow, let's dive deeper. What's the primary goal you want to achieve with this project?\n\nFor example:\n• Are you solving a specific problem?\n• Building something innovative?\n• Learning new technologies?\n• Creating value for users?\n\nTell me the story of what success looks like for "${userInput}".`,
            'suggestion',
            [
              'Build a complete solution from scratch',
              'Learn and experiment with new tech',
              'Solve a real-world problem',
              'Create a portfolio project',
            ]
          );
          setCurrentStep('project_goal');
          break;

        case 'project_goal':
          setProjectData((prev) => ({ ...prev, goal: userInput }));
          addMessage(
            'assistant',
            `Excellent vision! I can see how this will make a real impact. 🚀\n\nNow let's talk about scope. To make "${projectData.name}" a success, we need to be strategic about what to include.\n\nWhat are the core features or components you want to build? Think about:\n• Must-have features (the minimum viable product)\n• Nice-to-have features (if time permits)\n• Future enhancements (can wait for version 2.0)\n\nDescribe the scope in your own words - what will you actually build?`,
            'text'
          );
          setCurrentStep('project_scope');
          break;

        case 'project_scope':
          setProjectData((prev) => ({ ...prev, scope: userInput, description: `${prev.goal} ${userInput}` }));
          addMessage(
            'assistant',
            `Perfect! You've outlined a clear scope. Now let's assemble your dream team! 👥\n\nWho should be part of this journey? I see we have ${students.length} talented people available:\n\n${students.map((s, i) => `${i + 1}. ${s.name} - ${s.email}`).join('\n')}\n\nTell me who you'd like to work with. You can say their names, email addresses, or just "all" if you want the whole squad involved!`,
            'suggestion',
            ['Include everyone', 'Just myself', 'Select specific members']
          );
          setCurrentStep('team_selection');
          break;

        case 'team_selection':
          const selectedMembers = parseTeamSelection(userInput);
          setProjectData((prev) => ({ ...prev, teamMembers: selectedMembers }));
          
          const teamNames = students
            .filter((s) => selectedMembers.includes(s.id))
            .map((s) => s.name)
            .join(', ');
          
          addMessage(
            'assistant',
            `Fantastic team! ${teamNames} ${selectedMembers.length > 1 ? 'are' : 'is'} on board. 🎉\n\nNow comes the exciting part - let's break down "${projectData.name}" into actionable tasks!\n\nBased on your goal and scope, I'm thinking this project could be divided into several key areas. Let me analyze what needs to be done...\n\n*AI is analyzing your project requirements...*`,
            'text'
          );
          
          setTimeout(() => {
            const generatedTasks = generateSmartTasks(projectData, selectedMembers);
            setProjectData((prev) => ({ ...prev, tasks: generatedTasks }));
            
            addMessage(
              'assistant',
              `I've analyzed your project and generated a comprehensive task breakdown! Here's my recommendation:\n\n${generatedTasks.map((task, i) => 
                `${i + 1}. **${task.name}** (${task.priority} priority)\n   📅 Due: ${task.deadline}\n   👤 Assigned: ${students.find(s => s.id === task.assignedTo)?.name || 'Unassigned'}\n`
              ).join('\n')}\n\nNow for the crucial question: **Where should you start?** 🎯\n\nWould you like me to help you prioritize these tasks and create a roadmap?`,
              'text'
            );
            setCurrentStep('task_planning');
          }, 2000);
          break;

        case 'task_planning':
          addMessage(
            'assistant',
            `Excellent! Let me create a strategic roadmap for "${projectData.name}". 🗺️\n\n*Analyzing task dependencies, team capacity, and project goals...*`,
            'text'
          );
          
          setTimeout(() => {
            const prioritizedTasks = prioritizeTasks(projectData.tasks);
            const roadmap = generateRoadmap(prioritizedTasks);
            
            addMessage(
              'assistant',
              roadmap,
              'summary'
            );
            setCurrentStep('prioritization');
          }, 1500);
          break;

        case 'prioritization':
          addMessage(
            'assistant',
            `Perfect! You now have a complete project plan for "${projectData.name}" 🎊\n\nHere's what we've built together:\n\n**Project:** ${projectData.name}\n**Goal:** ${projectData.goal}\n**Team:** ${projectData.teamMembers.length} member(s)\n**Tasks:** ${projectData.tasks.length} actionable items\n**Timeline:** ${getProjectTimeline(projectData.tasks)}\n\nAre you ready to create this project and start building? Type "yes" to confirm, or tell me if you'd like to adjust anything!`,
            'text'
          );
          setCurrentStep('confirmation');
          break;

        case 'confirmation':
          if (userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('confirm')) {
            onCreateProject({
              name: projectData.name,
              description: projectData.description,
              students: projectData.teamMembers,
              tasks: projectData.tasks.map((task) => ({
                name: task.name,
                assignedTo: task.assignedTo,
                status: task.status,
                deadline: task.deadline,
              })),
            });
            
            addMessage(
              'assistant',
              `🎉 Congratulations! "${projectData.name}" has been created successfully!\n\nYour project is now live with ${projectData.tasks.length} tasks ready to tackle. The team can start working immediately.\n\n**Next Steps:**\n1. Review the project board to see all tasks\n2. Team members will be notified of their assignments\n3. Start with the high-priority tasks I've identified\n4. Track progress and adjust as you go\n\nRemember: Great projects are built one task at a time. Good luck! 🚀`,
              'summary'
            );
            
            setTimeout(() => {
              setIsOpen(false);
              setTimeout(resetConversation, 300);
            }, 3000);
          } else {
            addMessage(
              'assistant',
              `No problem! What would you like to adjust? I can help you:\n• Change the project name or description\n• Modify the team composition\n• Adjust tasks or priorities\n• Update deadlines\n\nJust tell me what you'd like to change!`,
              'text'
            );
          }
          break;
      }
      setIsThinking(false);
    }, 1000);
  };

  const parseTeamSelection = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('all') || lowerInput.includes('everyone') || lowerInput.includes('whole')) {
      return students.map((s) => s.id);
    }
    
    if (lowerInput.includes('just me') || lowerInput.includes('myself') || lowerInput.includes('solo')) {
      return [students[0]?.id || '1']; // First student as current user
    }
    
    // Try to match student names or emails
    const selectedStudents = students.filter((student) => {
      return (
        lowerInput.includes(student.name.toLowerCase()) ||
        lowerInput.includes(student.email.toLowerCase())
      );
    });
    
    if (selectedStudents.length > 0) {
      return selectedStudents.map((s) => s.id);
    }
    
    // Default to all students if unclear
    return students.map((s) => s.id);
  };

  const generateSmartTasks = (
    data: ProjectData,
    teamMembers: string[]
  ): ProjectData['tasks'] => {
    const baseDate = new Date();
    
    // Generate tasks based on project scope keywords
    const scopeLower = data.scope.toLowerCase();
    const tasks: ProjectData['tasks'] = [];
    
    // Planning phase
    tasks.push({
      name: 'Project Setup & Requirements Documentation',
      assignedTo: teamMembers[0] || '1',
      status: 'Not Started',
      deadline: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
    });
    
    // Design phase
    if (scopeLower.includes('ui') || scopeLower.includes('design') || scopeLower.includes('interface')) {
      tasks.push({
        name: 'UI/UX Design & Wireframing',
        assignedTo: teamMembers[1 % teamMembers.length] || teamMembers[0],
        status: 'Not Started',
        deadline: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
      });
    }
    
    // Development phase
    if (scopeLower.includes('backend') || scopeLower.includes('api') || scopeLower.includes('database')) {
      tasks.push({
        name: 'Backend Architecture & Database Design',
        assignedTo: teamMembers[0] || '1',
        status: 'Not Started',
        deadline: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
      });
      
      tasks.push({
        name: 'API Development & Integration',
        assignedTo: teamMembers[1 % teamMembers.length] || teamMembers[0],
        status: 'Not Started',
        deadline: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
      });
    }
    
    if (scopeLower.includes('frontend') || scopeLower.includes('web') || scopeLower.includes('app')) {
      tasks.push({
        name: 'Frontend Component Development',
        assignedTo: teamMembers[2 % teamMembers.length] || teamMembers[0],
        status: 'Not Started',
        deadline: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
      });
    }
    
    // Core features
    tasks.push({
      name: 'Core Feature Implementation',
      assignedTo: teamMembers[0] || '1',
      status: 'Not Started',
      deadline: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
    });
    
    // Testing phase
    tasks.push({
      name: 'Testing & Quality Assurance',
      assignedTo: teamMembers[teamMembers.length - 1] || teamMembers[0],
      status: 'Not Started',
      deadline: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
    });
    
    // Documentation
    tasks.push({
      name: 'Documentation & Deployment Guide',
      assignedTo: teamMembers[1 % teamMembers.length] || teamMembers[0],
      status: 'Not Started',
      deadline: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
    });
    
    // Launch
    tasks.push({
      name: 'Final Review & Launch Preparation',
      assignedTo: teamMembers[0] || '1',
      status: 'Not Started',
      deadline: new Date(baseDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
    });
    
    return tasks;
  };

  const prioritizeTasks = (tasks: ProjectData['tasks']): ProjectData['tasks'] => {
    return [...tasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const generateRoadmap = (tasks: ProjectData['tasks']): string => {
    const highPriorityTasks = tasks.filter((t) => t.priority === 'high');
    const mediumPriorityTasks = tasks.filter((t) => t.priority === 'medium');
    
    return `## 🎯 Strategic Project Roadmap

Based on my analysis, here's the optimal path forward:

### 🔥 **Phase 1: Foundation (Weeks 1-2)**
Start here! These high-priority tasks lay the groundwork:

${highPriorityTasks.slice(0, 3).map((task, i) => 
  `**${i + 1}. ${task.name}**\n   Why start here? This ${i === 0 ? 'establishes the project foundation' : i === 1 ? 'defines the user experience' : 'builds the core infrastructure'}\n   Timeline: Complete by ${task.deadline}`
).join('\n\n')}

### ⚡ **Phase 2: Development Sprint (Weeks 3-4)**
Once the foundation is solid, tackle these:

${tasks.slice(3, 5).map((task, i) => 
  `**${i + 1}. ${task.name}**\n   This builds on the previous phase and adds real functionality`
).join('\n\n')}

### ✅ **Phase 3: Polish & Launch (Week 5+)**
Finally, ensure quality and prepare for launch:

${mediumPriorityTasks.slice(0, 2).map((task, i) => 
  `**${i + 1}. ${task.name}**\n   Critical for a successful launch`
).join('\n\n')}

### 💡 **Pro Tips for Success:**
• Focus on completing Phase 1 before moving forward
• Regular team check-ins keep everyone aligned
• Don't skip testing - quality matters!
• Celebrate small wins along the way

Ready to get started? 🚀`;
  };

  const getProjectTimeline = (tasks: ProjectData['tasks']): string => {
    if (tasks.length === 0) return 'Not set';
    
    const deadlines = tasks.map((t) => new Date(t.deadline).getTime());
    const earliest = new Date(Math.min(...deadlines));
    const latest = new Date(Math.max(...deadlines));
    
    const weeks = Math.ceil((latest.getTime() - earliest.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    addMessage('user', currentInput);
    const userMessage = currentInput;
    setCurrentInput('');
    
    generateAIResponse(currentStep, userMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(
          'assistant',
          `Hello! I'm your AI Project Creation Assistant. 🤖✨\n\nI'm here to help you plan and structure your project from start to finish. Together, we'll:\n\n🎯 Define your project vision and goals\n📋 Break down the work into manageable tasks\n👥 Assemble the right team\n🗺️ Create a strategic roadmap\n⚡ Identify what to work on first\n\nI'll guide you through every step with personalized recommendations based on best practices and AI insights.\n\nReady to create something amazing? Let's start by telling me about your project idea!`,
          'text'
        );
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        handleOpen();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Project Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">AI Project Creation Assistant</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Let AI help you create a comprehensive project plan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'summary'
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 border-purple-200 dark:border-purple-800'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted-foreground">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isThinking && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isThinking}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isThinking}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • The AI will guide you through each step
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}