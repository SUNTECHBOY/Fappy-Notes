import { useState } from 'react';
import { Portfolio, Student, UserRole, Project } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  User,
  Award,
  Briefcase,
  TrendingUp,
  Sparkles,
  Calendar,
  ExternalLink,
  Github,
  Globe,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { AddAchievementDialog } from './AddAchievementDialog';
import { AddFeedbackDialog } from './AddFeedbackDialog';
import { LearningRecommendations } from './LearningRecommendations';
import { Textarea } from './ui/textarea';

interface PortfolioBoardProps {
  portfolio: Portfolio;
  student: Student;
  userRole: UserRole;
  currentUserId: string;
  completedProjects?: number;
  materialsUploaded?: number;
  onAddAchievement?: (achievement: {
    title: string;
    description: string;
  }) => void;
  onAddFeedback?: (feedback: string) => void;
}

export function PortfolioBoard({
  portfolio,
  student,
  userRole,
  currentUserId,
  completedProjects = 0,
  materialsUploaded = 0,
  onAddAchievement,
  onAddFeedback,
}: PortfolioBoardProps) {
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const skillsByCategory = {
    language: portfolio.skills.filter((s) => s.category === 'language'),
    framework: portfolio.skills.filter((s) => s.category === 'framework'),
    tool: portfolio.skills.filter((s) => s.category === 'tool'),
    other: portfolio.skills.filter((s) => s.category === 'other'),
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

  const overallLevel =
    portfolio.skills.filter((s) => s.level === 'Advanced').length >= 3
      ? 'Advanced'
      : portfolio.skills.filter((s) => s.level === 'Intermediate').length >= 3
      ? 'Intermediate'
      : 'Beginner';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground text-2xl">
            {student.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{student.name}'s Portfolio</h2>
            <p className="text-muted-foreground mt-1">{student.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getSkillLevelColor(overallLevel)}>
                {overallLevel} Level
              </Badge>
              <Badge variant="outline">
                {portfolio.skills.length} Skills
              </Badge>
              <Badge variant="outline">
                {portfolio.projects.length} Projects
              </Badge>
            </div>
          </div>
        </div>
        {userRole === 'Admin' && (
          <div className="flex gap-2">
            <Button onClick={() => setAchievementDialogOpen(true)}>
              <Award className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          </div>
        )}
      </div>

      {/* AI Summary */}
      {portfolio.aiSummary && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">AI Portfolio Summary</h3>
                <p className="text-purple-800">{portfolio.aiSummary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, skills]) =>
                skills.length > 0 ? (
                  <div key={category}>
                    <h4 className="font-medium capitalize mb-3 text-sm text-muted-foreground">
                      {category === 'other' ? 'Other Skills' : `${category}s`}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <Badge
                              className={`${getSkillLevelColor(skill.level)} text-xs`}
                            >
                              {skill.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Learned: {new Date(skill.learnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </CardContent>
          </Card>

          {/* Work Samples */}
          <Card>
            <CardHeader>
              <CardTitle>Work Samples & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolio.workSamples?.github && (
                <a
                  href={portfolio.workSamples.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">GitHub Profile</p>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.workSamples.github}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
              {portfolio.workSamples?.portfolio && (
                <a
                  href={portfolio.workSamples.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Portfolio Website</p>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.workSamples.portfolio}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
              {portfolio.workSamples?.demo && (
                <a
                  href={portfolio.workSamples.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">Live Demo</p>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.workSamples.demo}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No projects yet
              </div>
            ) : (
              portfolio.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{project.name}</span>
                      {project.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Technologies Used:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Completed: {new Date(project.completedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.timeline
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            entry.type === 'skill'
                              ? 'bg-blue-100 text-blue-600'
                              : entry.type === 'project'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}
                        >
                          {entry.type === 'skill' ? (
                            <User className="h-5 w-5" />
                          ) : entry.type === 'project' ? (
                            <Briefcase className="h-5 w-5" />
                          ) : (
                            <Award className="h-5 w-5" />
                          )}
                        </div>
                        {index < portfolio.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <h4 className="font-semibold mt-1">{entry.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.achievements.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No achievements yet
              </div>
            ) : (
              portfolio.achievements.map((achievement) => (
                <Card key={achievement.id} className="border-2 border-amber-200 bg-amber-50/50">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-amber-600 flex-shrink-0" />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Awarded by: {achievement.awardedBy}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(achievement.awardedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Admin Feedback */}
          {portfolio.adminFeedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Feedback & Remarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio.adminFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">{feedback.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          {portfolio.aiSkillGapAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{portfolio.aiSkillGapAnalysis}</p>
              </CardContent>
            </Card>
          )}

          {portfolio.aiRecommendations && portfolio.aiRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Learning Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {portfolio.aiRecommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <span className="text-purple-600 font-bold mt-0.5">{index + 1}</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Growth Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Skill Development Progress</span>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (portfolio.skills.filter((s) => s.level !== 'Beginner').length /
                        portfolio.skills.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (portfolio.skills.filter((s) => s.level !== 'Beginner').length /
                      portfolio.skills.length) *
                    100
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{portfolio.skills.length}</p>
                  <p className="text-sm text-muted-foreground">Total Skills</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{portfolio.projects.length}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{portfolio.achievements.length}</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Learning Recommendations */}
          <LearningRecommendations
            portfolio={portfolio}
            completedProjects={completedProjects}
            materialsUploaded={materialsUploaded}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {userRole === 'Admin' && onAddAchievement && (
        <AddAchievementDialog
          open={achievementDialogOpen}
          onClose={() => setAchievementDialogOpen(false)}
          onAdd={(achievement) => {
            onAddAchievement(achievement);
            setAchievementDialogOpen(false);
          }}
        />
      )}

      {userRole === 'Admin' && onAddFeedback && (
        <AddFeedbackDialog
          open={feedbackDialogOpen}
          onClose={() => setFeedbackDialogOpen(false)}
          onAdd={(feedback) => {
            onAddFeedback(feedback);
            setFeedbackDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}