import { useState, useCallback } from 'react';
import type { CloudFile } from '../types/cloud';
import {
  useCloudFiles,
  useCloudFileContent,
  useCreateCloudFile,
  useCloudUpdateFile,
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

  const files = cloudFilesData?.map(mapResponseToCloudFile) ?? [];

  // Merge selected file with loaded content
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
    async (file: CloudFile, content: string) => {
      console.log('💾 Saving file:', file.name);
      await updateFileMutation.mutateAsync(content);
      console.log('✅ File saved successfully');
    },
    [updateFileMutation]
  );

  const deleteFile = useCallback(
    async (file: CloudFile) => {
      // TODO: Implement delete file API
      console.log('Deleting:', file.name);
      await refetch();
    },
    [refetch]
  );

  const uploadFiles = useCallback(
    async (fileList: FileList) => {
      // TODO: Implement upload files API
      console.log(
        'Uploading:',
        Array.from(fileList).map(f => f.name)
      );
      await refetch();
    },
    [refetch]
  );

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
