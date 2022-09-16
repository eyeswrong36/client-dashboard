<template>
  <div class="chart-container">
    <div class="gauge-label">
      <span>
        {{
          glabs
            ? `&#8369;${formatAmount(value, 2, 2)}`
            : formatAmount(value, 0, 0)
        }}
      </span>
    </div>
    <div class="gauge-min-max">
      <v-row>
        <v-col class="min" cols="6">0</v-col>
        <v-col class="max" cols="6">
          <div class="text-center">
            {{
              glabs
                ? `&#8369;${formatAmount(maxValue, 2, 2)}`
                : formatAmount(maxValue, 0, 0)
            }}
          </div>
        </v-col>
      </v-row>
    </div>
    <apexchart
      class="chart-radial"
      width="100%"
      height="270"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import { formatAmount } from '@/utils/helpers';
export default {
  data() {
    return {
      options: {},
    };
  },

  props: {
    series: { type: Array },
    color: { type: String },
    label: { type: String },
    value: { type: Number },
    maxValue: { type: Number },
    glabs: { type: Boolean, default: false },
  },

  created() {
    this.apexChartInit();
  },

  methods: {
    apexChartInit() {
      this.options = {
        chart: {
          type: 'radialBar',
        },
        states: {
          active: {
            filter: {
              type: 'none' /* none, lighten, darken */,
            },
          },
          hover: {
            filter: {
              type: 'none',
            },
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: '#ebebeb',
              startAngle: -90,
              endAngle: 90,
            },
            hollow: {
              size: '60%',
            },
            dataLabels: {
              showOn: 'always',
              name: {
                offsetY: -20,
                show: true,
                color: '#545454',
                fontSize: '10px',
                fontFamily: 'Satoshi',
                fontWeight: '700',
              },
              value: {
                offsetY: -15,
                color: '#151C36',
                fontSize: '16px',
                show: false,
                formatter: function (val) {
                  return val.toLocaleString();
                },
              },
            },
          },
        },
        fill: {
          type: 'solid',
          colors: [this.color],
        },
        stroke: {
          lineCap: 'butt',
        },
        labels: [this.label],
        stroke: {
          lineCap: 'round',
        },
      };
    },
    formatAmount,
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  .chart-radial {
    z-index: 0;
    position: relative;
    margin-top: -20px;
  }
  .gauge-label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    margin-top: 109px;
    span {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
    }
  }

  .gauge-min-max {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    margin-top: 135px;
    color: #151C36 !important;
    .min {
      text-align: right;
      padding-right: 77px;
    }
    .max {
      padding-right: 0;
      padding-left: 34px;
      div {
        width: 100px;
      }
    }
  }
}
</style>
