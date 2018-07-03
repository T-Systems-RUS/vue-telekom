export enum FileUploadStatus {
  NULL = 'NULL',
  LOADING = 'LOADING',
  COMPLETED = 'COMPLETED'
}

export interface IFileUpload {
  file: File;
  loadingStatus: FileUploadStatus;
  imageDataUrl?: string;
}

export interface IImageUrl {
  url: string;
  name: string;
  loadingStatus: FileUploadStatus;
}

