import { Project, Task, TaskStatus, StudyMaterial } from '../types';

// Simulated AI responses for demo purposes
// In production, these would call actual AI APIs

export const aiService = {
  // Natural Language Project Creation
  parseProjectFromNaturalLanguage: async (
    description: string
  ): Promise<{
    name: string;
    description: string;
    suggestedTasks: Array<{
      name: string;
      assignedTo: string;
      status: TaskStatus;
      deadline: string;
    }>;
    suggestedStudents: string[];
    estimatedDuration: string;
    difficulty: string;
  }> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Parse keywords to generate realistic project
    const lowerDesc = description.toLowerCase();

    let projectName = 'New Project';
    let projectDesc = description;
    let tasks: Array<any> = [];
    let difficulty = 'Medium';
    let duration = '2-3 weeks';

    // Detect project type and generate appropriate tasks
    if (lowerDesc.includes('web') || lowerDesc.includes('website')) {
      projectName = 'Web Application Development';
      projectDesc = `A comprehensive web development project focusing on modern frontend and backend technologies. ${description}`;
      tasks = [
        {
          name: 'Design UI/UX wireframes and mockups',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Set up project repository and development environment',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Develop frontend components and pages',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Implement backend API endpoints',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Database schema design and implementation',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Testing and bug fixes',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ];
      difficulty = 'Medium';
      duration = '3-4 weeks';
    } else if (lowerDesc.includes('mobile') || lowerDesc.includes('app')) {
      projectName = 'Mobile Application Development';
      projectDesc = `A mobile-first application project with focus on user experience. ${description}`;
      tasks = [
        {
          name: 'Research and define app requirements',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Create app wireframes and user flow',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Set up React Native / Flutter project',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Develop core features and screens',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Implement authentication and state management',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Test on multiple devices and platforms',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ];
      difficulty = 'Hard';
      duration = '4-5 weeks';
    } else if (lowerDesc.includes('ai') || lowerDesc.includes('machine learning') || lowerDesc.includes('ml')) {
      projectName = 'AI/ML Research Project';
      projectDesc = `An artificial intelligence and machine learning project. ${description}`;
      tasks = [
        {
          name: 'Literature review and research',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Data collection and preprocessing',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Feature engineering and selection',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Model development and training',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Model evaluation and optimization',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Documentation and presentation',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ];
      difficulty = 'Hard';
      duration = '4-6 weeks';
    } else {
      // Generic project
      const words = description.split(' ').slice(0, 5).join(' ');
      projectName = words.charAt(0).toUpperCase() + words.slice(1);
      tasks = [
        {
          name: 'Project planning and requirements gathering',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Initial research and analysis',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Development and implementation',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Testing and quality assurance',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        {
          name: 'Final documentation and delivery',
          assignedTo: '',
          status: 'Pending' as TaskStatus,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      ];
    }

    return {
      name: projectName,
      description: projectDesc,
      suggestedTasks: tasks,
      suggestedStudents: [],
      estimatedDuration: duration,
      difficulty,
    };
  },

  // AI Study Assistant - Answer questions from materials
  answerQuestionFromMaterials: async (
    question: string,
    materials: StudyMaterial[]
  ): Promise<{
    answer: string;
    sources: Array<{ materialId: string; materialName: string }>;
    confidence: number;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const lowerQuestion = question.toLowerCase();
    let answer = '';
    let sources: Array<{ materialId: string; materialName: string }> = [];
    let confidence = 85;

    // Smart response based on question keywords
    if (lowerQuestion.includes('react') || lowerQuestion.includes('component')) {
      answer = `React components are reusable pieces of UI that can manage their own state and lifecycle. There are two types: functional components (using hooks) and class components. Functional components with hooks are now the recommended approach.

Key concepts:
- Components receive data through props
- State is managed using useState hook
- Side effects are handled with useEffect
- Components should be pure and predictable

Best practices include keeping components small and focused, using proper naming conventions, and extracting reusable logic into custom hooks.`;
      sources = materials
        .filter((m) => m.subject === 'web' || m.name.toLowerCase().includes('react'))
        .slice(0, 2)
        .map((m) => ({ materialId: m.id, materialName: m.name }));
    } else if (lowerQuestion.includes('python') || lowerQuestion.includes('function')) {
      answer = `Python functions are defined using the 'def' keyword and can accept parameters and return values. Functions help organize code into reusable blocks.

Syntax:
def function_name(parameters):
    # function body
    return result

Key features:
- Default parameters: def greet(name="World")
- Variable arguments: *args and **kwargs
- Lambda functions for simple operations
- Decorators for function modification

Functions support recursion, closures, and can be passed as arguments to other functions (first-class functions).`;
      sources = materials
        .filter((m) => m.subject === 'python' || m.name.toLowerCase().includes('python'))
        .slice(0, 2)
        .map((m) => ({ materialId: m.id, materialName: m.name }));
    } else if (lowerQuestion.includes('machine learning') || lowerQuestion.includes('neural network')) {
      answer = `Neural networks are computational models inspired by biological neurons. They consist of layers of interconnected nodes that process information.

Architecture:
- Input Layer: Receives the raw data
- Hidden Layers: Process and transform data
- Output Layer: Produces predictions

Training Process:
1. Forward propagation: Data flows through network
2. Loss calculation: Compare prediction to actual
3. Backpropagation: Adjust weights to minimize loss
4. Repeat until convergence

Popular architectures include CNNs for images, RNNs for sequences, and Transformers for language tasks.`;
      sources = materials
        .filter((m) => m.subject === 'ai' || m.name.toLowerCase().includes('ai'))
        .slice(0, 2)
        .map((m) => ({ materialId: m.id, materialName: m.name }));
      confidence = 90;
    } else if (lowerQuestion.includes('database') || lowerQuestion.includes('sql')) {
      answer = `SQL (Structured Query Language) is used to interact with relational databases. Key operations include:

CRUD Operations:
- CREATE: Insert new records
- READ: SELECT queries to retrieve data
- UPDATE: Modify existing records
- DELETE: Remove records

Important concepts:
- Primary Keys: Unique identifiers
- Foreign Keys: Relationships between tables
- Joins: Combine data from multiple tables
- Indexes: Improve query performance
- Normalization: Reduce data redundancy

Use transactions for data integrity and write efficient queries using proper indexing.`;
      sources = materials
        .filter((m) => m.subject === 'dbms' || m.name.toLowerCase().includes('database'))
        .slice(0, 2)
        .map((m) => ({ materialId: m.id, materialName: m.name }));
    } else {
      answer = `Based on the materials available, here's what I found:

${question}

This is a general answer synthesized from your study materials. The key points to remember are:

1. Understanding the fundamentals is crucial
2. Practice with real examples helps solidify concepts
3. Review the uploaded materials for detailed explanations
4. Don't hesitate to ask follow-up questions for clarification

I recommend reviewing the relevant study materials for more comprehensive information on this topic.`;
      sources = materials.slice(0, 3).map((m) => ({
        materialId: m.id,
        materialName: m.name,
      }));
      confidence = 70;
    }

    return { answer, sources, confidence };
  },

  // Generate personalized learning recommendations
  generateLearningRecommendations: async (
    userId: string,
    skills: Array<{ name: string; level: string }>,
    completedProjects: number,
    materialsUploaded: number
  ): Promise<
    Array<{
      id: string;
      type: 'skill' | 'project' | 'material' | 'collaboration';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      estimatedTime: string;
    }>
  > => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const recommendations = [];

    // Skill-based recommendations
    const beginnerSkills = skills.filter((s) => s.level === 'Beginner');
    if (beginnerSkills.length > 0) {
      recommendations.push({
        id: 'rec1',
        type: 'skill' as const,
        title: `Level up ${beginnerSkills[0].name}`,
        description: `You're at beginner level in ${beginnerSkills[0].name}. Practice with intermediate projects to advance your skills.`,
        priority: 'high' as const,
        estimatedTime: '2-3 weeks',
      });
    }

    // Project recommendations
    if (completedProjects < 3) {
      recommendations.push({
        id: 'rec2',
        type: 'project' as const,
        title: 'Join a collaborative project',
        description:
          'Participate in team projects to gain practical experience and learn from peers.',
        priority: 'high' as const,
        estimatedTime: '3-4 weeks',
      });
    }

    // Material recommendations
    const advancedSkills = skills.filter((s) => s.level === 'Advanced');
    if (advancedSkills.length > 0) {
      recommendations.push({
        id: 'rec3',
        type: 'material' as const,
        title: `Share knowledge: ${advancedSkills[0].name}`,
        description: `You're advanced in ${advancedSkills[0].name}. Create study materials to help others and reinforce your expertise.`,
        priority: 'medium' as const,
        estimatedTime: '1-2 weeks',
      });
    }

    // Always add some general recommendations
    recommendations.push(
      {
        id: 'rec4',
        type: 'collaboration' as const,
        title: 'Mentor a beginner',
        description:
          'Share your knowledge by mentoring students who are just starting their learning journey.',
        priority: 'medium' as const,
        estimatedTime: 'Ongoing',
      },
      {
        id: 'rec5',
        type: 'skill' as const,
        title: 'Learn a complementary skill',
        description:
          'Expand your skillset by learning technologies that complement your current expertise.',
        priority: 'low' as const,
        estimatedTime: '4-6 weeks',
      },
      {
        id: 'rec6',
        type: 'project' as const,
        title: 'Start a passion project',
        description:
          'Build something you care about to stay motivated and showcase your unique interests.',
        priority: 'medium' as const,
        estimatedTime: '4-8 weeks',
      }
    );

    return recommendations.slice(0, 5);
  },

  // Admin Dashboard Insights
  generateAdminInsights: async (
    projects: Project[],
    users: any[],
    activityLogs: any[]
  ): Promise<{
    trends: Array<{ title: string; description: string; trend: 'up' | 'down' | 'stable'; value: string }>;
    alerts: Array<{ title: string; description: string; severity: 'high' | 'medium' | 'low' }>;
    predictions: Array<{ title: string; description: string; confidence: number }>;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const activeUsers = users.filter((u) => u.status === 'Active').length;
    const totalUsers = users.length;
    const activeRate = ((activeUsers / totalUsers) * 100).toFixed(1);

    const inProgressProjects = projects.filter((p) => p.status === 'In Progress').length;
    const completedProjects = projects.filter((p) => p.status === 'Completed').length;
    const completionRate = totalUsers > 0 ? ((completedProjects / projects.length) * 100).toFixed(1) : '0';

    return {
      trends: [
        {
          title: 'User Engagement',
          description: 'Overall platform activity has increased by 15% this week',
          trend: 'up',
          value: `${activeRate}% active`,
        },
        {
          title: 'Project Completion Rate',
          description: `${completedProjects} projects completed this month`,
          trend: 'up',
          value: `${completionRate}%`,
        },
        {
          title: 'Collaboration Index',
          description: 'Team collaboration frequency is stable',
          trend: 'stable',
          value: '82/100',
        },
        {
          title: 'Learning Progress',
          description: 'Average skill improvement across all users',
          trend: 'up',
          value: '+12%',
        },
      ],
      alerts: [
        {
          title: 'Inactive Users',
          description: `${totalUsers - activeUsers} users haven't logged in for over 7 days`,
          severity: 'medium',
        },
        {
          title: 'Project Delays',
          description: `${inProgressProjects} projects are approaching deadlines`,
          severity: 'high',
        },
        {
          title: 'Study Material Gaps',
          description: 'Some subjects have limited study materials available',
          severity: 'low',
        },
      ],
      predictions: [
        {
          title: 'Next Month Outlook',
          description: `Expected to complete ${Math.floor(completedProjects * 1.3)} projects based on current velocity`,
          confidence: 85,
        },
        {
          title: 'User Growth',
          description: 'Platform likely to reach 20+ active users by next month',
          confidence: 78,
        },
        {
          title: 'Skill Development',
          description: '60% of users will advance at least one skill level this quarter',
          confidence: 82,
        },
      ],
    };
  },
};
