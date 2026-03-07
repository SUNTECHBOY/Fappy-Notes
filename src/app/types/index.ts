export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done';
export type UserRole = 'Admin' | 'User';
export type FileType = 'image' | 'pdf' | 'text' | 'link' | 'youtube';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type UserStatus = 'Active' | 'Inactive' | 'Pending';
export type ActivityType = 'login' | 'project_create' | 'task_update' | 'material_upload' | 'comment' | 'profile_update';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
  mobileNumber?: string;
  joinedAt?: string;
  lastActive?: string;
  emailVerified?: boolean;
  assignedProjects?: string[];
  assignedStudyGroups?: string[];
  // Profile fields
  bio?: string;
  githubId?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  twitterHandle?: string;
  location?: string;
  occupation?: string;
}

export interface Task {
  id: string;
  name: string;
  assignedTo: string; // student id
  status: TaskStatus;
  deadline: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  students: string[]; // student ids
  tasks: Task[];
  aiSummary?: string;
  aiAlerts?: string[];
}

// Study Materials Types
export interface StudyMaterial {
  id: string;
  name: string;
  type: FileType;
  subject: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  thumbnail?: string;
  size?: string;
  aiSummary?: string;
  aiKeyPoints?: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  materialsCount: number;
}

// Portfolio Types
export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'tool' | 'framework' | 'other';
  level: SkillLevel;
  learnedAt: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  completedAt: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'skill' | 'project' | 'achievement';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  awardedBy: string;
  awardedAt: string;
  certificateUrl?: string;
}

export interface AdminFeedback {
  id: string;
  text: string;
  adminId: string;
  createdAt: string;
}

export interface Portfolio {
  userId: string;
  skills: Skill[];
  projects: PortfolioProject[];
  timeline: TimelineEntry[];
  achievements: Achievement[];
  workSamples: {
    github?: string;
    portfolio?: string;
    demo?: string;
  };
  adminFeedback: AdminFeedback[];
  aiSkillGapAnalysis?: string;
  aiRecommendations?: string[];
  aiSummary?: string;
}