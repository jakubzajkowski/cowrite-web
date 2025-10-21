export interface CloudFile {
  id: number;
  userId: number;
  name: string;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  tags: string;
  type?: string;
  content?: string;
  modifiedAt?: string;
}
