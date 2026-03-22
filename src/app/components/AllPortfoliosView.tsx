import { useState } from 'react';
import { Portfolio, Student } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  User,
  TrendingUp,
  Award,
  BookOpen,
  ArrowUpDown,
  MessageSquare,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Briefcase,
  Sparkles,
  Zap,
  Trophy,
  X,
} from 'lucide-react';
import { AddFeedbackDialog } from './AddFeedbackDialog';

interface AllPortfoliosViewProps {
  portfolios: { [userId: string]: Portfolio };
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onAddFeedback?: (userId: string, feedback: string) => void;
}

type LevelFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
type RoleFilter = 'All' | 'Admin' | 'User';
type SortOption = 'name' | 'skills' | 'projects' | 'achievements';

export function AllPortfoliosView({
  portfolios,
  students,
  onSelectStudent,
  onAddFeedback,
}: AllPortfoliosViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('All');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [feedbackTarget, setFeedbackTarget] = useState<string | null>(null);

  const getOverallLevel = (portfolio: Portfolio | undefined): LevelFilter => {
    const skills = portfolio?.skills || [];
    if (skills.filter((s) => s.level === 'Advanced').length >= 3) return 'Advanced';
    if (skills.filter((s) => s.level === 'Intermediate').length >= 3) return 'Intermediate';
    return 'Beginner';
  };

  const getProgressValue = (portfolio: Portfolio | undefined) => {
    const skills = portfolio?.skills || [];
    if (skills.length === 0) return 0;
    return Math.round((skills.filter((s) => s.level !== 'Beginner').length / skills.length) * 100);
  };

  const levelStyles: Record<string, { gradient: string; text: string; bg: string; border: string; dot: string }> = {
    Advanced:     { gradient: 'linear-gradient(135deg,#10b981,#059669)', text: '#047857', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', dot: '#10b981' },
    Intermediate: { gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)', text: '#1d4ed8', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', dot: '#3b82f6' },
    Beginner:     { gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', text: '#b45309', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
  };

  const filteredStudents = students
    .filter((student) => {
      const nameMatch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const portfolio = portfolios[student.id];
      const levelMatch = levelFilter === 'All' || getOverallLevel(portfolio) === levelFilter;
      const roleMatch = roleFilter === 'All' || student.role === roleFilter;
      return nameMatch && levelMatch && roleMatch;
    })
    .sort((a, b) => {
      const pa = portfolios[a.id];
      const pb = portfolios[b.id];
      switch (sortBy) {
        case 'skills':       return (pb?.skills?.length || 0) - (pa?.skills?.length || 0);
        case 'projects':     return (pb?.projects?.length || 0) - (pa?.projects?.length || 0);
        case 'achievements': return (pb?.achievements?.length || 0) - (pa?.achievements?.length || 0);
        default:             return a.name.localeCompare(b.name);
      }
    });

  const totalSkills   = Object.values(portfolios).reduce((s, p) => s + (p?.skills?.length || 0), 0);
  const totalProjects = Object.values(portfolios).reduce((s, p) => s + (p?.projects?.length || 0), 0);
  const advancedCount = students.filter((s) => getOverallLevel(portfolios[s.id]) === 'Advanced').length;
  const hasFilters    = levelFilter !== 'All' || roleFilter !== 'All' || !!searchQuery;

  const statCards = [
    { label: 'Total Students',  value: students.length, icon: User,       iconBg: 'linear-gradient(135deg,#6366f1,#818cf8)', glow: 'rgba(99,102,241,0.2)' },
    { label: 'Advanced Level',  value: advancedCount,   icon: TrendingUp, iconBg: 'linear-gradient(135deg,#10b981,#34d399)', glow: 'rgba(16,185,129,0.2)' },
    { label: 'Total Projects',  value: totalProjects,   icon: Briefcase,  iconBg: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', glow: 'rgba(139,92,246,0.2)' },
    { label: 'Total Skills',    value: totalSkills,     icon: Sparkles,   iconBg: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(245,158,11,0.2)' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* ── Page Header ── */
        .apv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }
        .apv-title {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 4px;
          line-height: 1;
        }
        .apv-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
          font-weight: 500;
        }

        /* ── Search ── */
        .apv-search-wrap {
          position: relative;
          width: 280px;
        }
        .apv-search-wrap svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .apv-search {
          width: 100%;
          padding: 10px 10px 10px 38px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          color: #374151;
          background: white;
          outline: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .apv-search:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .apv-search::placeholder { color: #d1d5db; }

        /* ── Bento Stat Cards ── */
        .apv-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) { .apv-stats { grid-template-columns: repeat(2,1fr); } }
        .apv-stat-card {
          background: white;
          border: 1px solid rgba(99,102,241,0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .apv-stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.02), transparent);
          pointer-events: none;
        }
        .apv-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.12);
        }
        .apv-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .apv-stat-value {
          font-size: 30px;
          font-weight: 800;
          color: #111827;
          line-height: 1;
          margin-bottom: 4px;
        }
        .apv-stat-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* ── Filter Bar ── */
        .apv-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
          padding: 14px 18px;
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .apv-filter-label {
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-right: 4px;
        }
        .apv-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          background: rgba(239,68,68,0.08);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .apv-clear-btn:hover {
          background: rgba(239,68,68,0.15);
        }

        /* ── Student Cards Grid ── */
        .apv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        /* ── Student Card ── */
        .apv-student-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }
        .apv-student-card:hover {
          box-shadow: 0 12px 40px rgba(99,102,241,0.14);
          border-color: rgba(99,102,241,0.25);
          transform: translateY(-3px);
        }
        .apv-card-accent {
          height: 4px;
          width: 100%;
        }
        .apv-card-body {
          padding: 20px;
        }

        /* Avatar */
        .apv-avatar-ring {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          padding: 2.5px;
          flex-shrink: 0;
        }
        .apv-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: 700;
          overflow: hidden;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        /* Status pill */
        .apv-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .apv-status-active {
          background: rgba(16,185,129,0.1);
          color: #047857;
          border: 1px solid rgba(16,185,129,0.25);
        }
        .apv-status-inactive {
          background: rgba(107,114,128,0.08);
          color: #6b7280;
          border: 1px solid rgba(107,114,128,0.2);
        }

        /* Level/Role tags */
        .apv-level-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 8px;
        }
        .apv-role-tag {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(99,102,241,0.07);
          color: #6366f1;
          border: 1px solid rgba(99,102,241,0.15);
        }

        /* Progress bar */
        .apv-progress-wrap {
          height: 5px;
          border-radius: 999px;
          background: #f3f4f6;
          overflow: hidden;
        }
        .apv-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.5s ease;
        }

        /* Mini stats row */
        .apv-mini-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #f3f4f6;
        }
        .apv-mini-stat {
          text-align: center;
          padding: 10px 6px;
          background: #fafafa;
          border-radius: 10px;
        }
        .apv-mini-stat-num {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
          line-height: 1;
          margin-bottom: 3px;
        }
        .apv-mini-stat-label {
          font-size: 10px;
          color: #9ca3af;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Social icons */
        .apv-socials {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }
        .apv-social-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        /* View Portfolio Button */
        .apv-view-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 3px 12px rgba(99,102,241,0.3);
          font-family: inherit;
        }
        .apv-view-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 18px rgba(99,102,241,0.4);
        }
        .apv-feedback-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          padding: 10px;
          background: white;
          color: #6366f1;
          border: 1.5px solid rgba(99,102,241,0.25);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .apv-feedback-btn:hover {
          background: rgba(99,102,241,0.06);
          border-color: #6366f1;
        }

        /* Empty State */
        .apv-empty {
          text-align: center;
          padding: 80px 24px;
          color: #9ca3af;
        }
        .apv-empty svg {
          opacity: 0.2;
          margin: 0 auto 14px;
          display: block;
        }
        .apv-empty h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 6px;
        }
        .apv-empty p {
          font-size: 13px;
          margin: 0;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="apv-header">
        <div>
          <h2 className="apv-title">All Student Portfolios</h2>
          <p className="apv-subtitle">
            {filteredStudents.length} of {students.length} student{students.length !== 1 ? 's' : ''} shown
          </p>
        </div>
        <div className="apv-search-wrap">
          <Search size={16} />
          <input
            className="apv-search"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Bento Stats ── */}
      <div className="apv-stats">
        {statCards.map(({ label, value, icon: Icon, iconBg, glow }) => (
          <div key={label} className="apv-stat-card" style={{ boxShadow: `0 4px 20px ${glow}` }}>
            <div className="apv-stat-icon" style={{ background: iconBg, boxShadow: `0 4px 12px ${glow}` }}>
              <Icon size={22} />
            </div>
            <div>
              <div className="apv-stat-value">{value}</div>
              <div className="apv-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="apv-filters">
        <span className="apv-filter-label">Filter:</span>

        <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as LevelFilter)}>
          <SelectTrigger style={{ width: 160, borderRadius: 10, fontSize: 13, height: 36 }}>
            <TrendingUp size={14} style={{ marginRight: 6, color: '#6366f1', flexShrink: 0 }} />
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleFilter)}>
          <SelectTrigger style={{ width: 140, borderRadius: 10, fontSize: 13, height: 36 }}>
            <User size={14} style={{ marginRight: 6, color: '#6366f1', flexShrink: 0 }} />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger style={{ width: 170, borderRadius: 10, fontSize: 13, height: 36 }}>
            <ArrowUpDown size={14} style={{ marginRight: 6, color: '#6366f1', flexShrink: 0 }} />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort: Name</SelectItem>
            <SelectItem value="skills">Sort: Most Skills</SelectItem>
            <SelectItem value="projects">Sort: Most Projects</SelectItem>
            <SelectItem value="achievements">Sort: Most Awards</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            className="apv-clear-btn"
            onClick={() => { setLevelFilter('All'); setRoleFilter('All'); setSearchQuery(''); }}
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Empty State ── */}
      {filteredStudents.length === 0 && (
        <div className="apv-empty">
          <User size={56} />
          <h3>No students match your filters</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* ── Student Cards Grid ── */}
      <div className="apv-grid">
        {filteredStudents.map((student) => {
          const portfolio  = portfolios[student.id];
          const level      = getOverallLevel(portfolio);
          const progress   = getProgressValue(portfolio);
          const skills     = portfolio?.skills || [];
          const projects   = portfolio?.projects || [];
          const achievements = portfolio?.achievements || [];
          const lvlStyle   = levelStyles[level] || levelStyles.Beginner;
          const initials   = (student.name || 'U').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
          const hasSocials = student.githubId || student.linkedinUrl || student.portfolioUrl;

          return (
            <div
              key={student.id}
              className="apv-student-card"
              onClick={() => onSelectStudent(student.id)}
            >
              {/* Accent bar */}
              <div className="apv-card-accent" style={{ background: lvlStyle.gradient }} />

              <div className="apv-card-body">
                {/* Top row: avatar + name + status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                  <div className="apv-avatar-ring" style={{ background: lvlStyle.gradient }}>
                    <div className="apv-avatar-inner">
                      {student.avatar
                        ? <img src={student.avatar} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {student.name}
                      </h3>
                      <span className={`apv-status-pill ${student.status === 'Active' ? 'apv-status-active' : 'apv-status-inactive'}`}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: student.status === 'Active' ? '#10b981' : '#9ca3af' }} />
                        {student.status || 'Active'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {student.email}
                    </p>
                    {(student.occupation || student.location) && (
                      <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#9ca3af' }}>
                        {student.occupation && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Briefcase size={11} />{student.occupation}</span>}
                        {student.location && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{student.location}</span>}
                      </div>
                    )}
                    {hasSocials && (
                      <div className="apv-socials">
                        {student.githubId && <div className="apv-social-icon"><Github size={12} /></div>}
                        {student.linkedinUrl && <div className="apv-social-icon"><Linkedin size={12} /></div>}
                        {student.portfolioUrl && <div className="apv-social-icon"><Globe size={12} /></div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Level + Role badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  <span
                    className="apv-level-tag"
                    style={{ background: lvlStyle.bg, color: lvlStyle.text, border: `1px solid ${lvlStyle.border}` }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: lvlStyle.dot }} />
                    {level}
                  </span>
                  <span className="apv-role-tag">{student.role}</span>
                  {!portfolio && (
                    <span style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: '#f9fafb', color: '#9ca3af', border: '1px solid #e5e7eb' }}>
                      No portfolio yet
                    </span>
                  )}
                </div>

                {/* Skill Progress */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
                    <span>Skill progress</span>
                    <span style={{ fontWeight: 700, color: '#6366f1' }}>{progress}%</span>
                  </div>
                  <div className="apv-progress-wrap">
                    <div className="apv-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="apv-mini-stats" style={{ marginBottom: 14 }}>
                  <div className="apv-mini-stat">
                    <div className="apv-mini-stat-num">{skills.length}</div>
                    <div className="apv-mini-stat-label">Skills</div>
                  </div>
                  <div className="apv-mini-stat">
                    <div className="apv-mini-stat-num">{projects.length}</div>
                    <div className="apv-mini-stat-label">Projects</div>
                  </div>
                  <div className="apv-mini-stat">
                    <div className="apv-mini-stat-num">{achievements.length}</div>
                    <div className="apv-mini-stat-label">Awards</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="apv-view-btn"
                    onClick={(e) => { e.stopPropagation(); onSelectStudent(student.id); }}
                  >
                    <BookOpen size={14} /> View Portfolio
                  </button>
                  {onAddFeedback && (
                    <button
                      className="apv-feedback-btn"
                      title="Add feedback"
                      onClick={(e) => { e.stopPropagation(); setFeedbackTarget(student.id); }}
                    >
                      <MessageSquare size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Dialog */}
      {feedbackTarget && onAddFeedback && (
        <AddFeedbackDialog
          open={!!feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onAdd={(feedback) => {
            onAddFeedback(feedbackTarget, feedback);
            setFeedbackTarget(null);
          }}
        />
      )}
    </div>
  );
}
