import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, FileText } from 'lucide-react';

interface CreateFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFile: (fileName: string) => Promise<void>;
}

export const CreateFileDialog = ({ open, onOpenChange, onCreateFile }: CreateFileDialogProps) => {
  const [fileName, setFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!fileName.trim()) return;

    setIsCreating(true);
    try {
      await onCreateFile(fileName.trim());
      setFileName('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating file:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Create New Markdown File
          </DialogTitle>
          <DialogDescription>
            Enter a name for your new markdown file. The .md extension will be added automatically
            if not provided.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              placeholder="my-document.md"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!fileName.trim() || isCreating}>
            {isCreating ? (
              <>Creating...</>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface CreateFileButtonProps {
  onCreateFile: (fileName: string) => Promise<void>;
}

export const CreateFileButton = ({ onCreateFile }: CreateFileButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} size="sm" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        New File
      </Button>

      <CreateFileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateFile={onCreateFile}
      />
    </>
  );
};
