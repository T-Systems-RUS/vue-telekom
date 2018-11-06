import {FileUploadStatus, IFileUpload, IImageUrl} from './IFileUploadList';

const harmfulFileExtensionRegex = new RegExp('(.|/)(bat|exe|cmd|sh|php([0-9])?|pl|cgi|' +
  '386|dll|com|torrent|js|app|jar|pif|vb|vbscript|wsf|asp|cer|csr|jsp|drv|sys|ade|adp|bas|chm' +
  '|cpl|crt|csh|fxp|hlp|hta|inf|ins|isp|jse|htaccess|htpasswd|ksh|lnk|mdb|mde|mdt|mdw' +
  '|msc|msi|msp|mst|ops|pcd|prg|reg|scr|sct|shb|shs|url|vbe|vbs|wsc|wsf|wsh)$');
const imageFileExtesionRegex = /\.(jpg|jpeg|png)$/;

export class FileUploaderService {
  public static fileListToFileUploadList(fileList: FileList|File[]): IFileUpload[] {
    return Array.prototype.map.call(fileList, (item: File) => FileUploaderService.fileToFileUpload(item));
  }

  public static fileToFileUpload(file: File): IFileUpload {
    return {
      file,
      loadingStatus: FileUploadStatus.NULL,
      imageDataUrl: ''
    };
  }

  public static isFileInUploadList(file: File, fileUploadList: IFileUpload[]): boolean {
    return fileUploadList.some((item: IFileUpload) => item.file.name === file.name);
  }

  public static getFileNameFromUrl(url: string): string {
    return url.split('/').slice(-1)[0];
  }

  public static urlToImageUrl(url: string): IImageUrl {
    return {
      url,
      name: FileUploaderService.getFileNameFromUrl(url),
      loadingStatus: FileUploadStatus.NULL
    };
  }

  // TODO: should be removed when API is working
  public static fakeUploadFiles(): Promise<boolean> {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
  }

  public static validateFileSize(file: File, maxSizeMb: number): boolean {
    return file.size <= this.mbToBytes(maxSizeMb);
  }

  public static validateFileName(fileName: string): boolean {
    return /^[A-zäöüÄÖÜß\s-\d.]*$/.test(fileName);
  }

  public static validateFileExtension(fileName: string): boolean {
    return !harmfulFileExtensionRegex.test(fileName.toLowerCase());
  }

  public static validateImageExtension(fileName: string): boolean {
    return imageFileExtesionRegex.test(fileName.toLowerCase());
  }

  public static validateCustomExtension(extensions: string[], fileName: string): boolean {
    const fileNameParsed = fileName.split('.');
    const fileExtension = fileNameParsed[fileNameParsed.length - 1];
    return extensions.findIndex(ext => ext.toLowerCase() === fileExtension.toLowerCase()) > -1;
  }

  public static readAsDataUrl(file: IFileUpload): Promise<string> {
    return new Promise((resolve, _reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file.file);
    });
  }

  public static fileListToImageFileUploadList(fileList: FileList|File[]): Promise<IFileUpload[]> {
    return Promise.all(Array.prototype.map.call(fileList, (file: File) => {
      const fileUpload: IFileUpload = FileUploaderService.fileToFileUpload(file);
      return this.readAsDataUrl(fileUpload)
        .then((result: string) => {
          fileUpload.imageDataUrl = result;
          return fileUpload;
        });
    }));
  }

  private static mbToBytes(mb: number) {
    return mb * 1024 * 1024;
  }
}
