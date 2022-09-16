<template>
  <v-card :style="cardStyle">
    <v-card-text>
      <p class="dashboard-cards-heading font-black">
        {{ cardTitle }}
        <ToolTip
          :tipInfo="tipInfo"
          :tipname="tipname"
          :isWide="isWide"
          :isLarge="true"
          v-if="toolTip"
        />
      </p>

      <div
        class="font-black dashboard-card-value"
        :style="`color: ${
          cardTitle.toLowerCase().includes('failed') ? '#DA4175' : color
        };`"
      >
        {{ cardValue.toLocaleString() }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import ToolTip from '@/components/common/tooltip.vue';
export default {
  props: {
    cardValue: { type: [String, Number], default: ['', 0] },
    cardTitle: { type: String, default: '' },
    color: { type: String, default: '' },
    toolTip: { type: Boolean, default: false },
    tipInfo: { type: String, default: '' },
    tipname: { type: String, default: '' },
    isWide: { type: Boolean, default: false },
    cardStyle: { type: Object, default: () => {} },
  },
  components: {
    ToolTip,
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  box-shadow: 1px 2px 4px rgb(0 0 0 /0.07) !important;
  border-radius: 8px;
  border: 1px solid #f1f1f1;
}
.dashboard-card-value {
  font-weight: 700;
  font-size: 30px;
  line-height: 41px;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    font-size: 25px;
    line-height: 34px;
  }
}

.dashboard-cards-heading {
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #151c36;
}
</style>
