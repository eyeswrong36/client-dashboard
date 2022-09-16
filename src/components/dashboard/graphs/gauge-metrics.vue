<template>
  <v-col cols="12" md="6" class="py-1 px-2 high-level-metrics col-spacer">
    <v-card minHeight="100%" class="dashboard-cards">
      <v-card-text>
        <!-- Header -->
        <v-row>
          <div class="d-flex flex-column py-2 px-3">
            <span class="metrics-title">{{ metricsTitle }}</span>
            <span class="metrics-plan">{{ metricsPlan }}</span>
          </div>
          <span class="credit-date py-2 px-3 ml-auto">
            {{ creditReset }}
          </span>
        </v-row>
        <!-- Gauge -->
        <v-row>
          <v-col
            :key="idx"
            cols="12"
            :sm="12 / gaugeData.length"
            class="gauge-container"
            v-for="(gauge, idx) in gaugeData"
          >
            <Radial
              :label="gauge.label"
              :series="gauge.series"
              :maxValue="gauge.maxValue"
              :value="gauge.value"
              :color="gauge.color"
              :glabs="isGlabs"
            />
          </v-col>
        </v-row>
        <!-- Usage/Footer -->
        <v-row>
          <v-col
            :key="idx"
            :cols="12 / usageData.length"
            v-for="(usage, idx) in usageData"
            :class="[ 
              usageData.length === 3 && 'd-flex',
              usageData.length === 3 && idx === 0 && 'justify-start',
              usageData.length === 3 && idx === 1 && 'justify-center',
              usageData.length === 3 && idx === 2 && 'justify-end'
            ]"
          >
            <div class="d-flex flex-column">
              <span class="radial-details"
                >{{ usage.textColumn }}:
                <ToolTip
                  v-if="usage.tooltip"
                  :tipname="usage.tooltip.name"
                  :isLarge="false"
                  :tipInfo="usage.tooltip.tipInfo"
                  :inverted="idx === usageData.length - 1 ? 'inverted' : ''"
                  style="width: 30px !important"
                  :isWide="usage.tooltip.isWide || false"
                />
              </span>
              <span v-if="usage.values.length === 1" class="viber-balance mt-2">
                {{
                  glabs
                    ? `&#8369;${formatAmount(usage.values[0].value, 2, 2)}`
                    : formatAmount(usage.values[0].value)
                }}
                <span
                  v-if="
                    usage.values[0].defineValue ||
                    usage.values[0].defineValue === 0
                  "
                  class="font-16"
                  >{{ `(&#8369;${usage.values[0].defineValue})` }}</span
                >
              </span>
              <div v-else class="mt-2">
                <div
                  v-for="(child, idx) in usage.values"
                  :key="idx"
                  class="d-flex"
                >
                  <span class="radial-details mt-1"
                    >{{ child.label }}
                    <ToolTip
                      v-if="child.tooltip"
                      :tipname="child.tooltip.name"
                      :isLarge="false"
                      :tipInfo="child.tooltip.tipInfo"
                      style="width: 30px !important"
                  /></span>
                  <span class="radial-details mt-1 ml-auto"
                    >{{
                      glabs
                        ? `&#8369;${formatAmount(child.value, 2, 2)}`
                        : formatAmount(child.value)
                    }}
                  </span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>
<script>
import Radial from '@/components/dashboard/graphs/gauge.vue';
import ToolTip from '@/components/common/tooltip.vue';
import { formatAmount, toLowerCase, sort } from '@/utils/helpers';
export default {
  props: {
    metricsTitle: {
      type: String,
      require: true,
    },

    metricsPlan: {
      type: String,
      require: true,
    },

    creditReset: {
      type: String,
      require: true,
    },

    gaugeData: {
      type: [Array, Object],
      default: () => [{}],
      require: true,
    },

    usageData: {
      type: [Array, Object],
      default: () => [],
    },

    color: {
      type: String,
      default: '#008DF0',
    },

    label: {
      type: String,
      require: true,
    },

    glabs: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    Radial,
    ToolTip,
  },

  computed: {
    isGlabs() {
      return toLowerCase(this.metricsPlan)?.includes('glabs') || false;
    },
  },

  methods: {
    formatAmount,
    sort,
  },
};
</script>

<style lang="scss" scoped>
.high-level-metrics {
  .metrics-title {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    color: #151c36 !important;
  }
  .metrics-plan {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
  .gauge-container {
    height: 160px;
    overflow: hidden;
  }
  .credit-date {
    color: #545454;
    font-size: 12px !important;
    // @media #{map-get($display-breakpoints, 'md-only')} {
    //   font-size: 11px !important;
    // }
  }
  .viber-balance {
    font-weight: 700;
    font-size: 25px;
    line-height: 32px;
    color: #151c36;
  }
  .radial-details {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #151c36;
  }
}
.v-card {
  box-shadow: 1px 2px 4px rgb(0 0 0 /0.07) !important;
  border-radius: 8px;
  border: 1px solid #f2f2f2 !important;
}
</style>
