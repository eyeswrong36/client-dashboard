<template>
  <div>
    <v-card class="dashboard-cards">
      <v-card-text>
        <apexchart
          width="100%"
          height="370px"
          type="line"
          :options="options"
          :series="series"
        ></apexchart> </v-card-text
    ></v-card>
  </div>
</template>

<script>
import dateFilter from '@/mixins/date-filter';
import getDaysMixin from '@/mixins/charts-get-days-between';
import { format } from 'date-fns';
export default {
  props: {
    series: { type: Array },
    color: { type: Array },
    total: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  data(p) {
    return {
      options: {
        chart: {
          id: 'line-graph',
          toolbar: {
            autoSelected: 'zoom',
            // show: false, //to hide toolbar
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              // customIcons: [],
            },
          },
          // events: {
          //   dataPointSelection: function (event, chartContext, config) {
          //     console.log(event.yAxis[0].value);
          //   },
          // },
        },
        markers: {
          size: (this.series.length === 2 && 1.5) || 0,
          fillOpacity: 0.5,
          strokeColor: this.color,
          hover: {
            size: 6,
          },
        },
        tooltip: {
          intersect: this.series.length === 2 ? true : false,
          shared: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            let date = format(
              new Date(w.globals.categoryLabels[dataPointIndex]),
              'MMMM d'
            );
            let label = w.globals.seriesNames[seriesIndex][0];
            let value =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            if (p.series.length === 2) {
              let success = {
                label: w.globals.seriesNames[0][0],
                value: w.globals.initialSeries[0].data[dataPointIndex],
                color: '#008DF0',
              };
              let failed = {
                label: w.globals.seriesNames[1][0],
                value: w.globals.initialSeries[1].data[dataPointIndex],
                color: '#DA4175',
              };
              let totalSms =
                series[0].reduce(
                  (previousValue, currentValue) => previousValue + currentValue,
                  0
                ) +
                series[1].reduce(
                  (previousValue, currentValue) => previousValue + currentValue,
                  0
                );
              if (success.value === failed.value) {
                return `<ul class="pa-2 apex-xaxis-tooltip">
              <li> ${date}</li>
              <li>Total SMS:<b> ${totalSms} </b></li>
              <li style="color:${success?.color}">${
                  success?.label || 'Success'
                }:<b> ${success?.value || 0} (${
                  (success?.value / totalSms).toLocaleString() * 100 || 0
                }%)</b></li>
              <li style="color:${failed?.color}">${
                  failed?.label || 'Failed'
                }:<b> ${failed?.value || 0} (${
                  (failed?.value / totalSms).toLocaleString() * 100 || 0
                }%)</b></li>
              </ul>`;
              } else {
                return `<ul class="pa-2 apex-xaxis-tooltip">
              <li> ${date}</li>
              <li>Total SMS:<b> ${totalSms || 0} </b></li>
              <li>${label}:<b> ${value || 0} (${
                  (value / totalSms).toLocaleString() * 100 || 0
                }%)</b></li>
              </ul>`;
              }
            } else {
              return `<ul  class="pa-2 apex-xaxis-tooltip">
              <li> ${date}</li>
              <li>${w.globals.seriesNames[0][0]}:<b> ${
                w.globals?.initialSeries[0]?.data[dataPointIndex] || 0
              }</b></li>
              </ul>`;
            }
          },
        },
        states: {
          active: {
            allowMultipleDataPointsSelection:
              (this.series.length === 2 && true) || false,
            filter: {
              type: 'none',
              value: 0,
            },
          },
          hover: {
            filter: {
              type: 'none',
              value: 0,
            },
          },
        },
        colors: this.color,

        stroke: {
          width: 3,
        },
        xaxis: {
          categories: [],
          type: 'category',
          // labels: {
          //   format: `MMM dd'yy`,
          // },
          tooltip: {
            enabled: false,
          },
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
          tickAmount: 7,
          minWidth: 100,
          maxWidth: 5000,
          labels: {
            style: {
              color: '#66687B !important',
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              lineHeight: '18px',
            },
          },
        },
        title: {
          text: this.title,
          align: 'left',
          floating: false,
          style: {
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: 'Satoshi',
            color: '#151C36',
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -40,
        },

        annotations: {
          xaxis: [],
        },
      },

      dayCount: 0,
    };
  },
  mixins: [getDaysMixin, dateFilter],
};
</script>

<style lang="scss" scoped></style>
