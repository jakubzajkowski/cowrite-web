export interface CloudFile {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  content?: string;
  url?: string;
}
