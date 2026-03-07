import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface AddFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (feedback: string) => void;
}

export function AddFeedbackDialog({
  open,
  onClose,
  onAdd,
}: AddFeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim()) {
      onAdd(feedback);
      setFeedback('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Feedback</DialogTitle>
          <DialogDescription>
            Provide feedback for the student.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Feedback / Remarks</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback or remarks for the student..."
              rows={6}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!feedback.trim()}>
              Add Feedback
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