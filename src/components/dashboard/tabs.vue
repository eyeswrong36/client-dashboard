<template>
  <div class="page-content-padded c-tabs-container">
    <div class="c-tabs">
      <ul>
        <li v-for="(tab, idx) in tabMenu" :key="idx" v-if="tab.show">
          <router-link
            :to="{ name: tab.routeName }"
            class="c-tab-menu"
            :class="{ active: isActiveRoute(tab.channel) }"
            active-class="active"
            >{{ tab.text }}
          </router-link>
        </li>
      </ul>

      <Datepicker class="ml-auto" />
    </div>
  </div>
</template>
<script>
import Datepicker from '@/components/dashboard/datepicker';
export default {
  name: 'tabs',

  props: {
    tabMenu: {
      type: [Array, Object],
      default: () => [{}],
    },
  },

  components: {
    Datepicker,
  },

  methods: {
    isActiveRoute(channel) {
      return this.$route.meta?.channel == channel || false;
    },
  },
};
</script>
<style lang="scss">
.c-tabs-container {
  .v-btn {
    box-shadow: 0px 4px 15px rgba(101, 101, 101, 0.1) !important;
  }

  .c-tabs {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      flex-flow: wrap;
      justify-content: center;
      ul li:not(:last-child) {
        margin-right: 5.5vw;
      }
      ul li:last-child {
        margin-right: 0;
      }
      .datepicker-container {
        margin-left: 0 !important;
      }
    }

    display: flex;
    align-items: center;
    padding: 21px 0 21px 0;
    ul {
      margin: 0 !important;
      padding: 0 !important;
      li {
        padding: 0;
        list-style-type: none;
        display: inline-block;
        text-decoration: none;
        margin-right: 1rem;
        a.c-tab-menu {
          display: block;
          padding: 1rem;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 500;
          line-height: 16.2px;
          color: #151c36;
          transition: 0.2s all ease-in-out;
          &:not(.active):hover {
            box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.2);
            background: white !important;
          }
          &.active {
            color: #008df0 !important;
            background: rgba(0, 141, 240, 0.1) !important;
          }
        }
      }
    }
  }
}
</style>
