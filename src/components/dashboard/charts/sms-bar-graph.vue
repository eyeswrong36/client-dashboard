<template>
  <div id="sms-polls-chart">
    <v-card class="dashboard-cards">
      <v-card-text>
        <apexchart
          width="100%"
          height="350px"
          :options="options"
          :series="series.slice(1)"
        ></apexchart></v-card-text
    ></v-card>
  </div>
</template>

<script>
import { format } from 'date-fns';
export default {
  props: {
    series: { type: Array, default: [] },
    categories: { type: Array, default: [] },
    pollRates: { type: Array },
    color: { type: Array },
    label: { type: String },
    value: { type: Number },
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
          type: 'bar',
          //   height: 350,
          stacked: true,
          toolbar: {
            show: true, //to hide toolbar
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
          zoom: {
            enabled: true,
          },
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
        tooltip: {
          intersect: false,
          shared: true,
          onDatasetHover: {
            highlightDataSeries: false,
          },
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
            let campaigns = p.series[0].data[dataPointIndex];
            let invalid_rate = p.pollRates[0].invalid_rate[dataPointIndex]
              ?.toFixed(2)
              .replace(/[.,]00$/, '');
            let valid_rate = p.pollRates[0].valid_rate[dataPointIndex]
              ?.toFixed(2)
              .replace(/[.,]00$/, '');
            let responses = w.globals.initialSeries[2].data[dataPointIndex];
            let valid = w.globals.initialSeries[1].data[dataPointIndex];
            let invalid = w.globals.initialSeries[0].data[dataPointIndex];

            return `<ul class="pa-2 apex-xaxis-tooltip">
              <li> ${date}</li>
              <li>Campaigns:<b> ${campaigns}</b></li>
              <li>Responses:<b> ${responses}</b></li>
              <li>Valid Responses:<b> ${valid} (${valid_rate || 0}%)</b></li>
              <li>Invalid Responses:<b> ${invalid} (${
              invalid_rate || 0
            }%)</b></li>

              </ul>`;
          },
        },
        colors: this.color,
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 8,
            columnWidth: '40%',
            colors: {
              backgroundBarColors: ['transparent'],
              bacgroundBarOpacity: 1,
              backgroundBarRadius: 0,
            },
          },
        },
        yaxis: {
          tickAmount: 4,
        },
        xaxis: {
          crosshairs: {
            show: true,
          },
          categories: this.categories,
          type: 'category',
          tickPlacement: 'on',
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
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
        },
        annotations: {
          xaxis: [],
        },
      },

      stacked: true,
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
#sms-polls-chart {
  .apexcharts-legend-marker {
    border-radius: 12px !important;
  }
  .apexcharts-legend {
    .apexcharts-legend-series:first-child {
      order: 3 !important;
    }
    .apexcharts-legend-series:nth-child(2) {
      order: 2 !important;
    }
    .apexcharts-legend-series:last-child {
      order: 1 !important;
    }
  }
}
</style>
