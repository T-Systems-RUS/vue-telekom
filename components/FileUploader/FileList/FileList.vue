<i18n src="./FileList.yml"></i18n>

<template>
  <section
    class="upload-file-list"
    v-if="files.length || imageUrl.url">
    <div
      v-for="file in files"
      class="upload-file-item is-flex">
      <div class="upload-file-name is-flex">
        <div class="upload-file-icon">
          <span
            v-if="isImageUpload"
            class="upload-image-preview"
            :style="{backgroundImage: getBackgroundImage(file)}"/>
          <span
            v-if="!isImageUpload"
            class="upload-file-preview"/>
        </div>
        <span class="upload-file-name-text">{{ file.file.name }}</span>
      </div>
      <div class="upload-file-actions is-flex">
        <span
          class="upload-file-status-icon"
          :class="{'is-completed': isCompleted(file.loadingStatus), 'is-loading': isLoading(file.loadingStatus)}"/>
        <a
          class="upload-file-delete-btn"
          :class="{'is-disabled': isLoading(file.loadingStatus)}"
          @click="handleDelete(file)"
          role="button">{{ $t('delete') }}</a>
      </div>
    </div>
    <div
      v-if="isImageUpload && imageUrl.url"
      class="upload-file-item is-flex">
      <div class="upload-file-name is-flex">
        <div class="upload-file-icon">
          <span
            class="upload-image-preview"
            :style="{backgroundImage: 'url(' + imageUrl.url + ')'}"/>
        </div>
        <span class="upload-file-name-text">{{ imageUrl.name }}</span>
      </div>
      <div class="upload-file-actions is-flex">
        <span
          class="upload-file-status-icon"
          :class="{'is-completed': isCompleted(imageUrl.loadingStatus),
                   'is-loading': isLoading(imageUrl.loadingStatus)}"/>
        <a
          class="upload-file-delete-btn"
          :class="{'is-disabled': isLoading(imageUrl.loadingStatus)}"
          @click="handleUrlDelete(imageUrl)"
          role="button">{{ $t('delete') }}</a>
      </div>
    </div>

    <ConfirmModal
      v-if="isConfirmModalOpen"
      @exit="handleConfirmFalse"
      @confirm="urlToDelete ? deleteUrl() : deleteFile()">
      <template slot="modal-title">{{ $t('deleteFileQuestion') }}</template>
      <p
        class="has-text-centered is-size-6"
        slot="modal-body">
        {{ $t('reallyDelete') }} {{ fileToDelete.file ? fileToDelete.file.name : imageUrl.name }}?
        {{ $t('actionUndone') }}
      </p>
      <template slot="confirm-button-text">{{ $t('deleteFileBtn') }}</template>
    </ConfirmModal>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {mapGetters} from 'vuex';
  import {
    ALL_UPLOAD_FILES,
    UPLOAD_IMAGE_URL,
    IS_IMAGE_URL,
    IS_IMAGE_UPLOAD
  } from '../fileUploadStore/getter-types';
  import {FileUploadStatus, IFileUpload} from '../IFileUploadList';
  import {DELETE_FROM_ALL_LISTS} from '../fileUploadStore/action-types';
  import {SET_IMAGE_URL} from '../fileUploadStore/mutation-types';
  import {IMAGE_URL_INITIAL} from '../fileUploadStore';

  export default Vue.extend({
    data() {
      return {
        fileToDelete: {},
        urlToDelete: false,
        isConfirmModalOpen: false
      };
    },
    computed: {
      ...mapGetters({
        isImageUrl: IS_IMAGE_URL,
        imageUrl: UPLOAD_IMAGE_URL,
        isImageUpload: IS_IMAGE_UPLOAD
      }),
      files(): IFileUpload[] {
        return this.$store.getters[ALL_UPLOAD_FILES];
      }
    },
    methods: {
      isLoading(status: FileUploadStatus): boolean {
        return status === FileUploadStatus.LOADING;
      },
      isCompleted(status: FileUploadStatus): boolean {
        return status === FileUploadStatus.COMPLETED;
      },
      deleteFile() {
        this.$store.dispatch(DELETE_FROM_ALL_LISTS, this.fileToDelete);
        this.fileToDelete = {};
        this.isConfirmModalOpen = false;
      },
      handleDelete(file: IFileUpload) {
        this.fileToDelete = file;
        this.isConfirmModalOpen = true;
      },
      handleConfirmFalse() {
        this.fileToDelete = {};
        this.urlToDelete = false;
        this.isConfirmModalOpen = false;
      },
      getBackgroundImage(file: IFileUpload) {
        return file.imageDataUrl ? `url(${file.imageDataUrl})` : '';
      },
      handleUrlDelete() {
        this.urlToDelete = true;
        this.isConfirmModalOpen = true;
      },
      deleteUrl() {
        this.$store.commit(SET_IMAGE_URL, IMAGE_URL_INITIAL);
        this.urlToDelete = false;
        this.isConfirmModalOpen = false;
      }
    }
  });
</script>

<style lang="scss" scoped>
  $assets_path: '../../../styles/assets/';

  @import '../../../styles/components/file-list';
</style>
