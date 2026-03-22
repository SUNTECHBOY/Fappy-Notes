import { ProjectDetails } from './components/ProjectDetails';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { AIProjectCreationAssistant } from './components/AIProjectCreationAssistant';
import { StudyMaterialsBoard } from './components/StudyMaterialsBoard';
import { PortfolioBoard } from './components/PortfolioBoard';
import { AllPortfoliosView } from './components/AllPortfoliosView';
import { AdminManagement } from './components/AdminManagement';
import { ProfileEditDialog } from './components/ProfileEditDialog';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthPanel } from './components/AuthPanel';
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
  User,
  LogOut,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { useState, useEffect } from 'react';
import { Project, StudyMaterial, Portfolio, UserRole, TaskStatus } from './types';
import {
  mockSubjects,
  mockActivityLogs,
  mockEngagementReports,
  mockTeamSuggestions,
  mockStudyGroups,
  mockStudents,
  mockProjects,
} from './data/mockData';
import { ProjectCard } from './components/ProjectCard';
import { useTheme } from './hooks/useTheme';
import { useDatabase } from './hooks/useDatabase';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabaseClient';
import { completeOnboarding } from './services/database';

type Section = 'projects' | 'materials' | 'portfolio' | 'all-portfolios' | 'admin';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    students,
    projects,
    materials,
    portfolios,
    loading,
    error,
    createProject,
    createTask,
    updateTaskStatus,
    addComment,
    uploadMaterial,
    createStudent,
    updateStudent,
    deleteStudent,
    addAchievement,
    addFeedback,
    deleteProject,
    deleteMaterial,
  } = useDatabase();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    return localStorage.getItem('fappy_selectedProjectId') || null;
  });
  const [userRole, setUserRole] = useState<UserRole>('User');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<Section>(() => {
    return (localStorage.getItem('fappy_activeSection') as Section) || 'projects';
  });
  const [selectedPortfolioUserId, setSelectedPortfolioUserId] = useState<string | null>(() => {
    return localStorage.getItem('fappy_portfolioUserId') || null;
  });
  const [subjects] = useState(mockSubjects);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const { user, authLoading, authError, signIn, signUp, signOut } = useAuth();

  // State Persistence Effects
  useEffect(() => {
    localStorage.setItem('fappy_activeSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('fappy_selectedProjectId', selectedProjectId);
    } else {
      localStorage.removeItem('fappy_selectedProjectId');
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedPortfolioUserId) {
      localStorage.setItem('fappy_portfolioUserId', selectedPortfolioUserId);
    } else {
      localStorage.removeItem('fappy_portfolioUserId');
    }
  }, [selectedPortfolioUserId]);

  // Derived State
  const selectedProject = selectedProjectId ? projects.find((p) => p.id === selectedProjectId) || null : null;

  // Declare currentStudent early so the role-sync effect can use it
  const currentStudent = students.find((s) => s.id === currentUserId);

  // Authentication Effect — set userId from auth session
  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
      // Role will be synced from DB student record below
      // Fall back to auth metadata only if student not loaded yet
      setUserRole((user.user_metadata?.role as UserRole) || 'User');
    } else {
      setCurrentUserId(null);
    }
  }, [user]);

  // Sync role from DB student record (authoritative source)
  useEffect(() => {
    if (currentStudent?.role) {
      setUserRole(currentStudent.role as UserRole);
    }
  }, [currentStudent]);

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

  // Project handlers
  const handleCreateProject = async (newProjectData: {
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
    try {
      const newProject = await createProject({
        name: newProjectData.name,
        description: newProjectData.description,
        students: newProjectData.students,
        status: 'Not Started',
        progress: 0,
        aiSummary: 'New project created. Ready to add tasks and begin work!',
      });

      // Create tasks if provided
      if (newProjectData.tasks && newProjectData.tasks.length > 0) {
        for (const task of newProjectData.tasks) {
          await createTask(newProject.id, task);
        }
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleUpdateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => {
    try {
      await updateTaskStatus(projectId, taskId, status);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleAddComment = async (
    projectId: string,
    taskId: string,
    commentText: string
  ) => {
    if (!currentUserId) return;
    try {
      await addComment(projectId, taskId, commentText, currentUserId);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleAddTask = async (
    projectId: string,
    taskData: {
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }
  ) => {
    try {
      await createTask(projectId, taskData);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleUploadMaterial = async (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => {
    if (!currentUserId) return;
    await uploadMaterial({
      ...material,
      uploadedBy: currentUserId,
      aiSummary: 'Comprehensive study material covering key concepts with detailed examples.',
      aiKeyPoints: [
        'Well-structured content with clear explanations',
        'Includes practical examples and use cases',
        'Suitable for intermediate to advanced learners',
      ],
    });
    // Note: errors are NOT caught here — they propagate back to FileUploadDialog
    // so the dialog can display them inline instead of silently failing.
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this study material? This action cannot be undone.')) {
      try {
        await deleteMaterial(materialId);
      } catch (err) {
        console.error('Error deleting material:', err);
      }
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    // Subject deletion would require additional backend implementation
    alert('Subject deletion will be implemented with proper backend integration.');
  };

  // Portfolio handlers
  const handleAddAchievement = async (userId: string, achievement: { title: string; description: string }) => {
    try {
      await addAchievement(userId, achievement);
    } catch (err) {
      console.error('Error adding achievement:', err);
    }
  };

  const handleAddFeedback = async (userId: string, feedback: string) => {
    if (!currentUserId) return;
    try {
      await addFeedback(userId, feedback, currentUserId);
    } catch (err) {
      console.error('Error adding feedback:', err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        if (selectedProjectId === projectId) {
          setSelectedProjectId(null);
        }
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        await deleteStudent(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  // Profile update handler
  const handleUpdateProfile = async (updatedStudent: any) => {
    try {
      // Keep avatar if it's a valid URL from storage, remove if it's base64
      const updates = { ...updatedStudent };
      
      if (updates.avatar && updates.avatar.startsWith('data:image')) {
        delete updates.avatar; // Remove base64 data, keep storage URL if exists
      }
      
      console.log('Updating student profile with:', updates);
      await updateStudent(updatedStudent.id, updates);
      console.log('✅ Profile updated successfully');
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Full error:', errorMessage);
    }
  };

  const NavMenu = () => (
    <nav className="flex flex-col gap-2">
      <Button
        variant="ghost"
        className={activeSection === 'projects' 
          ? 'justify-start bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary/90' 
          : 'justify-start text-sidebar-foreground font-medium hover:bg-sidebar-accent'}
        onClick={() => setActiveSection('projects')}
      >
        <FolderKanban className="h-5 w-5 mr-3" />
        Projects
      </Button>
      <Button
        variant="ghost"
        className={activeSection === 'materials' 
          ? 'justify-start bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary/90' 
          : 'justify-start text-sidebar-foreground font-medium hover:bg-sidebar-accent'}
        onClick={() => setActiveSection('materials')}
      >
        <BookOpen className="h-5 w-5 mr-3" />
        Study Materials
      </Button>
      <Button
        variant="ghost"
        className={activeSection === 'portfolio' 
          ? 'justify-start bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary/90' 
          : 'justify-start text-sidebar-foreground font-medium hover:bg-sidebar-accent'}
        onClick={() => {
          setActiveSection('portfolio');
          setSelectedPortfolioUserId(null);
        }}
      >
        <UserCircle className="h-5 w-5 mr-3" />
        My Portfolio
      </Button>
      {userRole === 'Admin' && (
        <Button
          variant="ghost"
          className={activeSection === 'all-portfolios' 
            ? 'justify-start bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary/90' 
            : 'justify-start text-sidebar-foreground font-medium hover:bg-sidebar-accent'}
          onClick={() => {
            setActiveSection('all-portfolios');
            setSelectedPortfolioUserId(null);
          }}
        >
          <Users className="h-5 w-5 mr-3" />
          All Portfolios
        </Button>
      )}
      {userRole === 'Admin' && (
        <Button
          variant="ghost"
          className={activeSection === 'admin' 
            ? 'justify-start bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary/90' 
            : 'justify-start text-sidebar-foreground font-medium hover:bg-sidebar-accent'}
          onClick={() => setActiveSection('admin')}
        >
          <Shield className="h-5 w-5 mr-3" />
          Admin Management
        </Button>
      )}
    </nav>
  );

  const [loadingSlow, setLoadingSlow] = useState(false);
  useEffect(() => {
    if (!authLoading) { setLoadingSlow(false); return; }
    const t = setTimeout(() => setLoadingSlow(true), 4000);
    return () => clearTimeout(t);
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
        <div className="text-sky-400 font-medium text-lg">Loading session...</div>
        {loadingSlow && (
          <div className="text-center mt-2">
            <p className="text-slate-400 text-sm mb-3">Taking longer than expected...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        )}
      </div>
    );
  }

  // If there's no active Supabase session at all, just render an auth panel.
  if (!currentUserId) {
    return (
      <AuthPanel
        loading={authLoading}
        error={authError}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    );
  }

  if (!loading && currentStudent && currentStudent.status === 'Pending') {
    return (
      <OnboardingScreen
        onComplete={async (data) => {
          await completeOnboarding(currentStudent.id, data);
          window.location.reload(); // Force a clean reload to initialize the dashboard with Active status
        }}
      />
    );
  }

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
                  {userRole === 'Admin' ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-300/40 dark:border-indigo-500/30">
                      <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Admin</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">User</span>
                    </div>
                  )}
                </div>
                <div
                  className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors"
                  onClick={() => setIsProfileEditOpen(true)}
                  title="View Profile"
                >
                  {currentStudent?.avatar ? (
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent?.name || 'User'}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                      {(currentStudent?.name || user?.user_metadata?.full_name || user?.email || 'U')
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="text-sm">
                    <div className="font-medium">{currentStudent?.name || user?.user_metadata?.full_name || 'User'}</div>
                    <div className="text-muted-foreground text-xs">
                      {currentStudent?.email || user?.email}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title="Sign Out"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-lg text-muted-foreground">Loading data from Supabase...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-destructive font-semibold">⚠️ Error: {error}</p>
                    <p className="text-sm text-muted-foreground mt-1">Check your browser console (F12) for details. Make sure your Supabase credentials are valid.</p>
                  </div>
                )}
                
                {/* Projects Section */}
                {activeSection === 'projects' && (
              <>
                {/* Stats Dashboard — Premium Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
                  {/* Total Projects */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/8 to-blue-600/5 dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-blue-600/10 border border-blue-200/60 dark:border-blue-500/20 p-4 md:p-6 group hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-blue-500/15 dark:bg-blue-400/20 border border-blue-300/30">
                          <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-3xl md:text-4xl font-black text-blue-700 dark:text-blue-300 tabular-nums">{stats.totalProjects}</span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wide">Total Projects</p>
                    </div>
                  </div>
                  {/* In Progress */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/8 to-amber-600/5 dark:from-amber-500/20 dark:via-orange-500/15 dark:to-amber-600/10 border border-amber-200/60 dark:border-amber-500/20 p-4 md:p-6 group hover:shadow-lg hover:shadow-amber-500/15 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/20 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-amber-500/15 dark:bg-amber-400/20 border border-amber-300/30">
                          <FolderKanban className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-3xl md:text-4xl font-black text-amber-700 dark:text-amber-300 tabular-nums">{stats.inProgress}</span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wide">In Progress</p>
                    </div>
                  </div>
                  {/* Completed */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/8 to-emerald-600/5 dark:from-emerald-500/20 dark:via-teal-500/15 dark:to-emerald-600/10 border border-emerald-200/60 dark:border-emerald-500/20 p-4 md:p-6 group hover:shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-300/30">
                          <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-3xl md:text-4xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{stats.completed}</span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wide">Completed</p>
                    </div>
                  </div>
                  {/* Total Tasks */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-violet-500/8 to-purple-600/5 dark:from-purple-500/20 dark:via-violet-500/15 dark:to-purple-600/10 border border-purple-200/60 dark:border-purple-500/20 p-4 md:p-6 group hover:shadow-lg hover:shadow-purple-500/15 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-400/20 dark:bg-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                    <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-purple-500/15 dark:bg-purple-400/20 border border-purple-300/30">
                          <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-3xl md:text-4xl font-black text-purple-700 dark:text-purple-300 tabular-nums">{stats.totalTasks}</span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wide">Total Tasks</p>
                    </div>
                  </div>
                </div>

                {/* Main Content */}

                <Tabs defaultValue="board" className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <TabsList className="bg-white/50 border border-border/50 rounded-xl p-1 shadow-sm dark:bg-card">
                      <TabsTrigger value="board" className="rounded-lg">Board</TabsTrigger>
                      <TabsTrigger value="list" className="rounded-lg">List</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                      <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search projects..."
                          className="pl-10 rounded-xl border-border/50 bg-white/50 shadow-sm transition-all focus-visible:ring-primary/20 dark:bg-card w-full"
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
                            students={students}
                            onDelete={handleDeleteProject}
                            onClick={() => setSelectedProjectId(project.id)}
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
                                          setSelectedProjectId(project.id)
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
                  project={selectedProject}
                  students={students}
                  userRole={userRole}
                  currentUserId={currentUserId}
                  open={!!selectedProject}
                  onClose={() => setSelectedProjectId(null)}
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
                students={students.length > 0 ? students : mockStudents}
                currentUserId={currentUserId}
                userRole={userRole}
                onUploadMaterial={handleUploadMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onDeleteSubject={handleDeleteSubject}
              />
            )}

            {/* Portfolio Section */}
            {activeSection === 'portfolio' && (
              <PortfolioBoard
                portfolio={portfolios[currentUserId] || {
                  userId: currentUserId,
                  skills: [],
                  projects: [],
                  timeline: [],
                  achievements: [],
                  adminFeedback: [],
                  workSamples: {},
                }}
                student={currentStudent || { id: currentUserId, name: user?.user_metadata?.full_name || 'User', email: user?.email || '', status: 'Active', avatar: '', bio: '' } as any}
                userRole={userRole}
                currentUserId={currentUserId}
                allProjects={projects}
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
                        students.find((s) => s.id === selectedPortfolioUserId) ||
                        mockStudents.find((s) => s.id === selectedPortfolioUserId)!
                      }
                      userRole={userRole}
                      currentUserId={currentUserId}
                      allProjects={projects}
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
                    students={students.length > 0 ? students : mockStudents}
                    onSelectStudent={setSelectedPortfolioUserId}
                    onAddFeedback={(userId, feedback) => handleAddFeedback(userId, feedback)}
                  />
                )}
              </>
            )}

            {/* Admin Management Section (Admin Only) */}
            {activeSection === 'admin' && userRole === 'Admin' && (
              <AdminManagement
                users={students}
                activityLogs={mockActivityLogs}
                engagementReports={mockEngagementReports}
                teamSuggestions={mockTeamSuggestions}
                studyGroups={mockStudyGroups}
                projects={mockProjects.map((p) => ({ id: p.id, name: p.name }))}
                onInviteUser={async (invite) => {
                  if (!invite.email) {
                    alert(
                      'Email-based invites are required to create real user accounts. Please provide an email address.'
                    );
                    return;
                  }

                  try {
                    const baseName = invite.email.split('@')[0] || 'New User';
                    const displayName = invite.name || baseName.replace(/[._-]/g, ' ');

                    // Call the Supabase Edge Function to securely send the invitation
                    const { data, error } = await supabase.functions.invoke('invite-user', {
                      body: {
                        email: invite.email,
                        role: invite.role,
                        name: displayName,
                        mobileNumber: invite.mobileNumber,
                        inviterId: currentStudent?.id,
                      },
                    });

                    if (error) throw error;
                    if (data?.error) throw new Error(data.error);
                    
                    alert(
                      `Invitation sent to ${invite.email}.\n\nThey will receive an email with a link to join the workspace and set their password.`
                    );
                  } catch (err: any) {
                    console.error('Error inviting user via edge function:', err);
                    alert(`Failed to send invitation: ${err?.message || 'Unknown error'}\nCheck the console for more details.`);
                  }
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
                onDeleteUser={handleDeleteUser}
              />
            )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Profile Edit Dialog */}
      {(currentStudent || currentUserId) && (
        <ProfileEditDialog
          open={isProfileEditOpen}
          onOpenChange={setIsProfileEditOpen}
          student={currentStudent || { 
            id: currentUserId, 
            name: user?.user_metadata?.full_name || 'User', 
            email: user?.email || '', 
            status: 'Active', 
            avatar: '', 
            bio: '',
            role: userRole
          } as any}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}