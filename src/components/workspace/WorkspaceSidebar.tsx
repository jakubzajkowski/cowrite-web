import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileList } from './FileList';
import { CreateFileButton } from './CreateFileDialog';
import type { MarkdownFile, WorkspaceFolder } from '@/hooks/useWorkspace';
import { HardDrive, Settings, Search } from 'lucide-react';
import { useState } from 'react';

interface WorkspaceSidebarProps {
  workspace: WorkspaceFolder | null;
  files: MarkdownFile[];
  currentFile: MarkdownFile | null;
  isLoading: boolean;
  onFileSelect: (file: MarkdownFile) => void;
  onCreateFile: (fileName: string) => Promise<void>;
  onDeleteFile: (file: MarkdownFile) => Promise<void>;
  onRefreshWorkspace: () => Promise<void>;
  onSelectWorkspace: () => void;
}

export const WorkspaceSidebar = ({
  workspace,
  files,
  currentFile,
  isLoading,
  onFileSelect,
  onCreateFile,
  onDeleteFile,
  onRefreshWorkspace,
  onSelectWorkspace,
}: WorkspaceSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!workspace) {
    return null;
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <HardDrive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{workspace.name}</h2>
              <p className="text-xs text-muted-foreground">
                Local Workspace • {files.length} {files.length === 1 ? 'file' : 'files'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onSelectWorkspace} title="Change workspace">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <CreateFileButton onCreateFile={onCreateFile} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-hidden">
        <FileList
          files={filteredFiles}
          currentFile={currentFile}
          onFileSelect={onFileSelect}
          onFileDelete={onDeleteFile}
          onRefresh={onRefreshWorkspace}
          isLoading={isLoading}
        />
        {searchQuery && filteredFiles.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No files match your search
          </div>
        )}
      </div>
    </div>
  );
};
