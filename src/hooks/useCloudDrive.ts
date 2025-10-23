import { useState, useCallback } from 'react';
import type { CloudFile } from '../types/cloud';
import {
  useCloudFiles,
  useCloudFileContent,
  useCreateCloudFile,
  useCloudUpdateFile,
  useDeleteCloudFile,
} from '@/lib/api/hooks';
import type { CloudFileResponse } from '@/lib/api/types';

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
  const [selectedFile, setSelectedFile] = useState<CloudFile | null>(null);
  const { data: cloudFilesData, isLoading, refetch } = useCloudFiles();
  const { data: fileContentData } = useCloudFileContent(selectedFile?.id || 0);
  const createFileMutation = useCreateCloudFile();
  const updateFileMutation = useCloudUpdateFile(selectedFile?.id || 0);
  const deleteFileMutation = useDeleteCloudFile(selectedFile?.id || 0);

  const files = cloudFilesData?.map(mapResponseToCloudFile) ?? [];

  const currentFile = selectedFile
    ? { ...selectedFile, content: fileContentData?.content ?? '' }
    : null;

  const loadFiles = useCallback(() => refetch(), [refetch]);

  const setCurrentFile = useCallback((file: CloudFile | null) => {
    setSelectedFile(file);
  }, []);

  const createFile = useCallback(
    async (fileName: string) => {
      try {
        await createFileMutation.mutateAsync({
          name: fileName,
          content: '',
        });
      } catch (error) {
        console.error('Failed to create file:', error);
      }
    },
    [createFileMutation]
  );

  const saveFile = useCallback(
    async (content: string) => {
      await updateFileMutation.mutateAsync(content);
    },
    [updateFileMutation]
  );

  const deleteFile = useCallback(
    async (file: CloudFile) => {
      await deleteFileMutation.mutateAsync();
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      await refetch();
    },
    [deleteFileMutation, refetch, selectedFile]
  );

  const uploadFiles = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const downloadFile = useCallback(async (file: CloudFile) => {
    // TODO: Implement download file API
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
