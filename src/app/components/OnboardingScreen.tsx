import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { MapPin, Briefcase, User, Phone, Github, Linkedin, Loader } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (data: {
    bio: string;
    location: string;
    occupation: string;
    mobileNumber: string;
    githubId: string;
    linkedinUrl: string;
  }) => Promise<void>;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    occupation: '',
    mobileNumber: '',
    githubId: '',
    linkedinUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bio || !formData.location || !formData.occupation) {
      setError('Please fill out the mandatory fields to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onComplete(formData);
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile details.');
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <Card className="w-full max-w-2xl border-slate-800/80 bg-slate-950/70 backdrop-blur-md shadow-2xl shadow-sky-900/40">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            Welcome to the Board!
          </CardTitle>
          <CardDescription className="text-center text-slate-400 text-base">
            Just one more step before you can access your dashboard. We need a few details to complete your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-slate-200">
                  <Briefcase className="inline-block w-4 h-4 mr-2" />
                  Occupation <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="occupation"
                  required
                  placeholder="e.g. Developer, Designer, Student"
                  className="bg-slate-900/70 border-slate-800 text-slate-100"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-200">
                  <MapPin className="inline-block w-4 h-4 mr-2" />
                  Location <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="location"
                  required
                  placeholder="City, Country"
                  className="bg-slate-900/70 border-slate-800 text-slate-100"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio" className="text-slate-200">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Short Bio <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="bio"
                  required
                  rows={3}
                  className="bg-slate-900/70 border-slate-800 resize-none text-slate-100"
                  placeholder="Tell your team a little about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-slate-200">
                  <Phone className="inline-block w-4 h-4 mr-2" />
                  Mobile Number
                </Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="bg-slate-900/70 border-slate-800 text-slate-100"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange('mobileNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubId" className="text-slate-200">
                  <Github className="inline-block w-4 h-4 mr-2" />
                  GitHub Username
                </Label>
                <Input
                  id="githubId"
                  placeholder="username"
                  className="bg-slate-900/70 border-slate-800 text-slate-100"
                  value={formData.githubId}
                  onChange={(e) => handleChange('githubId', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="linkedinUrl" className="text-slate-200">
                  <Linkedin className="inline-block w-4 h-4 mr-2" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  className="bg-slate-900/70 border-slate-800 text-slate-100"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 p-3 rounded-md border border-red-900/50">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 font-medium text-white transition-all shadow-lg shadow-sky-900/20"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                'Complete Profile & Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
