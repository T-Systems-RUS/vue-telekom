<i18n src="./FileUploaderModal.yml"></i18n>

<template>
  <CommonModal
    class="file-uploader-modal"
    @exit="closeWithoutSaving">
    <slot
      name="upload-title"
      slot="modal-title">{{ $t('uploadFiles') }}
    </slot>
    <p
      slot="modal-subtitle"
      class="file-uploader-modal-optional has-text-centered is-size-5 is-size-6-mobile">
      <slot name="upload-optional">{{ $t('defaultOptional') }}</slot>
    </p>
    <div
      class="file-uploader-modal-content centered"
      slot="modal-content">
      <ErrorMessage
        :title="$t('fileNotUploadedError')"
        v-if="hasError">
        <p
          class="title is-7 is-regular is-marginless"
          v-if="fileSizeError">
          <b>{{ getInvalidFileNames(fileSizeError) }}</b>:
          {{ $t('fileSizeError') }}
        </p>
        <p
          class="title is-7 is-regular is-marginless"
          v-if="fileExtensionError">
          <b>{{ getInvalidFileNames(fileExtensionError) }}</b>:
          {{ $t('fileExtensionError') }}
        </p>
        <p
          class="title is-7 is-regular"
          v-if="imageExtensionError">
          <b>{{ getInvalidFileNames(imageExtensionError) }}</b>:
          {{ $t('imageExtensionError') }}
        </p>
      </ErrorMessage>
      <div
        class="image-uploader-tabs-wrap is-flex"
        v-if="isImageUpload && !isMultiple">
        <div class="image-uploader-tabs is-flex">
          <span
            class="is-size-6"
            @click="isImageUrl = false"
            :class="{'is-active': !isImageUrl}">{{ $t('uploadImage') }}</span>
          <span
            class="is-size-6"
            @click="isImageUrl = true"
            :class="{'is-active': isImageUrl}">{{ $t('addUrl') }}</span>
        </div>
      </div>
      <div
        v-if="!isImageUrl"
        class="file-uploader-common-upload">
        <div class="file-uploader-modal-info">
          <slot name="upload-info">
            <h3 class="title is-5 is-bold">{{ $t('addFiles') }}</h3>
            <p class="is-size-6">{{ $t('filesInfo') }}</p>
          </slot>
        </div>
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
      </div>
      <div
        v-if="isImageUrl"
        class="image-uploader-url-upload">
        <div class="field centered">
          <label class="label is-pulled-left">
            {{ $t('imageUrl') }}:
          </label>
          <div class="control">
            <input
              :placeholder="$t('exampleUrl')"
              @change="handleUrlChange($event.target.value)"
              name="customText"
              class="input"
              type="text">
          </div>
        </div>
      </div>
      <div class="file-uploader-modal-list">
        <FileList/>
      </div>
      <div class="file-uploader-modal-add has-text-centered">
        <slot name="upload-btn">
          <button
            :disabled="!isButtonActive"
            class="button is-primary is-large"
            @click="addFiles">
            <slot name="upload-btn-text">{{ $t('addFilesBtn') }}</slot>
          </button>
        </slot>
      </div>
      <div
        slot="modal-cancel-btn"
        v-if="!isImageUpload"
        class="file-uploader-modal-skip has-text-centered">
        <a @click="closeWithoutSaving">{{ $t('skipThisStep') }}</a>
      </div>
      <ConfirmModal
        v-if="isReplaceModalOpen && !isMultiple"
        @exit="closeReplaceModal"
        @confirm="handleReplaceFiles">
        <template slot="modal-title">
          {{ $t('replaceImageQuestion') }}
        </template>
        <p
          class="has-text-centered is-size-6"
          slot="modal-body">
          {{ $t('reallyReplace') }} {{ files[0] ? files[0].file.name : imageUrl.name }}? {{ $t('actionUndone') }}
        </p>
        <template slot="confirm-button-text">{{ $t('replaceImageBtn') }}</template>
      </ConfirmModal>
    </div>
  </CommonModal>
</template>

