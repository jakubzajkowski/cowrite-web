import { Button } from '@/components/ui/button';
import { FileList } from './FileList';
import { CreateFileButton } from './CreateFileDialog';
import type { MarkdownFile, WorkspaceFolder } from '@/hooks/useWorkspace';
import { FolderOpen, Settings } from 'lucide-react';

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
  if (!workspace) {
    return null;
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-sm font-medium truncate">{workspace.name}</h2>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onSelectWorkspace} title="Change workspace">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <CreateFileButton onCreateFile={onCreateFile} />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-hidden">
        <FileList
          files={files}
          currentFile={currentFile}
          onFileSelect={onFileSelect}
          onFileDelete={onDeleteFile}
          onRefresh={onRefreshWorkspace}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
