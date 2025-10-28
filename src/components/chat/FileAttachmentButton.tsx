import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface File {
  id: string | number;
  name: string;
  content?: string;
}

interface FileAttachmentButtonProps {
  files: File[];
  attachedFiles: File[];
  onAttach: (file: File) => void;
  onDetach: (fileId: string | number) => void;
  disabled?: boolean;
}

export const FileAttachmentButton = ({
  files,
  attachedFiles,
  onAttach,
  onDetach,
  disabled,
}: FileAttachmentButtonProps) => {
  const [open, setOpen] = useState(false);

  const isAttached = (fileId: string | number) => attachedFiles.some(f => f.id === fileId);

  const handleToggle = (file: File) => {
    if (isAttached(file.id)) {
      onDetach(file.id);
    } else {
      onAttach(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          disabled={disabled || files.length === 0}
          title="Attach files from workspace"
        >
          <Paperclip className="h-4 w-4" />
          {attachedFiles.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              {attachedFiles.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Files</DialogTitle>
          <DialogDescription>
            Select files from your workspace to include in the conversation
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-1">
            {files.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No files in workspace
              </div>
            ) : (
              files.map(file => {
                const attached = isAttached(file.id);
                return (
                  <button
                    key={file.id}
                    onClick={() => handleToggle(file)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent',
                      attached && 'bg-primary/10 hover:bg-primary/15'
                    )}
                  >
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center',
                        attached ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      {attached ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {file.content && (
                        <p className="text-xs text-muted-foreground truncate">
                          {file.content.length} characters
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
