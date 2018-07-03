import {Module} from 'vuex';
import {ALERT} from './getter-types';
import {RESET_ALERT, SET_ALERT} from './mutation-types';

export enum AlertType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  HINT = 'HINT'
}

export interface IAlertItem {
  text: string,
  type: AlertType
}

interface IAlertState {
  alert: IAlertItem|null
}

const alertState: Module<IAlertState, {}> = {
  state: {
    alert: null
  },
  mutations: {
    [SET_ALERT](state, payload: IAlertItem) {
      state.alert = payload;
    },
    [RESET_ALERT](state) {
      state.alert = null;
    }
  },
  getters: {
    [ALERT]: state => state.alert
  }
};

export default alertState;
