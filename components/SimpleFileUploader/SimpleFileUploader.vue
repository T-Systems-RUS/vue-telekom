<i18n src="./SimpleFileUploader.yml"></i18n>

<template>
  <section
    class="simple-file-uploader"
    :class="{'is-disabled': disabled}">
    <label class="file-uploader-dropbox has-text-centered is-size-6">
      <input
        type="file"
        :disabled="disabled"
        ref="fileInput"
        :multiple="isMultiple"
        class="file-uploader-input"
        @change="onFilesChange($event.target.files)">
      <span class="file-uploader-drag centered"/>
      <p>{{ $t('dragFilesHere') }}</p>
      <a>{{ $t('selectFiles') }}</a>
    </label>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {FileUploaderService} from '../FileUploader/FileUploaderService';
  import {IFileUpload} from '../FileUploader/IFileUploadList';
  import {FILE_MAX_SIZE, FileUploadErrorType, IFileUploadErrors} from '../FileUploader/fileUploadStore';

  export default Vue.extend({
    props: {
      isMultiple: Boolean,
      isImageUpload: Boolean,
      allowedFormats: {},
      disabled: Boolean
    },
    methods: {
      onFilesChange(files: FileList) {
        if (this.disabled) {
          this.resetFileInput();
        } else {
          const {validFiles, errors} = this.validateFiles(files);
          if (this.isImageUpload) {
            FileUploaderService.fileListToImageFileUploadList(validFiles)
              .then((fileUploads: IFileUpload[]) => this.emitEvents(fileUploads, errors));
          } else {
            this.emitEvents(FileUploaderService.fileListToFileUploadList(validFiles), errors);
          }
        }
      },
      validateFiles(files: FileList): {validFiles: File[], errors: IFileUploadErrors} {
        let errors: IFileUploadErrors = {};

        const validFiles: File[] = Array.prototype.filter.call(files, (file: File) => {
          let isValid = true;
          if (!FileUploaderService.validateFileSize(file, FILE_MAX_SIZE)) {
            errors = this.updateErrors(errors, FileUploadErrorType.FILE_SIZE, file.name);
            isValid = false;
          }
          if (
            this.allowedFormats &&
            this.allowedFormats instanceof Array &&
            !FileUploaderService.validateCustomExtension(this.allowedFormats, file.name)
          ) {
            errors = this.updateErrors(errors, FileUploadErrorType.CUSTOM_FORMAT, file.name);
            isValid = false;
          } else if (this.isImageUpload && !FileUploaderService.validateImageExtension(file.name)) {
            errors = this.updateErrors(errors, FileUploadErrorType.IMAGE_EXTENSION, file.name);
            isValid = false;
          } else if (!FileUploaderService.validateFileExtension(file.name)) {
            errors = this.updateErrors(errors, FileUploadErrorType.FILE_EXTENSION, file.name);
            isValid = false;
          }
          return isValid;
        });

        return {validFiles, errors};
      },
      updateErrors(errors: IFileUploadErrors, errorType: FileUploadErrorType, fileName: string): IFileUploadErrors {
        const error = errors[errorType];
        errors[errorType] = error instanceof Array ?
          [...error, fileName] :
          [fileName];
        return errors;
      },
      emitEvents(files: IFileUpload[], errors: IFileUploadErrors) {
        this.$emit('change', files);
        if (Object.keys(errors).length) {
          this.$emit('error', errors);
        }
        this.resetFileInput();
      },
      resetFileInput() {
        // ref is used because v-model and value cannot be binded to file input
        if (this.$refs.fileInput instanceof HTMLInputElement) {
          this.$refs.fileInput.value = '';
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  $assets_path: '../../styles/assets/';
  @import '../../styles/components/file-uploader-dropbox';

  .simple-file-uploader {
    &.is-disabled {
      opacity: .5;
      pointer-events: none;
    }
  }
</style>
