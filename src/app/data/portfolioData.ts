import { Portfolio } from '../types';

export const mockPortfolios: { [userId: string]: Portfolio } = {
  '1': {
    userId: '1',
    skills: [
      {
        id: 'sk1',
        name: 'JavaScript',
        category: 'language',
        level: 'Advanced',
        learnedAt: '2024-06-15',
      },
      {
        id: 'sk2',
        name: 'React',
        category: 'framework',
        level: 'Advanced',
        learnedAt: '2024-07-20',
      },
      {
        id: 'sk3',
        name: 'Python',
        category: 'language',
        level: 'Intermediate',
        learnedAt: '2024-09-10',
      },
      {
        id: 'sk4',
        name: 'Git',
        category: 'tool',
        level: 'Advanced',
        learnedAt: '2024-05-01',
      },
      {
        id: 'sk5',
        name: 'Node.js',
        category: 'framework',
        level: 'Intermediate',
        learnedAt: '2024-08-15',
      },
    ],
    projects: [
      {
        id: 'p1',
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce application with payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        link: 'https://github.com/alice/ecommerce',
        completedAt: '2025-12-20',
      },
      {
        id: 'p2',
        name: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates',
        technologies: ['React', 'Firebase', 'Material-UI'],
        link: 'https://github.com/alice/taskmanager',
        completedAt: '2025-11-15',
      },
      {
        id: 'p3',
        name: 'Weather Dashboard',
        description: 'Weather forecasting app using OpenWeather API',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        link: 'https://github.com/alice/weather-app',
        completedAt: '2025-10-05',
      },
    ],
    timeline: [
      {
        id: 't1',
        date: '2024-06-15',
        title: 'Learned JavaScript',
        description: 'Completed JavaScript fundamentals course',
        type: 'skill',
      },
      {
        id: 't2',
        date: '2025-10-05',
        title: 'Weather Dashboard Completed',
        description: 'Built and deployed weather forecasting application',
        type: 'project',
      },
      {
        id: 't3',
        date: '2025-12-01',
        title: 'Best Contributor Award',
        description: 'Recognized for outstanding contributions',
        type: 'achievement',
      },
    ],
    achievements: [
      {
        id: 'a1',
        title: 'Best Contributor Award 2025',
        description: 'Recognized for exceptional contributions to team projects',
        awardedBy: 'Admin',
        awardedAt: '2025-12-01',
      },
      {
        id: 'a2',
        title: 'React Advanced Certification',
        description: 'Completed advanced React development course',
        awardedBy: 'Admin',
        awardedAt: '2025-09-15',
      },
    ],
    workSamples: {
      github: 'https://github.com/alicejohnson',
      portfolio: 'https://alicejohnson.dev',
      demo: 'https://demo.alicejohnson.dev',
    },
    adminFeedback: [
      {
        id: 'f1',
        text: 'Excellent progress in React development. Keep up the great work!',
        adminId: 'admin1',
        createdAt: '2025-12-15',
      },
      {
        id: 'f2',
        text: 'Your e-commerce project shows strong full-stack skills.',
        adminId: 'admin1',
        createdAt: '2025-12-22',
      },
    ],
    aiSkillGapAnalysis: 'Strong frontend development skills with React and JavaScript. Consider expanding backend knowledge with more advanced Node.js patterns, learning Docker for containerization, and exploring cloud platforms like AWS or Azure.',
    aiRecommendations: [
      'Learn TypeScript for better code quality and maintainability',
      'Explore Next.js for server-side rendering capabilities',
      'Study system design for scalable applications',
      'Learn Docker and Kubernetes for DevOps skills',
    ],
    aiSummary: 'Alice is an advanced frontend developer with strong React and JavaScript skills. She has completed 3 significant projects and earned 2 certifications. Her portfolio demonstrates excellent growth trajectory.',
  },
  '2': {
    userId: '2',
    skills: [
      {
        id: 'sk6',
        name: 'Python',
        category: 'language',
        level: 'Advanced',
        learnedAt: '2024-05-10',
      },
      {
        id: 'sk7',
        name: 'Django',
        category: 'framework',
        level: 'Intermediate',
        learnedAt: '2024-08-20',
      },
      {
        id: 'sk8',
        name: 'PostgreSQL',
        category: 'tool',
        level: 'Intermediate',
        learnedAt: '2024-09-05',
      },
    ],
    projects: [
      {
        id: 'p4',
        name: 'Blog Platform',
        description: 'Multi-user blogging platform with rich text editor',
        technologies: ['Django', 'PostgreSQL', 'Bootstrap'],
        link: 'https://github.com/bob/blog-platform',
        completedAt: '2025-11-30',
      },
    ],
    timeline: [
      {
        id: 't4',
        date: '2024-05-10',
        title: 'Started Python',
        description: 'Began learning Python programming',
        type: 'skill',
      },
      {
        id: 't5',
        date: '2025-11-30',
        title: 'Blog Platform Launch',
        description: 'Deployed blog platform to production',
        type: 'project',
      },
    ],
    achievements: [
      {
        id: 'a3',
        title: 'Python Fundamentals Certificate',
        description: 'Completed Python programming fundamentals',
        awardedBy: 'Admin',
        awardedAt: '2024-07-20',
      },
    ],
    workSamples: {
      github: 'https://github.com/bobsmith',
    },
    adminFeedback: [
      {
        id: 'f3',
        text: 'Good progress with backend development. Focus on frontend skills next.',
        adminId: 'admin1',
        createdAt: '2025-12-10',
      },
    ],
    aiSkillGapAnalysis: 'Solid backend development foundation with Python and Django. Consider learning frontend frameworks like React or Vue.js, improving database optimization skills, and exploring REST API design patterns.',
    aiRecommendations: [
      'Learn React or Vue.js for full-stack capabilities',
      'Study REST API design best practices',
      'Explore database indexing and query optimization',
      'Learn Redis for caching strategies',
    ],
    aiSummary: 'Bob is an intermediate backend developer specializing in Python and Django. He has completed 1 major project and shows strong potential for full-stack development.',
  },
  '3': {
    userId: '3',
    skills: [
      {
        id: 'sk9',
        name: 'Java',
        category: 'language',
        level: 'Advanced',
        learnedAt: '2024-04-01',
      },
      {
        id: 'sk10',
        name: 'Spring Boot',
        category: 'framework',
        level: 'Intermediate',
        learnedAt: '2024-10-15',
      },
    ],
    projects: [
      {
        id: 'p5',
        name: 'Library Management System',
        description: 'Complete library management system with REST APIs',
        technologies: ['Java', 'Spring Boot', 'MySQL'],
        link: 'https://github.com/carol/library-system',
        completedAt: '2025-12-10',
      },
    ],
    timeline: [
      {
        id: 't6',
        date: '2024-04-01',
        title: 'Java Mastery',
        description: 'Achieved advanced Java proficiency',
        type: 'skill',
      },
    ],
    achievements: [],
    workSamples: {
      github: 'https://github.com/caroldavis',
    },
    adminFeedback: [],
    aiSkillGapAnalysis: 'Strong Java and Spring Boot knowledge. Consider learning microservices architecture, cloud platforms, and frontend technologies to become a well-rounded developer.',
    aiRecommendations: [
      'Learn microservices with Spring Cloud',
      'Study AWS or Google Cloud Platform',
      'Explore frontend frameworks for full-stack skills',
      'Learn Docker and container orchestration',
    ],
    aiSummary: 'Carol is an advanced Java developer with Spring Boot expertise. She has completed 1 significant backend project and demonstrates strong technical foundations.',
  },
  '4': {
    userId: '4',
    skills: [
      {
        id: 'sk11',
        name: 'HTML/CSS',
        category: 'language',
        level: 'Advanced',
        learnedAt: '2024-03-15',
      },
      {
        id: 'sk12',
        name: 'JavaScript',
        category: 'language',
        level: 'Intermediate',
        learnedAt: '2024-06-20',
      },
    ],
    projects: [
      {
        id: 'p6',
        name: 'Portfolio Website',
        description: 'Personal portfolio with animations',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        link: 'https://davidwilson.com',
        completedAt: '2025-09-20',
      },
    ],
    timeline: [
      {
        id: 't7',
        date: '2024-03-15',
        title: 'Web Development Journey',
        description: 'Started learning web development',
        type: 'skill',
      },
    ],
    achievements: [
      {
        id: 'a4',
        title: 'Web Design Excellence',
        description: 'Outstanding web design and UI/UX work',
        awardedBy: 'Admin',
        awardedAt: '2025-10-01',
      },
    ],
    workSamples: {
      portfolio: 'https://davidwilson.com',
    },
    adminFeedback: [
      {
        id: 'f4',
        text: 'Great design sense! Consider learning React for more dynamic applications.',
        adminId: 'admin1',
        createdAt: '2025-10-15',
      },
    ],
    aiSkillGapAnalysis: 'Excellent frontend design skills. Expand JavaScript knowledge, learn modern frameworks like React or Vue.js, and explore backend technologies for full-stack capabilities.',
    aiRecommendations: [
      'Learn React or Vue.js framework',
      'Study JavaScript ES6+ features deeply',
      'Explore Tailwind CSS or styled-components',
      'Learn basic Node.js for backend understanding',
    ],
    aiSummary: 'David is an intermediate frontend developer with excellent design skills. He has completed 1 portfolio project and received recognition for web design excellence.',
  },
  '5': {
    userId: '5',
    skills: [
      {
        id: 'sk13',
        name: 'UI/UX Design',
        category: 'other',
        level: 'Advanced',
        learnedAt: '2024-02-10',
      },
      {
        id: 'sk14',
        name: 'Figma',
        category: 'tool',
        level: 'Advanced',
        learnedAt: '2024-03-01',
      },
    ],
    projects: [
      {
        id: 'p7',
        name: 'Mobile App Design',
        description: 'Complete UI/UX design for fitness app',
        technologies: ['Figma', 'Adobe XD'],
        link: 'https://figma.com/emma-designs',
        completedAt: '2025-12-05',
      },
    ],
    timeline: [
      {
        id: 't8',
        date: '2024-02-10',
        title: 'UI/UX Specialization',
        description: 'Specialized in user interface design',
        type: 'skill',
      },
    ],
    achievements: [
      {
        id: 'a5',
        title: 'Design Innovation Award',
        description: 'Recognized for innovative UI/UX design work',
        awardedBy: 'Admin',
        awardedAt: '2025-12-15',
      },
    ],
    workSamples: {
      portfolio: 'https://emmabrown.design',
    },
    adminFeedback: [
      {
        id: 'f5',
        text: 'Outstanding design work! Your portfolio is impressive.',
        adminId: 'admin1',
        createdAt: '2025-12-20',
      },
    ],
    aiSkillGapAnalysis: 'Exceptional UI/UX design skills with mastery of design tools. Consider learning frontend development to implement your designs, explore motion design, and study accessibility guidelines.',
    aiRecommendations: [
      'Learn HTML/CSS to implement your designs',
      'Study animation and motion design',
      'Explore accessibility (WCAG) guidelines',
      'Learn design systems and component libraries',
    ],
    aiSummary: 'Emma is an advanced UI/UX designer with exceptional Figma skills. She has completed 1 major design project and received recognition for design innovation.',
  },
};
