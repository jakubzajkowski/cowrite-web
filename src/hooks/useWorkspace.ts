import { useState, useCallback } from 'react';

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

export const useWorkspace = () => {
  const [workspace, setWorkspace] = useState<WorkspaceFolder | null>(null);
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sprawdza czy przeglądarka obsługuje File System Access API
  const isFileSystemAccessSupported = () => {
    return 'showDirectoryPicker' in window;
  };

  // Wybiera folder jako workspace
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
        path: dirHandle.name
      };
      
      setWorkspace(newWorkspace);
      await loadFilesFromWorkspace(dirHandle);
    } catch (error) {
      console.error('Error selecting workspace:', error);
    }
  }, []);

  // Ładuje pliki MD z workspace
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

  // Rekurencyjnie skanuje katalog w poszukiwaniu plików MD
  const scanDirectory = async (
    dirHandle: FileSystemDirectoryHandle, 
    currentPath: string, 
    files: MarkdownFile[]
  ) => {
    for await (const [name, handle] of dirHandle) {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;
      
      if (handle.kind === 'file' && name.toLowerCase().endsWith('.md')) {
        try {
          const file = await handle.getFile();
          const content = await file.text();
          
          files.push({
            id: fullPath,
            name: name,
            path: fullPath,
            content: content,
            lastModified: file.lastModified,
            handle: handle
          });
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      } else if (handle.kind === 'directory') {
        await scanDirectory(handle, fullPath, files);
      }
    }
  };

  // Tworzy nowy plik MD
  const createNewFile = useCallback(async (fileName: string, content = '') => {
    if (!workspace) return;

    try {
      // Upewnij się, że nazwa kończy się na .md
      const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
      
      const fileHandle = await workspace.handle.getFileHandle(finalFileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      const newFile: MarkdownFile = {
        id: finalFileName,
        name: finalFileName,
        path: finalFileName,
        content: content,
        lastModified: Date.now(),
        handle: fileHandle
      };

      setFiles(prev => [...prev, newFile]);
      setCurrentFile(newFile);
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }, [workspace]);

  // Zapisuje plik
  const saveFile = useCallback(async (file: MarkdownFile, newContent: string) => {
    if (!file.handle) return;

    try {
      const writable = await file.handle.createWritable();
      await writable.write(newContent);
      await writable.close();

      const updatedFile = {
        ...file,
        content: newContent,
        lastModified: Date.now()
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

  // Usuwa plik
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

  // Odświeża pliki w workspace
  const refreshWorkspace = useCallback(async () => {
    if (workspace) {
      await loadFilesFromWorkspace(workspace.handle);
    }
  }, [workspace, loadFilesFromWorkspace]);

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
    setCurrentFile,
  };
};