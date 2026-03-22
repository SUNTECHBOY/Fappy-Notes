import { useState } from "react";
import { ManageAccessDialog } from "./ManageAccessDialog";
import { InviteUserDialog } from "./InviteUserDialog";
import { ActivityLogDialog } from "./ActivityLogDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AIDashboardInsights } from "./AIDashboardInsights";
import {
  Shield,
  Users,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Activity,
  Search,
  Mail,
  Phone,
  MoreVertical,
  Eye,
  XCircle,
  Sparkles,
  TrendingUp,
  Trash2,
  Zap,
} from "lucide-react";
import {
  Student,
  ActivityLog,
  UserEngagementReport,
  TeamFormationSuggestion,
  StudyGroup,
  UserRole,
  UserStatus,
} from "../types/admin";

interface AdminManagementProps {
  users: Student[];
  activityLogs: ActivityLog[];
  engagementReports: UserEngagementReport[];
  teamSuggestions: TeamFormationSuggestion[];
  studyGroups: StudyGroup[];
  projects: Array<{ id: string; name: string }>;
  onInviteUser: (invite: { name?: string; email?: string; mobileNumber?: string; role: UserRole }) => void;
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
  onUpdateUserAccess: (userId: string, projects: string[], studyGroups: string[]) => void;
  onDeleteUser?: (userId: string) => void;
}

type AdminTab = "dashboard" | "users" | "engagement" | "teams";

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",  label: "AI Dashboard",        icon: Sparkles },
  { id: "users",      label: "User Management",      icon: Users },
  { id: "engagement", label: "Engagement Reports",   icon: TrendingUp },
  { id: "teams",      label: "AI Team Suggestions",  icon: Zap },
];

