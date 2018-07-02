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
  @import '../../../styles/base/variables';
  @import '../../../styles/utilities/mixins';

  $upload-file-item-margin-bottom: $building-unit-x2;
  $upload-file-icon-margin-right: 8px;
  $upload-image-icon-margin-right: $building-unit;
  $upload-file-icon-size: $building-unit-x2;
  $upload-file-image-size: $building-unit-x3;
  $upload-file-name-right: $building-unit-x2;
  $status-icon-size: $building-unit-x2;
  $status-icon-margin-right: 11px;

  .upload-file-list {
    .upload-file-item {
      width: 100%;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $upload-file-item-margin-bottom;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .upload-file-name {
      padding-right: $upload-file-name-right;
      align-items: center;
    }

    .upload-file-actions {
      flex-shrink: 0;
    }

    .upload-file-preview {
      display: block;
      width: $upload-file-icon-size;
      height: $upload-file-icon-size;
      background: center / contain url('../assets/file-solid.svg') no-repeat;
      margin-right: $upload-file-icon-margin-right;
    }

    .upload-image-preview {
      display: block;
      width: $upload-file-image-size;
      height: $upload-file-image-size;
      background: center / contain no-repeat;
      border-radius: $telekom-radius;
      border: 1px solid $gray-220;
      margin-right: $upload-image-icon-margin-right;
    }

    .upload-file-status-icon {
      display: block;
      margin-right: $status-icon-margin-right;
      width: $status-icon-size;
      height: $status-icon-size;
      background: center / cover no-repeat;

      &.is-completed {
        background-image: url('../assets/check.svg');
      }

      @keyframes loading-animation {
        100% {
          transform: rotate(360deg);
        }
      }

      &.is-loading {
        background-image: url('../assets/loading.svg');
        animation: loading-animation ease .5s infinite;
      }
    }

    .upload-file-delete-btn {
      &.is-disabled {
        opacity: .5;
        pointer-events: none;
      }
    }
  }
</style>
