import { useState } from 'react';
import { Portfolio, Student, UserRole, Project } from '../types';
import { Progress } from './ui/progress';
import {
  User,
  Award,
  Briefcase,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Github,
  Globe,
  MessageSquare,
  Linkedin,
  Twitter,
  MapPin,
  Mail,
  Phone,
  FolderKanban,
  Star,
  Zap,
  BarChart2,
  Trophy,
} from 'lucide-react';
import { AddAchievementDialog } from './AddAchievementDialog';
import { AddFeedbackDialog } from './AddFeedbackDialog';
import { LearningRecommendations } from './LearningRecommendations';

interface PortfolioBoardProps {
  portfolio: Portfolio;
  student: Student;
  userRole: UserRole;
  currentUserId: string;
  completedProjects?: number;
  materialsUploaded?: number;
  allProjects?: Project[];
  onAddAchievement?: (achievement: { title: string; description: string }) => void;
  onAddFeedback?: (feedback: string) => void;
}

const TABS = ['skills', 'projects', 'timeline', 'achievements', 'ai-insights'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  skills: 'Skills',
  projects: 'Projects',
  timeline: 'Timeline',
  achievements: 'Achievements',
  'ai-insights': 'AI Insights',
};

const TAB_ICONS: Record<Tab, React.ElementType> = {
  skills: Zap,
  projects: FolderKanban,
  timeline: TrendingUp,
  achievements: Trophy,
  'ai-insights': Sparkles,
};

