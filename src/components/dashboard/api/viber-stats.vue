<template>
  <v-col cols="12" sm="12" md="6" class="high-level-stats">
    <v-row justify="space-between">
      <v-col
        v-for="(item, idx) in items"
        class="col-spacer"
        :key="idx"
        :cols="6"
        :sm="4"
      >
        <Card
          class="pa-2 card-stats top-cards"
          :cardValue="item.value"
          :cardTitle="item.label"
          :color="item.color ? item.color : color"
          :toolTip="item.hasTooltip"
          :tipInfo="item.hasTooltip ? item.tooltip.tipInfo : ''"
          :tipname="item.hasTooltip ? item.tooltip.name : ''"
          :isWide="item.hasTooltip ? item.tooltip.isWide : false"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import Card from '@/components/dashboard/cards/card.vue';
export default {
  props: {
    items: {
      type: [Array, Object],
      default: () => [{}],
    },

    color: {
      type: String,
      default: '',
    },
  },

  components: {
    Card,
  },
};
</script>
