import {FileUploadStatus, IFileUpload, IImageUrl} from './IFileUploadList';

const harmfulFileExtensionRegex = new RegExp('(.|/)(bat|exe|cmd|sh|php([0-9])?|pl|cgi|' +
  '386|dll|com|torrent|js|app|jar|pif|vb|vbscript|wsf|asp|cer|csr|jsp|drv|sys|ade|adp|bas|chm' +
  '|cpl|crt|csh|fxp|hlp|hta|inf|ins|isp|jse|htaccess|htpasswd|ksh|lnk|mdb|mde|mdt|mdw' +
  '|msc|msi|msp|mst|ops|pcd|prg|reg|scr|sct|shb|shs|url|vbe|vbs|wsc|wsf|wsh)$');
const imageFileExtesionRegex = /\.(jpg|jpeg|png)$/;

export class FileUploaderService {
  static fileListToFileUploadList(fileList: FileList|File[]): IFileUpload[] {
    return Array.prototype.map.call(fileList, (item: File) => FileUploaderService.fileToFileUpload(item));
  }

  static fileToFileUpload(file: File): IFileUpload {
    return {
      file,
      loadingStatus: FileUploadStatus.NULL,
      imageDataUrl: ''
    };
  }

  static isFileInUploadList(file: File, fileUploadList: IFileUpload[]): boolean {
    return fileUploadList.some((item: IFileUpload) => item.file.name === file.name);
  }

  static getFileNameFromUrl(url: string): string {
    return url.split('/').slice(-1)[0];
  }

  static urlToImageUrl(url: string): IImageUrl {
    return {
      url,
      name: FileUploaderService.getFileNameFromUrl(url),
      loadingStatus: FileUploadStatus.NULL
    };
  }

  // TODO: should be removed when API is working
  static fakeUploadFiles(): Promise<boolean> {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
  }

  static validateFileSize(file: File, maxSizeMb: number): boolean {
    return file.size <= this.mbToBytes(maxSizeMb);
  }

  static validateFileExtension(fileName: string): boolean {
    return !harmfulFileExtensionRegex.test(fileName.toLowerCase());
  }

  static validateImageExtension(fileName: string): boolean {
    return imageFileExtesionRegex.test(fileName.toLowerCase());
  }

  static validateCustomExtension(extensions: string[], fileName: string): boolean {
    const fileNameParsed = fileName.split('.');
    const fileExtension = fileNameParsed[fileNameParsed.length - 1];
    return extensions.findIndex(ext => ext.toLowerCase() === fileExtension.toLowerCase()) > -1;
  }

  static readAsDataUrl(file: IFileUpload): Promise<string> {
    // tslint:disable-next-line
    return new Promise((resolve, _reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file.file);
    });
  }

  static fileListToImageFileUploadList(fileList: FileList|File[]): Promise<IFileUpload[]> {
    // to avoid strange type error:
    // Type 'Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>' is not assignable to type 'Promise<IFileUpload[]>'
    // @ts-ignore
    return Promise.all(Array.prototype.map.call(fileList, (file: File) => {
      const fileUpload: IFileUpload = FileUploaderService.fileToFileUpload(file);
      return this.readAsDataUrl(fileUpload)
        .then((imageDataUrl: string): IFileUpload => ({...fileUpload, imageDataUrl}));
    }));
  }

  private static mbToBytes(mb: number) {
    return mb * 1024 * 1024;
  }
}
