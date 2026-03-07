import { ActivityType, UserRole, UserStatus } from './index';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  metadata?: {
    projectId?: string;
    taskId?: string;
    materialId?: string;
    [key: string]: any;
  };
}

export interface UserInvite {
  email?: string;
  mobileNumber?: string;
  role: UserRole;
}

export interface UserEngagementReport {
  userId: string;
  totalLogins: number;
  projectsContributed: number;
  materialsUploaded: number;
  commentsPosted: number;
  lastActive: string;
  engagementScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface TeamFormationSuggestion {
  id: string;
  suggestedTeam: string[];
  projectType: string;
  reasoning: string;
  skillBalance: number;
  estimatedSynergy: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  subject: string;
  createdAt: string;
}
