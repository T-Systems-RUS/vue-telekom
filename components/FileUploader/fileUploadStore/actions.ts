import {ActionTree} from 'vuex';
import {FILE_MAX_SIZE, FileUploadErrorType, IFileUploadState, IMAGE_URL_INITIAL} from './index';
import {
  ADD_FILES,
  DELETE_FILE,
  DELETE_TEMP_FILE,
  SET_FILE_LOADING,
  SET_FILE_COMPLETED,
  SET_FILE_DATA_URL,
  SET_IMAGE_STATUS,
  SET_FILE_UPLOAD_ERROR,
  ADD_TEMP_FILES,
  SET_TEMP_FILES,
  RESET_UPLOAD_ERRORS,
  SET_REPLACEMENT_FILES, RESET_TEMP_FILES, SET_IMAGE_URL, RESET_FILES, SET_REPLACEMENT_URL, RESET_UPLOAD_REPLACEMENTS
} from './mutation-types';
import {
  ADD_TEMP_TO_FILES,
  DELETE_FROM_ALL_LISTS,
  HANDLE_FILES_CHANGE,
  HANDLE_MULTIPLE_FILE_CHANGE,
  HANDLE_REPLACE_FILES,
  HANDLE_SINGLE_FILE_CHANGE, HANDLE_URL_CHANGE,
  SET_PREVIEW_IMAGES, UPDATE_REPLACEMENT_FILES, UPDATE_REPLACEMENT_URL,
  UPDATE_TEMP_FILES,
  UPLOAD_FILES,
  VALIDATE_FILES
} from './action-types';
import {FileUploaderService} from '../FileUploaderService';
import {FileUploadStatus, IFileUpload} from '../IFileUploadList';
import {ALL_UPLOAD_FILES} from './getter-types';

export const actions: ActionTree<IFileUploadState, {}> = {
  [ADD_TEMP_TO_FILES]({state, commit}) {
    commit(ADD_FILES, state.tempFiles);
    commit(RESET_TEMP_FILES);
  },
  [UPDATE_TEMP_FILES]({state, dispatch, commit}, payload) {
    dispatch(VALIDATE_FILES, payload)
      .then(fileUploadList => {
        if (fileUploadList.length) {
          commit(state.isMultiple ? ADD_TEMP_FILES : SET_TEMP_FILES, fileUploadList);
        }
      });
  },
  [VALIDATE_FILES]({state, commit}, payload) {
    return payload.filter((item: IFileUpload) => {
      let isValid = true;
      if (!FileUploaderService.validateFileSize(item.file, FILE_MAX_SIZE)) {
        commit(SET_FILE_UPLOAD_ERROR, {errorType: FileUploadErrorType.FILE_SIZE, fileName: item.file.name});
        isValid = false;
      }
      if (state.isImageUpload && !FileUploaderService.validateImageExtension(item.file.name)) {
        commit(SET_FILE_UPLOAD_ERROR, {errorType: FileUploadErrorType.IMAGE_EXTENSION, fileName: item.file.name});
        isValid = false;
      } else if (!FileUploaderService.validateFileExtension(item.file.name)) {
        commit(SET_FILE_UPLOAD_ERROR, {errorType: FileUploadErrorType.FILE_EXTENSION, fileName: item.file.name});
        isValid = false;
      }
      return isValid;
    });
  },
  [DELETE_FROM_ALL_LISTS]({commit}, payload) {
    commit(DELETE_FILE, payload);
    commit(DELETE_TEMP_FILE, payload);
  },
  [UPLOAD_FILES]({commit, state}) {
    // TODO: should be refactored
    if (state.imageUrl.url) {
      commit(SET_IMAGE_STATUS, FileUploadStatus.LOADING);
      return FileUploaderService.fakeUploadFiles()
        .then(() => commit(SET_IMAGE_STATUS, FileUploadStatus.COMPLETED));
    }
    return Promise.all(state.files.map((file: IFileUpload) => {
      commit(SET_FILE_LOADING, file);
      return FileUploaderService.fakeUploadFiles()
        .then(() => commit(SET_FILE_COMPLETED, file));
    }));
  },
  [SET_PREVIEW_IMAGES]({state, commit, getters}) {
    if (state.isImageUpload) {
      getters[ALL_UPLOAD_FILES].forEach((fileUpload: IFileUpload) => {
        if (!fileUpload.imageDataUrl) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            commit(SET_FILE_DATA_URL, {file: fileUpload, dataUrl: reader.result});
          }, false);
          reader.readAsDataURL(fileUpload.file);
        }
      });
    }
  },
  [HANDLE_FILES_CHANGE]({state, commit, dispatch}, payload) {
    commit(RESET_UPLOAD_ERRORS);
    dispatch(
      state.isMultiple ? HANDLE_MULTIPLE_FILE_CHANGE : HANDLE_SINGLE_FILE_CHANGE,
      FileUploaderService.fileListToFileUploadList(payload)
    );
  },
  [HANDLE_MULTIPLE_FILE_CHANGE]({dispatch}, payload) {
    dispatch(UPDATE_TEMP_FILES, payload)
      .then(() => dispatch(SET_PREVIEW_IMAGES));
  },
  [HANDLE_SINGLE_FILE_CHANGE]({state, dispatch, getters}, payload) {
    if (getters[ALL_UPLOAD_FILES].length || state.imageUrl.url) {
      dispatch(UPDATE_REPLACEMENT_FILES, payload);
    } else {
      dispatch(HANDLE_MULTIPLE_FILE_CHANGE, payload);
    }
  },
  [HANDLE_REPLACE_FILES]({state, commit, dispatch}) {
    commit(RESET_FILES);
    if (state.replacementFiles.length) {
      commit(SET_TEMP_FILES, state.replacementFiles);
      commit(SET_IMAGE_URL, IMAGE_URL_INITIAL);
      dispatch(SET_PREVIEW_IMAGES);
    } else if (state.replacementUrl) {
      commit(RESET_TEMP_FILES);
      commit(SET_IMAGE_URL, FileUploaderService.urlToImageUrl(state.replacementUrl));
    }
    commit(RESET_UPLOAD_REPLACEMENTS);
  },
  [UPDATE_REPLACEMENT_FILES]({commit, dispatch}, payload) {
    dispatch(VALIDATE_FILES, payload)
      .then(fileUploadList => {
        commit(SET_REPLACEMENT_FILES, fileUploadList);
      });
  },
  [UPDATE_REPLACEMENT_URL]({commit}, payload) {
    const urlFileName = FileUploaderService.getFileNameFromUrl(payload);
    if (!FileUploaderService.validateImageExtension(urlFileName)) {
      commit(SET_FILE_UPLOAD_ERROR, {errorType: FileUploadErrorType.IMAGE_EXTENSION, fileName: urlFileName});
    } else {
      commit(SET_REPLACEMENT_URL, payload);
    }
  },
  [HANDLE_URL_CHANGE]({state, commit, getters, dispatch}, payload) {
    commit(RESET_UPLOAD_ERRORS);
    dispatch(UPDATE_REPLACEMENT_URL, payload)
      .then(() => {
        if (!getters[ALL_UPLOAD_FILES].length && !state.imageUrl.url) {
          commit(SET_IMAGE_URL, FileUploaderService.urlToImageUrl(state.replacementUrl));
          commit(SET_REPLACEMENT_URL, '');
        }
      });
  }
};