export function PortfolioBoard({
  portfolio,
  student,
  userRole,
  currentUserId,
  completedProjects = 0,
  materialsUploaded = 0,
  allProjects = [],
  onAddAchievement,
  onAddFeedback,
}: PortfolioBoardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('skills');
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const studentProjects = allProjects.filter((p) => p.students.includes(student.id));

  const skillsByCategory = {
    language: (portfolio?.skills || []).filter((s) => s.category === 'language'),
    framework: (portfolio?.skills || []).filter((s) => s.category === 'framework'),
    tool: (portfolio?.skills || []).filter((s) => s.category === 'tool'),
    other: (portfolio?.skills || []).filter((s) => s.category === 'other'),
  };

  const safeSkills = portfolio?.skills || [];
  const overallLevel =
    safeSkills.filter((s) => s.level === 'Advanced').length >= 3
      ? 'Advanced'
      : safeSkills.filter((s) => s.level === 'Intermediate').length >= 3
      ? 'Intermediate'
      : 'Beginner';

  const levelConfig = {
    Beginner: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '⭐ Beginner' },
    Intermediate: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: '🔵 Intermediate' },
    Advanced: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: '🟢 Advanced' },
  };
  const lvl = levelConfig[overallLevel as keyof typeof levelConfig];

  const getSkillLevelStyle = (level: string) => {
    switch (level) {
      case 'Beginner': return { background: 'rgba(245,158,11,0.15)', color: '#b45309', border: '1px solid rgba(245,158,11,0.3)' };
      case 'Intermediate': return { background: 'rgba(59,130,246,0.15)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.3)' };
      case 'Advanced': return { background: 'rgba(16,185,129,0.15)', color: '#047857', border: '1px solid rgba(16,185,129,0.3)' };
      default: return { background: 'rgba(107,114,128,0.15)', color: '#374151', border: '1px solid rgba(107,114,128,0.3)' };
    }
  };

  const getProjectStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: 'rgba(16,185,129,0.1)', color: '#047857', dot: '#10b981' };
      case 'In Progress': return { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', dot: '#3b82f6' };
      default: return { bg: 'rgba(107,114,128,0.1)', color: '#374151', dot: '#9ca3af' };
    }
  };

  const socialLinks = [
    student.githubId && { icon: Github, label: 'GitHub', href: `https://github.com/${student.githubId}`, display: `github.com/${student.githubId}` },
    student.linkedinUrl && { icon: Linkedin, label: 'LinkedIn', href: student.linkedinUrl, display: student.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '') },
    student.portfolioUrl && { icon: Globe, label: 'Portfolio', href: student.portfolioUrl, display: student.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '') },
    student.websiteUrl && { icon: Globe, label: 'Website', href: student.websiteUrl, display: student.websiteUrl.replace(/^https?:\/\/(www\.)?/, '') },
    student.twitterHandle && { icon: Twitter, label: 'Twitter/X', href: `https://twitter.com/${student.twitterHandle}`, display: `@${student.twitterHandle}` },
    !student.githubId && portfolio?.workSamples?.github && { icon: Github, label: 'GitHub', href: portfolio.workSamples.github, display: portfolio.workSamples.github.replace(/^https?:\/\/(www\.)?/, '') },
    !student.portfolioUrl && portfolio?.workSamples?.portfolio && { icon: Globe, label: 'Portfolio', href: portfolio.workSamples.portfolio, display: portfolio.workSamples.portfolio.replace(/^https?:\/\/(www\.)?/, '') },
    portfolio?.workSamples?.demo && { icon: ExternalLink, label: 'Live Demo', href: portfolio.workSamples.demo, display: portfolio.workSamples.demo.replace(/^https?:\/\/(www\.)?/, '') },
  ].filter(Boolean) as { icon: any; label: string; href: string; display: string }[];

  const initials = student.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .portfolio-wrapper {
          background: #ffffff;
          min-height: 100%;
        }

        /* Hero */
        .portfolio-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f7ff 0%, #eef2ff 40%, #e0e7ff 70%, #f0f4ff 100%);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
        }
        .portfolio-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 10% 80%, rgba(99,102,241,0.1) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(167,139,250,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Avatar */
        .portfolio-avatar-ring {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15), 0 8px 24px rgba(99,102,241,0.25);
        }
        .portfolio-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
          font-weight: 700;
          overflow: hidden;
        }

        /* Level badge */
        .level-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: 1px solid;
          margin-bottom: 8px;
        }

        /* Stat pills */
        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(99,102,241,0.15);
          box-shadow: 0 2px 8px rgba(99,102,241,0.08);
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        .stat-pill strong {
          color: #6366f1;
          font-weight: 700;
        }

        /* Action buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          text-shadow: 0 1px 2px rgba(0,0,0,0.15);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.45);
        }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.8);
          color: #6366f1;
          border: 1.5px solid rgba(99,102,241,0.35);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .btn-outline:hover {
          background: rgba(99,102,241,0.06);
          border-color: #6366f1;
          transform: translateY(-1px);
        }

        /* Tab bar */
        .portfolio-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 28px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .portfolio-tabs::-webkit-scrollbar { display: none; }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 12px 22px;
          background: none;
          border: none;
          border-bottom: 2.5px solid transparent;
          margin-bottom: -2px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .tab-btn:hover {
          color: #6366f1;
          background: rgba(99,102,241,0.04);
          border-radius: 8px 8px 0 0;
        }
        .tab-btn.active {
          color: #6366f1;
          border-bottom-color: #6366f1;
          font-weight: 600;
        }

        /* Cards */
        .glass-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .glass-card:hover {
          box-shadow: 0 8px 32px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06);
        }
        .card-header {
          padding: 20px 24px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }
        .card-header-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.12));
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          flex-shrink: 0;
        }
        .card-body { padding: 20px 24px 24px; }

        /* Section label */
        .section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9ca3af;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        /* Skill chips */
        .skill-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          background: #fafafa;
          border: 1px solid #e5e7eb;
          transition: all 0.15s ease;
        }
        .skill-chip:hover {
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 2px 8px rgba(99,102,241,0.08);
          background: white;
        }
        .skill-level-tag {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
        }

        /* Info row */
        .info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f9fafb;
        }
        .info-row:last-child { border-bottom: none; }
        .info-row-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99,102,241,0.08);
          border-radius: 8px;
          color: #6366f1;
          flex-shrink: 0;
        }

        /* Social link */
        .social-link {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #374151;
          font-size: 13px;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }
        .social-link:hover {
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.12);
          color: #6366f1;
        }

        /* Project card */
        .project-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .project-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
        }
        .project-card:hover {
          box-shadow: 0 8px 28px rgba(99,102,241,0.12);
          transform: translateY(-2px);
        }

        /* Timeline */
        .timeline-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .timeline-line {
          width: 2px;
          flex: 1;
          margin-top: 6px;
          background: linear-gradient(to bottom, #e5e7eb, transparent);
        }

        /* Achievement card */
        .achievement-card {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s ease;
        }
        .achievement-card:hover {
          box-shadow: 0 6px 20px rgba(245,158,11,0.15);
          transform: translateY(-1px);
        }

        /* Stat metric cards */
        .metric-card {
          background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
        }
        .metric-card .metric-num {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .metric-card .metric-label {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
          font-weight: 500;
        }

        /* Feedback card */
        .feedback-card {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 12px;
          padding: 16px;
        }

        /* AI summary pill */
        .ai-summary-card {
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .ai-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 60px 24px;
          color: #9ca3af;
        }
        .empty-state svg {
          opacity: 0.25;
          margin: 0 auto 12px;
          display: block;
        }
        .empty-state p {
          font-size: 14px;
        }

        /* Progress bar */
        .progress-bar-wrapper {
          height: 6px;
          border-radius: 999px;
          background: #e5e7eb;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.6s ease;
        }
      `}</style>

      <div className="portfolio-wrapper">
        {/* ── Hero Section ── */}
        <div className="portfolio-hero">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 1 }}>
            {/* Left: Avatar + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div className="portfolio-avatar-ring">
                <div className="portfolio-avatar-inner">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : initials}
                </div>
              </div>
              <div>
                <div
                  className="level-badge"
                  style={{ backgroundColor: lvl.bg, color: lvl.color, borderColor: `${lvl.color}40` }}
                >
                  <Star size={11} />
                  {overallLevel} Level
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: '0 0 4px', lineHeight: 1.2 }}>
                  {student.name}'s Portfolio
                </h2>
                {student.occupation && (
                  <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Briefcase size={13} /> {student.occupation}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span className="stat-pill"><Mail size={13} /><span>{student.email}</span></span>
                  {student.location && <span className="stat-pill"><MapPin size={13} /><span>{student.location}</span></span>}
                  <span className="stat-pill"><Zap size={13} /><strong>{safeSkills.length}</strong> Skills</span>
                  <span className="stat-pill"><FolderKanban size={13} /><strong>{studentProjects.length}</strong> Projects</span>
                  {(portfolio?.achievements || []).length > 0 && (
                    <span className="stat-pill"><Trophy size={13} /><strong>{(portfolio?.achievements || []).length}</strong> Achievements</span>
                  )}
                </div>
              </div>
            </div>
            {/* Right: Action Buttons */}
            {userRole === 'Admin' && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button className="btn-primary" onClick={() => setAchievementDialogOpen(true)}>
                  <Award size={15} /> Add Achievement
                </button>
                <button className="btn-outline" onClick={() => setFeedbackDialogOpen(true)}>
                  <MessageSquare size={15} /> Add Feedback
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio Card */}
        {student.bio && (
          <div className="ai-summary-card" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderColor: 'rgba(34,197,94,0.25)', marginBottom: 24 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <User size={18} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a', marginBottom: 4 }}>About</p>
              <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.6, margin: 0 }}>{student.bio}</p>
            </div>
          </div>
        )}

        {/* AI Summary Card */}
        {portfolio.aiSummary && (
          <div className="ai-summary-card" style={{ marginBottom: 24 }}>
            <div className="ai-icon"><Sparkles size={18} /></div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7c3aed', marginBottom: 4 }}>AI Portfolio Summary</p>
              <p style={{ fontSize: 14, color: '#4c1d95', lineHeight: 1.6, margin: 0 }}>{portfolio.aiSummary}</p>
            </div>
          </div>
        )}

        {/* ── Tab Bar ── */}
        <div className="portfolio-tabs">
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            return (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon size={15} />
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* ── Tab: Skills ── */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Info */}
            <div className="glass-card">
              <div className="card-header">
                <div className="card-header-icon"><User size={17} /></div>
                Profile Info
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  <div>
                    <p className="section-label">Contact</p>
                    <div className="info-row">
                      <div className="info-row-icon"><Mail size={14} /></div>
                      <span style={{ fontSize: 13 }}>{student.email}</span>
                    </div>
                    {student.mobileNumber && (
                      <div className="info-row">
                        <div className="info-row-icon"><Phone size={14} /></div>
                        <span style={{ fontSize: 13 }}>{student.mobileNumber}</span>
                      </div>
                    )}
                    {student.location && (
                      <div className="info-row">
                        <div className="info-row-icon"><MapPin size={14} /></div>
                        <span style={{ fontSize: 13 }}>{student.location}</span>
                      </div>
                    )}
                    {student.occupation && (
                      <div className="info-row">
                        <div className="info-row-icon"><Briefcase size={14} /></div>
                        <span style={{ fontSize: 13 }}>{student.occupation}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="section-label">Links & Socials</p>
                    {socialLinks.length > 0 ? socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="social-link">
                          <Icon size={15} style={{ color: '#6366f1', flexShrink: 0 }} />
                          <span style={{ truncate: 'true', fontSize: 13 }}>{link.display}</span>
                          <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                        </a>
                      );
                    }) : (
                      <p style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.6 }}>
                        No social links added yet. Edit your profile to add GitHub, LinkedIn, or portfolio links.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="glass-card">
              <div className="card-header">
                <div className="card-header-icon"><Zap size={17} /></div>
                Technical Skills
              </div>
              <div className="card-body">
                {safeSkills.length === 0 ? (
                  <div className="empty-state">
                    <Zap size={40} />
                    <p>No skills added yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {Object.entries(skillsByCategory).map(([category, skills]) =>
                      skills.length > 0 ? (
                        <div key={category}>
                          <p className="section-label">{category === 'other' ? 'Other Skills' : `${category.charAt(0).toUpperCase() + category.slice(1)}s`}</p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                            {skills.map((skill) => {
                              const lvlStyle = getSkillLevelStyle(skill.level);
                              return (
                                <div key={skill.id} className="skill-chip">
                                  <div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{skill.name}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>
                                      {new Date(skill.learnedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </p>
                                  </div>
                                  <span className="skill-level-tag" style={lvlStyle}>{skill.level}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Projects ── */}
        {activeTab === 'projects' && (
          studentProjects.length === 0 ? (
            <div className="empty-state">
              <FolderKanban size={52} />
              <p>No projects found. Join a project to see it here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {studentProjects.map((project) => {
                const doneTasks = project.tasks.filter((t) => t.status === 'Done').length;
                const statusStyle = getProjectStatusStyle(project.status);
                return (
                  <div key={project.id} className="project-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.3 }}>{project.name}</h3>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: statusStyle.bg, color: statusStyle.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle.dot }} />
                        {project.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
                        <span>Progress</span><span style={{ fontWeight: 600, color: '#6366f1' }}>{project.progress}%</span>
                      </div>
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af' }}>
                      <span>👥 {project.students.length} member{project.students.length !== 1 ? 's' : ''}</span>
                      <span>✅ {doneTasks}/{project.tasks.length} tasks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Tab: Timeline ── */}
        {activeTab === 'timeline' && (
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon"><TrendingUp size={17} /></div>
              Learning Journey
            </div>
            <div className="card-body">
              {(portfolio?.timeline || []).length === 0 ? (
                <div className="empty-state">
                  <TrendingUp size={40} />
                  <p>No timeline entries yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {(portfolio?.timeline || [])
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry, index, arr) => {
                      const colors = {
                        skill: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
                        project: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
                        achievement: { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
                      };
                      const c = colors[entry.type as keyof typeof colors] || colors.achievement;
                      return (
                        <div key={entry.id} style={{ display: 'flex', gap: 16, paddingBottom: index < arr.length - 1 ? 24 : 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="timeline-dot" style={{ background: c.bg, color: c.color }}>
                              {entry.type === 'skill' ? <User size={18} /> : entry.type === 'project' ? <Briefcase size={18} /> : <Award size={18} />}
                            </div>
                            {index < arr.length - 1 && <div className="timeline-line" />}
                          </div>
                          <div style={{ flex: 1, paddingTop: 8 }}>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '4px 0 4px' }}>{entry.title}</h4>
                            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{entry.description}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Achievements ── */}
        {activeTab === 'achievements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {(portfolio?.achievements || []).length === 0 ? (
              <div className="empty-state">
                <Trophy size={52} />
                <p>No achievements yet. Keep building!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {(portfolio?.achievements || []).map((achievement) => (
                  <div key={achievement.id} className="achievement-card">
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                        <Award size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#92400e', margin: '0 0 4px' }}>{achievement.title}</h4>
                        <p style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5, margin: '0 0 10px' }}>{achievement.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#b45309' }}>
                          <span>By {achievement.awardedBy}</span>
                          <span>{new Date(achievement.awardedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Feedback */}
            {(portfolio?.adminFeedback || []).length > 0 && (
              <div className="glass-card">
                <div className="card-header">
                  <div className="card-header-icon"><MessageSquare size={17} /></div>
                  Admin Feedback & Remarks
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(portfolio?.adminFeedback || []).map((feedback) => (
                    <div key={feedback.id} className="feedback-card">
                      <p style={{ fontSize: 14, color: '#1e3a5f', margin: 0, lineHeight: 1.6 }}>{feedback.text}</p>
                      <p style={{ fontSize: 12, color: '#93c5fd', margin: '8px 0 0' }}>{new Date(feedback.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: AI Insights ── */}
        {activeTab === 'ai-insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Growth Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div className="metric-card">
                <div className="metric-num">{safeSkills.length}</div>
                <div className="metric-label">Total Skills</div>
              </div>
              <div className="metric-card">
                <div className="metric-num">{studentProjects.length}</div>
                <div className="metric-label">Projects</div>
              </div>
              <div className="metric-card">
                <div className="metric-num">{(portfolio?.achievements || []).length}</div>
                <div className="metric-label">Achievements</div>
              </div>
            </div>

            {/* Skill Development Progress */}
            <div className="glass-card">
              <div className="card-header">
                <div className="card-header-icon"><BarChart2 size={17} /></div>
                Growth Analytics
              </div>
              <div className="card-body">
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#374151', fontWeight: 500 }}>Skill Development Progress</span>
                  <span style={{ fontWeight: 700, color: '#6366f1' }}>
                    {safeSkills.length === 0 ? 0 : Math.round((safeSkills.filter((s) => s.level !== 'Beginner').length / safeSkills.length) * 100)}%
                  </span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: `${safeSkills.length === 0 ? 0 : Math.round((safeSkills.filter((s) => s.level !== 'Beginner').length / safeSkills.length) * 100)}%` }} />
                </div>
              </div>
            </div>

            {/* AI Skill Gap Analysis */}
            {portfolio.aiSkillGapAnalysis && (
              <div className="ai-summary-card">
                <div className="ai-icon"><TrendingUp size={18} /></div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7c3aed', marginBottom: 4 }}>AI Skill Gap Analysis</p>
                  <p style={{ fontSize: 14, color: '#4c1d95', lineHeight: 1.6, margin: 0 }}>{portfolio.aiSkillGapAnalysis}</p>
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {portfolio.aiRecommendations && portfolio.aiRecommendations.length > 0 && (
              <div className="glass-card">
                <div className="card-header">
                  <div className="card-header-icon"><Sparkles size={17} /></div>
                  AI Learning Recommendations
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {portfolio.aiRecommendations.map((rec, index) => (
                    <div key={index} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 10 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {index + 1}
                      </span>
                      <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Recommendations Component */}
            <LearningRecommendations
              portfolio={portfolio}
              completedProjects={completedProjects}
              materialsUploaded={materialsUploaded}
            />
          </div>
        )}
      </div>

      {/* Dialogs */}
      {userRole === 'Admin' && onAddAchievement && (
        <AddAchievementDialog
          open={achievementDialogOpen}
          onClose={() => setAchievementDialogOpen(false)}
          onAdd={(achievement) => { onAddAchievement(achievement); setAchievementDialogOpen(false); }}
        />
      )}
      {userRole === 'Admin' && onAddFeedback && (
        <AddFeedbackDialog
          open={feedbackDialogOpen}
          onClose={() => setFeedbackDialogOpen(false)}
          onAdd={(feedback) => { onAddFeedback(feedback); setFeedbackDialogOpen(false); }}
        />
      )}
    </div>
  );
}