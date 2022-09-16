<template>
  <div>
    <v-card id="sms-dashboard-cards" class="dashboard-cards">
      <v-card-text>
        <apexchart
          width="100%"
          height="350px"
          type="line"
          :options="options"
          :series="series"
        ></apexchart> </v-card-text
    ></v-card>
  </div>
</template>

<script>
import { format } from 'date-fns';
export default {
  props: {
    categories: { type: Array, default: [] },
    series: { type: Array, default: [] },
    outgoingRates: { type: Array },
    color: { type: Array, default: [] },
    total: { type: String, default: '' },
    title: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
  },
  data(p) {
    return {
      previousValue: '',
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
          events: this.series.length === 2 && {
            // marker click
            markerClick: function (
              event,
              chartContext,
              { seriesIndex, dataPointIndex, config }
            ) {
              let dataPointSelected = dataPointIndex;
              let dataSeriesSelected = seriesIndex;
              const apexGraph = document.getElementById('apexchartsline-graph');

              let copy = document.getElementsByClassName(
                'apexcharts-tooltip apexcharts-active'
              );
              let clone = copy[0].cloneNode(true);
              clone.id = `apexcharts-active-dp${dataPointSelected}-series${dataSeriesSelected}`;
              const list = clone.classList;
              list.add('apex-tooltip-clone');

              apexGraph.appendChild(clone);
            },

            // do something on click anywhere inside chart
            click: function (event, chartContext, config) {
              let clones = Array.from(
                document.getElementsByClassName('apex-tooltip-clone')
              );
              if (config.dataPointIndex < 0)
                clones.forEach((c) => {
                  c.remove();
                });
            },
          },
        },
        markers: {
          size: (this.series.length === 2 && 2.5) || 0.1,
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
            var Difference_In_Time =
              new Date(p.endDate).getTime() - new Date(p.startDate).getTime();
            // get number of days
            var days = Difference_In_Time / (1000 * 3600 * 24);
            let date =
              days >= 183
                ? format(new Date(p.previousValue), 'MMMM YYY')
                : format(
                    new Date(w.globals.categoryLabels[dataPointIndex]),
                    'MMMM d'
                  );
            let label = w.globals.seriesNames[seriesIndex][0];
            let value =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            // outgoing || SMS Blast
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
              let totalSms = p.outgoingRates[0]?.totalSMS[dataPointIndex] || 0;
              if (success.value === failed.value) {
                return `<ul class="pa-2 apex-xaxis-tooltip">
              <li> ${date}</li>
              <li>Total SMS:<b> ${totalSms} </b></li>
              <li style="color:${success?.color}">${
                  success?.label || 'Success'
                }:<b> ${success?.value || 0} (${
                  p.outgoingRates[0]?.success_rate[dataPointIndex]
                    ?.toFixed(2)
                    .replace(/[.,]00$/, '') || 0
                }%)</b></li>
              <li style="color:${failed?.color}">${
                  failed?.label || 'Failed'
                }:<b> ${failed?.value || 0} (${
                  p.outgoingRates[0]?.failed_rate[dataPointIndex]
                    ?.toFixed(2)
                    .replace(/[.,]00$/, '') || 0
                }%)</b></li>
              </ul>`;
              } else {
                return `<ul class="pa-2 apex-xaxis-tooltip">
              <li> ${date}</li>
              <li>Total SMS:<b> ${totalSms || 0} </b></li>
              <li>${label}:<b> ${value || 0} (${
                  label === 'Success'
                    ? p.outgoingRates[0]?.success_rate[dataPointIndex]
                        ?.toFixed(2)
                        .replace(/[.,]00$/, '')
                    : p.outgoingRates[0]?.failed_rate[dataPointIndex]
                        ?.toFixed(2)
                        .replace(/[.,]00$/, '') || 0
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
              type: 'lighten',
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
          categories: this.categories,
          type: 'category',
          labels: {
            formatter: function (val) {
              var Difference_In_Time =
                new Date(p.endDate).getTime() - new Date(p.startDate).getTime();
              // get number of days
              var days = Difference_In_Time / (1000 * 3600 * 24);
              p.previousValue = val;
              if (days >= 183) {
                if (val) return format(new Date(val), 'MMM YYY');
              }
              if (val) return format(new Date(val), 'MMM d');
            },
          },
          tooltip: {
            enabled: false,
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
    };
  },
  beforeMount() {
    var Difference_In_Time =
      new Date(this.endDate).getTime() - new Date(this.startDate).getTime();
    // get number of days
    var days = Difference_In_Time / (1000 * 3600 * 24);
    let years = [];

    if (days >= 32) {
      for (let category of this.options.xaxis.categories) {
        if (category)
          if (format(new Date(category), 'MMM YYY').includes('Jan')) {
            years.push(category);
          }
      }
      if (years.length > 1) {
        if (
          format(new Date(years[0]), 'MMM YYY') ===
          format(new Date(years[1]), 'MMM YYY')
        ) {
          this.options.annotations.xaxis.push({
            x: format(new Date(years[0]), 'MMM d'),
            strokeDashArray: 0,
            borderColor: '#008DF099',
            label: {
              borderColor: '#008DF099',
              style: {
                color: '#fff',
                background: '#008DF099',
              },
              text: format(new Date(years[0]), 'YYY'),
            },
          });
        }
      }
      if (days >= 730) {
        this.options.xaxis.tickAmount = this.categories.length / 12;
      }
      if (days >= 183) {
        for (let year of years) {
          this.options.annotations.xaxis.push({
            x: format(new Date(year), 'MMM YYY'),
            strokeDashArray: 0,
            borderColor: '#008DF099',
            label: {
              borderColor: '#008DF099',
              style: {
                color: '#fff',
                background: '#008DF099',
              },
              text: format(new Date(year), 'YYY'),
            },
          });
        }
      }
    }
  },
};
</script>

<style lang="scss">
#sms-dashboard-cards {
  .apex-tooltip-clone {
    z-index: 1;
  }
}
</style>
