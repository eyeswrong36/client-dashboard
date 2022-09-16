<template>
  <div>
    <v-card class="dashboard-cards">
      <v-card-text>
        <p class="card-title">{{ cardTitle }}</p>
        <apexchart
          class="chart-holder"
          :class="{ 'tooltip-holder': isTooltipVisible }"
          type="bar"
          height="330px"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    cardTitle: {
      Type: String,
      default: 'Seen Rate',
    },
  },
  created() {},
  data() {
    let vm = this;
    return {
      idxHolder: '',
      isTooltipVisible: false,
      series: [
        {
          name: ['seen'],
          color: '#6D3D91',
          data: [20, 30, 50, 10, 35, 75, 60],
        },
        {
          name: ['excess-rate'],
          color: '#f1f1f1',
          data: [80, 70, 50, 90, 65, 25, 40],
        },
      ],
      chartOptions: {
        chart: {
          stacked: true,
          stackType: '100%',
          toolbar: {
            show: false,
          },
          type: 'bar',
          height: 200,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              vm.manipulateTooltip(event, chartContext, config);
            },
            dataPointMouseEnter: function (event, chartContext, config) {
              if (vm.idxHolder !== config.dataPointIndex) {
                vm.isTooltipVisible = false;
              }
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '30%',
            rangeBarOverlap: true,
            endingShape: 'rounded',
            borderRadius: [8, 8],
            colors: {
              backgroundBarColors: ['transparent', 'transparent'],
              bacgroundBarOpacity: 1,
              backgroundBarRadius: 0,
            },
          },
        },
        grid: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: [
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
          ],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: true,
            style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              lineHeight: '18px',
            },
          },
        },
        yaxis: {
          show: true,
          tickAmount: 4,
          labels: {
            minWidth: 0,
            maxWidth: 100,
            formatter: (val) => {
              return `${val}%`;
            },
            style: {
              // colors: [],
              color: '#66687B !important',
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              lineHeight: '18px',
            },
          },
        },
        fill: {
          opacity: 1,
          colors: ['#6D3D91', '#f1f1f1'],
          type: 'solid',
          pattern: {
            style: 'verticalLines',
          },
        },
        tooltip: {
          enabled: true,
          enabledOnSeries: [0, 2],
          style: {
            fontFamily: 'Satoshi',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '16px',
            color: '#151C36',
          },
          // x: {
          //   show: false
          // },
          // y: {
          //   formatter: function (val) {
          //     return `1,000 (${val}%)`
          //   }
          // },
          // marker: {
          //   show: false
          // },
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            return (
              '<div class="arrow_box">' +
              '<p class="p1">' +
              w.globals.labels[dataPointIndex] +
              ' 10' +
              '</p>' +
              '<p class="p2">' +
              'Seen Count: <span>' +
              '1,000 ' +
              '(' +
              series[seriesIndex][dataPointIndex] +
              '%' +
              ')' +
              '</span></p>' +
              '</div>'
            );
          },
        },
        states: {
          hover: {
            filter: {
              type: 'none',
              value: 0,
            },
          },
          active: {
            filter: {
              type: 'none',
            },
          },
        },
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
        console.log('true', this.idxHolder, config.dataPointIndex);
        this.isTooltipVisible = true;
      } else {
        console.log('false');
        this.isTooltipVisible = !this.isTooltipVisible;
      }
      this.idxHolder = config.dataPointIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
p.card-title {
  margin: 0;
  font-weight: 500;
  font-size: 16px;
}

::v-deep .arrow_box {
  padding: 5px;
  background: #ffffff;
  border: 1px solid #f1f1f1;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.07);
  border-radius: 5px;
  p {
    font-family: 'Satoshi';
    margin: 0;
    padding: 0;
    color: #151c36;
    &.p1 {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
    }
    &.p2 {
      font-weight: 500;
      font-size: 10px;
      line-height: 14px;
      span {
        font-weight: 700;
      }
    }
  }
}
::v-deep .chart-holder {
  &.tooltip-holder {
    .apexcharts-tooltip {
      opacity: 1 !important;
    }
  }
}
</style>
