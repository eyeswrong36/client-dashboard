<template>
  <v-col class="high-level-metrics col-spacer" cols="12" sm="12" md="6">
    <v-card width="100%" height="100%" class="dashboard-cards">
      <v-card-text>
        <v-row style="position: relative; z-index: 1">
          <v-col cols="6">
            <p
              class="metrics-title muted-text font-weight-900"
              style="font-size: 16px; line-height: 22px"
            >
              {{ metricsTitle }}
            </p>
          </v-col>
          <v-col cols="6">
            <p class="text-right reset-date muted-text">
              {{ cutOff }}
            </p>
          </v-col>
        </v-row>

        <v-row style="position: relative; z-index: 1">
          <v-col cols="6">
            <p
              class="text-center font-weight-700 c-pt-4"
              style="font-size: 39px; line-height: 140%"
            >
              {{ formatAmount(outgoing) }}
            </p>
            <p class="text-center muted-text">Outgoing</p>
          </v-col>
          <v-col cols="6">
            <p
              class="text-center font-weight-700 c-pt-4"
              style="font-size: 39px; line-height: 140%"
            >
              {{ formatAmount(incoming) }}
            </p>
            <p class="text-center muted-text">Incoming</p>
          </v-col>
        </v-row>

        <v-row v-if="failover" style="position: relative; z-index: 1">
          <v-col cols="12">
            <p class="text-center muted-text p-">
              SMS Failover
              <ToolTip
                :tip-info="`This is the total amount of SMS Failover messages sent for your Viber Campaigns.\nThis is peso-value based.`"
                tipname="payg-failover"
                is-wide
                class="pl-1 pr-3"
                :is-large="false"
              />
              <span
                class="text-center font-weight-700 c-pt-4"
                style="font-size: 16px; line-height: 22px"
              >
                {{ formatAmount(failoverCount) }} </span
              ><span
                class="font-weight-500"
                style="font-size: 16px; line-height: 22px"
                >(&#8369;{{ formatAmount(failoverCost, 2, 2) }})</span
              >
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { formatAmount } from '@/utils/helpers';
import ToolTip from '@/components/common/tooltip.vue';
export default {
  props: {
    metricsTitle: { type: String },
    cutOff: { type: String },
    incoming: {
      type: Number,
      default: 0,
    },
    outgoing: {
      type: Number,
      default: 0,
    },
    failover: {
      type: Boolean,
      default: false,
    },
    failoverCount: {
      type: Number,
      default: 0,
    },
    failoverCost: {
      type: Number,
      default: 0,
    },
    failoverChannel: {
      type: String,
      default: '',
    },
  },

  components: {
    ToolTip,
  },

  methods: {
    formatAmount,
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  box-shadow: 1px 2px 4px rgb(0 0 0 /0.07) !important;
  border-radius: 8px;
  border: 1px solid #f2f2f2 !important;
}
.metrics-title {
  margin-bottom: 0;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
}
.metrics-plan {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}

.reset-date {
  @media #{map-get($display-breakpoints, 'md-only')} {
    font-size: 11px !important;
  }
}
.viber-balance {
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  color: #151c36;
}
.single-radial {
  .text-right {
    padding-right: 80px;
  }
  .text-left {
    padding-left: 75px;
  }
}
.dual-radial {
  .text-center.left {
    padding-right: 30px;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      padding-right: 80px !important;
      text-align: end !important;
    }
  }
  .text-center.right {
    padding-left: 35px;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      padding-left: 70px !important;
      text-align: start !important;
    }
  }
}
</style>
