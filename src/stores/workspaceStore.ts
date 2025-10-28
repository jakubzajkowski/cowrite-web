import { create } from 'zustand';
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

interface WorkspaceState {
  workspace: WorkspaceFolder | null;
  files: MarkdownFile[];
  selectedFile: MarkdownFile | null;
  isLoading: boolean;
  setWorkspace: (workspace: WorkspaceFolder | null) => void;
  setFiles: (files: MarkdownFile[]) => void;
  setSelectedFile: (file: MarkdownFile | null) => void;
  setIsLoading: (loading: boolean) => void;
  addFile: (file: MarkdownFile) => void;
  updateFile: (fileId: string, updates: Partial<MarkdownFile>) => void;
  removeFile: (fileId: string) => void;
  clear: () => void;
}

const WORKSPACE_HANDLE_KEY = 'cowrite-workspace-handle';
const CURRENT_FILE_KEY = 'cowrite-current-file';

export const useWorkspaceStore = create<WorkspaceState>(set => ({
  workspace: null,
  files: [],
  selectedFile: null,
  isLoading: false,

  setWorkspace: workspace => {
    set({ workspace });
    if (workspace) {
      idbSet(WORKSPACE_HANDLE_KEY, workspace.handle).catch(console.error);
    }
  },

  setFiles: files => set({ files }),

  setSelectedFile: file => {
    set({ selectedFile: file });
    if (file) {
      localStorage.setItem(
        CURRENT_FILE_KEY,
        JSON.stringify({ id: file.id, name: file.name, path: file.path })
      );
    } else {
      localStorage.removeItem(CURRENT_FILE_KEY);
    }
  },

  setIsLoading: isLoading => set({ isLoading }),

  addFile: file => set(state => ({ files: [...state.files, file] })),

  updateFile: (fileId, updates) =>
    set(state => ({
      files: state.files.map(f => (f.id === fileId ? { ...f, ...updates } : f)),
      selectedFile:
        state.selectedFile?.id === fileId
          ? { ...state.selectedFile, ...updates }
          : state.selectedFile,
    })),

  removeFile: fileId =>
    set(state => ({
      files: state.files.filter(f => f.id !== fileId),
      selectedFile: state.selectedFile?.id === fileId ? null : state.selectedFile,
    })),

  clear: () => set({ workspace: null, files: [], selectedFile: null, isLoading: false }),
}));

export const restoreWorkspace = async () => {
  if (!('showDirectoryPicker' in window)) return;

  try {
    const savedHandle = await idbGet<FileSystemDirectoryHandle>(WORKSPACE_HANDLE_KEY);
    if (!savedHandle) return;

    const workspace: WorkspaceFolder = {
      name: savedHandle.name,
      handle: savedHandle,
      path: savedHandle.name,
    };

    useWorkspaceStore.getState().setWorkspace(workspace);
    return workspace;
  } catch (error) {
    console.error('Failed to restore workspace:', error);
  }
};

export const restoreSelectedFile = () => {
  try {
    const stored = localStorage.getItem(CURRENT_FILE_KEY);
    if (!stored) return;

    const fileData = JSON.parse(stored);
    const { files } = useWorkspaceStore.getState();
    const file = files.find(f => f.id === fileData.id);

    if (file) {
      useWorkspaceStore.getState().setSelectedFile(file);
    }
  } catch (error) {
    console.error('Failed to restore selected file:', error);
  }
};
