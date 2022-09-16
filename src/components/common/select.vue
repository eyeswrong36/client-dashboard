<template>
  <v-select
    solo
    dense
    height="41px"
    class="select"
    v-model="model"
    :value="value"
    :items="options"
    :label="label"
    :multiple="multiple"
    :attach="attach"
    :item-text="itemText"
    :item-value="itemValue"
    :prepend-inner-icon="prependInnerIcon"
    @change="onChange"
  >
    <template v-if="multiple" v-slot:selection="{ item, index }">
      <span class="mr-2" v-if="index === 0">{{ item[itemText] }}</span>
      <span v-if="index === 1" class="grey--text text-caption">
        (+{{ value.length - 1 }} others)
      </span>
    </template>
  </v-select>
</template>

<script>
import { useModel } from '@/utils/vue';
export default {
  props: {
    label: {
      type: String,
      default: 'Select',
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    attach: {
      type: Boolean,
      default: false,
    },

    options: {
      type: [Array, Object],
      default: () => [],
    },

    itemValue: {
      type: String,
      default: 'value',
    },

    itemText: {
      type: String,
      default: 'value',
    },

    prependInnerIcon: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    value: '',
  }),

  computed: {
    model: useModel(),
  },

  methods: {
    onChange(val) {
      this.value = val;
      this.$emit('onChange', val);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item__action {
  margin-right: 8px !important;
}

.select {
  width: 215px;
  font-weight: 500 !important;
  font-size: 12px;
  line-height: 16px;

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
  padding-left: 4px !important;
}

::v-deep .v-icon {
  font-size: 21px !important;
}
</style>
