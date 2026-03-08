import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as db from '../services/database';
import type {
  Student,
  Project,
  StudyMaterial,
  Portfolio,
  Task,
  TaskStatus,
} from '../types';

export const useDatabase = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [portfolios, setPortfolios] = useState<{ [userId: string]: Portfolio }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch (fast - projects, materials, students only)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        console.log('Starting data fetch...');
        
        const [studentsData, projectsData, materialsData] = await Promise.all([
          db.fetchStudents().then(d => { console.log('Students loaded:', d); return d; }),
          db.fetchProjects().then(d => { console.log('Projects loaded:', d); return d; }),
          db.fetchStudyMaterials().then(d => { console.log('Materials loaded:', d); return d; }),
        ]);

        console.log('All data fetched successfully');
        setStudents(studentsData);
        setProjects(projectsData);
        setMaterials(materialsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(`Failed to load data: ${errorMsg}`);
        toast.error('Failed to load data from database');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Load portfolios separately in the background (non-blocking)
  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const portfoliosData = await db.fetchAllPortfolios();
        setPortfolios(portfoliosData);
      } catch (err) {
        console.error('Error loading portfolios:', err);
        // Don't show error toast for portfolios since main data loaded
      }
    };

    loadPortfolios();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    try {
      const projectsSubscription = db.subscribeToProjects(async (payload) => {
        try {
          console.log('Projects change:', payload);
          // Refresh projects on any change
          const updatedProjects = await db.fetchProjects();
          setProjects(updatedProjects);
        } catch (err) {
          console.error('Error refreshing projects:', err);
        }
      });

      const tasksSubscription = db.subscribeToTasks(async (payload) => {
        try {
          console.log('Tasks change:', payload);
          // Refresh projects when tasks change
          const updatedProjects = await db.fetchProjects();
          setProjects(updatedProjects);
        } catch (err) {
          console.error('Error refreshing projects on task change:', err);
        }
      });

      const materialsSubscription = db.subscribeToStudyMaterials(async (payload) => {
        try {
          console.log('Study materials change:', payload);
          // Refresh materials
          const updatedMaterials = await db.fetchStudyMaterials();
          setMaterials(updatedMaterials);
        } catch (err) {
          console.error('Error refreshing materials:', err);
        }
      });

      return () => {
        try {
          projectsSubscription.unsubscribe();
          tasksSubscription.unsubscribe();
          materialsSubscription.unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing:', err);
        }
      };
    } catch (err) {
      console.error('Error setting up subscriptions:', err);
      return () => {};
    }
  }, []);

  // Student operations
  const createStudent = async (studentData: Omit<Student, 'id'> & { id?: string }) => {
    try {
      const newStudent = await db.createStudent(studentData);
      setStudents([...students, newStudent]);
      toast.success('Student created successfully');
      return newStudent;
    } catch (err) {
      console.error('Error creating student:', err);
      toast.error('Failed to create student');
      throw err;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const updatedStudent = await db.updateStudent(id, updates);
      setStudents(students.map((s) => (s.id === id ? updatedStudent : s)));
      toast.success('Student updated successfully');
      return updatedStudent;
    } catch (err) {
      console.error('Error updating student:', err);
      toast.error('Failed to update student');
      throw err;
    }
  };

  const deleteStudentById = async (id: string) => {
    try {
      await db.deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Failed to delete student');
      throw err;
    }
  };

  // Project operations
  const createProject = async (
    projectData: Omit<Project, 'id' | 'tasks' | 'aiAlerts'>
  ) => {
    try {
      const newProject = await db.createProject(projectData);
      setProjects([newProject, ...projects]);
      toast.success('Project created successfully');
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error('Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await db.updateProject(id, updates);
      // Refresh projects to get latest data
      const refreshedProjects = await db.fetchProjects();
      setProjects(refreshedProjects);
      toast.success('Project updated successfully');
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error('Failed to update project');
      throw err;
    }
  };

  const deleteProjectById = async (id: string) => {
    try {
      await db.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
      throw err;
    }
  };

  // Task operations
  const createTask = async (
    projectId: string,
    taskData: Omit<Task, 'id' | 'comments'>
  ) => {
    try {
      await db.createTask(projectId, taskData);
      // Refresh projects to get updated tasks
      const refreshedProjects = await db.fetchProjects();
      setProjects(refreshedProjects);
      toast.success('Task created successfully');
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => {
    try {
      await db.updateTask(taskId, { status });

      // Update progress locally
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        const updatedTasks = project.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        );
        const completedTasks = updatedTasks.filter((t) => t.status === 'Done').length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        let projectStatus = project.status;
        if (progress === 100) {
          projectStatus = 'Completed';
        } else if (progress > 0) {
          projectStatus = 'In Progress';
        }

        await db.updateProject(projectId, { progress, status: projectStatus });
      }

      // Refresh projects
      const refreshedProjects = await db.fetchProjects();
      setProjects(refreshedProjects);
      toast.success('Task status updated');
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
      throw err;
    }
  };

  const addComment = async (
    projectId: string,
    taskId: string,
    commentText: string,
    author: string
  ) => {
    try {
      await db.createComment(taskId, {
        text: commentText,
        author,
        timestamp: new Date().toISOString(),
      });

      // Refresh projects to get updated comments
      const refreshedProjects = await db.fetchProjects();
      setProjects(refreshedProjects);
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
      throw err;
    }
  };

  // Study Materials operations
  const uploadMaterial = async (material: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => {
    try {
      const newMaterial = await db.createStudyMaterial(material);
      setMaterials([newMaterial, ...materials]);
      toast.success('Study material uploaded successfully');
      return newMaterial;
    } catch (err) {
      console.error('Error uploading material:', err);
      toast.error('Failed to upload material');
      throw err;
    }
  };

  const deleteMaterial = async (materialId: string) => {
    try {
      await db.deleteStudyMaterial(materialId);
      setMaterials(materials.filter((m) => m.id !== materialId));
      toast.success('Study material deleted successfully');
    } catch (err) {
      console.error('Error deleting material:', err);
      toast.error('Failed to delete material');
      throw err;
    }
  };

  // Portfolio operations
  const addAchievement = async (
    userId: string,
    achievement: { title: string; description: string }
  ) => {
    try {
      const newAchievement = await db.addAchievement(userId, {
        ...achievement,
        awardedBy: 'Admin',
        awardedAt: new Date().toISOString().split('T')[0],
      });

      const portfolio = portfolios[userId];
      setPortfolios({
        ...portfolios,
        [userId]: {
          ...portfolio,
          achievements: [...(portfolio?.achievements || []), newAchievement],
        },
      });
      toast.success('Achievement added successfully');
    } catch (err) {
      console.error('Error adding achievement:', err);
      toast.error('Failed to add achievement');
      throw err;
    }
  };

  const addFeedback = async (userId: string, feedback: string, adminId: string) => {
    try {
      const newFeedback = await db.addAdminFeedback(userId, {
        text: feedback,
        adminId,
        createdAt: new Date().toISOString().split('T')[0],
      });

      const portfolio = portfolios[userId];
      setPortfolios({
        ...portfolios,
        [userId]: {
          ...portfolio,
          adminFeedback: [...(portfolio?.adminFeedback || []), newFeedback],
        },
      });
      toast.success('Feedback added successfully');
    } catch (err) {
      console.error('Error adding feedback:', err);
      toast.error('Failed to add feedback');
      throw err;
    }
  };

  return {
    // Data
    students,
    projects,
    materials,
    portfolios,
    loading,
    error,

    // Student operations
    createStudent,
    updateStudent,
    deleteStudent: deleteStudentById,

    // Project operations
    createProject,
    updateProject,
    deleteProject: deleteProjectById,

    // Task operations
    createTask,
    updateTaskStatus,
    addComment,

    // Study Materials operations
    uploadMaterial,
    deleteMaterial,

    // Portfolio operations
    addAchievement,
    addFeedback,
  };
};
