import { useState } from 'react';
import { UserRole } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Phone, Shield, User } from 'lucide-react';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (invite: { email?: string; mobileNumber?: string; role: UserRole }) => void;
}

export function InviteUserDialog({
  open,
  onClose,
  onInvite,
}: InviteUserDialogProps) {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'mobile'>('email');
  const [formData, setFormData] = useState({
    email: '',
    mobileNumber: '',
    role: 'User' as UserRole,
  });

  const handleSubmit = () => {
    if (inviteMethod === 'email' && formData.email) {
      onInvite({ email: formData.email, role: formData.role });
      setFormData({ email: '', mobileNumber: '', role: 'User' });
    } else if (inviteMethod === 'mobile' && formData.mobileNumber) {
      onInvite({ mobileNumber: formData.mobileNumber, role: formData.role });
      setFormData({ email: '', mobileNumber: '', role: 'User' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User to StudentCollab Platform</DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-md p-3 mb-4">
          <p className="text-sm text-purple-900">
            Invite students and collaborators to join your StudentCollab project workspace. They will get access to shared projects, study materials, and collaborative features.
          </p>
        </div>

        <Tabs
          value={inviteMethod}
          onValueChange={(v) => setInviteMethod(v as 'email' | 'mobile')}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Phone className="h-4 w-4 mr-2" />
              Mobile (OTP)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                An invitation email will be sent with a verification link
              </p>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input
                type="tel"
                placeholder="+1-555-0123"
                value={formData.mobileNumber}
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                An OTP will be sent for verification and signup
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Assign Role</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>User</span>
                  </div>
                </SelectItem>
                <SelectItem value="Admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-2">
            <p className="text-sm font-medium text-blue-900">Security Features:</p>
            <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
              <li>Role-based access control (RBAC)</li>
              <li>
                {inviteMethod === 'email'
                  ? 'Email verification required'
                  : 'OTP-based secure signup'}
              </li>
              <li>Secure authentication tokens</li>
              <li>Admin approval workflow</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={
                (inviteMethod === 'email' && !formData.email) ||
                (inviteMethod === 'mobile' && !formData.mobileNumber)
              }
            >
              Send Invitation
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}