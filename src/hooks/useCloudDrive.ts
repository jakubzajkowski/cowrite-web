import { useCallback, useEffect } from 'react';
import type { CloudFile } from '../types/cloud';
import {
  useCloudFiles,
  useCloudFileContent,
  useCreateCloudFile,
  useCloudUpdateFile,
  useDeleteCloudFile,
} from '@/lib/api/hooks';
import type { CloudFileResponse } from '@/lib/api/types';
import { useCloudDriveStore } from '@/stores/cloudDriveStore';

const mapResponseToCloudFile = (response: CloudFileResponse): CloudFile => ({
  id: response.id,
  userId: response.userId,
  name: response.name,
  s3Key: response.s3Key,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt,
  size: response.size,
  tags: response.tags,
  type: 'text/markdown',
  modifiedAt: response.updatedAt,
  content: '',
});

export const useCloudDrive = () => {
  const { selectedFile, setSelectedFile, setFileContent, getFileContent, clearFileContent } =
    useCloudDriveStore();

  const { data: cloudFilesData, isLoading, refetch } = useCloudFiles();
  const { data: fileContentData } = useCloudFileContent(selectedFile?.id || 0);
  const createFileMutation = useCreateCloudFile();
  const updateFileMutation = useCloudUpdateFile(selectedFile?.id || 0);
  const deleteFileMutation = useDeleteCloudFile(selectedFile?.id || 0);

  const files = cloudFilesData?.map(mapResponseToCloudFile) ?? [];

  useEffect(() => {
    if (selectedFile && fileContentData?.content !== undefined) {
      setFileContent(selectedFile.id, fileContentData.content);
    }
  }, [selectedFile, fileContentData, setFileContent]);

  const currentFile = selectedFile
    ? { ...selectedFile, content: getFileContent(selectedFile.id) }
    : null;

  const loadFiles = useCallback(() => refetch(), [refetch]);

  const setCurrentFile = useCallback(
    (file: CloudFile | null) => {
      setSelectedFile(file);
    },
    [setSelectedFile]
  );

  const createFile = useCallback(
    async (fileName: string) => {
      try {
        const newFile = await createFileMutation.mutateAsync({
          name: fileName,
          content: '',
        });
        setFileContent(newFile.noteId, '');
      } catch (error) {
        console.error('Failed to create file:', error);
      }
    },
    [createFileMutation, setFileContent]
  );

  const saveFile = useCallback(
    async (content: string) => {
      if (!selectedFile) return;
      await updateFileMutation.mutateAsync(content);
      setFileContent(selectedFile.id, content);
    },
    [updateFileMutation, selectedFile, setFileContent]
  );

  const deleteFile = useCallback(
    async (file: CloudFile) => {
      await deleteFileMutation.mutateAsync();
      clearFileContent(file.id);
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      await refetch();
    },
    [deleteFileMutation, refetch, selectedFile, setSelectedFile, clearFileContent]
  );

  const uploadFiles = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const downloadFile = useCallback(async (file: CloudFile) => {
    console.log('Downloading:', file.name);
  }, []);

  return {
    files,
    currentFile,
    isLoading,
    setCurrentFile,
    createFile,
    saveFile,
    deleteFile,
    uploadFiles,
    downloadFile,
    loadFiles,
  };
};
