import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MarkdownFile } from '@/hooks/useWorkspace';
import { FileText, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface FileListProps {
  files: MarkdownFile[];
  currentFile: MarkdownFile | null;
  onFileSelect: (file: MarkdownFile) => void;
  onFileDelete: (file: MarkdownFile) => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

export const FileList = ({ files, currentFile, onFileSelect, onFileDelete }: FileListProps) => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const handleDelete = async (file: MarkdownFile) => {
    setDeletingFile(file.id);
    try {
      await onFileDelete(file);
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setDeletingFile(null);
    }
  };

  const formatFileTime = (lastModified: number) => {
    try {
      return formatDistanceToNow(new Date(lastModified), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  // Sort files by last modified (most recent first)
  const sortedFiles = [...files].sort((a, b) => b.lastModified - a.lastModified);
  const allFiles = sortedFiles;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        {files.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">No files yet</p>
            <p className="text-xs">Create your first markdown file to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {/* All Files */}
            <div>
              <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  All Files ({allFiles.length})
                </span>
              </div>
              <div className="space-y-0.5">
                {allFiles.map(file => (
                  <FileItem
                    key={file.id}
                    file={file}
                    isActive={currentFile?.id === file.id}
                    onSelect={onFileSelect}
                    onDelete={handleDelete}
                    isDeleting={deletingFile === file.id}
                    formatTime={formatFileTime}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

// Separate FileItem component for better organization
interface FileItemProps {
  file: MarkdownFile;
  isActive: boolean;
  onSelect: (file: MarkdownFile) => void;
  onDelete: (file: MarkdownFile) => void;
  isDeleting: boolean;
  formatTime: (time: number) => string;
}

const FileItem = ({
  file,
  isActive,
  onSelect,
  onDelete,
  isDeleting,
  formatTime,
}: FileItemProps) => (
  <div
    className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all ${
      isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent/50'
    }`}
    onClick={() => onSelect(file)}
  >
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className={`p-1 rounded ${isActive ? 'bg-primary/20' : 'bg-blue-50 dark:bg-blue-950'}`}>
        <FileText
          className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-blue-600 dark:text-blue-400'}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight">{file.name}</p>
        <p className="text-xs text-muted-foreground leading-tight">
          {formatTime(file.lastModified)}
        </p>
      </div>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={e => e.stopPropagation()}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation();
            onDelete(file);
          }}
          disabled={isDeleting}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
