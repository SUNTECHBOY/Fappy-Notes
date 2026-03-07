import { useState } from 'react';
import { Student } from '../types';
import { ActivityLog } from '../types/admin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  LogIn,
  FolderPlus,
  CheckSquare,
  Upload,
  MessageSquare,
  UserCog,
} from 'lucide-react';

interface ActivityLogDialogProps {
  open: boolean;
  onClose: () => void;
  activityLogs: ActivityLog[];
  users: Student[];
}

export function ActivityLogDialog({
  open,
  onClose,
  activityLogs,
  users,
}: ActivityLogDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LogIn className="h-4 w-4" />;
      case 'project_create':
        return <FolderPlus className="h-4 w-4" />;
      case 'task_update':
        return <CheckSquare className="h-4 w-4" />;
      case 'material_upload':
        return <Upload className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'profile_update':
        return <UserCog className="h-4 w-4" />;
      default:
        return <UserCog className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-blue-500';
      case 'project_create':
        return 'bg-green-500';
      case 'task_update':
        return 'bg-purple-500';
      case 'material_upload':
        return 'bg-orange-500';
      case 'comment':
        return 'bg-pink-500';
      case 'profile_update':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredLogs = activityLogs
    .filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || log.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Activity Logs</DialogTitle>
          <DialogDescription>
            View detailed activity history for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="project_create">Project Create</SelectItem>
                <SelectItem value="task_update">Task Update</SelectItem>
                <SelectItem value="material_upload">Material Upload</SelectItem>
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="profile_update">Profile Update</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No activity logs found
              </div>
            ) : (
              filteredLogs.map((log) => {
                const user = users.find((u) => u.id === log.userId);
                return (
                  <div
                    key={log.id}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`${getActivityColor(
                          log.type
                        )} rounded-full p-2 text-white`}
                      >
                        {getActivityIcon(log.type)}
                      </div>
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{log.userName}</p>
                            <Badge variant="outline" className="text-xs">
                              {log.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.description}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>

                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(log.metadata).map(
                            ([key, value]) =>
                              typeof value === 'string' && (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}