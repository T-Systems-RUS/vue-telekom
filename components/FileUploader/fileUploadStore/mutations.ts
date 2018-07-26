import {MutationTree} from 'vuex';
import {FileUploadErrorType, IFileUploadState} from './index';
import {
  ADD_FILES,
  SET_FILE_LOADING,
  SET_FILE_COMPLETED,
  ADD_TEMP_FILES,
  DELETE_FILE,
  DELETE_TEMP_FILE,
  RESET_FILES,
  RESET_TEMP_FILES,
  SET_FILE_DATA_URL,
  SET_FILES,
  SET_TEMP_FILES,
  SET_IMAGE_URL,
  SET_IS_IMAGE_URL,
  SET_IMAGE_STATUS,
  RESET_UPLOAD_ERRORS,
  SET_FILE_UPLOAD_ERROR,
  SET_IS_IMAGE_UPLOAD,
  SET_IS_UPLOAD_MULTIPLE,
  SET_REPLACEMENT_FILES,
  SET_REPLACEMENT_URL, RESET_UPLOAD_REPLACEMENTS, SET_IS_UPLOAD_MODAL_OPEN
} from './mutation-types';
import {FileUploadStatus, IFileUpload} from '../IFileUploadList';
import {FileUploaderService} from '../FileUploaderService';

export const mutations: MutationTree<IFileUploadState> = {
  [ADD_FILES](state, filesUploadList: IFileUpload[]) {
    filesUploadList.forEach((fileUpload: IFileUpload) => {
      if (!FileUploaderService.isFileInUploadList(fileUpload.file, state.files)) {
        state.files.push(fileUpload);
      }
    });
  },
  [ADD_TEMP_FILES](state, filesUploadList: IFileUpload[]) {
    filesUploadList.forEach((fileUpload: IFileUpload) => {
      if (!FileUploaderService.isFileInUploadList(fileUpload.file, state.tempFiles) &&
        !FileUploaderService.isFileInUploadList(fileUpload.file, state.files)) {
        state.tempFiles.push(fileUpload);
      }
    });
  },
  [SET_FILES](state, payload) {
    state.files = payload;
  },
  [SET_TEMP_FILES](state, payload) {
    state.tempFiles = payload;
  },
  [RESET_FILES](state) {
    state.files = [];
  },
  [RESET_TEMP_FILES](state) {
    state.tempFiles = [];
  },
  [DELETE_FILE](state, payload) {
    const index = state.files.indexOf(payload);
    if (index > -1) {
      state.files.splice(index, 1);
    }
  },
  [DELETE_TEMP_FILE](state, payload) {
    const index = state.tempFiles.indexOf(payload);
    if (index > -1) {
      state.tempFiles.splice(index, 1);
    }
  },
  [SET_FILE_LOADING](state, payload) {
    state.files[state.files.indexOf(payload)].loadingStatus = FileUploadStatus.LOADING;
  },
  [SET_FILE_COMPLETED](state, payload) {
    state.files[state.files.indexOf(payload)].loadingStatus = FileUploadStatus.COMPLETED;
  },
  [SET_FILE_DATA_URL](state, {file, dataUrl}) {
    if (state.files.indexOf(file) > -1) {
      state.files[state.files.indexOf(file)].imageDataUrl = dataUrl;
    }
    if (state.tempFiles.indexOf(file) > -1) {
      state.tempFiles[state.tempFiles.indexOf(file)].imageDataUrl = dataUrl;
    }
  },
  [SET_IS_IMAGE_URL](state, payload) {
    state.isImageUrl = payload;
  },
  [SET_IS_IMAGE_UPLOAD](state, payload) {
    state.isImageUpload = payload;
  },
  [SET_IS_UPLOAD_MULTIPLE](state, payload) {
    state.isMultiple = payload;
  },
  [SET_IMAGE_URL](state, payload) {
    state.imageUrl = payload;
  },
  [SET_IMAGE_STATUS](state, payload) {
    state.imageUrl.loadingStatus = payload;
  },
  [RESET_UPLOAD_ERRORS](state) {
    state.errors = {};
  },
  [SET_FILE_UPLOAD_ERROR](state, {errorType, fileName}: { errorType: FileUploadErrorType; fileName: string; }) {
    const error = state.errors[errorType];
    state.errors[errorType] = error instanceof Array ?
      [...error, fileName] :
      [fileName];
  },
  [SET_REPLACEMENT_FILES](state, payload) {
    state.replacementFiles = payload;
  },
  [SET_REPLACEMENT_URL](state, payload) {
    state.replacementUrl = payload;
  },
  [RESET_UPLOAD_REPLACEMENTS](state) {
    state.replacementFiles = [];
    state.replacementUrl = '';
  },
  [SET_IS_UPLOAD_MODAL_OPEN](state, payload: boolean) {
    state.isUploadModalOpen = payload;
  }
};
