import { useState, useCallback, useEffect } from 'react';
import { set as idbSet, get as idbGet } from 'idb-keyval';

export interface MarkdownFile {
  id: string;
  name: string;
  path: string;
  content: string;
  lastModified: number;
  handle?: FileSystemFileHandle;
}

export interface WorkspaceFolder {
  name: string;
  handle: FileSystemDirectoryHandle;
  path: string;
}

const WORKSPACE_HANDLE_KEY = 'cowrite-workspace-handle';
const CURRENT_FILE_STORAGE_KEY = 'cowrite-current-file';

export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<WorkspaceFolder | null>(null);
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const saveWorkspaceToStorage = useCallback(async (workspaceData: WorkspaceFolder) => {
    try {
      await idbSet(WORKSPACE_HANDLE_KEY, workspaceData.handle);
    } catch (error) {
      console.error('Error saving workspace to IndexedDB:', error);
    }
  }, []);

  const saveCurrentFileToStorage = useCallback((file: MarkdownFile | null) => {
    try {
      if (file) {
        const storageData = {
          id: file.id,
          name: file.name,
          path: file.path,
        };
        localStorage.setItem(CURRENT_FILE_STORAGE_KEY, JSON.stringify(storageData));
      } else {
        localStorage.removeItem(CURRENT_FILE_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving current file to localStorage:', error);
    }
  }, []);

  const restoreWorkspaceFromStorage = useCallback(async () => {
    if (!isFileSystemAccessSupported()) return;

    try {
      const savedHandle = await idbGet(WORKSPACE_HANDLE_KEY);
      if (!savedHandle) return;

      const permission = await savedHandle.queryPermission({ mode: 'readwrite' });
      if (permission === 'granted') {
        const newWorkspace: WorkspaceFolder = {
          name: savedHandle.name,
          handle: savedHandle,
          path: savedHandle.name,
        };
        setWorkspace(newWorkspace);
        await loadFilesFromWorkspace(savedHandle);
      }
    } catch (error) {
      console.error('Error restoring workspace from IndexedDB:', error);
    }
  }, []);

  useEffect(() => {
    restoreWorkspaceFromStorage();
  }, [restoreWorkspaceFromStorage]);

  const isFileSystemAccessSupported = () => {
    return 'showDirectoryPicker' in window;
  };

  const selectWorkspace = useCallback(async () => {
    if (!isFileSystemAccessSupported()) {
      alert('File System Access API is not supported in your browser. Please use Chrome, Edge, or another Chromium-based browser.');
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
      await saveWorkspaceToStorage(newWorkspace);
      await loadFilesFromWorkspace(dirHandle);
    } catch (error) {
      console.error('Error selecting workspace:', error);
    }
  }, [saveWorkspaceToStorage]);

  const loadFilesFromWorkspace = useCallback(async (dirHandle: FileSystemDirectoryHandle) => {
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
  }, []);

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

  const createNewFile = useCallback(async (fileName: string, content = '') => {
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

      setFiles(prev => [...prev, newFile]);
      setCurrentFile(newFile);
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }, [workspace]);

  const saveFile = useCallback(async (file: MarkdownFile, newContent: string) => {
    if (!file.handle) return;

    try {
      const writable = await file.handle.createWritable();
      await writable.write(newContent);
      await writable.close();

      const updatedFile = {
        ...file,
        content: newContent,
        lastModified: Date.now(),
      };

      setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));

      if (currentFile?.id === file.id) {
        setCurrentFile(updatedFile);
      }

      return updatedFile;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }, [currentFile]);

  const deleteFile = useCallback(async (file: MarkdownFile) => {
    if (!workspace || !file.handle) return;

    try {
      await workspace.handle.removeEntry(file.name);
      setFiles(prev => prev.filter(f => f.id !== file.id));

      if (currentFile?.id === file.id) {
        setCurrentFile(null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }, [workspace, currentFile]);

  const refreshWorkspace = useCallback(async () => {
    if (workspace) {
      await loadFilesFromWorkspace(workspace.handle);
    }
  }, [workspace, loadFilesFromWorkspace]);

  const setCurrentFileWithStorage = useCallback((file: MarkdownFile | null) => {
    setCurrentFile(file);
    saveCurrentFileToStorage(file);
  }, [saveCurrentFileToStorage]);

  const restoreCurrentFileFromStorage = useCallback(() => {
    try {
      const storedFile = localStorage.getItem(CURRENT_FILE_STORAGE_KEY);
      if (storedFile) {
        const fileData = JSON.parse(storedFile);
        const foundFile = files.find(f => f.id === fileData.id);
        if (foundFile) {
          setCurrentFile(foundFile);
        }
      }
    } catch (error) {
      console.error('Error restoring current file from localStorage:', error);
    }
  }, [files]);

  useEffect(() => {
    if (files.length > 0) {
      restoreCurrentFileFromStorage();
    }
  }, [files, restoreCurrentFileFromStorage]);

  return {
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
    setCurrentFile: setCurrentFileWithStorage,
  };
};
