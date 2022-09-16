import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const persistState = createPersistedState({
  paths: ['account', 'dashboard'],
});

export default new Vuex.Store({
  modules,
  plugins: [persistState],
});
