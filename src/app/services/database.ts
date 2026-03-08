import { supabase } from '../lib/supabaseClient';
import type {
  Student,
  Project,
  Task,
  Comment,
  StudyMaterial,
  Portfolio,
  Skill,
  PortfolioProject,
  TimelineEntry,
  Achievement,
  AdminFeedback,
} from '../types';

// Students/Users
export const fetchStudents = async () => {
  const { data, error } = await supabase.from('students').select('*').order('name');
  if (error) throw error;
  return data as Student[];
};

export const createStudent = async (student: Omit<Student, 'id'> & { id?: string }) => {
  const insertData = student.id ? student : { id: `u${Date.now()}`, ...student };
  const { data, error } = await supabase
    .from('students')
    .insert([insertData])
    .select()
    .single();
  if (error) throw error;
  return data as Student;
};

export const updateStudent = async (id: string, updates: Partial<Student>) => {
  const { data, error } = await supabase
    .from('students')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Student;
};

export const completeOnboarding = async (id: string, updates: Partial<Student>) => {
  const { data, error } = await supabase
    .from('students')
    .update({ ...updates, status: 'Active', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Student;
};

export const deleteStudent = async (id: string) => {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
};

// Upload student profile photo
export const uploadProfilePhoto = async (studentId: string, file: File): Promise<string> => {
  try {
    const fileName = `${studentId}-${Date.now()}-${file.name}`;
    console.log('📸 Starting upload:', { studentId, fileName, fileSize: file.size, fileType: file.type });
    
    // Check if file is valid
    if (!file.size) {
      throw new Error('File is empty');
    }
    
    const { data, error } = await supabase.storage
      .from('student-photos')
      .upload(`profiles/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('❌ Supabase Storage Error:', {
        message: error.message,
        status: (error as any).status,
        statusCode: (error as any).statusCode,
      });
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ Upload successful:', data);

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('student-photos')
      .getPublicUrl(`profiles/${fileName}`);

    console.log('🔗 Public URL:', publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (err) {
    console.error('❌ Full error details:', {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : 'N/A',
    });
    throw err;
  }
};

// Projects
export const fetchProjects = async () => {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_students(student_id),
      tasks(*,comments(*)),
      ai_alerts(alert_text)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform the data to match the Project interface
  return projects.map((project: any) => ({
    ...project,
    students: project.project_students.map((ps: any) => ps.student_id),
    aiAlerts: project.ai_alerts.map((alert: any) => alert.alert_text),
  })) as Project[];
};

export const createProject = async (
  projectData: Omit<Project, 'id' | 'tasks' | 'aiAlerts'>
) => {
  const projectId = `p${Date.now()}`;
  const { students, ...project } = projectData;

  // Create project
  const { data: newProject, error: projectError } = await supabase
    .from('projects')
    .insert([{ id: projectId, ...project }])
    .select()
    .single();

  if (projectError) throw projectError;

  // Add project students
  if (students && students.length > 0) {
    const projectStudents = students.map((studentId) => ({
      project_id: projectId,
      student_id: studentId,
    }));

    const { error: studentsError } = await supabase
      .from('project_students')
      .insert(projectStudents);

    if (studentsError) throw studentsError;
  }

  return { ...newProject, students, tasks: [], aiAlerts: [] } as Project;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { students, tasks, aiAlerts, ...projectUpdates } = updates;

  const { data, error } = await supabase
    .from('projects')
    .update({ ...projectUpdates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update project students if needed
  if (students) {
    // Delete existing relationships
    await supabase.from('project_students').delete().eq('project_id', id);

    // Add new relationships
    if (students.length > 0) {
      const projectStudents = students.map((studentId) => ({
        project_id: id,
        student_id: studentId,
      }));
      await supabase.from('project_students').insert(projectStudents);
    }
  }

  return data as Project;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

// Tasks
export const createTask = async (
  projectId: string,
  taskData: Omit<Task, 'id' | 'comments'>
) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ id: `t${Date.now()}`, project_id: projectId, ...taskData }])
    .select()
    .single();

  if (error) throw error;
  return { ...data, comments: [] } as Task;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { comments, ...taskUpdates } = updates;

  const { data, error } = await supabase
    .from('tasks')
    .update({ ...taskUpdates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
};

// Comments
export const createComment = async (
  taskId: string,
  commentData: Omit<Comment, 'id'>
) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ id: `c${Date.now()}`, task_id: taskId, ...commentData }])
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
};

// Study Materials
export const fetchStudyMaterials = async () => {
  const { data, error } = await supabase
    .from('study_materials')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data as StudyMaterial[];
};

export const createStudyMaterial = async (
  material: Omit<StudyMaterial, 'id' | 'uploadedAt'>
) => {
  const { data, error } = await supabase
    .from('study_materials')
    .insert([
      {
        id: `sm${Date.now()}`,
        ...material,
        uploaded_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as StudyMaterial;
};

export const deleteStudyMaterial = async (id: string) => {
  const { error } = await supabase.from('study_materials').delete().eq('id', id);
  if (error) throw error;
};

// Portfolio
export const fetchPortfolio = async (userId: string): Promise<Portfolio> => {
  // Fetch all portfolio data
  const [skills, projects, timeline, achievements, feedback, settings] =
    await Promise.all([
      supabase
        .from('portfolio_skills')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('portfolio_projects')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false }),
      supabase
        .from('portfolio_timeline')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false }),
      supabase
        .from('portfolio_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false }),
      supabase
        .from('admin_feedback')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('portfolio_settings')
        .select('*')
        .eq('user_id', userId),
    ]);

  if (skills.error) throw skills.error;
  if (projects.error) throw projects.error;
  if (timeline.error) throw timeline.error;
  if (achievements.error) throw achievements.error;
  if (feedback.error) throw feedback.error;
  if (settings.error) throw settings.error;

  // Get the first settings row if it exists
  const settingsData = settings.data?.[0];

  return {
    userId,
    skills: skills.data as Skill[],
    projects: projects.data as PortfolioProject[],
    timeline: timeline.data as TimelineEntry[],
    achievements: achievements.data as Achievement[],
    adminFeedback: feedback.data as AdminFeedback[],
    workSamples: {
      github: settingsData?.work_samples_github,
      portfolio: settingsData?.work_samples_portfolio,
      demo: settingsData?.work_samples_demo,
    },
    aiSkillGapAnalysis: settingsData?.ai_skill_gap_analysis,
    aiRecommendations: settingsData?.ai_recommendations,
    aiSummary: settingsData?.ai_summary,
  };
};

export const fetchAllPortfolios = async () => {
  const { data: students, error } = await supabase.from('students').select('id');

  if (error) throw error;

  const portfolios: { [userId: string]: Portfolio } = {};

  for (const student of students) {
    try {
      portfolios[student.id] = await fetchPortfolio(student.id);
    } catch (err) {
      console.error(`Error fetching portfolio for user ${student.id}:`, err);
      // Create empty portfolio if none exists
      portfolios[student.id] = {
        userId: student.id,
        skills: [],
        projects: [],
        timeline: [],
        achievements: [],
        adminFeedback: [],
        workSamples: {},
      };
    }
  }

  return portfolios;
};

export const addPortfolioSkill = async (userId: string, skill: Omit<Skill, 'id'>) => {
  const { data, error } = await supabase
    .from('portfolio_skills')
    .insert([{ id: `s${Date.now()}`, user_id: userId, ...skill }])
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
};

export const addPortfolioProject = async (
  userId: string,
  project: Omit<PortfolioProject, 'id'>
) => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert([{ id: `pp${Date.now()}`, user_id: userId, ...project }])
    .select()
    .single();

  if (error) throw error;
  return data as PortfolioProject;
};

export const addAchievement = async (
  userId: string,
  achievement: Omit<Achievement, 'id'>
) => {
  const { data, error } = await supabase
    .from('portfolio_achievements')
    .insert([{ id: `a${Date.now()}`, user_id: userId, ...achievement }])
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
};

export const addAdminFeedback = async (
  userId: string,
  feedback: Omit<AdminFeedback, 'id'>
) => {
  const { data, error } = await supabase
    .from('admin_feedback')
    .insert([{ id: `f${Date.now()}`, user_id: userId, ...feedback }])
    .select()
    .single();

  if (error) throw error;
  return data as AdminFeedback;
};

export const updatePortfolioSettings = async (
  userId: string,
  settings: {
    workSamples?: {
      github?: string;
      portfolio?: string;
      demo?: string;
    };
    aiSkillGapAnalysis?: string;
    aiRecommendations?: string[];
    aiSummary?: string;
  }
) => {
  const { data, error } = await supabase
    .from('portfolio_settings')
    .upsert([
      {
        user_id: userId,
        work_samples_github: settings.workSamples?.github,
        work_samples_portfolio: settings.workSamples?.portfolio,
        work_samples_demo: settings.workSamples?.demo,
        ai_skill_gap_analysis: settings.aiSkillGapAnalysis,
        ai_recommendations: settings.aiRecommendations,
        ai_summary: settings.aiSummary,
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToProjects = (callback: (payload: any) => void) => {
  return supabase
    .channel('projects_channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      callback
    )
    .subscribe();
};

export const subscribeToTasks = (callback: (payload: any) => void) => {
  return supabase
    .channel('tasks_channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
    .subscribe();
};

export const subscribeToStudyMaterials = (callback: (payload: any) => void) => {
  return supabase
    .channel('study_materials_channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'study_materials' },
      callback
    )
    .subscribe();
};
