import { useState, useEffect } from 'react';
import { Check, Save, AlertCircle } from 'lucide-react';

interface SaveStatusProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export const SaveStatus = ({ isSaving, lastSaved, hasUnsavedChanges }: SaveStatusProps) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const now = Date.now();
      const diff = now - lastSaved.getTime();

      if (diff < 60000) {
        // Less than 1 minute
        setTimeAgo('just now');
      } else if (diff < 3600000) {
        // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        setTimeAgo(`${minutes}m ago`);
      } else if (diff < 86400000) {
        // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        setTimeAgo(`${hours}h ago`);
      } else {
        const days = Math.floor(diff / 86400000);
        setTimeAgo(`${days}d ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (isSaving) {
    return (
      <div className="flex items-center space-x-2 text-sm text-blue-600">
        <Save className="w-4 h-4 animate-pulse" />
        <span className="font-medium">Saving...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-500">
        <AlertCircle className="w-4 h-4" />
        <span className="font-medium">Unsaved changes</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600 animate-in fade-in duration-200">
        <Check className="w-4 h-4 font-bold" />
        <span className="font-medium">Saved {timeAgo}</span>
      </div>
    );
  }

  return null;
};
