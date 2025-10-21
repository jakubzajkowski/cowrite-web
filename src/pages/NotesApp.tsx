import { useState, useCallback, useEffect } from 'react';
import { TopNavbar } from '@/components/navbar/TopNavbar';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { WorkspaceTypeSelector } from '@/components/workspace/WorkspaceTypeSelector';
import { WorkspaceSelector } from '@/components/workspace/WorkspaceSelector';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { DriveWorkspace } from '@/components/workspace/DriveWorkspace';
import { SaveStatus } from '@/components/workspace/SaveStatus';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useCloudDrive } from '@/hooks/useCloudDrive';
import { LLMChatPanel } from '@/components/chat/LLMChatPanel';

const NotesApp = () => {
  const [workspaceType, setWorkspaceType] = useState<'local' | 'cloud' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Local workspace hook
  const {
    workspace,
    files,
    currentFile: localCurrentFile,
    isLoading: localIsLoading,
    isFileSystemAccessSupported,
    selectWorkspace,
    createNewFile,
    saveFile: saveLocalFile,
    deleteFile: deleteLocalFile,
    refreshWorkspace,
    setCurrentFile: setLocalCurrentFile,
  } = useWorkspace();

  // Cloud drive hook
  const {
    files: cloudFiles,
    currentFile: cloudCurrentFile,
    isLoading: cloudIsLoading,
    setCurrentFile: setCloudCurrentFile,
    createFile: createCloudFile,
    saveFile: saveCloudFile,
    deleteFile: deleteCloudFile,
    uploadFiles: uploadCloudFiles,
    downloadFile: downloadCloudFile,
    loadFiles: loadCloudFiles,
  } = useCloudDrive();

  // Load cloud files when cloud workspace is selected
  useEffect(() => {
    if (workspaceType === 'cloud') {
      loadCloudFiles();
    }
  }, [workspaceType, loadCloudFiles]);

  // Determine current file and loading state based on workspace type
  const currentFile = workspaceType === 'cloud' ? cloudCurrentFile : localCurrentFile;
  const isLoading = workspaceType === 'cloud' ? cloudIsLoading : localIsLoading;

  // Auto-save functionality
  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

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
            if (workspaceType === 'cloud' && cloudCurrentFile) {
              await saveCloudFile(cloudCurrentFile, content);
            } else if (workspaceType === 'local' && localCurrentFile) {
              await saveLocalFile(localCurrentFile, content);
            }
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
    [
      currentFile,
      workspaceType,
      cloudCurrentFile,
      localCurrentFile,
      saveCloudFile,
      saveLocalFile,
      saveTimeout,
    ]
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
            if (workspaceType === 'cloud' && cloudCurrentFile) {
              await saveCloudFile(cloudCurrentFile, editorContent);
            } else if (workspaceType === 'local' && localCurrentFile) {
              await saveLocalFile(localCurrentFile, editorContent);
            }
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
  }, [
    currentFile,
    hasUnsavedChanges,
    workspaceType,
    cloudCurrentFile,
    localCurrentFile,
    saveCloudFile,
    saveLocalFile,
  ]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const handleLocalCreateFile = useCallback(
    async (fileName: string) => {
      await createNewFile(fileName);
    },
    [createNewFile]
  );

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleChatToggle = () => setChatOpen(o => !o);
  const handleSearch = () => console.log('Search');
  const handleShare = () => console.log('Share');
  const handleExport = () => console.log('Export');
  const handleImport = () => console.log('Import');

  // Cloud workspace handlers
  const handleCloudFileSelect = setCloudCurrentFile;
  const handleCloudFileCreate = createCloudFile;
  const handleCloudFileDelete = deleteCloudFile;
  const handleCloudFileUpload = uploadCloudFiles;
  const handleCloudFileDownload = downloadCloudFile;

  const handleChangeWorkspace = () => {
    setWorkspaceType(null);
  };

  // Step 1: Show workspace type selector
  if (!workspaceType) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavbar
          currentNoteTitle="Select Workspace Type"
          onSidebarToggle={handleSidebarToggle}
          onSearch={handleSearch}
          onShare={handleShare}
          onExport={handleExport}
          onImport={handleImport}
          onChatToggle={handleChatToggle}
          isChatOpen={chatOpen}
        />
        <WorkspaceTypeSelector
          onSelectLocal={() => setWorkspaceType('local')}
          onSelectCloud={() => setWorkspaceType('cloud')}
        />
        <LLMChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    );
  }

  // Step 2: If local selected but no workspace, show local workspace selector
  if (workspaceType === 'local' && !workspace) {
    return (
      <div className="h-screen flex flex-col">
        <TopNavbar
          currentNoteTitle="Select Workspace"
          onSidebarToggle={handleSidebarToggle}
          onSearch={handleSearch}
          onShare={handleShare}
          onExport={handleExport}
          onImport={handleImport}
          onChatToggle={handleChatToggle}
          isChatOpen={chatOpen}
        />
        <WorkspaceSelector
          onSelectWorkspace={selectWorkspace}
          isSupported={isFileSystemAccessSupported()}
        />
        <LLMChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    );
  }

  // Step 3: Cloud Drive Workspace
  if (workspaceType === 'cloud') {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <TopNavbar
          currentNoteTitle={currentFile?.name || 'Cloud Drive'}
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
          onChatToggle={handleChatToggle}
          isChatOpen={chatOpen}
        />

        <div className="flex flex-1 overflow-hidden">
          {sidebarOpen && (
            <DriveWorkspace
              files={cloudFiles}
              currentFile={cloudCurrentFile}
              onFileSelect={handleCloudFileSelect}
              onFileCreate={handleCloudFileCreate}
              onFileDelete={handleCloudFileDelete}
              onFileUpload={handleCloudFileUpload}
              onFileDownload={handleCloudFileDownload}
              onChangeWorkspace={handleChangeWorkspace}
              isLoading={isLoading}
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
                  <p>Choose a file from the cloud drive or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <LLMChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    );
  }

  // Step 4: Local Workspace (existing functionality)
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
        onChatToggle={handleChatToggle}
        isChatOpen={chatOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <WorkspaceSidebar
            workspace={workspace}
            files={files}
            currentFile={localCurrentFile}
            isLoading={localIsLoading}
            onFileSelect={setLocalCurrentFile}
            onCreateFile={handleLocalCreateFile}
            onDeleteFile={deleteLocalFile}
            onRefreshWorkspace={refreshWorkspace}
            onSelectWorkspace={handleChangeWorkspace}
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
      <LLMChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default NotesApp;
