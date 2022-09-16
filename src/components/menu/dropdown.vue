<template>
  <v-menu
    v-if="!$phoneView"
    :offset-y="false"
    :on-hover-open="true"
    :close-on-content-click="true"
    nudge-bottom="0"
    transition="slide-y-transition"
    bottom
    allow-overflow
    v-model="isShow"
  >
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <router-link
          :to="{ name: menu.redirect }"
          :active-class="menu.redirect !== null ? 'active' : ''"
          class="menu text-dark link"
          :class="{
            active: validateActiveFromDropdown(menu.dropdown),
          }"
        >
          {{ menu.text }}
        </router-link>
      </span>
    </template>

    <!-- mega menu -->

    <v-card
      v-if="menu.megamenu"
      flat
      scrollable
      class="solutions-mega-menu d-flex pa-0"
    >
      <div
        class="menu-group-container"
        v-for="(groupMenu, idx) in menu.dropdown"
        :key="idx"
      >
        <h5 class="menu-group-title font-weight-700 font-12 primary--text">
          {{ groupMenu.title }}
        </h5>

        <v-list dense class="menu-list">
          <v-list-item
            v-for="(menu, idxc) in groupMenu.child"
            :key="idxc"
            class="pa-0"
          >
            <v-list-item-content class="pa-0 mb-4">
              <router-link
                :to="{ name: menu.redirect }"
                :active-class="menu.redirect !== null ? 'active' : ''"
                class="menu-text text-dark link-custom"
              >
                <v-list-item-title
                  class="d-flex items-center align-center"
                  style="min-height: 30px"
                >
                  <img :src="menu.icon" width="30" />
                  <span class="menu-text menu-link ml-4">{{ menu.text }}</span>
                </v-list-item-title>
                <p class="menu-desc" v-text="menu.description" />
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-card>

    <!-- standard menu -->

    <v-card v-else flat class="d-flex c-pa-4">
      <v-list dense>
        <v-list-item
          v-for="(menu, idxc) in menu.dropdown"
          :key="idxc"
          class="my-2 d-flex"
          :class="{ 'd-none': menu.hide }"
        >
          <router-link
            :to="{ name: menu.redirect }"
            :active-class="menu.redirect !== null ? 'active' : ''"
            class="menu-text text-dark link flex-grow-1"
          >
            <v-list-item-title class="d-flex items-center align-center">
              <img :src="menu.icon" width="30" />
              <span class="ml-4">{{ menu.text }}</span>
            </v-list-item-title>
          </router-link>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  props: {
    menu: {
      type: [Object, Array],
      default: () => {},
    },
  },

  data: () => ({
    isShow: false,
  }),

  watch: {
    isShow: {
      immediate: true,
      handler(val) {
        val && this.maxHeight();
      },
    },
  },

  methods: {
    validateActiveFromDropdown(dropdown) {
      if (dropdown.find((i) => i.redirect === this.$route.name)) return true;

      for (const childRoutes of dropdown)
        if (typeof childRoutes.parentMenuActiveIn == 'object')
          if (
            childRoutes.parentMenuActiveIn.find(
              (chilRoute) => chilRoute === this.$route.name
            )
          )
            return true;

      return false;
    },

    maxHeight() {
      setTimeout(() => {
        const menu = document.querySelector('.solutions-mega-menu');
        if (menu) menu.style.maxHeight = `${window.innerHeight - 100}px`;
      }, 50);
    },
  },
};
</script>
<style lang="scss" scoped>
.menuable__content__active {
  box-shadow: 0 8px 20.5px 0 rgba(0, 0, 0, 0.099) !important;
}
.solutions-mega-menu {
  padding: 34px 0 12px 0 !important;
  border: none !important;
  overflow-y: auto;
  overflow-x: hidden;
  .menu-group-container {
    width: 400px;
    max-width: 100%;
    position: relative;
    padding: 0 34px 0 34px;
    .menu-group-title {
      height: 24px !important;
      font-size: 12px !important;
      margin-bottom: 16px !important;
    }
    &:not(:last-child)::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      z-index: 999;
      height: 95%;
      min-height: 390px;
      width: 4px;
      border-right: 1px solid #b6b6b6 !important;
      transform: translateY(1%);
    }
  }
  .divider {
    position: absolute;
    right: 0;
    top: 0;
    height: 360px !important;
    transform: translateY(10%);
    color: #b6b6b6 !important;
  }
  .menu-text {
    font-weight: 700 !important;
    font-size: 12px !important;
    line-height: 23.2px !important;
    letter-spacing: 0.02em !important;
  }
  .menu-desc {
    font-size: 14px !important;
    line-height: 18.9px !important;
    font-weight: 400 !important;
    margin-top: 8px !important;
  }
}
.link-custom {
  &:hover,
  &.active {
    .menu-link {
      color: #008df0 !important;
      @media #{map-get($display-breakpoints, 'md-and-up')} {
        text-decoration: underline !important;
        text-decoration-color: #ffb839 !important;
        text-decoration-thickness: 2px !important;
        text-underline-offset: 7px;
      }
    }
  }
}
</style>
