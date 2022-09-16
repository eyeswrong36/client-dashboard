<template>
  <div>
    <v-divider color="#DADADA" class="c-mt-3 c-mb-4"></v-divider>
    <v-row class="row-spacing">
      <v-col v-for="(item, idx) in telco" :key="idx" class="col-spacer">
        <Card
          :card-title="item.name"
          :card-value="item.value || 0"
          class="pa-2 card-stats top-cards"
          :color="item.color"
          :border-color="item.color"
          :style="{ borderBottom: `6px solid ${item.color}` }"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Card from '@/components/dashboard/cards/card.vue';
export default {
  props: {
    telco: {
      type: [Array, Object],
      default: () => [],
    },

    color: {
      type: String,
    },
  },

  components: {
    Card,
  },
};
</script>
