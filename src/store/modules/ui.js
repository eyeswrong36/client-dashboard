import Vue from 'vue';

/**
 * @typedef {Object} LoaderConfig
 * @property {boolean} loading
 * @property {Object} message
 * @property {Object} message.title
 * @property {Object} message.body
 */

export default {
  namespaced: true,

  state: {
    loading: false,
    loadingMessage: {
      title: '',
      body: '',
    },
    hideNavbar: true,
  },

  mutations: {
    setLoading(state, obj) {
      const { loading, message } = obj || {};
      state.loading = loading || false;
      state.loadingMessage.title = message?.title || '';
      state.loadingMessage.body = message?.body || '';
    },

    setHideNavbar(state, v) {
      state.hideNavbar = v;
    },
  },

  actions: {
    /**
     * @param ctx
     * @param {boolean|string|LoaderConfig} opts
     */
    setLoading(ctx, opts) {
      if (opts == null) throw new Error('Invalid loading options');

      if (typeof opts === 'boolean') opts = { loading: opts };

      if (typeof opts === 'string') {
        opts = { loading: true, message: { message: opts } };
      }

      ctx.commit('setLoading', opts);
    },

    /**
     * @param ctx
     * @param {boolean} v
     */
    setHideNavbar(ctx, v) {
      ctx.commit('setHideNavbar', v);
    },
  },
};

Vue.mixin({
  methods: {
    $setLoading(opts) {
      return store.dispatch('ui/setLoading', opts);
    },
  },
});
