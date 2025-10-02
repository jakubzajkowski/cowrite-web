import { useState, useCallback, useEffect } from 'react';
import { TopNavbar } from '@/components/navbar/TopNavbar';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { WorkspaceSelector } from '@/components/workspace/WorkspaceSelector';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { SaveStatus } from '@/components/workspace/SaveStatus';
import { useWorkspace } from '@/hooks/useWorkspace';

const NotesApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    workspace,
    files,
    currentFile,
    isLoading,
    isFileSystemAccessSupported,
    selectWorkspace,
    createNewFile,
    saveFile,
    deleteFile,
    refreshWorkspace,
    setCurrentFile,
  } = useWorkspace();

  // Auto-save functionality
  const [saveTimeout, setSaveTimeout] = useState<number | null>(null);

  const handleContentChange = useCallback(
    (content: string) => {
      if (!currentFile) return;

      setHasUnsavedChanges(true);

      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout for auto-save
      const timeout = setTimeout(async () => {
        if (currentFile) {
          setIsSaving(true);
          try {
            await saveFile(currentFile, content);
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
          } catch (error) {
            console.error('Error auto-saving file:', error);
          } finally {
            setIsSaving(false);
          }
        }
      }, 1000); // Auto-save after 1 second of inactivity

      setSaveTimeout(timeout);
    },
    [currentFile, saveFile, saveTimeout]
  );

  // Manual save with Ctrl+S
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentFile && hasUnsavedChanges) {
          setIsSaving(true);
          try {
            // Get current content from editor
            const editorContent = document.querySelector('.tiptap')?.innerHTML || '';
            await saveFile(currentFile, editorContent);
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
          } catch (error) {
            console.error('Error saving file:', error);
          } finally {
            setIsSaving(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFile, hasUnsavedChanges, saveFile]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const handleCreateFile = useCallback(
    async (fileName: string) => {
      await createNewFile(fileName);
    },
    [createNewFile]
  );

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleSearch = () => console.log('Search');
  const handleShare = () => console.log('Share');
  const handleExport = () => console.log('Export');
  const handleImport = () => console.log('Import');

  // If no workspace is selected, show workspace selector
  if (!workspace) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavbar
          currentNoteTitle="Select Workspace"
          onSidebarToggle={handleSidebarToggle}
          onSearch={handleSearch}
          onShare={handleShare}
          onExport={handleExport}
          onImport={handleImport}
        />
        <WorkspaceSelector
          onSelectWorkspace={selectWorkspace}
          isSupported={isFileSystemAccessSupported()}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNavbar
        currentNoteTitle={currentFile?.name}
        onSidebarToggle={handleSidebarToggle}
        onSearch={handleSearch}
        onShare={handleShare}
        onExport={handleExport}
        onImport={handleImport}
        rightContent={
          <SaveStatus
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <WorkspaceSidebar
            workspace={workspace}
            files={files}
            currentFile={currentFile}
            isLoading={isLoading}
            onFileSelect={setCurrentFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={deleteFile}
            onRefreshWorkspace={refreshWorkspace}
            onSelectWorkspace={selectWorkspace}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {currentFile ? (
            <TipTapEditor
              key={currentFile.id}
              content={currentFile.content}
              onChange={handleContentChange}
              placeholder={`Start writing "${currentFile.name}"...`}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No file selected</h2>
                <p>Choose a file from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
