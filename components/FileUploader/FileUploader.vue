<i18n src="./FileUploader.yml"></i18n>

<template>
  <div class="file-uploader">
    <div
      @click="setIsUploadModalOpen(true)"
      class="file-uploader-btn-wrap">
      <slot name="open-modal-btn">
        <button class="file-uploader-btn button">
          <slot name="button-text">
            <span>{{ $t('addFiles') }}</span>
          </slot>
        </button>
      </slot>
    </div>

    <FileList
      class="outer-file-list"
      v-if="hasOuterFileList"/>
    <FileUploaderModal
      v-if="isUploadModalOpen"
      @close="setIsUploadModalOpen(false)">
      <slot
        name="upload-title"
        slot="upload-title"/>
      <slot
        name="upload-optional"
        slot="upload-optional"/>
      <slot
        name="upload-info"
        slot="upload-info"/>
      <slot
        name="upload-btn"
        slot="upload-btn"/>
      <slot
        name="upload-btn-text"
        slot="upload-btn-text"/>
      <slot
        name="modal-cancel-btn"
        slot="modal-cancel-btn"/>
    </FileUploaderModal>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {mapGetters, mapMutations} from 'vuex';
  import FileUploaderModal from './FileUploaderModal/FileUploaderModal.vue';
  import FileList from './FileList/FileList.vue';
  import {
    RESET_FILES,
    RESET_TEMP_FILES,
    SET_IMAGE_URL, SET_IS_IMAGE_UPLOAD,
    SET_IS_IMAGE_URL, SET_IS_UPLOAD_MODAL_OPEN, SET_IS_UPLOAD_MULTIPLE
  } from './fileUploadStore/mutation-types';
  import {IMAGE_URL_INITIAL} from './fileUploadStore';
  import {IS_UPLOAD_MODAL_OPEN} from './fileUploadStore/getter-types';

  export default Vue.extend({
    components: {
      FileUploaderModal,
      FileList
    },
    props: {
      isImageUpload: Boolean,
      isMultiple: Boolean,
      hasOuterFileList: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters({
        isUploadModalOpen: IS_UPLOAD_MODAL_OPEN
      })
    },
    methods: {
      ...mapMutations({
        setIsUploadModalOpen: SET_IS_UPLOAD_MODAL_OPEN
      })
    },
    created() {
      this.$store.commit(SET_IS_IMAGE_UPLOAD, this.isImageUpload);
      this.$store.commit(SET_IS_UPLOAD_MULTIPLE, this.isMultiple);
    },
    destroyed() {
      this.$store.commit(RESET_FILES);
      this.$store.commit(RESET_TEMP_FILES);
      this.$store.commit(SET_IMAGE_URL, IMAGE_URL_INITIAL);
      this.$store.commit(SET_IS_IMAGE_URL, false);
      this.$store.commit(SET_IS_IMAGE_UPLOAD, false);
      this.$store.commit(SET_IS_UPLOAD_MULTIPLE, false);
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/base/variables';
  @import '../../styles/utilities/mixins';

  $button-padding-left: $building-unit-x3;
  $button-icon-left: -21px;
  $button-icon-width: 20px;
  $button-icon-height: 15px;
  $file-list-margin-top: 28px;

  $file-icon-size: $building-unit-x2;
  $image-preview-size: $building-unit-x3;

  .file-uploader {
    .file-uploader-btn-wrap {
      display: table;
    }

    .file-uploader-btn {
      padding-left: $button-padding-left;

      span {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          @include absolute-y-center;
          left: $button-icon-left;
          width: $button-icon-width;
          height: $button-icon-height;
          background: center / cover url('assets/download-outline.svg');
        }
      }
    }

    &.is-width-100 {
      .button {
        width: 100%;
      }
    }

    .outer-file-list {
      margin-top: $file-list-margin-top;
    }
  }
</style>
