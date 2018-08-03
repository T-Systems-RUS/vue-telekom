<i18n src="./SimpleFileList.yml"></i18n>

<template>
  <section
    v-if="(files && files.length) || fileUrl"
    class="simple-file-list upload-file-list"
    :class="{'is-disabled': disabled}">
    <div
      v-if="files && files.length"
      class="simple-files">
      <!--Tiles-->
      <div
        v-if="isTile && isImageUpload"
        class="simple-file-tiles is-flex">
        <div
          v-for="file in files"
          class="simple-file-tile-wrap">
          <div
            :style="{backgroundImage: getBackgroundImage(file)}"
            class="simple-file-tile">
            <span
              v-if="isLoading(file.loadingStatus) || isCompleted(file.loadingStatus)"
              class="tile-status">
              <span
                class="upload-file-status-icon"
                :class="{'is-completed': isCompleted(file.loadingStatus),
                         'is-loading': isLoading(file.loadingStatus)}"/>
            </span>
            <a
              v-else
              @click="handleDelete(file)"
              class="tile-image-delete-btn"
              :class="{'is-disabled': disabled}"/>
          </div>
        </div>
      </div>
      <!--List-->
      <div
        v-else
        class="upload-file-list">
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
              :class="{'is-disabled': disabled || isLoading(file.loadingStatus)}"
              @click="handleDelete(file)"
              role="button">{{ $t('delete') }}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="fileUrl && fileUrl.url">
      <!--Tile-->
      <div
        v-if="isTile && isImageUpload"
        class="simple-file-tiles is-flex">
        <div class="simple-file-tile-wrap">
          <div
            :style="{backgroundImage: getBackgroundImage(fileUrl)}"
            class="simple-file-tile">
            <span
              v-if="isLoading(fileUrl.loadingStatus) || isCompleted(fileUrl.loadingStatus)"
              class="tile-status">
              <span
                class="upload-file-status-icon"
                :class="{'is-completed': isCompleted(fileUrl.loadingStatus),
                         'is-loading': isLoading(fileUrl.loadingStatus)}"/>
            </span>
            <a
              v-else
              @click="handleDeleteFileUrl(fileUrl)"
              class="tile-image-delete-btn"
              :class="{'is-disabled': disabled}"/>
          </div>
        </div>
      </div>
      <div
        v-else
        class="upload-file-item is-flex">
        <div class="upload-file-name is-flex">
          <div class="upload-file-icon">
            <span class="upload-file-preview"/>
          </div>
          <span class="upload-file-name-text">{{ fileUrl.name }}</span>
        </div>
        <div class="upload-file-actions is-flex">
          <span
            class="upload-file-status-icon"
            :class="{'is-completed': isCompleted(fileUrl.loadingStatus),
                     'is-loading': isLoading(fileUrl.loadingStatus)}"/>
          <a
            class="upload-file-delete-btn"
            :class="{'is-disabled': disabled || isLoading(fileUrl.loadingStatus)}"
            @click="handleDeleteFileUrl(fileUrl)"
            role="button">{{ $t('delete') }}</a>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="isConfirmModalOpen"
      @exit="resetModal"
      @confirm="fileToDelete ? deleteFile() : deleteFileUrl()">
      <template slot="modal-title">{{ $t('deleteFileQuestion') }}</template>
      <p
        class="has-text-centered is-size-6"
        slot="modal-body">
        {{ $t('reallyDelete') }} {{ fileToDelete ? fileToDelete.file.name : fileUrl.name }}?
        {{ $t('actionUndone') }}
      </p>
      <template slot="confirm-button-text">{{ $t('deleteFileBtn') }}</template>
    </ConfirmModal>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {FileUploadStatus, IFileUpload, IFileUrl} from '../FileUploader/IFileUploadList';

  interface ISimpleFileListData {
    fileToDelete: IFileUpload|null;
    fileUrlToDelete: IFileUrl|null;
    isConfirmModalOpen: boolean;
  }

  export default Vue.extend({
    data(): ISimpleFileListData {
      return {
        fileToDelete: null,
        fileUrlToDelete: null,
        isConfirmModalOpen: false
      };
    },
    props: {
      files: {},
      isImageUpload: Boolean,
      isTile: Boolean,
      fileUrl: Object,
      disabled: Boolean
    },
    methods: {
      getBackgroundImage(file: IFileUpload|IFileUrl) {
        return file.imageDataUrl ? `url(${file.imageDataUrl})` : '';
      },
      isLoading(status: FileUploadStatus): boolean {
        return status === FileUploadStatus.LOADING;
      },
      isCompleted(status: FileUploadStatus): boolean {
        return status === FileUploadStatus.COMPLETED;
      },
      handleDelete(file: IFileUpload) {
        this.fileToDelete = file;
        this.isConfirmModalOpen = true;
      },
      handleDeleteFileUrl(fileUrl: IFileUrl) {
        this.fileUrlToDelete = fileUrl;
        this.isConfirmModalOpen = true;
      },
      deleteFile() {
        this.$emit('delete', this.fileToDelete);
        this.resetModal();
      },
      deleteFileUrl() {
        if (this.fileUrlToDelete) {
          this.$emit('deleteurl', this.fileUrlToDelete.url);
        }
        this.resetModal();
      },
      resetModal() {
        this.fileToDelete = null;
        this.fileUrlToDelete = null;
        this.isConfirmModalOpen = false;
      }
    }
  });
</script>

<style lang="scss" scoped>
  $assets_path: '../../styles/assets/';

  @import '../../styles/components/file-list';

  // TODO: might need to refactor explicit definition
  $tile-width: 163px;
  $tile-height: 192px;

  .simple-file-list {
    &.is-disabled {
      opacity: .5;
    }
  }

  .simple-file-tiles {
    margin: -$building-unit;
    flex-wrap: wrap;

    .simple-file-tile-wrap {
      padding: $building-unit;
    }

    .simple-file-tile {
      position: relative;
      width: $tile-width;
      height: $tile-height;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: $white;
      background-position: center;

      &::before {
        content: '';
        @include absolute-fit;
        z-index: 1;
        background-color: $gray-38;
        opacity: 0.2;
      }
    }

    .tile-image-delete-btn {
      width: $building-unit-x3;
      height: $building-unit-x3;
      background-size: $building-unit-x2 $building-unit-x2;
      background-color: $white;
      border-radius: 50%;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: url('./assets/trash.svg');
      @include absolute-xy-center;
      transition: $transition-default;
      cursor: pointer;
      z-index: 1;

      &:hover {
        background-color: $gray-237;
      }

      &.is-disabled {
        opacity: .5;
        pointer-events: none;
      }
    }

    .tile-status {
      @include absolute-xy-center;
      z-index: 1;
      width: $building-unit-x3;
      height: $building-unit-x3;
      background-color: $white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      .upload-file-status-icon {
        margin-right: 0;
      }
    }
  }
</style>
