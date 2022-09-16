<template>
  <div>
    <v-select
      height="41px"
      v-model="e0"
      :items="services"
      label="Select a service"
      prepend-inner-icon="mdi-filter-outline"
      class="service-select"
      dense
      solo
      v-on:change="filterServices(`${e0}`)"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      e0: '',
    };
  },
  props: {
    services: { type: Array },
    e1: { type: String },
    filterServices: { type: Function },
  },
  mounted() {
    setTimeout(() => {
      this.e0 = this.services[0];
    }, 510);
  },
};
</script>

<style lang="scss" scoped>
.service-select {
  width: 215px;
  @media #{map-get($display-breakpoints, 'xs-only')} {
    width: 100% !important;
    padding: 0 !important;
  }

  ::v-deep .v-input__slot {
    border-bottom: 0 !important;
    box-shadow: 1px 2px 4px rgb(0 0 0 / 0.07) !important;
  }
}
::v-deep .v-list-item:hover:not(.v-list-item--active) {
  color: #008df0 !important;
  caret-color: #008df0 !important;
}
::v-deep .v-text-field__details {
  height: 17px !important;
  padding: 0 !important;
  margin: 0 !important;
}
::v-deep .v-list-item__title {
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 16px !important;
}
::v-deep .v-select__selection {
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 16px !important;
}

::v-deep .v-icon {
  font-size: 21px !important;
}
::v-deep .v-select__selection {
  color: #151c36 !important;
}
</style>
