import { useCallback, useEffect } from 'react';
import { useWorkspaceStore, restoreWorkspace, restoreSelectedFile } from '@/stores/workspaceStore';
import type { MarkdownFile, WorkspaceFolder } from '@/stores/workspaceStore';

export type { MarkdownFile, WorkspaceFolder };

export const useWorkspace = () => {
  const {
    workspace,
    files,
    selectedFile,
    isLoading,
    setWorkspace,
    setFiles,
    setSelectedFile,
    setIsLoading,
    addFile,
    updateFile,
    removeFile,
  } = useWorkspaceStore();

  useEffect(() => {
    restoreWorkspace().then(restored => {
      if (restored) {
        loadFilesFromWorkspace(restored.handle);
      }
    });
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      restoreSelectedFile();
    }
  }, [files]);

  const isFileSystemAccessSupported = () => 'showDirectoryPicker' in window;

  const selectWorkspace = useCallback(async () => {
    if (!isFileSystemAccessSupported()) {
      alert(
        'File System Access API is not supported in your browser. Please use Chrome, Edge, or another Chromium-based browser.'
      );
      return;
    }

    try {
      const dirHandle = await window.showDirectoryPicker();
      const newWorkspace: WorkspaceFolder = {
        name: dirHandle.name,
        handle: dirHandle,
        path: dirHandle.name,
      };

      setWorkspace(newWorkspace);
      await loadFilesFromWorkspace(dirHandle);
    } catch (error) {
      console.error('Error selecting workspace:', error);
    }
  }, [setWorkspace]);

  const loadFilesFromWorkspace = useCallback(
    async (dirHandle: FileSystemDirectoryHandle) => {
      setIsLoading(true);
      const markdownFiles: MarkdownFile[] = [];

      try {
        await scanDirectory(dirHandle, '', markdownFiles);
        setFiles(markdownFiles);
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [setFiles, setIsLoading]
  );

  const scanDirectory = async (
    dirHandle: FileSystemDirectoryHandle,
    currentPath: string,
    files: MarkdownFile[]
  ) => {
    // @ts-expect-error: for-await-of is supported in modern browsers
    for await (const [name, handle] of dirHandle) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;

      if (handle.kind === 'file' && name.toLowerCase().endsWith('.md')) {
        try {
          const file = await handle.getFile();
          const content = await file.text();

          files.push({
            id: fullPath,
            name,
            path: fullPath,
            content,
            lastModified: file.lastModified,
            handle,
          });
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      } else if (handle.kind === 'directory') {
        await scanDirectory(handle, fullPath, files);
      }
    }
  };

  const createNewFile = useCallback(
    async (fileName: string, content = '') => {
      if (!workspace) return;

      try {
        const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
        const fileHandle = await workspace.handle.getFileHandle(finalFileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();

        const newFile: MarkdownFile = {
          id: finalFileName,
          name: finalFileName,
          path: finalFileName,
          content,
          lastModified: Date.now(),
          handle: fileHandle,
        };

        addFile(newFile);
        setSelectedFile(newFile);
      } catch (error) {
        console.error('Error creating file:', error);
        throw error;
      }
    },
    [workspace, addFile, setSelectedFile]
  );

  const saveFile = useCallback(
    async (file: MarkdownFile, newContent: string) => {
      if (!file.handle) return;

      try {
        const writable = await file.handle.createWritable();
        await writable.write(newContent);
        await writable.close();

        updateFile(file.id, {
          content: newContent,
          lastModified: Date.now(),
        });
      } catch (error) {
        console.error('Error saving file:', error);
        throw error;
      }
    },
    [updateFile]
  );

  const deleteFile = useCallback(
    async (file: MarkdownFile) => {
      if (!workspace || !file.handle) return;

      try {
        await workspace.handle.removeEntry(file.name);
        removeFile(file.id);
      } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
      }
    },
    [workspace, removeFile]
  );

  const refreshWorkspace = useCallback(async () => {
    if (workspace) {
      await loadFilesFromWorkspace(workspace.handle);
    }
  }, [workspace, loadFilesFromWorkspace]);

  return {
    workspace,
    files,
    currentFile: selectedFile,
    isLoading,
    isFileSystemAccessSupported,
    selectWorkspace,
    createNewFile,
    saveFile,
    deleteFile,
    refreshWorkspace,
    setCurrentFile: setSelectedFile,
  };
};
