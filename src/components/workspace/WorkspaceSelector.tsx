import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, AlertCircle } from 'lucide-react';

interface WorkspaceSelectorProps {
  onSelectWorkspace: () => void;
  isSupported: boolean;
}

export const WorkspaceSelector = ({ onSelectWorkspace, isSupported }: WorkspaceSelectorProps) => {
  if (!isSupported) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Browser Not Supported</CardTitle>
            <CardDescription>
              File System Access API is not supported in your browser. 
              Please use Chrome, Edge, or another Chromium-based browser to access local files.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <FolderOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <CardTitle>Select Workspace</CardTitle>
          <CardDescription>
            Choose a folder on your computer to use as your markdown workspace. 
            You'll be able to view, edit, and create .md files in this folder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onSelectWorkspace} 
            className="w-full" 
            size="lg"
          >
            <FolderOpen className="w-5 h-5 mr-2" />
            Choose Folder
          </Button>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <h4 className="font-medium mb-2">What happens next:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Browse and select a folder</li>
              <li>View all .md files in the folder</li>
              <li>Create, edit, and save markdown files</li>
              <li>Files are saved directly to your computer</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};