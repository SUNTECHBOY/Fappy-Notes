import { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import * as db from '../services/database';
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
import { Github, Globe, Linkedin, Twitter, MapPin, Briefcase, Mail, Phone, Camera, X, Loader } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(student);
    if (!open) {
      setIsEditing(false); // Reset to view mode when closed
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Student, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ... photo logic remains same ...
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      try {
        setIsUploading(true);
        const photoUrl = await db.uploadProfilePhoto(student.id, file);
        handleChange('avatar', photoUrl);
      } catch (err) {
        console.error('Photo upload failed:', err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        alert(`Failed to upload photo: ${errorMsg}`);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    handleChange('avatar', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderSocialLink = (icon: any, value: string | undefined, label: string, urlPrefix: string = '') => {
    if (!value) return null;
    const Icon = icon;
    return (
      <a href={`${urlPrefix}${value}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-accent">
        <Icon className="h-4 w-4" />
        <span className="truncate">{value}</span>
      </a>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Profile' : 'Student Profile'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your profile information and social links' : 'View your profile details and contact information'}
          </DialogDescription>
        </DialogHeader>

        {!isEditing ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="h-24 w-24 rounded-full object-cover border-4 border-primary/20" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-md">
                    {student.name.split(' ').map((n) => n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1 space-y-1">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-primary font-medium flex items-center justify-center sm:justify-start gap-2">
                  <Briefcase className="h-4 w-4" /> {student.occupation || student.role}
                </p>
                {student.location && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="h-4 w-4" /> {student.location}
                  </p>
                )}
              </div>
            </div>

            {student.bio && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{student.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-2">Contact Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{student.email}</span>
                  </div>
                  {student.mobileNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.mobileNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {(student.githubId || student.portfolioUrl || student.linkedinUrl || student.websiteUrl || student.twitterHandle) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold border-b pb-2">Links & Socials</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {renderSocialLink(Github, student.githubId, 'GitHub', 'https://github.com/')}
                    {renderSocialLink(Linkedin, student.linkedinUrl, 'LinkedIn')}
                    {renderSocialLink(Twitter, student.twitterHandle, 'Twitter', 'https://twitter.com/')}
                    {renderSocialLink(Globe, student.portfolioUrl, 'Portfolio')}
                    {renderSocialLink(Globe, student.websiteUrl, 'Website')}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </DialogFooter>
          </div>
        ) : (
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
                    disabled={isUploading}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        {formData.avatar ? 'Change Photo' : 'Upload Photo'}
                      </>
                    )}
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
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}