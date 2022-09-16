<template>
  <v-app-bar
    app
    elevation="0"
    color="white"
    class="m360-app-bar"
    :height="68"
    style="box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.07) !important"
  >
    <router-link
      :to="{ name: homeRouteName }"
      class="d-flex align-items-center"
    >
      <img
        alt="M360 Logo"
        src="@/assets/icons/m360-Logo-client-dashboard.png"
      />
    </router-link>

    <NavMenu />

    <v-spacer />

    <Drawer v-if="$phoneView" :onLogout="onLogout" />

    <template v-else>
      <v-divider inset vertical class="c-mr-5" style="color: #f1f1f1" />
      <right-menu
        right
        bottom
        offset-y
        close-on-content-click
        max-width="157px"
        transition="slide-y-transition"
        nudge-bottom="24"
        content-class="app-nav-menu"
      >
        <template #activator="{ on }">
          <div
            v-on="on"
            class="username--label d-flex align-center justify-center cursor-pointer"
          >
            <img src="@/assets/icons/navbar-person-dark.svg" class="c-mr-5" />
            <span class="mr-2">{{ userName }}</span>
            <v-icon color="#151C36">mdi-chevron-down</v-icon>
          </div>
        </template>
        <div class="account-actions">
          <ul>
            <li>
              <router-link :to="{ name: 'account' }" class="link c-mb-5 mt-1"
                >Account Settings</router-link
              >
            </li>
            <li>
              <a :href="`mailto:${emailSupport}`" class="link c-mb-5"
                >Email Support</a
              >
            </li>
            <v-divider class="c-mb-5" />
            <li>
              <span @click="onLogout" class="link cursor-pointer">
                Log Out
              </span>
            </li>
          </ul>
        </div>
      </right-menu>
    </template>

    <Dialog ref="dialog" />
  </v-app-bar>
</template>

<script>
import Dialog from '@/components/common/async-dialog';
import NavMenu from '@/components/menu';
import Drawer from '@/components/menu/drawer';
import RightMenu from '@/components/common/right-menu';
import { logger } from '@/utils/logger';

const log = logger('app-navbar');

export default {
  name: 'AppNavbar',

  components: {
    NavMenu,
    Drawer,
    Dialog,
    RightMenu,
  },

  computed: {
    emailSupport() {
      return process.env.VUE_APP_EMAIL_SUPPORT;
    },

    userName() {
      return this.$store.getters['account/GET_USER_INFO']['name'] ?? '';
    },

    tabMenu() {
      return this.$store.getters['dashboard/GET_TAB_MENU'];
    },

    homeRouteName() {
      for (const tab of this.tabMenu) if (tab.show) return tab.routeName;

      return 'dashboard';
    },
  },

  methods: {
    async onLogout() {
      const routeName = this.$route.name;
      log('onLogout#routeName: ', routeName);

      // Workaround to trigger beforeRouteLeave hook
      if (
        routeName === 'account-edit' ||
        routeName === 'account-change-password'
      ) {
        await this.$router.push({ name: 'account' });
      }

      const dialog = await this.$refs.dialog.show('confirm', {
        isError: true,
        description: 'Are you sure you want to log out?',
        primaryLabel: 'Log Out',
        primaryColor: 'error',
        autoClose: false,
      });
      if (!dialog.confirm) return dialog.close();

      try {
        await this.$store.dispatch('auth/logout');
      } catch (error) {
        console.error(error);
      } finally {
        this.$store.dispatch('auth/clearAuth');
        this.$router.push({ name: 'login' });
      }
    },
  },
};
</script>

<style lang="scss">
.menuable__content__active {
  box-shadow: 0px 4px 15px rgba(101, 101, 101, 0.1) !important;
}
.m360-app-bar {
  z-index: 9 !important;

  .v-toolbar__content {
    margin: auto;
    width: 1440px;
    max-width: 100%;
    padding-left: 4.5%;
    padding-right: 4.5%;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      padding-left: 34px;
      padding-right: 34px;
    }
  }

  .username--label {
    span {
      color: #828282 !important;
      font-size: 12px !important;
      font-weight: 700 !important;
    }
  }
}

.account-actions {
  min-width: 157px;
  padding: 13px 21px !important;
  background: #ffffff;
  border-radius: 5px;
  span,
  ul {
    padding: 0 !important;
    list-style: none;
    li {
      span,
      a {
        text-align: right;
        color: #151c36 !important;
        font-weight: 500;
        font-size: 12px;
        line-height: 16.2px;
        display: block !important;
      }
    }
  }
}

.app-nav-menu {
  border-radius: 8px;
}
</style>
