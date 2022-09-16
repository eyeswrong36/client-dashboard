<template>
  <div>
    <v-row justify="space-between">
      <v-col
        class="col-spacer"
        v-for="(card, i) in item"
        :key="i"
        :cols="
          (i == 0 && item.length % 2 !== 0 && '12') ||
          (i == 1 && item.length % 2 !== 0 && '6') ||
          (i == 2 && item.length % 2 !== 0 && '6') ||
          (item.length % 2 == 0 && '6')
        "
        :sm="
          (((i == 0 && item.length % 2 !== 0) ||
            (i == 1 && item.length % 2 !== 0)) &&
            '6') ||
          (i == 2 && item.length % 2 !== 0 && '4') ||
          (item.length % 2 == 0 && '6')
        "
      >
        <!-- :cols="item.length % 2 == 0 ? '12' : '6'" -->
        <Card
          class="pa-2 card-stats"
          :class="i > 2 ? 'bottom-cards' : 'top-cards'"
          :cardTitle="card.label"
          :cardValue="card.value"
          :color="color"
          :toolTip="card.tooltip ? true : false"
          :tipname="card.tooltip && card.tooltip.name"
          :tipInfo="card.tooltip ? card.tooltip.tipInfo : ''"
          :isWide="card.tooltip && card.tooltip.isWide"
          :isLarge="true"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Card from '@/components/dashboard/cards/card.vue';
export default {
  props: {
    item: { type: [Array, Object] },
    color: { type: String },
  },
  components: {
    Card,
  },
};
</script>

<style lang="scss" scoped></style>