<script lang="ts">
  import Vue from 'vue';
  import FileList from '../FileList/FileList.vue';
  import {
    RESET_TEMP_FILES, SET_IS_IMAGE_URL,
    RESET_UPLOAD_ERRORS, RESET_UPLOAD_REPLACEMENTS
  } from '../fileUploadStore/mutation-types';
  import {
    ADD_TEMP_TO_FILES,
    SET_PREVIEW_IMAGES,
    HANDLE_FILES_CHANGE,
    HANDLE_URL_CHANGE,
    HANDLE_REPLACE_FILES
  } from '../fileUploadStore/action-types';
  import {
    ALL_UPLOAD_FILES,
    FILE_EXTENSION_ERROR,
    IMAGE_EXTENSION_ERROR,
    FILE_SIZE_ERROR,
    UPLOAD_IMAGE_URL,
    IS_IMAGE_URL,
    IS_IMAGE_UPLOAD,
    IS_UPLOAD_MULTIPLE,
    HAS_UPLOAD_ERRORS, HAS_UPLOAD_REPLACEMENTS
  } from '../fileUploadStore/getter-types';
  import {IFileUpload, IImageUrl} from '../IFileUploadList';

  export default Vue.extend({
    components: {
      FileList
    },
    destroyed() {
      this.resetErrors();
    },
    computed: {
      files(): IFileUpload[] {
        return this.$store.getters[ALL_UPLOAD_FILES];
      },
      isImageUrl: {
        get(): boolean {
          return this.$store.getters[IS_IMAGE_URL];
        },
        set(val: boolean) {
          this.$store.commit(SET_IS_IMAGE_URL, val);
        }
      },
      imageUrl(): IImageUrl {
        return this.$store.getters[UPLOAD_IMAGE_URL];
      },
      hasError(): boolean {
        return this.$store.getters[HAS_UPLOAD_ERRORS];
      },
      isImageUpload(): boolean {
        return this.$store.getters[IS_IMAGE_UPLOAD];
      },
      isMultiple(): boolean {
        return this.$store.getters[IS_UPLOAD_MULTIPLE];
      },
      fileExtensionError(): string[] {
        return this.$store.getters[FILE_EXTENSION_ERROR];
      },
      imageExtensionError(): string[] {
        return this.$store.getters[IMAGE_EXTENSION_ERROR];
      },
      fileSizeError(): string[] {
        return this.$store.getters[FILE_SIZE_ERROR];
      },
      isButtonActive(): boolean {
        return Boolean(
          this.isImageUpload ?
            this.imageUrl.url || this.files.length :
            this.files.length
        );
      },
      isReplaceModalOpen(): boolean {
        return this.$store.getters[HAS_UPLOAD_REPLACEMENTS];
      }
    },
    methods: {
      onFilesChange(files: FileList) {
        this.$store.dispatch(HANDLE_FILES_CHANGE, files);
        this.resetFileInput();
      },
      resetErrors() {
        this.$store.commit(RESET_UPLOAD_ERRORS);
      },
      getInvalidFileNames(fileNames: string[]) {
        return fileNames.join(', ');
      },
      handleReplaceFiles() {
        this.$store.dispatch(HANDLE_REPLACE_FILES);
      },
      handleUrlChange(url: string) {
        this.$store.dispatch(HANDLE_URL_CHANGE, url);
      },
      closeReplaceModal() {
        this.$store.commit(RESET_UPLOAD_REPLACEMENTS);
      },
      addFiles() {
        this.$store.dispatch(ADD_TEMP_TO_FILES);
        this.$emit('close');
      },
      closeWithoutSaving() {
        this.$store.commit(RESET_TEMP_FILES);
        this.$emit('close');
      },
      setPreviewImages() {
        this.$store.dispatch(SET_PREVIEW_IMAGES);
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
  @import '../../../styles/base/variables';
  @import '../../../styles/utilities/transitions';
  @import '../../../styles/utilities/mixins';

  $assets_path: '../../../styles/assets/';

  @import '../../../styles/components/file-uploader-dropbox';

  $modal-border-top: 4px solid $magenta;
  $modal-content-width: $container-min-width;
  $title-margin-bottom: $building-unit-x2;
  $optional-margin-bottom: $building-unit-x4 + $building-unit-x0_5;
  $subtitle-margin-bottom: $building-unit-x0_5;
  $info-margin-bottom: $building-unit-x2;

  $list-margin-bottom: 50px;
  $list-margin-bottom-mobile: $building-unit-x3;
  $add-margin-bottom: $building-unit-x1_5;

  $image-tabs-padding: 0 30px;
  $image-tabs-border-size: 1px;
  $image-tab-padding: $building-unit $building-unit-x0_5;
  $image-tab-border-height: $building-unit-x0_25;

  .file-uploader-modal {
    align-items: flex-start;

    .modal-background {
      background: $white;
      border-top: $modal-border-top;
    }

    .container {
      justify-content: center;
      width: 100%;
    }

    &-content {
      width: $modal-content-width;

      @include mobile {
        width: 100%;
      }
    }

    &-optional {
      font-weight: $font-weight-medium;
      margin-bottom: $optional-margin-bottom;
    }

    h3 {
      margin-bottom: $subtitle-margin-bottom;
    }

    &-info {
      margin-bottom: $info-margin-bottom;
    }

    &-list {
      margin-bottom: $list-margin-bottom;

      @include mobile {
        margin-bottom: $list-margin-bottom-mobile;
      }
    }

    &-add {
      margin-bottom: $add-margin-bottom;
    }

    .image-uploader-tabs-wrap {
      justify-content: center;
      margin-bottom: $building-unit-x3;
    }

    .image-uploader-tabs {
      padding: $image-tabs-padding;
      border-bottom: $image-tabs-border-size solid $gray-220;

      span {
        padding: $image-tab-padding;
        margin-right: $building-unit-x2;
        position: relative;
        transition: $transition-default;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -$image-tabs-border-size;
          height: $image-tab-border-height;
          transition: $transition-default;
        }

        &.is-active {
          color: $magenta;

          &::after {
            background: $magenta;
          }
        }
      }
    }

    .image-uploader-url-upload {
      margin-bottom: $building-unit-x3;
    }
  }
</style>
