import { useState } from 'react';
import { StudyMaterial } from '../types';
import { aiService } from '../utils/aiService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Sparkles, Send, BookOpen, Loader2, Brain, TrendingUp } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ materialId: string; materialName: string }>;
  confidence?: number;
  timestamp: string;
}

interface AIStudyAssistantProps {
  materials: StudyMaterial[];
  open: boolean;
  onClose: () => void;
}

export function AIStudyAssistant({
  materials,
  open,
  onClose,
}: AIStudyAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI Study Assistant. I can help you understand concepts from your uploaded study materials. Ask me anything about the topics you're learning!

Some example questions:
• "Explain React components"
• "How do Python functions work?"
• "What are neural networks?"
• "Explain SQL databases"`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.answerQuestionFromMaterials(
        input,
        materials
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        confidence: response.confidence,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'Explain the key concepts in my study materials',
    'What are the most important topics I should focus on?',
    'How do these concepts apply in real-world scenarios?',
    'Can you summarize the main points?',
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Study Assistant
          </DialogTitle>
          <DialogDescription>
            Get instant help with your studies powered by AI.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span className="font-medium">Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source) => (
                            <Badge
                              key={source.materialId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {source.materialName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.confidence !== undefined && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-xs">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-muted-foreground">
                            Confidence:
                          </span>
                          <span className="font-medium">{message.confidence}%</span>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Try these questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your study materials..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>📚 {materials.length} study materials</strong> loaded and
              ready to answer your questions. The AI analyzes your uploaded
              content to provide accurate, contextual answers.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}