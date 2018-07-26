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

  export default Vue.extend({
    props: {
      isMultiple: Boolean
    },
    methods: {
      onFilesChange(files: FileList) {
        this.$emit('change', FileUploaderService.fileListToFileUploadList(files));
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
</style>
