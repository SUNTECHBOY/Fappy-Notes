import { useState } from 'react';
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
import { Textarea } from './ui/textarea';

interface AddAchievementDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (achievement: { title: string; description: string }) => void;
}

export function AddAchievementDialog({
  open,
  onClose,
  onAdd,
}: AddAchievementDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = () => {
    if (formData.title && formData.description) {
      onAdd(formData);
      setFormData({ title: '', description: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Achievement</DialogTitle>
          <DialogDescription>
            Add a new achievement to the portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Achievement Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Best Contributor Award 2026"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the achievement..."
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!formData.title || !formData.description}>
              Add Achievement
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