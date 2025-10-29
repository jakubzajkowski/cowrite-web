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

type WorkspaceType = 'local' | 'cloud' | null;

const NotesApp = () => {
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const {
    workspace,
    files: localFiles,
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

  useEffect(() => {
    if (workspaceType === 'cloud') {
      loadCloudFiles();
    }
  }, [workspaceType, loadCloudFiles]);

  const isCloud = workspaceType === 'cloud';
  const currentFile = isCloud ? cloudCurrentFile : localCurrentFile;
  const isLoading = isCloud ? cloudIsLoading : localIsLoading;

  const [saveTimeout, setSaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const performSave = useCallback(
    async (content: string) => {
      if (!currentFile) return;

      setIsSaving(true);
      try {
        if (isCloud && cloudCurrentFile) {
          await saveCloudFile(content);
        } else if (!isCloud && localCurrentFile) {
          await saveLocalFile(localCurrentFile, content);
        }
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving file:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [currentFile, isCloud, cloudCurrentFile, localCurrentFile, saveCloudFile, saveLocalFile]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      if (!currentFile) return;

      setHasUnsavedChanges(true);

      if (saveTimeout) clearTimeout(saveTimeout);

      const timeout = setTimeout(() => performSave(content), 1000);
      setSaveTimeout(timeout);
    },
    [currentFile, saveTimeout, performSave]
  );

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentFile && hasUnsavedChanges) {
          const editorContent = document.querySelector('.tiptap')?.innerHTML || '';
          await performSave(editorContent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFile, hasUnsavedChanges, performSave]);

  useEffect(() => {
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [saveTimeout]);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleChatToggle = () => setChatOpen(o => !o);
  const handleSearch = () => console.log('Search');
  const handleShare = () => console.log('Share');
  const handleExport = () => console.log('Export');
  const handleImport = () => console.log('Import');

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

  const renderEditor = () => {
    if (!currentFile) {
      return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No file selected</h2>
            <p>Choose a file from the {isCloud ? 'cloud drive' : 'sidebar'} or create a new one</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto">
        <TipTapEditor
          key={currentFile.id}
          content={currentFile.content || ''}
          onChange={handleContentChange}
          placeholder={`Start writing "${currentFile.name}"...`}
        />
      </div>
    );
  };

  if (isCloud) {
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
              onFileSelect={setCloudCurrentFile}
              onFileCreate={createCloudFile}
              onFileDelete={deleteCloudFile}
              onFileUpload={uploadCloudFiles}
              onFileDownload={downloadCloudFile}
              onChangeWorkspace={() => setWorkspaceType(null)}
              isLoading={isLoading}
            />
          )}
          <div className="flex-1 flex flex-col overflow-hidden">{renderEditor()}</div>
        </div>
  <LLMChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
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
        onChatToggle={handleChatToggle}
        isChatOpen={chatOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <WorkspaceSidebar
            workspace={workspace}
            files={localFiles}
            currentFile={localCurrentFile}
            isLoading={localIsLoading}
            onFileSelect={setLocalCurrentFile}
            onCreateFile={createNewFile}
            onDeleteFile={deleteLocalFile}
            onRefreshWorkspace={refreshWorkspace}
            onSelectWorkspace={() => setWorkspaceType(null)}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">{renderEditor()}</div>
      </div>
  <LLMChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default NotesApp;
