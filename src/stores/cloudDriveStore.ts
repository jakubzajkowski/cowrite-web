import { create } from 'zustand';
import type { CloudFile } from '../types/cloud';

interface CloudDriveState {
  selectedFile: CloudFile | null;
  fileContents: Map<number, string>;
  setSelectedFile: (file: CloudFile | null) => void;
  setFileContent: (fileId: number, content: string) => void;
  getFileContent: (fileId: number) => string;
  clearFileContent: (fileId: number) => void;
  clearAllContents: () => void;
}

export const useCloudDriveStore = create<CloudDriveState>((set, get) => ({
  selectedFile: null,
  fileContents: new Map(),

  setSelectedFile: file => set({ selectedFile: file }),

  setFileContent: (fileId, content) =>
    set(state => {
      const newContents = new Map(state.fileContents);
      newContents.set(fileId, content);
      return { fileContents: newContents };
    }),

  getFileContent: fileId => get().fileContents.get(fileId) ?? '',

  clearFileContent: fileId =>
    set(state => {
      const newContents = new Map(state.fileContents);
      newContents.delete(fileId);
      return { fileContents: newContents };
    }),

  clearAllContents: () => set({ fileContents: new Map(), selectedFile: null }),
}));
