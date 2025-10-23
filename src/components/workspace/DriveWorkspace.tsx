import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Cloud,
  Upload,
  Search,
  MoreVertical,
  Trash2,
  Download,
  FileText,
  Image,
  File as FileIcon,
  Folder,
  Grid3x3,
  List,
  SortAsc,
  Plus,
  Settings,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CloudFile } from '../../types/cloud';

interface DriveWorkspaceProps {
  files: CloudFile[];
  currentFile: CloudFile | null;
  onFileSelect: (file: CloudFile) => void;
  onFileCreate: (name: string, type: string) => Promise<void>;
  onFileDelete: (file: CloudFile) => Promise<void>;
  onFileUpload: (files: FileList) => Promise<void>;
  onFileDownload: (file: CloudFile) => Promise<void>;
  onChangeWorkspace: () => void;
  isLoading?: boolean;
}

const getFileIcon = (type?: string) => {
  if (!type) return FileText;
  if (type.startsWith('image/')) return Image;
  if (type.includes('text') || type.includes('markdown')) return FileText;
  return FileIcon;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const DriveWorkspace = ({
  files,
  currentFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileUpload,
  onFileDownload,
  onChangeWorkspace,
  isLoading = false,
}: DriveWorkspaceProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFile = async () => {
    if (newFileName.trim()) {
      await onFileCreate(newFileName.trim(), 'text/markdown');
      setNewFileName('');
      setShowCreateDialog(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Cloud Drive</h2>
              <p className="text-xs text-muted-foreground">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onChangeWorkspace} title="Change workspace">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            New File
          </Button>
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4" />
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

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

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-muted rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewMode('list')}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <SortAsc className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Date</span>
          </Button>
        </div>
      </div>

      {/* Create File Dialog */}
      {showCreateDialog && (
        <div className="p-3 border-b bg-muted/30">
          <div className="flex gap-2">
            <Input
              placeholder="Enter file name..."
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') {
                  setShowCreateDialog(false);
                  setNewFileName('');
                }
              }}
              className="h-8"
              autoFocus
            />
            <Button size="sm" className="h-8" onClick={handleCreateFile}>
              Create
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => {
                setShowCreateDialog(false);
                setNewFileName('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Files List/Grid */}
      <div className="flex-1 overflow-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Cloud className="w-12 h-12 mx-auto mb-2 text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">Loading files...</p>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs">
              <Folder className="w-16 h-16 mx-auto mb-3 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-1">No files yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? 'No files match your search'
                  : 'Create a new file or upload files to get started'}
              </p>
              {!searchQuery && (
                <Button size="sm" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Create File
                </Button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredFiles.map(file => {
              const Icon = getFileIcon(file.type);
              const isActive = currentFile?.id === file.id;

              return (
                <Card
                  key={file.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    isActive ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onFileSelect(file)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onFileDownload(file)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onFileDelete(file)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm font-medium truncate mb-1">{file.name}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{file.size ? formatBytes(file.size) : 'Unknown'}</span>
                      <span>
                        {file.modifiedAt
                          ? formatDistanceToNow(file.modifiedAt, { addSuffix: true })
                          : 'Recently'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFiles.map(file => {
              const Icon = getFileIcon(file.type);
              const isActive = currentFile?.id === file.id;

              return (
                <div
                  key={file.id}
                  className={`group flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                    isActive ? 'bg-accent' : ''
                  }`}
                  onClick={() => onFileSelect(file)}
                >
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-950 rounded">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.size ? formatBytes(file.size) : 'Unknown'} •{' '}
                      {file.modifiedAt
                        ? formatDistanceToNow(file.modifiedAt, { addSuffix: true })
                        : 'Recently'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onFileDownload(file)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onFileDelete(file)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
