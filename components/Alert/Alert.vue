<i18n src="./Alert.yml"></i18n>

<template>
  <transition name="fade">
    <div
        v-if="alert"
        class="alert"
        :class="{'is-success': isAlertType(alertType.SUCCESS),
           'is-warning': isAlertType(alertType.WARNING),
           'is-hint': isAlertType(alertType.HINT)}">
      <div class="alert-inner container">
        <p
            class="alert-text has-text-centered"
            slot="alert-text">
          <span>{{ $t(alert.text) }}</span>
          <a
              v-if="alert.link"
              @click="alert.link.method">{{ $t(alert.link.text) }}</a>
        </p>
        <button
            v-if="!alert.noCloseBtn"
            @click="resetAlert"
            class="alert-close"/>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {mapMutations, mapGetters} from 'vuex';
  import {ALERT} from './alertStore/getter-types';
  import {RESET_ALERT} from './alertStore/mutation-types';
  import {AlertType} from './alertStore';

  export default Vue.extend({
    data() {
      return {
        alertType: AlertType
      };
    },
    computed: {
      ...mapGetters({
        alert: ALERT
      })
    },
    methods: {
      ...mapMutations({
        resetAlert: RESET_ALERT
      }),
      isAlertType(type: AlertType) {
        return this.alert.type === type;
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '../../styles/components/alert';

  .alert-close {
    background-image: url('./assets/close.svg');
  }
</style>
