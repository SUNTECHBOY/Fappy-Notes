import { useState } from "react";
import { ManageAccessDialog } from "./ManageAccessDialog";
import { InviteUserDialog } from "./InviteUserDialog";
import { ActivityLogDialog } from "./ActivityLogDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";
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
  UserX,
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
  onInviteUser: (invite: {
    name?: string;
    email?: string;
    mobileNumber?: string;
    role: UserRole;
  }) => void;
  onUpdateUserStatus: (
    userId: string,
    status: UserStatus,
  ) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
  onUpdateUserAccess: (
    userId: string,
    projects: string[],
    studyGroups: string[],
  ) => void;
  onDeleteUser?: (userId: string) => void;
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [inviteDialogOpen, setInviteDialogOpen] =
    useState(false);
  const [activityLogDialogOpen, setActivityLogDialogOpen] =
    useState(false);
  const [selectedUserForAccess, setSelectedUserForAccess] =
    useState<Student | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "Active")
      .length,
    pendingUsers: users.filter((u) => u.status === "Pending")
      .length,
    adminUsers: users.filter((u) => u.role === "Admin").length,
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-gray-500";
      case "Pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return (
          <TrendingUp className="h-4 w-4 text-green-500" />
        );
      case "decreasing":
        return (
          <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
        );
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and access control
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActivityLogDialogOpen(true)}
            variant="outline"
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity Logs
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Users
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.activeUsers}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.pendingUsers}
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Admins
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.adminUsers}
                </p>
              </div>
              <Shield className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">
            AI Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            User Management
          </TabsTrigger>
          <TabsTrigger value="engagement">
            Engagement Reports
          </TabsTrigger>
          <TabsTrigger value="teams">
            AI Team Suggestions
          </TabsTrigger>
        </TabsList>

        {/* AI Dashboard Tab */}
        <TabsContent value="dashboard">
          <AIDashboardInsights
            projects={projects.map((p) => ({
              id: p.id,
              name: p.name,
              status: "In Progress" as any,
              progress: 50,
              tasks: [],
              students: [],
              description: "",
              aiSummary: "",
              aiAlerts: [],
            }))}
            users={users}
            activityLogs={activityLogs}
          />
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">
                  Inactive
                </SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-full md:w-[160px]">
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
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">
                        User
                      </th>
                      <th className="text-left p-4 font-medium">
                        Contact
                      </th>
                      <th className="text-left p-4 font-medium">
                        Role
                      </th>
                      <th className="text-left p-4 font-medium">
                        Status
                      </th>
                      <th className="text-left p-4 font-medium">
                        Last Active
                      </th>
                      <th className="text-left p-4 font-medium">
                        Projects
                      </th>
                      <th className="text-left p-4 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">
                                {user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.emailVerified && (
                                  <span className="inline-flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    Verified
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span>{user.email}</span>
                            </div>
                            {user.mobileNumber && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{user.mobileNumber}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              user.role === "Admin"
                                ? "default"
                                : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={getStatusColor(
                              user.status!,
                            )}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {user.lastActive
                            ? new Date(
                                user.lastActive,
                              ).toLocaleString()
                            : "Never"}
                        </td>
                        <td className="p-4 text-sm">
                          {user.assignedProjects?.length || 0}{" "}
                          projects
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setSelectedUserForAccess(user)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Manage Access
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateUserRole(
                                    user.id,
                                    user.role === "Admin"
                                      ? "User"
                                      : "Admin",
                                  )
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                {user.role === "Admin"
                                  ? "Remove Admin"
                                  : "Make Admin"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "Active" ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onUpdateUserStatus(
                                      user.id,
                                      "Inactive",
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    onUpdateUserStatus(
                                      user.id,
                                      "Active",
                                    )
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {onDeleteUser && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onDeleteUser(user.id)
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Reports Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Generated Engagement Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {engagementReports.map((report) => {
                  const user = users.find(
                    (u) => u.id === report.userId,
                  );
                  if (!user) return null;

                  return (
                    <Card
                      key={report.userId}
                      className="border-2"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-12 w-12 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg">
                                {user.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {getTrendIcon(report.trend)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Engagement Score
                            </span>
                            <span className="text-2xl font-bold">
                              {report.engagementScore}%
                            </span>
                          </div>
                          <Progress
                            value={report.engagementScore}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <p className="text-2xl font-bold">
                              {report.totalLogins}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total Logins
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {report.projectsContributed}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Projects
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {report.materialsUploaded}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Materials
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {report.commentsPosted}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Comments
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Last Active:{" "}
                            {new Date(
                              report.lastActive,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Team Suggestions Tab */}
        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered Team Formation Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamSuggestions.map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {suggestion.projectType}
                            </h3>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge className="bg-blue-500">
                                Skill Balance:{" "}
                                {suggestion.skillBalance}%
                              </Badge>
                              <Badge className="bg-purple-500">
                                Synergy:{" "}
                                {suggestion.estimatedSynergy}%
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            Suggested Team:
                          </span>
                          {suggestion.suggestedTeam.map(
                            (userId) => {
                              const user = users.find(
                                (u) => u.id === userId,
                              );
                              return user ? (
                                <Badge
                                  key={userId}
                                  variant="outline"
                                >
                                  {user.name}
                                </Badge>
                              ) : null;
                            },
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground bg-white/50 p-3 rounded-md">
                          <strong>AI Reasoning:</strong>{" "}
                          {suggestion.reasoning}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <InviteUserDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onInvite={(invite) => {
          onInviteUser(invite);
          setInviteDialogOpen(false);
        }}
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
            onUpdateUserAccess(
              selectedUserForAccess.id,
              projectIds,
              studyGroupIds,
            );
            setSelectedUserForAccess(null);
          }}
        />
      )}
    </div>
  );
}