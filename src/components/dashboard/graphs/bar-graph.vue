<template>
  <v-card flat class="chart-container">
    <apexchart
      ref="chart"
      class="chart-holder"
      :class="{ 'tooltip-holder': isTooltipVisible }"
      :type="type"
      :height="height"
      :series="series"
      :options="chartOptions"
      width="100%"
    ></apexchart>
  </v-card>
</template>
<script>
import {
  charOptionDefault,
  barChartOptions,
} from '@/components/dashboard/api/constants';

export default {
  props: {
    title: {
      type: [String, Object],
      default: '',
    },

    type: {
      type: String,
      defalult: 'bar',
    },

    series: {
      type: Array,
      default: () => [],
    },

    chart: {
      type: Object,
      default: () => {},
    },

    xaxis: {
      type: Object,
      default: () => {},
    },

    yaxis: {
      type: Object,
      default: () => {},
    },

    annotations: {
      type: Object,
      default: () => {},
    },

    states: {
      type: Object,
      default: () => {},
    },

    legend: {
      type: Object,
      default: () => {},
    },

    stroke: {
      type: Object,
      default: () => {},
    },

    markers: {
      type: Object,
      default: () => {},
    },

    colors: {
      type: Array,
      default: () => [],
    },

    tooltip: {
      type: Object,
      default: () => {},
    },

    footerTitle: {
      type: String,
      default: '',
    },

    height: {
      type: [Number, String],
      default: 350,
    },
  },

  data: () => ({
    idxHolder: '',
    isTooltipVisible: false,
    chartOptions: {},
    charOptionDefault,
  }),

  created() {
    this.chartOptions = this.charOptionDefault({
      chart: this.chart,
      yaxis: this.yaxis,
      states: this.states,
      legend: this.legend,
      stroke: this.stroke,
      annotations: this.annotations,
      xaxis: {
        ...this.xaxis,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        intersect: false,
        ...this.tooltip,
      },
      markers: {
        ...this.markers,
        strokeColors: this.colors,
      },
      title: {
        text: this.title,
        ...((typeof this.title === 'object' && this.title) || {}),
      },
      footerTitle: this.footerTitle,
      setOptions: barChartOptions,
    });

    this.chartOptions.chart.events = {
      dataPointSelection: (event, chartContext, config) => {
        this.manipulateTooltip(event, chartContext, config);
      },
      dataPointMouseEnter: (event, chartContext, config) => {
        if (this.idxHolder !== config.dataPointIndex) {
          this.isTooltipVisible = false;
        }
      },
    };
  },

  methods: {
    async manipulateTooltip(event, chartContext, config) {
      if (this.idxHolder === '') {
        this.isTooltipVisible = true;
        this.idxHolder = config.dataPointIndex;
        return;
      }
      if ((await this.idxHolder) != (await config.dataPointIndex)) {
        this.isTooltipVisible = true;
      } else {
        this.isTooltipVisible = !this.isTooltipVisible;
      }
      this.idxHolder = config.dataPointIndex;
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-container {
  box-shadow: 1px 2px 4px rgb(0 0 0 /0.07) !important;
  border-radius: 8px;
  border: 1px solid #f1f1f1;
  padding: 16px;
}

::v-deep .chart-holder {
  &.tooltip-holder {
    .apexcharts-tooltip {
      opacity: 1 !important;
    }
  }
}
</style>
