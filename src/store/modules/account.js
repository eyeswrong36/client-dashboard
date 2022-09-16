import { logger } from '@/utils/logger';
import * as utils from '@/utils/request';

const log = logger('store:account');

export default {
  namespaced: true,
  state: {
    userInfo: {},
    isLoading: false,
  },
  actions: {
    /**
     *
     * @param {Object} payload payload.phone
     */
    async otpRequest(_, payload) {
      log('payload', payload);
      const { phone } = payload;
      const res = await utils.request('dashboard-api/api/pin/request', {
        method: 'POST',
        body: {
          phone: phone,
        },
      });

      return res;
    },

    /**
     *
     * @param {Object} payload payload.ref_code payload.pin
     */
    async verifyOTP(_, payload) {
      const { ref_code, pin } = payload;
      const res = await utils.request('dashboard-api/api/pin/verify', {
        method: 'POST',
        body: {
          ref_code: ref_code,
          pin: pin,
        },
      });

      return res;
    },

    async getAccountInfo(ctx) {
      const res = await utils.request('dashboard-api/api/account/info');

      if (res.code === 200) {
        ctx.commit('SET_USER_INFO', res.data);
      }

      return res;
    },

    /**
     * @param {Object} payload
     */
    async updateInfo(_, payload) {
      const { name, number, jobTitle, companyName, companyAddress } = payload;
      const res = await utils.request('dashboard-api/api/account/update', {
        method: 'PUT',
        body: {
          name: name.trim(),
          phone: number.trim(),
          designation: jobTitle.trim(),
          company_name: companyName.trim(),
          company_address: companyAddress.trim(),
        },
      });

      return res;
    },

    /**
     *
     * @param {} ctx
     * @param {Object} payload payload.currentPassword, payload.newPassword
     */
    async onChangePassword(ctx, payload) {
      const { current_password, new_password, confirm_new_password } = payload;
      const res = await utils.request(
        'dashboard-api/api/account/change-password',
        {
          method: 'POST',
          body: {
            current_password: current_password.value,
            new_password: new_password.value,
            confirm_new_password: confirm_new_password.value,
          },
        }
      );

      return res;
    },

    destroyAccount({ commit }) {
      commit('SET_USER_INFO', {});
    },
  },

  mutations: {
    SET_USER_INFO(state, payload) {
      state.userInfo = payload;
    },

    SET_LOADING(state, payload) {
      state.isLoading = payload;
    },
  },

  getters: {
    GET_USER_INFO: (state) => state.userInfo,
    GET_LOADING: (state) => state.isLoading,
  },
};
