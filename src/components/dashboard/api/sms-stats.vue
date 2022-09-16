<template>
  <v-col>
    <v-row justify="space-between">
      <v-col
        v-for="(item, idx) in items"
        :key="idx"
        cols="12"
        sm="6"
        class="col-spacer"
      >
        <Card
          :color="color"
          :cardTitle="item.label"
          :cardValue="item.value || 0"
          class="pa-2 card-stats top-cards"
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

<style lang="scss" scoped></style>
