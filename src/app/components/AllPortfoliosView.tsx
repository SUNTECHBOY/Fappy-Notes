import { useState } from 'react';
import { Portfolio, Student } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Search, User, TrendingUp, Award } from 'lucide-react';

interface AllPortfoliosViewProps {
  portfolios: { [userId: string]: Portfolio };
  students: Student[];
  onSelectStudent: (studentId: string) => void;
}

export function AllPortfoliosView({
  portfolios,
  students,
  onSelectStudent,
}: AllPortfoliosViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOverallLevel = (portfolio: Portfolio) => {
    const safeSkills = portfolio?.skills || [];
    if (safeSkills.filter((s) => s.level === 'Advanced').length >= 3) {
      return 'Advanced';
    }
    if (safeSkills.filter((s) => s.level === 'Intermediate').length >= 3) {
      return 'Intermediate';
    }
    return 'Beginner';
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-yellow-500';
      case 'Intermediate':
        return 'bg-blue-500';
      case 'Advanced':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">All Student Portfolios</h2>
          <p className="text-muted-foreground mt-1">
            View and manage student portfolios and growth analytics
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold mt-1">{students.length}</p>
              </div>
              <User className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Advanced Level</p>
                <p className="text-3xl font-bold mt-1">
                  {
                    students.filter(
                      (s) =>
                        portfolios[s.id] &&
                        getOverallLevel(portfolios[s.id]) === 'Advanced'
                    ).length
                  }
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold mt-1">
                  {Object.values(portfolios).reduce(
                    (sum, p) => sum + (p?.projects?.length || 0),
                    0
                  )}
                </p>
              </div>
              <Award className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Skills</p>
                <p className="text-3xl font-bold mt-1">
                  {Object.values(portfolios).reduce(
                    (sum, p) => sum + (p?.skills?.length || 0),
                    0
                  )}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Portfolio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const portfolio = portfolios[student.id];
          if (!portfolio) return null;

          const level = getOverallLevel(portfolio);
          const safeSkills = portfolio?.skills || [];
          const progressPercentage = safeSkills.length === 0 ? 0 : Math.round(
            (safeSkills.filter((s) => s.level !== 'Beginner').length /
              safeSkills.length) *
              100
          );

          return (
            <Card
              key={student.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectStudent(student.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground">
                    {(student.name || 'User')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg leading-tight">{student.name}</CardTitle>
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 h-4">
                        {student.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground/70">Student ID:</span>
                        <span className="font-mono">{student.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground/70">Role:</span>
                        <span>{student.role}</span>
                      </div>
                      {student.mobileNumber && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground/70">Mobile:</span>
                          <span>{student.mobileNumber}</span>
                        </div>
                      )}
                      {student.joinedAt && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground/70">Joined:</span>
                          <span>{new Date(student.joinedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Level Badge */}
                <div className="flex items-center gap-2 mt-4">
                  <Badge className={getSkillLevelColor(level)}>{level} Level</Badge>
                  <Badge variant="outline">{(portfolio?.skills || []).length} skills</Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Skill Progress</span>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t mt-4">
                  <div>
                    <p className="text-xl font-bold">{(portfolio?.projects || []).length}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{(portfolio?.achievements || []).length}</p>
                    <p className="text-xs text-muted-foreground">Awards</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{(portfolio?.timeline || []).length}</p>
                    <p className="text-xs text-muted-foreground">Milestones</p>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  View Full Portfolio
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
