<template>
  <v-app id="app">
    <global-loader />

    <app-navbar v-if="!hideNavbar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import GlobalLoader from './components/global-loader';
import AppNavbar from './components/app-navbar';
import { logger } from '@/utils/logger';
import { LAST_REQUEST_KEY } from '@/utils/request';

/**
 * 59 mins - 1 sec
 * - Added a 1 second idleTime to reduce app stress
 * - 60mins (36000000ms) is the actual logging off time
 */
const IDLE_LENGTH = 3599000;
const log = logger('app');

export default {
  name: 'App',
  components: { AppNavbar, GlobalLoader },
  data: () => ({
    idleTimer: null,
  }),

  computed: {
    hideNavbar() {
      return this.$store.state.ui.hideNavbar;
    },

    isAuthenticated() {
      return this.$store.getters['auth/IS_AUTHENTICATED'];
    },
  },

  async onIdle() {
    // We only want to check activity when authenticated
    if (!this.isAuthenticated) return;

    this.idleTimer = setInterval(async () => {
      log('onIdle#interval#loggingOut');
      await this.$store.dispatch('auth/logout');
      this.$store.dispatch('auth/clearAuth');
      this.$router.push({ name: 'login' });
    }, IDLE_LENGTH);
  },

  async onActive() {
    // We only want to check activity when authenticated
    if (!this.isAuthenticated) return;

    // Clear current timer
    if (this.idleTimer) clearInterval(this.idleTimer);

    const lastAPICallDateTime = localStorage.getItem(LAST_REQUEST_KEY) ?? 0;
    const timeDiff = new Date().getTime() - parseInt(lastAPICallDateTime);
    log('onIdle#timeDiff: ', timeDiff);

    /**
     * Check last API call time.
     * Refresh token past the 20min from last API inactivity to ensur that
     * We refresh it before it expires, as any page activity should consider
     * the user as active.
     */
    if ((IDLE_LENGTH + 1000) / 3 < timeDiff) {
      log('onIdle#refreshingJwtToken');
      await this.$store.dispatch('auth/refreshJwtToken');
    }
  },

  created() {
    // Repopulate the JWT in store from localStorage
    this.$store.dispatch('auth/repopulateJwtToken');
  },

  beforeDestroy() {
    // don't forget to clear all timers
    if (this.idleTimer) clearInterval(this.idleTimer);
  },
};
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';
#app {
  font-family: 'Satoshi';
}

html {
  overflow-y: auto;
}
</style>
