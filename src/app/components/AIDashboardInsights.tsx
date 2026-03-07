import { useState, useEffect } from 'react';
import { Project } from '../types';
import { ActivityLog } from '../types/admin';
import { aiService } from '../utils/aiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  CheckCircle,
  Brain,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface AIDashboardInsightsProps {
  projects: Project[];
  users: any[];
  activityLogs: ActivityLog[];
}

export function AIDashboardInsights({
  projects,
  users,
  activityLogs,
}: AIDashboardInsightsProps) {
  const [insights, setInsights] = useState<{
    trends: Array<{
      title: string;
      description: string;
      trend: 'up' | 'down' | 'stable';
      value: string;
    }>;
    alerts: Array<{
      title: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
    }>;
    predictions: Array<{
      title: string;
      description: string;
      confidence: number;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.generateAdminInsights(
        projects,
        users,
        activityLogs
      );
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          className: 'bg-red-50 border-red-200 text-red-900',
          badgeClassName: 'bg-red-500',
        };
      case 'medium':
        return {
          icon: <Info className="h-5 w-5" />,
          className: 'bg-yellow-50 border-yellow-200 text-yellow-900',
          badgeClassName: 'bg-yellow-500',
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          className: 'bg-blue-50 border-blue-200 text-blue-900',
          badgeClassName: 'bg-blue-500',
        };
    }
  };

  if (isLoading || !insights) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-semibold">AI is analyzing your data...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Generating insights and predictions
              </p>
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">AI-Powered Insights</h3>
            <p className="text-sm text-muted-foreground">
              Real-time analytics and predictions
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadInsights}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Trends */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          Platform Trends
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.trends.map((trend, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{trend.title}</p>
                      <p className="text-2xl font-bold mt-1">{trend.value}</p>
                    </div>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trend.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Action Required
        </h4>
        <div className="space-y-3">
          {insights.alerts.map((alert, index) => {
            const config = getSeverityConfig(alert.severity);
            return (
              <Card key={index} className={`border-2 ${config.className}`}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    {config.icon}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h5 className="font-semibold">{alert.title}</h5>
                        <Badge className={config.badgeClassName}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{alert.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Predictions */}
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Predictions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.predictions.map((prediction, index) => (
            <Card
              key={index}
              className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50"
            >
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  {prediction.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {prediction.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-semibold">{prediction.confidence}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Note */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">AI-Powered Intelligence</p>
              <p className="text-sm text-white/90">
                These insights are generated by analyzing user activity, project
                progress, and engagement patterns. The AI continuously learns and
                adapts to provide increasingly accurate predictions and
                recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