export function AdminManagement({
  users,
  activityLogs,
  engagementReports,
  teamSuggestions,
  studyGroups,
  projects,
  onInviteUser,
  onUpdateUserStatus,
  onUpdateUserRole,
  onUpdateUserAccess,
  onDeleteUser,
}: AdminManagementProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [activityLogDialogOpen, setActivityLogDialogOpen] = useState(false);
  const [selectedUserForAccess, setSelectedUserForAccess] = useState<Student | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const stats = {
    totalUsers:   users.length,
    activeUsers:  users.filter((u) => u.status === "Active").length,
    pendingUsers: users.filter((u) => u.status === "Pending").length,
    adminUsers:   users.filter((u) => u.role === "Admin").length,
  };

  const getStatusStyle = (status: UserStatus) => {
    switch (status) {
      case "Active":   return { bg: "rgba(16,185,129,0.1)", color: "#047857", dot: "#10b981", border: "rgba(16,185,129,0.25)" };
      case "Inactive": return { bg: "rgba(107,114,128,0.1)", color: "#374151", dot: "#9ca3af", border: "rgba(107,114,128,0.2)" };
      case "Pending":  return { bg: "rgba(245,158,11,0.1)", color: "#b45309", dot: "#f59e0b", border: "rgba(245,158,11,0.25)" };
      default:         return { bg: "rgba(107,114,128,0.1)", color: "#374151", dot: "#9ca3af", border: "rgba(107,114,128,0.2)" };
    }
  };

  const getTrendStyle = (trend: string) => {
    switch (trend) {
      case "increasing": return { color: "#10b981", label: "↑ Increasing", bg: "rgba(16,185,129,0.1)" };
      case "decreasing": return { color: "#ef4444", label: "↓ Decreasing", bg: "rgba(239,68,68,0.1)" };
      default:           return { color: "#6366f1", label: "→ Stable",     bg: "rgba(99,102,241,0.1)" };
    }
  };

  const statCards = [
    { label: "Total Users",   value: stats.totalUsers,   icon: Users,       iconBg: "linear-gradient(135deg,#6366f1,#818cf8)", glow: "rgba(99,102,241,0.22)" },
    { label: "Active",        value: stats.activeUsers,  icon: CheckCircle, iconBg: "linear-gradient(135deg,#10b981,#34d399)", glow: "rgba(16,185,129,0.22)" },
    { label: "Pending",       value: stats.pendingUsers, icon: AlertCircle, iconBg: "linear-gradient(135deg,#f59e0b,#fbbf24)", glow: "rgba(245,158,11,0.22)" },
    { label: "Admins",        value: stats.adminUsers,   icon: Shield,      iconBg: "linear-gradient(135deg,#8b5cf6,#a78bfa)", glow: "rgba(139,92,246,0.22)" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* ── Header ── */
        .am-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }
        .am-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 26px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 4px;
        }
        .am-title-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .am-subtitle { font-size: 13px; color: #9ca3af; margin: 0; font-weight: 500; }

        /* Header Buttons */
        .am-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border: none; border-radius: 11px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          transition: all 0.2s ease; font-family: inherit;
        }
        .am-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }

        .am-btn-outline {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px;
          background: white; color: #6366f1;
          border: 1.5px solid rgba(99,102,241,0.3); border-radius: 11px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s ease; font-family: inherit;
          box-shadow: 0 2px 8px rgba(99,102,241,0.08);
        }
        .am-btn-outline:hover { background: rgba(99,102,241,0.05); border-color: #6366f1; transform: translateY(-1px); }

        /* ── Bento Stats ── */
        .am-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) { .am-stats { grid-template-columns: repeat(2,1fr); } }

        .am-stat-card {
          background: white;
          border: 1px solid rgba(99,102,241,0.08);
          border-radius: 18px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .am-stat-card::after {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 90px; height: 90px;
          border-radius: 50%;
          opacity: 0.06;
        }
        .am-stat-card:hover { transform: translateY(-2px); }
        .am-stat-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: white; flex-shrink: 0;
        }
        .am-stat-value { font-size: 32px; font-weight: 800; color: #111827; line-height: 1; margin-bottom: 4px; }
        .am-stat-label { font-size: 12px; color: #9ca3af; font-weight: 500; }

        /* ── Tabs ── */
        .am-tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 28px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .am-tab-bar::-webkit-scrollbar { display: none; }
        .am-tab-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 12px 22px;
          background: none; border: none;
          border-bottom: 2.5px solid transparent;
          margin-bottom: -2px;
          font-size: 13.5px; font-weight: 500;
          color: #6b7280; cursor: pointer;
          transition: all 0.2s ease; white-space: nowrap;
          font-family: inherit;
        }
        .am-tab-btn:hover { color: #6366f1; background: rgba(99,102,241,0.04); border-radius: 8px 8px 0 0; }
        .am-tab-btn.active { color: #6366f1; border-bottom-color: #6366f1; font-weight: 600; }

        /* ── Filters ── */
        .am-filter-bar {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-bottom: 18px;
          padding: 14px 18px;
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          align-items: center;
        }
        .am-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .am-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .am-search {
          width: 100%; padding: 9px 12px 9px 38px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 13px; color: #374151; background: #fafafa;
          outline: none; transition: all 0.2s; font-family: inherit;
        }
        .am-search:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .am-search::placeholder { color: #d1d5db; }

        /* ── Table ── */
        .am-table-wrapper {
          background: white;
          border: 1px solid rgba(99,102,241,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(99,102,241,0.06);
        }
        .am-table { width: 100%; border-collapse: collapse; }
        .am-table thead { background: linear-gradient(135deg, rgba(99,102,241,0.03), rgba(139,92,246,0.04)); border-bottom: 1px solid #e5e7eb; }
        .am-table th {
          text-align: left; padding: 14px 18px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af;
        }
        .am-table td { padding: 14px 18px; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
        .am-table tbody tr { transition: background 0.15s; }
        .am-table tbody tr:hover { background: rgba(99,102,241,0.02); }
        .am-table tbody tr:last-child td { border-bottom: none; }

        /* Avatar in table */
        .am-table-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 13px; font-weight: 700;
          flex-shrink: 0; overflow: hidden;
          border: 2px solid rgba(99,102,241,0.15);
        }

        /* Status pill */
        .am-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600; border: 1px solid;
        }
        .am-status-dot { width: 5px; height: 5px; border-radius: 50%; }

        /* Role badge */
        .am-role-badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 6px;
          font-size: 11px; font-weight: 600;
        }
        .am-role-admin { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); }
        .am-role-user  { background: rgba(107,114,128,0.08); color: #6b7280; border: 1px solid rgba(107,114,128,0.2); }

        /* Action btn in table */
        .am-action-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: none; border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #9ca3af;
          transition: all 0.15s; font-family: inherit;
        }
        .am-action-btn:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.2); color: #6366f1; }

        /* ── Engagement Card ── */
        .am-eng-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .am-eng-card:hover { box-shadow: 0 8px 28px rgba(99,102,241,0.1); transform: translateY(-2px); }
        .am-eng-header { padding: 18px 20px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid #f3f4f6; }
        .am-eng-body { padding: 18px 20px; }

        /* Circular progress ring */
        .am-ring-wrap { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
        .am-ring-svg { transform: rotate(-90deg); }
        .am-ring-track { fill: none; stroke: #f3f4f6; stroke-width: 5; }
        .am-ring-fill  { fill: none; stroke-width: 5; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
        .am-ring-label {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
        }
        .am-ring-num { font-size: 14px; font-weight: 800; color: #111827; line-height: 1; }
        .am-ring-sub { font-size: 8px; color: #9ca3af; font-weight: 500; }

        /* Engagement stat mini */
        .am-eng-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 12px; }
        .am-eng-mini { text-align: center; padding: 10px 6px; background: #fafafa; border-radius: 10px; }
        .am-eng-mini-num { font-size: 18px; font-weight: 800; color: #111827; }
        .am-eng-mini-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }

        /* ── Team Suggestion Card ── */
        .am-team-card {
          background: linear-gradient(135deg, #f5f3ff, #eff6ff);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 16px;
          padding: 22px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .am-team-card::before {
          content: '';
          position: absolute;
          top: -20px; right: -20px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.12), transparent);
        }
        .am-team-card:hover { box-shadow: 0 8px 28px rgba(99,102,241,0.14); transform: translateY(-2px); }

        .am-badge-blue    { display: inline-flex; align-items: center; padding: 4px 10px; background: rgba(59,130,246,0.1); color: #1d4ed8; border: 1px solid rgba(59,130,246,0.25); border-radius: 8px; font-size: 11px; font-weight: 700; }
        .am-badge-purple  { display: inline-flex; align-items: center; padding: 4px 10px; background: rgba(139,92,246,0.1); color: #6d28d9; border: 1px solid rgba(139,92,246,0.25); border-radius: 8px; font-size: 11px; font-weight: 700; }
        .am-badge-member  { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 6px; background: white; color: #374151; border: 1px solid #e5e7eb; font-size: 12px; font-weight: 500; }

        .am-reasoning {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #374151;
          line-height: 1.6;
          margin-top: 12px;
          backdrop-filter: blur(4px);
        }

        /* Glass card */
        .am-glass-card {
          background: white;
          border: 1px solid rgba(99,102,241,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(99,102,241,0.06);
        }
        .am-glass-card-header {
          padding: 18px 22px;
          border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 700; color: #111827;
        }
        .am-glass-card-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.12));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center; color: #6366f1;
        }
        .am-glass-card-body { padding: 20px 22px; }

        /* Empty state */
        .am-empty { text-align: center; padding: 60px 24px; color: #9ca3af; }
        .am-empty svg { opacity: 0.2; margin: 0 auto 12px; display: block; }

        /* Progress bar */
        .am-prog-wrap { height: 5px; border-radius: 999px; background: #f3f4f6; overflow: hidden; }
        .am-prog-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #6366f1, #8b5cf6); }
      `}</style>

      {/* ── Header ── */}
      <div className="am-header">
        <div>
          <h2 className="am-title">
            <div className="am-title-icon"><Shield size={20} /></div>
            Admin Management
          </h2>
          <p className="am-subtitle">Manage users, roles, and platform access control</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="am-btn-outline" onClick={() => setActivityLogDialogOpen(true)}>
            <Activity size={14} /> Activity Logs
          </button>
          <button className="am-btn-primary" onClick={() => setInviteDialogOpen(true)}>
            <UserPlus size={14} /> Invite User
          </button>
        </div>
      </div>

      {/* ── Bento Stats ── */}
      <div className="am-stats">
        {statCards.map(({ label, value, icon: Icon, iconBg, glow }) => (
          <div key={label} className="am-stat-card" style={{ boxShadow: `0 4px 24px ${glow}` }}>
            <div className="am-stat-icon" style={{ background: iconBg, boxShadow: `0 4px 14px ${glow}` }}>
              <Icon size={24} />
            </div>
            <div>
              <div className="am-stat-value">{value}</div>
              <div className="am-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div className="am-tab-bar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`am-tab-btn ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ══ AI Dashboard Tab ══ */}
      {activeTab === "dashboard" && (
        <AIDashboardInsights
          projects={projects.map((p) => ({
            id: p.id, name: p.name,
            status: "In Progress" as any,
            progress: 50, tasks: [], students: [],
            description: "", aiSummary: "", aiAlerts: [],
          }))}
          users={users}
          activityLogs={activityLogs}
        />
      )}

      {/* ══ User Management Tab ══ */}
      {activeTab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Filter bar */}
          <div className="am-filter-bar">
            <div className="am-search-wrap">
              <Search size={15} />
              <input
                className="am-search"
                placeholder="Search users by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger style={{ width: 150, borderRadius: 10, fontSize: 13, height: 38 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger style={{ width: 140, borderRadius: 10, fontSize: 13, height: 38 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="am-table-wrapper">
            <table className="am-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Projects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="am-empty">
                        <Users size={44} />
                        <p style={{ fontSize: 14 }}>No users match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.map((user) => {
                  const stStyle = getStatusStyle(user.status!);
                  const initials = user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
                  return (
                    <tr key={user.id}>
                      {/* User */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="am-table-avatar">
                            {user.avatar
                              ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : initials}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{user.name}</p>
                            {user.emailVerified && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#10b981" }}>
                                <CheckCircle size={10} /> Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Contact */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                            <Mail size={11} /> {user.email}
                          </span>
                          {user.mobileNumber && (
                            <span style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                              <Phone size={11} /> {user.mobileNumber}
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Role */}
                      <td>
                        <span className={`am-role-badge ${user.role === "Admin" ? "am-role-admin" : "am-role-user"}`}>
                          {user.role === "Admin" && <Shield size={10} style={{ marginRight: 4 }} />}
                          {user.role}
                        </span>
                      </td>
                      {/* Status */}
                      <td>
                        <span className="am-status-pill" style={{ background: stStyle.bg, color: stStyle.color, borderColor: stStyle.border }}>
                          <span className="am-status-dot" style={{ background: stStyle.dot }} />
                          {user.status}
                        </span>
                      </td>
                      {/* Last Active */}
                      <td style={{ fontSize: 12, color: "#9ca3af" }}>
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}
                      </td>
                      {/* Projects */}
                      <td style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
                        {user.assignedProjects?.length || 0}
                        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400, marginLeft: 3 }}>projects</span>
                      </td>
                      {/* Actions */}
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="am-action-btn">
                              <MoreVertical size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUserForAccess(user)}>
                              <Eye size={14} style={{ marginRight: 8 }} /> Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onUpdateUserRole(user.id, user.role === "Admin" ? "User" : "Admin")}>
                              <Shield size={14} style={{ marginRight: 8 }} />
                              {user.role === "Admin" ? "Remove Admin" : "Make Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "Active" ? (
                              <DropdownMenuItem onClick={() => onUpdateUserStatus(user.id, "Inactive")} style={{ color: "#ef4444" }}>
                                <XCircle size={14} style={{ marginRight: 8 }} /> Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => onUpdateUserStatus(user.id, "Active")} style={{ color: "#10b981" }}>
                                <CheckCircle size={14} style={{ marginRight: 8 }} /> Activate
                              </DropdownMenuItem>
                            )}
                            {onDeleteUser && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onDeleteUser(user.id)} style={{ color: "#ef4444" }}>
                                  <Trash2 size={14} style={{ marginRight: 8 }} /> Delete User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ Engagement Reports Tab ══ */}
      {activeTab === "engagement" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="am-glass-card">
            <div className="am-glass-card-header">
              <div className="am-glass-card-icon"><Sparkles size={16} /></div>
              AI-Generated Engagement Reports
            </div>
            <div className="am-glass-card-body">
              {engagementReports.length === 0 ? (
                <div className="am-empty"><Sparkles size={44} /><p style={{ fontSize: 14 }}>No engagement reports yet</p></div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                  {engagementReports.map((report) => {
                    const user = users.find((u) => u.id === report.userId);
                    if (!user) return null;
                    const trend = getTrendStyle(report.trend);
                    const r = 32;
                    const circ = 2 * Math.PI * r;
                    const score = Math.min(Math.max(report.engagementScore, 0), 100);
                    const offset = circ - (score / 100) * circ;
                    const initials = user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
                    return (
                      <div key={report.userId} className="am-eng-card">
                        <div className="am-eng-header">
                          {/* Circular progress ring */}
                          <div className="am-ring-wrap">
                            <svg className="am-ring-svg" width="72" height="72" viewBox="0 0 72 72">
                              <circle className="am-ring-track" cx="36" cy="36" r={r} />
                              <circle
                                className="am-ring-fill"
                                cx="36" cy="36" r={r}
                                stroke="url(#engGrad)"
                                strokeDasharray={circ}
                                strokeDashoffset={offset}
                              />
                              <defs>
                                <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#6366f1" />
                                  <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="am-ring-label">
                              <span className="am-ring-num">{score}%</span>
                              <span className="am-ring-sub">score</span>
                            </div>
                          </div>
                          {/* User info */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{user.name}</p>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: trend.bg, color: trend.color }}>
                                {trend.label}
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 6px" }}>{user.email}</p>
                            <div className="am-prog-wrap">
                              <div className="am-prog-fill" style={{ width: `${score}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="am-eng-body">
                          <div className="am-eng-stats">
                            {[
                              { label: "Logins",    val: report.totalLogins },
                              { label: "Projects",  val: report.projectsContributed },
                              { label: "Materials", val: report.materialsUploaded },
                              { label: "Comments",  val: report.commentsPosted },
                            ].map(({ label, val }) => (
                              <div key={label} className="am-eng-mini">
                                <div className="am-eng-mini-num">{val}</div>
                                <div className="am-eng-mini-label">{label}</div>
                              </div>
                            ))}
                          </div>
                          <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "right", marginTop: 10 }}>
                            Last active: {new Date(report.lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ AI Team Suggestions Tab ══ */}
      {activeTab === "teams" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="am-glass-card">
            <div className="am-glass-card-header">
              <div className="am-glass-card-icon"><Zap size={16} /></div>
              AI-Powered Team Formation Suggestions
            </div>
            <div className="am-glass-card-body">
              {teamSuggestions.length === 0 ? (
                <div className="am-empty"><Zap size={44} /><p style={{ fontSize: 14 }}>No team suggestions yet</p></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {teamSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="am-team-card">
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
                            {suggestion.projectType}
                          </h3>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span className="am-badge-blue">⚖️ Skill Balance: {suggestion.skillBalance}%</span>
                            <span className="am-badge-purple">✨ Synergy: {suggestion.estimatedSynergy}%</span>
                          </div>
                        </div>
                        {/* Mini synergy ring */}
                        <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                          <svg style={{ transform: "rotate(-90deg)" }} width="56" height="56" viewBox="0 0 56 56">
                            <circle fill="none" stroke="#e5e7eb" strokeWidth="4" cx="28" cy="28" r="24" />
                            <circle
                              fill="none" stroke="url(#teamGrad)" strokeWidth="4" strokeLinecap="round"
                              cx="28" cy="28" r="24"
                              strokeDasharray={`${2 * Math.PI * 24}`}
                              strokeDashoffset={`${2 * Math.PI * 24 * (1 - suggestion.estimatedSynergy / 100)}`}
                            />
                            <defs>
                              <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: "#6366f1" }}>{suggestion.estimatedSynergy}%</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Suggested Team:</span>
                        {suggestion.suggestedTeam.map((userId) => {
                          const u = users.find((x) => x.id === userId);
                          return u ? (
                            <span key={userId} className="am-badge-member">
                              {u.name.split(" ")[0]}
                            </span>
                          ) : null;
                        })}
                      </div>

                      <div className="am-reasoning">
                        <strong style={{ color: "#6366f1" }}>AI Reasoning:</strong>{" "}
                        {suggestion.reasoning}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Dialogs ── */}
      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onInvite={(invite) => { onInviteUser(invite); setInviteDialogOpen(false); }}
      />
      <ActivityLogDialog
        open={activityLogDialogOpen}
        onClose={() => setActivityLogDialogOpen(false)}
        activityLogs={activityLogs}
        users={users}
      />
      {selectedUserForAccess && (
        <ManageAccessDialog
          open={!!selectedUserForAccess}
          onClose={() => setSelectedUserForAccess(null)}
          user={selectedUserForAccess}
          projects={projects}
          studyGroups={studyGroups}
          onUpdate={(projectIds, studyGroupIds) => {
            onUpdateUserAccess(selectedUserForAccess.id, projectIds, studyGroupIds);
            setSelectedUserForAccess(null);
          }}
        />
      )}
    </div>
  );
}