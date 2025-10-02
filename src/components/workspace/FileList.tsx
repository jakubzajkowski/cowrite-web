import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MarkdownFile } from '@/hooks/useWorkspace';
import { FileText, MoreHorizontal, Trash2, RefreshCw } from 'lucide-react';
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

export const FileList = ({
  files,
  currentFile,
  onFileSelect,
  onFileDelete,
  onRefresh,
  isLoading,
}: FileListProps) => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Files ({files.length})</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {files.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No markdown files found</p>
            <p className="text-xs mt-1">Create a new file to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {files.map(file => (
              <div
                key={file.id}
                className={`group flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer transition-colors ${
                  currentFile?.id === file.id ? 'bg-accent' : ''
                }`}
                onClick={() => onFileSelect(file)}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileTime(file.lastModified)}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(file);
                      }}
                      disabled={deletingFile === file.id}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deletingFile === file.id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
