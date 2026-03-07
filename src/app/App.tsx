import { ProjectDetails } from './components/ProjectDetails';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { AIProjectCreationAssistant } from './components/AIProjectCreationAssistant';
import { StudyMaterialsBoard } from './components/StudyMaterialsBoard';
import { PortfolioBoard } from './components/PortfolioBoard';
import { AllPortfoliosView } from './components/AllPortfoliosView';
import { AdminManagement } from './components/AdminManagement';
import { ProfileEditDialog } from './components/ProfileEditDialog';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Settings,
  Search,
  Sparkles,
  BookOpen,
  UserCircle,
  Menu,
  Shield,
  Moon,
  Sun,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { useState } from 'react';
import { Project, StudyMaterial, Portfolio, UserRole, TaskStatus, Student } from './types';
import {
  mockProjects,
  mockStudents,
  mockStudyMaterials,
  mockPortfolios,
  mockSubjects,
  mockActivityLogs,
  mockEngagementReports,
  mockTeamSuggestions,
  mockStudyGroups,
} from './data/mockData';
import { ProjectCard } from './components/ProjectCard';
import { useTheme } from './hooks/useTheme';

type Section = 'projects' | 'materials' | 'portfolio' | 'all-portfolios' | 'admin';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockStudyMaterials);
  const [portfolios, setPortfolios] = useState<{ [userId: string]: Portfolio }>(mockPortfolios);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('User');
  const [currentUserId] = useState('1'); // Simulating logged-in user as Alice
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<Section>('projects');
  const [selectedPortfolioUserId, setSelectedPortfolioUserId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    totalTasks: projects.reduce((sum, p) => sum + p.tasks.length, 0),
  };

  const currentStudent = students.find((s) => s.id === currentUserId);

  // Project handlers
  const handleCreateProject = (newProjectData: {
    name: string;
    description: string;
    students: string[];
    tasks?: Array<{
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }>;
  }) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: newProjectData.name,
      description: newProjectData.description,
      students: newProjectData.students,
      status: 'Not Started',
      progress: 0,
      tasks: newProjectData.tasks?.map(task => ({
        ...task,
        id: `t${Date.now()}-${Math.random()}`,
        comments: [],
      })) || [],
      aiSummary: 'New project created. Ready to add tasks and begin work!',
      aiAlerts: [],
    };
    setProjects([...projects, newProject]);
  };

  const handleUpdateTaskStatus = (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) =>
            task.id === taskId ? { ...task, status } : task
          );

          const completedTasks = updatedTasks.filter((t) => t.status === 'Done')
            .length;
          const progress = Math.round(
            (completedTasks / updatedTasks.length) * 100
          );

          let projectStatus = project.status;
          if (progress === 100) {
            projectStatus = 'Completed';
          } else if (progress > 0) {
            projectStatus = 'In Progress';
          }

          return {
            ...project,
            tasks: updatedTasks,
            progress,
            status: projectStatus,
          };
        }
        return project;
      })
    );
  };

  const handleAddComment = (
    projectId: string,
    taskId: string,
    commentText: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: `c${Date.now()}`,
                    text: commentText,
                    author: currentUserId,
                    timestamp: new Date().toISOString(),
                  },
                ],
              };
            }
            return task;
          });
          return { ...project, tasks: updatedTasks };
        }
        return project;
      })
    );
  };

  const handleAddTask = (
    projectId: string,
    taskData: {
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const newTask = {
            id: `t${Date.now()}`,
            ...taskData,
            comments: [],
          };
          return {
            ...project,
            tasks: [...project.tasks, newTask],
          };
        }
        return project;
      })
    );
  };

  // Study materials handlers
  const handleUploadMaterial = (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => {
    const newMaterial: StudyMaterial = {
      ...material,
      id: `sm${Date.now()}`,
      uploadedBy: currentUserId,
      uploadedAt: new Date().toISOString(),
      aiSummary: 'Comprehensive study material covering key concepts with detailed examples.',
      aiKeyPoints: [
        'Well-structured content with clear explanations',
        'Includes practical examples and use cases',
        'Suitable for intermediate to advanced learners',
      ],
    };
    setMaterials([...materials, newMaterial]);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(materials.filter((m) => m.id !== materialId));
  };

  const handleDeleteSubject = (subjectId: string) => {
    // Remove the subject
    setSubjects(subjects.filter((s) => s.id !== subjectId));
    // Remove all materials associated with this subject
    setMaterials(materials.filter((m) => m.subject !== subjectId));
  };

  // Portfolio handlers
  const handleAddAchievement = (userId: string, achievement: { title: string; description: string }) => {
    setPortfolios((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        achievements: [
          ...prev[userId].achievements,
          {
            id: `a${Date.now()}`,
            ...achievement,
            awardedBy: 'Admin',
            awardedAt: new Date().toISOString().split('T')[0],
          },
        ],
      },
    }));
  };

  const handleAddFeedback = (userId: string, feedback: string) => {
    setPortfolios((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        adminFeedback: [
          ...prev[userId].adminFeedback,
          {
            id: `f${Date.now()}`,
            text: feedback,
            adminId: currentUserId,
            createdAt: new Date().toISOString().split('T')[0],
          },
        ],
      },
    }));
  };

  // Admin delete handlers
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(projects.filter((p) => p.id !== projectId));
      setSelectedProject(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      // Note: In a real application, you would also need to remove user from all projects, portfolios, etc.
      alert('User deletion functionality would be implemented here with proper backend integration.');
    }
  };

  // Profile update handler
  const handleUpdateProfile = (updatedStudent: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const NavMenu = () => (
    <nav className="flex flex-col gap-2">
      <Button
        variant={activeSection === 'projects' ? 'default' : 'ghost'}
        className="justify-start"
        onClick={() => setActiveSection('projects')}
      >
        <FolderKanban className="h-4 w-4 mr-2" />
        Projects
      </Button>
      <Button
        variant={activeSection === 'materials' ? 'default' : 'ghost'}
        className="justify-start"
        onClick={() => setActiveSection('materials')}
      >
        <BookOpen className="h-4 w-4 mr-2" />
        Study Materials
      </Button>
      <Button
        variant={activeSection === 'portfolio' ? 'default' : 'ghost'}
        className="justify-start"
        onClick={() => {
          setActiveSection('portfolio');
          setSelectedPortfolioUserId(null);
        }}
      >
        <UserCircle className="h-4 w-4 mr-2" />
        My Portfolio
      </Button>
      {userRole === 'Admin' && (
        <Button
          variant={activeSection === 'all-portfolios' ? 'default' : 'ghost'}
          className="justify-start"
          onClick={() => {
            setActiveSection('all-portfolios');
            setSelectedPortfolioUserId(null);
          }}
        >
          <Users className="h-4 w-4 mr-2" />
          All Portfolios
        </Button>
      )}
      {userRole === 'Admin' && (
        <Button
          variant={activeSection === 'admin' ? 'default' : 'ghost'}
          className="justify-start"
          onClick={() => setActiveSection('admin')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin Management
        </Button>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-card p-6 relative">
        {/* Decorative gradient background - adapts to theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--shadow-indigo)] via-transparent to-[var(--shadow-violet)] dark:from-[var(--glow-lavender)] dark:via-transparent dark:to-[var(--glow-sky)] opacity-30 dark:opacity-20 pointer-events-none rounded-r-lg" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--accent-indigo)] via-[var(--accent-violet)] to-[var(--accent-blue)] dark:from-[var(--accent-lavender)] dark:via-[var(--accent-sky)] dark:to-[var(--accent-cyan)] flex items-center justify-center text-white shadow-lg shadow-[var(--shadow-violet)] dark:shadow-[var(--glow-violet)]">
              SC
            </div>
            <div>
              <h1 className="font-bold">StudentCollab</h1>
              <p className="text-xs text-[var(--accent-indigo)] dark:text-[var(--accent-sky)]">AI-Powered Platform</p>
            </div>
          </div>
          <NavMenu />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground">
                      SC
                    </div>
                    <div>
                      <h1 className="font-bold">StudentCollab</h1>
                      <p className="text-xs text-muted-foreground">AI-Powered</p>
                    </div>
                  </div>
                  <NavMenu />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-3 lg:hidden">
                <FolderKanban className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">StudentCollab</h1>
              </div>

              <div className="hidden lg:block">
                <Badge variant="outline" className="text-sm border-[var(--accent-indigo)]/40 dark:border-[var(--accent-lavender)]/30 bg-gradient-to-r from-[var(--accent-indigo)]/15 via-[var(--accent-violet)]/15 to-[var(--accent-blue)]/15 dark:from-[var(--accent-lavender)]/10 dark:to-[var(--accent-cyan)]/10 text-[var(--accent-indigo)] dark:text-[var(--accent-lavender)] shadow-sm shadow-[var(--shadow-indigo)] dark:shadow-[var(--glow-lavender)]">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Enabled
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="relative"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    Role:
                  </span>
                  <Select
                    value={userRole}
                    onValueChange={(v) => setUserRole(v as UserRole)}
                  >
                    <SelectTrigger className="w-[100px] md:w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors"
                  onClick={() => setIsProfileEditOpen(true)}
                >
                  {currentStudent?.avatar ? (
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                      {currentStudent?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  <div className="text-sm">
                    <div className="font-medium">{currentStudent?.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {currentStudent?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {/* Projects Section */}
            {activeSection === 'projects' && (
              <>
                {/* Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                  <div className="bg-card border rounded-lg p-4 md:p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-[var(--glow-sky)] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-sky)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-[var(--accent-sky)]">
                          Total Projects
                        </p>
                        <p className="text-2xl md:text-3xl font-bold mt-1">
                          {stats.totalProjects}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-[var(--accent-sky)]/20">
                        <LayoutDashboard className="h-8 md:h-10 w-8 md:w-10 text-[var(--accent-sky)]" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border rounded-lg p-4 md:p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-[var(--glow-peach)] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-peach)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-[var(--accent-peach)]">
                          In Progress
                        </p>
                        <p className="text-2xl md:text-3xl font-bold mt-1">
                          {stats.inProgress}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-[var(--accent-peach)]/20">
                        <FolderKanban className="h-8 md:h-10 w-8 md:w-10 text-[var(--accent-peach)]" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border rounded-lg p-4 md:p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-[var(--glow-mint)] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-mint)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-[var(--accent-mint)]">
                          Completed
                        </p>
                        <p className="text-2xl md:text-3xl font-bold mt-1">
                          {stats.completed}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-[var(--accent-mint)]/20">
                        <Settings className="h-8 md:h-10 w-8 md:w-10 text-[var(--accent-mint)]" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border rounded-lg p-4 md:p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-[var(--glow-lavender)] transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-lavender)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-xs md:text-sm text-[var(--accent-lavender)]">
                          Total Tasks
                        </p>
                        <p className="text-2xl md:text-3xl font-bold mt-1">
                          {stats.totalTasks}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-[var(--accent-lavender)]/20">
                        <Users className="h-8 md:h-10 w-8 md:w-10 text-[var(--accent-lavender)]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="board" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <TabsList>
                      <TabsTrigger value="board">Board</TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                      <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search projects..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      {userRole === 'Admin' && (
                        <CreateProjectDialog
                          students={mockStudents}
                          onCreateProject={handleCreateProject}
                        />
                      )}
                      {userRole === 'Admin' && (
                        <AIProjectCreationAssistant
                          students={mockStudents}
                          onCreateProject={handleCreateProject}
                        />
                      )}
                    </div>
                  </div>

                  {/* Board View */}
                  <TabsContent value="board">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProjects.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                          No projects found.{' '}
                          {userRole === 'Admin' &&
                            'Create your first project to get started!'}
                        </div>
                      ) : (
                        filteredProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            students={mockStudents}
                            isAdmin={userRole === 'Admin'}
                            onDelete={handleDeleteProject}
                            onClick={() =>
                              setSelectedProject(
                                projects.find((p) => p.id === project.id) || null
                              )
                            }
                          />
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* List View */}
                  <TabsContent value="list">
                    <div className="bg-card border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b bg-muted/50">
                            <tr>
                              <th className="text-left p-4 font-medium">Project Name</th>
                              <th className="text-left p-4 font-medium">Status</th>
                              <th className="text-left p-4 font-medium">Progress</th>
                              <th className="text-left p-4 font-medium">Team</th>
                              <th className="text-left p-4 font-medium">Tasks</th>
                              <th className="text-left p-4 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProjects.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="text-center py-8 text-muted-foreground"
                                >
                                  No projects found
                                </td>
                              </tr>
                            ) : (
                              filteredProjects.map((project) => {
                                const statusColors = {
                                  'Not Started': 'bg-gray-500',
                                  'In Progress': 'bg-blue-500',
                                  Completed: 'bg-green-500',
                                };

                                return (
                                  <tr
                                    key={project.id}
                                    className="border-b hover:bg-muted/50"
                                  >
                                    <td className="p-4 font-medium">{project.name}</td>
                                    <td className="p-4">
                                      <Badge className={statusColors[project.status]}>
                                        {project.status}
                                      </Badge>
                                    </td>
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-primary"
                                            style={{ width: `${project.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-sm">
                                          {project.progress}%
                                        </span>
                                      </div>
                                    </td>
                                    <td className="p-4">
                                      {project.students.length} members
                                    </td>
                                    <td className="p-4">
                                      {
                                        project.tasks.filter((t) => t.status === 'Done')
                                          .length
                                      }{' '}
                                      / {project.tasks.length}
                                    </td>
                                    <td className="p-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          setSelectedProject(
                                            projects.find((p) => p.id === project.id) ||
                                              null
                                          )
                                        }
                                      >
                                        View Details
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Project Details Modal */}
                <ProjectDetails
                  project={
                    selectedProject
                      ? projects.find((p) => p.id === selectedProject.id) || null
                      : null
                  }
                  students={mockStudents}
                  userRole={userRole}
                  currentUserId={currentUserId}
                  open={!!selectedProject}
                  onClose={() => setSelectedProject(null)}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onAddComment={handleAddComment}
                  onAddTask={handleAddTask}
                  onDeleteProject={userRole === 'Admin' ? handleDeleteProject : undefined}
                />
              </>
            )}

            {/* Study Materials Section */}
            {activeSection === 'materials' && (
              <StudyMaterialsBoard
                materials={materials}
                subjects={subjects}
                students={mockStudents}
                currentUserId={currentUserId}
                userRole={userRole}
                onUploadMaterial={handleUploadMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onDeleteSubject={handleDeleteSubject}
              />
            )}

            {/* Portfolio Section */}
            {activeSection === 'portfolio' && portfolios[currentUserId] && (
              <PortfolioBoard
                portfolio={portfolios[currentUserId]}
                student={currentStudent!}
                userRole={userRole}
                currentUserId={currentUserId}
                completedProjects={projects.filter(p => p.status === 'Completed' && p.students.includes(currentUserId)).length}
                materialsUploaded={materials.filter(m => m.uploadedBy === currentUserId).length}
                onAddAchievement={(achievement) =>
                  handleAddAchievement(currentUserId, achievement)
                }
                onAddFeedback={(feedback) => handleAddFeedback(currentUserId, feedback)}
              />
            )}

            {/* All Portfolios Section (Admin Only) */}
            {activeSection === 'all-portfolios' && userRole === 'Admin' && (
              <>
                {selectedPortfolioUserId ? (
                  <div>
                    <Button
                      variant="outline"
                      className="mb-6"
                      onClick={() => setSelectedPortfolioUserId(null)}
                    >
                      ← Back to All Portfolios
                    </Button>
                    <PortfolioBoard
                      portfolio={portfolios[selectedPortfolioUserId]}
                      student={
                        mockStudents.find((s) => s.id === selectedPortfolioUserId)!
                      }
                      userRole={userRole}
                      currentUserId={currentUserId}
                      completedProjects={projects.filter(p => p.status === 'Completed' && p.students.includes(selectedPortfolioUserId)).length}
                      materialsUploaded={materials.filter(m => m.uploadedBy === selectedPortfolioUserId).length}
                      onAddAchievement={(achievement) =>
                        handleAddAchievement(selectedPortfolioUserId, achievement)
                      }
                      onAddFeedback={(feedback) =>
                        handleAddFeedback(selectedPortfolioUserId, feedback)
                      }
                    />
                  </div>
                ) : (
                  <AllPortfoliosView
                    portfolios={portfolios}
                    students={mockStudents}
                    onSelectStudent={setSelectedPortfolioUserId}
                  />
                )}
              </>
            )}

            {/* Admin Management Section (Admin Only) */}
            {activeSection === 'admin' && userRole === 'Admin' && (
              <AdminManagement
                users={mockStudents}
                activityLogs={mockActivityLogs}
                engagementReports={mockEngagementReports}
                teamSuggestions={mockTeamSuggestions}
                studyGroups={mockStudyGroups}
                projects={mockProjects.map(p => ({ id: p.id, name: p.name }))}
                onInviteUser={(invite) => {
                  // Simulate user invitation
                  console.log('Inviting user:', invite);
                  alert(`Invitation sent to ${invite.email || invite.mobileNumber} to join StudentCollab platform!\n\nThey will receive an invitation to access:\n• Collaborative Projects\n• Study Materials\n• Portfolio Features\n• Team Workspace`);
                }}
                onUpdateUserStatus={(userId, status) => {
                  console.log('Update user status:', userId, status);
                  alert(`User status updated to ${status}`);
                }}
                onUpdateUserRole={(userId, role) => {
                  console.log('Update user role:', userId, role);
                  alert(`User role updated to ${role}`);
                }}
                onUpdateUserAccess={(userId, projectIds, studyGroupIds) => {
                  console.log('Update user access:', userId, projectIds, studyGroupIds);
                  alert(`Access updated for user`);
                }}
                onDeleteProject={handleDeleteProject}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* Profile Edit Dialog */}
      {currentStudent && (
        <ProfileEditDialog
          open={isProfileEditOpen}
          onOpenChange={setIsProfileEditOpen}
          student={currentStudent}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}