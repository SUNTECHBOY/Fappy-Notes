import { useState, useEffect } from 'react';
import { Portfolio } from '../types';
import { aiService } from '../utils/aiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Sparkles,
  Target,
  BookOpen,
  Users,
  Code,
  Loader2,
  RefreshCw,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface LearningRecommendationsProps {
  portfolio: Portfolio;
  completedProjects: number;
  materialsUploaded: number;
}

export function LearningRecommendations({
  portfolio,
  completedProjects,
  materialsUploaded,
}: LearningRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    Array<{
      id: string;
      type: 'skill' | 'project' | 'material' | 'collaboration';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      estimatedTime: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await aiService.generateLearningRecommendations(
        portfolio.userId,
        portfolio.skills,
        completedProjects,
        materialsUploaded
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [portfolio.userId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill':
        return <Code className="h-5 w-5" />;
      case 'project':
        return <Target className="h-5 w-5" />;
      case 'material':
        return <BookOpen className="h-5 w-5" />;
      case 'collaboration':
        return <Users className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          className: 'bg-red-500',
          label: 'High Priority',
        };
      case 'medium':
        return {
          className: 'bg-yellow-500',
          label: 'Medium Priority',
        };
      default:
        return {
          className: 'bg-blue-500',
          label: 'Low Priority',
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'skill':
        return 'text-purple-500';
      case 'project':
        return 'text-blue-500';
      case 'material':
        return 'text-green-500';
      case 'collaboration':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="text-sm text-muted-foreground">
              AI is generating personalized recommendations...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            AI Learning Recommendations
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const priorityConfig = getPriorityConfig(rec.priority);
          return (
            <Card key={rec.id} className="bg-white border-2">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`${getTypeColor(rec.type)} mt-1`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Badge className={priorityConfig.className}>
                      {priorityConfig.label}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.estimatedTime}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {rec.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="bg-white border-2 border-purple-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Personalized Just for You</p>
              <p className="text-xs text-muted-foreground">
                These recommendations are tailored based on your current skills,
                learning progress, and goals. Follow them to accelerate your
                growth and achieve your objectives faster.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
