import { logger } from '@/utils/logger';
import * as utils from '@/utils/request';
import { TAB_MENU } from '@/components/dashboard/constants';

const log = logger('dashboard:account');

/**
 * @typedef {('0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'13'|'14'|'15'|'16'|'17'|'19'|'21')} ServiceId
 * - 0 - SMS All
 * - 1 - SMS Polls
 * - 2 - SMS Queue
 * - 3 - SMS Reach
 * - 4 - SMS Chat
 * - 5 - SMS Pin
 * - 6 - SMS Blast
 * - 7 - SMS API
 * - 8 - SMPP
 * - 9 - SMTP
 * - 10 - SFTP
 * - 11 - Omni
 * - 13 - Messenger
 * - 14 - Viber
 * - 15 - ELoad
 * - 16 - Viber Bot
 * - 17 - Viber API
 * - 18 - Hermes
 * - 21 - HSMS
 */

export default {
  namespaced: true,

  state: {
    dateFilter: {
      startDate: null,
      endDate: null,
    },
    userServices: {},
    tabMenu: TAB_MENU,
    userPlan: {},
  },

  mutations: {
    /**
     *
     * @param {*} state
     * @param {*} payload
     */
    SET_DATE_FILTER(state, payload) {
      const { startDate, endDate } = payload;
      state.dateFilter.startDate = startDate;
      state.dateFilter.endDate = endDate;
    },

    SET_USER_SERVICES(state, payload) {
      state.userServices = payload;
    },

    SET_USER_PLAN(state, payload) {
      state.userPlan = payload;
    },

    SET_TAB_MENU(state, payload) {
      state.tabMenu = payload;
    },
  },

  actions: {
    /**
     *
     * @param {} ctx
     * @param {Object} payload payload.startDate, payload.endDate, payload.serviceId
     */
    async getHighlevelStats(ctx, payload) {
      const { startDate, endDate, serviceId } = payload;
      const res = await utils.request(
        'dashboard-api/api/dashboard/stats/high-level',
        {
          method: 'POST',
          body: {
            date_from: startDate,
            date_to: endDate,
            service_id: serviceId,
          },
        }
      );

      log('getHighlevelStats#res: ', res);
      return res;
    },

    async getServices({ commit, state }) {
      const res = await utils.request('dashboard-api/api/account/services');

      if (res.code === 200) {
        const services = res.data;
        let query = {};
        state.tabMenu = state.tabMenu.map((tab) => {
          /** @var channelName SMS | Viber | Messenger | API */
          const channelName = Object.values(services[tab.channel]);
          /** @var show tab if channel is not empty array */
          const show = channelName.length ? true : false;
          /**
           * set the default @var routeName redirection of API channel base on the services
           * that is available for the current user
           */
          let routeName = tab.routeName;
          if (tab.channel == 'api') {
            const apiChannel = Object.values(services['api']);
            if (apiChannel.length) {
              const service = apiChannel[0]?.toLowerCase();
              const defaultServiceRoute = `dashboard-${service}-api`;
              routeName = apiChannel.length
                ? defaultServiceRoute
                : tab.routeName;
            }
          }

          return {
            ...tab,
            routeName,
            show,
          };
        });

        commit('SET_USER_SERVICES', services);
      }

      return res;
    },

    async getPlan(ctx) {
      const res = await utils.request(
        'dashboard-api/api/dashboard/stats/plan-usage'
      );

      if (res.code === 200) {
        ctx.commit('SET_USER_PLAN', res.data);
      }
      return res;
    },

    /**
     * @param {*} ctx
     * @param {object} payload
     * @param {string} payload.startDate
     * @param {string} payload.endDate
     * @param {ServiceId} payload.serviceId
     *
     * @returns {object}
     */
    async getGraphStats(ctx, payload) {
      const { startDate, endDate, serviceId } = payload;
      const res = await utils.request(
        'dashboard-api/api/dashboard/stats/graph-details',
        {
          method: 'POST',
          body: {
            date_from: startDate,
            date_to: endDate,
            service_id: serviceId,
          },
        }
      );

      log('getGraphStats#res: ', res);
      return res;
    },

    destroyServices({ commit }) {
      commit('SET_USER_SERVICES', {});
      commit('SET_USER_PLAN', {});
      commit('SET_TAB_MENU', TAB_MENU);
      commit('SET_DATE_FILTER', {
        startDate: null,
        endDate: null,
      });
    },
  },

  getters: {
    GET_DATE_FILTER: (state) => state.dateFilter,

    GET_USER_SERVICES: (state) => state.userServices,

    GET_USER_PLAN: (state) => state.userPlan,

    GET_TAB_MENU: (state) => state.tabMenu,
  },
};
