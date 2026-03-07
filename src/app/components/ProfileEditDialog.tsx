import { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Github, Globe, Linkedin, Twitter, MapPin, Briefcase, Mail, Phone, Camera, X } from 'lucide-react';

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onSave: (updatedStudent: Student) => void;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  student,
  onSave,
}: ProfileEditDialogProps) {
  const [formData, setFormData] = useState<Student>(student);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(student);
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleChange = (field: keyof Student, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Convert to base64 for frontend storage
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    handleChange('avatar', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and social links
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Profile Photo */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Profile Photo
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className="h-24 w-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl border-2 border-border">
                      {formData.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline-block w-4 h-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">
                    <Phone className="inline-block w-4 h-4 mr-2" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber || ''}
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="inline-block w-4 h-4 mr-2" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="occupation">
                    <Briefcase className="inline-block w-4 h-4 mr-2" />
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ''}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="Student, Developer, Designer, etc."
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Social Links & Portfolio */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Social Links & Portfolio
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubId">
                    <Github className="inline-block w-4 h-4 mr-2" />
                    GitHub Username
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      github.com/
                    </span>
                    <Input
                      id="githubId"
                      value={formData.githubId || ''}
                      onChange={(e) => handleChange('githubId', e.target.value)}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">
                    <Globe className="inline-block w-4 h-4 mr-2" />
                    Portfolio Website
                  </Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl || ''}
                    onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">
                    <Linkedin className="inline-block w-4 h-4 mr-2" />
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">
                    <Globe className="inline-block w-4 h-4 mr-2" />
                    Personal Website
                  </Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={formData.websiteUrl || ''}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterHandle">
                    <Twitter className="inline-block w-4 h-4 mr-2" />
                    Twitter/X Handle
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">@</span>
                    <Input
                      id="twitterHandle"
                      value={formData.twitterHandle || ''}
                      onChange={(e) =>
                        handleChange('twitterHandle', e.target.value)
                      }
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}