import {Module} from 'vuex';
import {FileUploadStatus, IFileUpload, IImageUrl} from '../IFileUploadList';
import {mutations} from './mutations';
import {actions} from './actions';
import {
  ALL_UPLOAD_FILES,
  UPLOAD_IMAGE_URL,
  IS_IMAGE_UPLOAD,
  IS_IMAGE_URL,
  IS_UPLOAD_MULTIPLE,
  FILE_UPLOAD_ERRORS,
  HAS_UPLOAD_ERRORS,
  FILE_EXTENSION_ERROR,
  FILE_SIZE_ERROR,
  IMAGE_EXTENSION_ERROR,
  REPLACEMENT_URL,
  REPLACEMENT_FILES,
  HAS_UPLOAD_REPLACEMENTS, IS_UPLOAD_MODAL_OPEN
} from './getter-types';

export enum FileUploadErrorType {
  FILE_SIZE = 'FILE_SIZE',
  FILE_EXTENSION = 'FILE_EXTENSION',
  IMAGE_EXTENSION = 'IMAGE_EXTENSION',
  CUSTOM_FORMAT = 'CUSTOM_FORMAT'
}

export type IFileUploadErrors = {
  [k in FileUploadErrorType]?: string[] // file names
};

export interface IFileUploadState {
  isImageUpload: boolean;
  isMultiple: boolean;
  isUploadModalOpen: boolean;
  files: IFileUpload[];
  tempFiles: IFileUpload[];
  isImageUrl: boolean;
  imageUrl: IImageUrl;
  replacementFiles: IFileUpload[];
  replacementUrl: string;
  errors: IFileUploadErrors;
}

export const IMAGE_URL_INITIAL = {
  url: '',
  name: '',
  loadingStatus: FileUploadStatus.NULL
};

export const FILE_MAX_SIZE = 10485760; // 10Mb

const fileUploadState: Module<IFileUploadState, {}> = {
  state: {
    files: [],
    tempFiles: [],
    isImageUpload: false,
    isMultiple: false,
    isUploadModalOpen: false,
    isImageUrl: false,
    imageUrl: IMAGE_URL_INITIAL,
    replacementFiles: [],
    replacementUrl: '',
    errors: {}
  },
  mutations,
  actions,
  getters: {
    [ALL_UPLOAD_FILES]: state => [...state.files, ...state.tempFiles],
    [UPLOAD_IMAGE_URL]: state => state.imageUrl,
    [IS_IMAGE_URL]: state => state.isImageUrl,
    [IS_IMAGE_UPLOAD]: state => state.isImageUpload,
    [IS_UPLOAD_MULTIPLE]: state => state.isMultiple,
    [IS_UPLOAD_MODAL_OPEN]: state => state.isUploadModalOpen,
    [FILE_UPLOAD_ERRORS]: state => state.errors,
    [FILE_EXTENSION_ERROR]: state => state.errors[FileUploadErrorType.FILE_EXTENSION],
    [FILE_SIZE_ERROR]: state => state.errors[FileUploadErrorType.FILE_SIZE],
    [IMAGE_EXTENSION_ERROR]: state => state.errors[FileUploadErrorType.IMAGE_EXTENSION],
    [HAS_UPLOAD_ERRORS]: state => Boolean(Object.keys(state.errors).length),
    [REPLACEMENT_FILES]: state => state.replacementFiles,
    [REPLACEMENT_URL]: state => state.replacementUrl,
    [HAS_UPLOAD_REPLACEMENTS]: state => state.replacementFiles.length || state.replacementUrl
  }
};

export default fileUploadState;
