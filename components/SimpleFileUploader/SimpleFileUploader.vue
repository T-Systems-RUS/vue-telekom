<i18n src="./SimpleFileUploader.yml"></i18n>

<template>
  <section class="simple-file-uploader">
    <label class="file-uploader-dropbox has-text-centered is-size-6">
      <input
        type="file"
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
      isImageUpload: Boolean
    },
    methods: {
      onFilesChange(files: FileList) {
        const validFiles: File[] = this.validateFiles(files);
        if (this.isImageUpload) {
          FileUploaderService.fileListToImageFileUploadList(validFiles)
            .then((fileUploads: IFileUpload[]) => {
              this.emitFiles(fileUploads);
              this.resetFileInput();
            });
        } else {
          this.emitFiles(FileUploaderService.fileListToFileUploadList(validFiles));
          this.resetFileInput();
        }
      },
      validateFiles(files: FileList): File[] {
        let errors: IFileUploadErrors = {};

        const validFiles: File[] = Array.prototype.filter.call(files, (file: File) => {
          let isValid = true;
          if (!FileUploaderService.validateFileSize(file, FILE_MAX_SIZE)) {
            errors = this.updateErrors(errors, FileUploadErrorType.FILE_SIZE, file.name);
            isValid = false;
          }
          if (this.isImageUpload && !FileUploaderService.validateImageExtension(file.name)) {
            errors = this.updateErrors(errors, FileUploadErrorType.IMAGE_EXTENSION, file.name);
            isValid = false;
          } else if (!FileUploaderService.validateFileExtension(file.name)) {
            errors = this.updateErrors(errors, FileUploadErrorType.FILE_EXTENSION, file.name);
            isValid = false;
          }
          return isValid;
        });

        if (Object.keys(errors).length) {
          this.emitErrors(errors);
        }
        return validFiles;
      },
      resetFileInput() {
        // ref is used because v-model and value cannot be binded to file input
        if (this.$refs.fileInput instanceof HTMLInputElement) {
          this.$refs.fileInput.value = '';
        }
      },
      updateErrors(errors: IFileUploadErrors, errorType: FileUploadErrorType, fileName: string): IFileUploadErrors {
        const error = errors[errorType];
        errors[errorType] = error instanceof Array ?
          [...error, fileName] :
          [fileName];
        return errors;
      },
      emitFiles(files: IFileUpload[]) {
        this.$emit('change', files);
      },
      emitErrors(errors: IFileUploadErrors) {
        console.log(errors);
        this.$emit('error', errors);
      }
    }
  });
</script>

<style lang="scss" scoped>
  $assets_path: '../../styles/assets/';
  @import '../../styles/components/file-uploader-dropbox';
</style>
