import { logger } from '@/utils/logger';
import * as utils from '@/utils/request';
import { DEVICE_ID_KEY } from '@/views/account/auth/constants';

const log = logger('store:auth');

export default {
  namespaced: true,

  state: {
    jwtToken: '',
    loading: false,
  },

  mutations: {
    setJwtToken(state, token) {
      state.jwtToken = token;
      utils.setJWT(token);
    },

    clearJwtToken(state) {
      state.jwtToken = '';
      utils.removeJWT();
    },

    setLoading(state, v) {
      state.loading = v;
    },
  },

  actions: {
    /**
     * @param ctx
     * @param {object} payload
     * @param {string} payload.username
     * @param {string} payload.password
     * @param {string} payload.device_id
     * @param {boolean} payload.is_remember
     *
     * @returns {object}
     */
    async login({ commit }, payload) {
      log('login#payload: ', payload);
      const opts = {
        method: 'post',
        body: payload,
      };

      const res = await utils.request('dashboard-api/api/login', opts);

      commit('setJwtToken', res.data.token);

      return res;
    },

    /**
     * @param {*} ctx
     * @param {*} payload
     */
    async logout({ dispatch }) {
      const res = await utils.request('dashboard-api/api/logout', {
        method: 'POST',
      });

      log('logout#clearingAuth');
      dispatch('clearAuth');

      return res;
    },

    clearAuth({ commit, dispatch }) {
      commit('clearJwtToken');
      dispatch('account/destroyAccount', null, { root: true });
      dispatch('dashboard/destroyServices', null, { root: true });
    },

    /**
     * @param ctx
     * @param {string} email
     *
     * @returns {object}
     */
    async forgotPassword(ctx, email) {
      log('forgotPassword#email: ', email);
      const res = await utils.request('dashboard-api/api/forgot-password', {
        method: 'post',
        body: { email },
      });

      return res;
    },

    /**
     * @param ctx
     * @param {object} payload
     * @param {number} payload.pin
     * @param {string} payload.username
     * @param {string} payload.password
     * @param {string} payload.ref_code
     * @param {string} payload.device_id
     * @param {boolean} payload.is_remember
     *
     * @returns {object}
     */
    async verify2FA(ctx, payload) {
      log('verify2FA#payload: ', payload);
      const opts = {
        method: 'post',
        body: payload,
      };

      const res = await utils.request(
        'dashboard-api/api/login-verification',
        opts
      );

      ctx.commit('setJwtToken', res.data.token);

      return res;
    },

    /**
     * @param ctx
     * @param {object} payload
     * @param {string} payload.username
     * @param {string} payload.password
     * @param {number} payload.user_id
     *
     * @returns {object}
     */
    async send2FA(ctx, payload) {
      log('send2FA#payload: ', payload);
      const opts = {
        method: 'post',
        body: payload,
      };

      const res = await utils.request(
        'dashboard-api/api/login-otp-resend',
        opts
      );

      return res;
    },

    setLoading(ctx, v) {
      ctx.commit('setLoading', v);
    },

    repopulateJwtToken({ commit }) {
      const token = utils.getJWT();

      if (token) {
        commit('setJwtToken', token);
      } else {
        commit('clearJwtToken');
      }
    },

    async refreshJwtToken({ commit }) {
      const res = await utils.request('dashboard-api/api/refresh', {
        method: 'post',
        body: {
          device_id: localStorage.getItem(DEVICE_ID_KEY),
        },
      });

      log('refreshJwtToken#res: ', res);
      commit('setJwtToken', res.data.token);

      return res;
    },
  },

  getters: {
    IS_AUTHENTICATED(state) {
      return !!state.jwtToken;
    },
  },
};
