<template>
  <v-toolbar-items
    class="main-menu hidden-sm-and-down c-ml-1 justify-center align-center"
  >
    <div v-for="(menu, idx) in mainMenu" :key="idx">
      <DropdownMenu v-if="menu.dropdown.length && !menu.hide" :menu="menu" />
      <router-link
        v-if="!menu.dropdown.length && !menu.hide"
        :to="{ name: menu.redirect }"
        :class="{ active: menu.isActive }"
        active-class="active"
        class="menu text-dark link"
        >{{ menu.text }}
      </router-link>
    </div>
  </v-toolbar-items>
</template>
<script>
import { mainMenu } from '@/constants';
import DropdownMenu from '@/components/menu/dropdown';
export default {
  components: {
    DropdownMenu,
  },

  data: () => ({
    mainMenu,
  }),

  computed: {
    tabMenu() {
      return this.$store.getters['dashboard/GET_TAB_MENU'];
    },
  },

  mounted() {
    this.setDashboardLink();
  },

  watch: {
    tabMenu: {
      deep: true,
      handler() {
        this.setDashboardLink();
      },
    },

    $route() {
      this.mainMenu = this.mainMenu.map((menu) => {
        const isActive = this.$route.meta?.groupActiveMenu === 'dashboard';
        if (menu.groupActiveMenu === 'dashboard') {
          return {
            ...menu,
            isActive,
          };
        }
        return menu;
      });
    },
  },

  methods: {
    setDashboardLink() {
      for (const tab of this.tabMenu) {
        if (tab.show) {
          this.mainMenu = mainMenu.map((menu) => {
            const isActive = this.$route.meta?.groupActiveMenu === 'dashboard';
            if (menu.text == 'Dashboard') {
              return {
                ...menu,
                redirect: tab.routeName,
                isActive,
              };
            }
            return menu;
          });

          break;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.main-menu {
  display: flex;
  .menu {
    font-size: 12px !important;
    font-weight: 700 !important;
    display: block !important;
    line-height: 23px !important;
    letter-spacing: 0.02em !important;
    padding: 36px 19px;
  }
}
</style>
