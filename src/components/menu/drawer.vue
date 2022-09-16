<template>
  <div>
    <v-app-bar-nav-icon
      class="mr-n4"
      color="primary"
      @click.stop="drawer = true"
    />
    <v-dialog
      v-model="drawer"
      fullscreen
      hide-overlay
      transition="dialog-right-transition"
    >
      <v-card tile color="white" class="d-flex flex-column">
        <div>
          <v-toolbar dark flat color="white" :height="$largeView ? 90 : 86">
            <v-spacer />
            <v-btn icon dark @click.stop="drawer = !drawer" class="mr-0">
              <v-icon large color="primary">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list color="white" class="drawer-menu py-0">
            <v-list-group
              v-for="(menu, idx) in mainMenu"
              :key="idx"
              :append-icon="!menu.dropdown.length ? '' : '$expand'"
              :class="{ 'd-none': menu.hide }"
            >
              <template v-slot:activator>
                <v-list-item class="py-1" style="padding: 1.05rem">
                  <v-list-item-title>
                    <h3
                      class="normal-text-spacing white--text"
                      style="line-height: 27px"
                    >
                      <router-link
                        class="text-dark"
                        @click.native="drawer = !drawer"
                        :to="{ name: menu.redirect }"
                        style="
                          display: block;
                          padding: 12px 0;
                          background-color: transparent !important;
                        "
                        >{{ menu.text }}</router-link
                      >
                    </h3>
                  </v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item v-if="menu.dropdown.length">
                <v-list-item-content style="padding: 0">
                  <v-list
                    v-for="(dropdown, idxc) in menu.dropdown"
                    :key="idxc"
                    subheader
                    style="padding: 0; margin: 0 !important"
                  >
                    <v-list-item
                      :to="{ name: dropdown.redirect }"
                      @click.stop="drawer = !drawer"
                      :class="{ 'd-none': dropdown.hide }"
                    >
                      <v-list-item-title
                        class="d-flex items-center align-center"
                        style="min-height: 30px"
                      >
                        <img :src="dropdown.icon" width="30" />
                        <span
                          class="ml-4 menu-text text-dark link"
                          v-text="dropdown.text"
                        />
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </div>

        <v-list color="primary" class="flex-grow-1 user-dropdown py-5">
          <v-list-group append-icon="$expand" v-model="isExpaned">
            <template v-slot:activator>
              <v-list-item class="py-1" style="color: transparent !important">
                <v-list-item-title>
                  <div class="d-flex align-center justify-center">
                    <img
                      src="@/assets/icons/navbar-person-white.svg"
                      class="mr-3"
                    />
                    <p class="mr-2 username">{{ userName }}</p>
                  </div>
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item class="pa-0">
              <v-list-item-content class="pa-0 ml-11">
                <v-list class="pa-0" style="background-color: transparent">
                  <v-list-item>
                    <v-list-item-title>
                      <router-link
                        :to="{ name: 'account' }"
                        class="menu-item"
                        @click.native="drawer = !drawer"
                        >Account Settings</router-link
                      >
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <a :href="`mailto:${emailSupport}`" class="menu-item"
                        >Email Support</a
                      >
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider
                    class="ml-4 my-3"
                    color="#fffff"
                    style="width: 170px"
                  />
                  <v-list-item>
                    <v-list-item-title
                      ><a
                        href="javascript:void(0)"
                        @click="onLogout"
                        class="menu-item"
                        >Log Out</a
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mainMenu } from '@/constants';
export default {
  props: {
    onLogout: {
      type: Function,
      default: () => {},
    },
  },

  data: () => ({
    drawer: false,
    mainMenu,
    isExpaned: true,
  }),

  computed: {
    emailSupport() {
      return process.env.VUE_APP_EMAIL_SUPPORT;
    },

    userName() {
      return this.$store.getters['account/GET_USER_INFO']['name'] || '';
    },
  },
};
</script>
<style lang="scss">
.user-dropdown {
  .username {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #ffffff !important;
  }
  .menu-item {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    color: #ffffff !important;
    display: block;
    padding: 16px 16px 16px 0;
    width: 150px;
  }

  .v-list-item {
    width: fit-content !important;
    .v-list-item__icon {
      margin-left: -0.9rem !important;
      .v-icon {
        color: #ffffff !important;
        font-size: 28px !important;
        transform: rotate(-90deg) !important;
        margin-right: 1rem;
      }
    }
  }

  .v-list-group--active > .v-list-group__header .v-icon {
    transform: rotate(0deg) !important;
    margin-right: 1rem !important;
  }
}

.drawer-menu {
  min-height: calc(50vh - 90px) !important;
  .sub-header {
    font-weight: 700 !important;
    font-size: 12px !important;
    line-height: 16px !important;
    letter-spacing: 0.02em !important;
    color: #151c36 !important;
    margin-left: 0.1rem !important;
    margin-bottom: 0.1rem !important;
  }

  .menu-text {
    font-size: 16px;
    line-height: 16px;
    font-weight: 500;
  }

  .v-list-item {
    width: fit-content !important;
    display: flex;
    flex-grow: none !important;
    .v-list-item__icon {
      margin-left: -0.9rem !important;
      .v-icon {
        color: #008df0 !important;
        font-size: 34px !important;
        transform: rotate(-90deg) !important;
        margin-right: 1rem;
      }
    }
  }

  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: transparent !important;
  }

  .v-list-group--active > .v-list-group__header .v-icon {
    transform: rotate(0deg) !important;
    margin-right: 1rem !important;
  }
}

.v-list-item {
  &.v-list-item--active {
    color: transparent !important;
  }
  &:hover {
    color: transparent !important;
  }
}
</style>
