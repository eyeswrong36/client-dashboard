<template>
  <v-row class="mt-4">
    <v-col>
      <v-card flat class="telco-graph-container c-pa-2">
        <div class="d-flex">
          <span class="sent-message">Messages Successfully Sent by Telco</span>
          <div class="ml-auto">
            <Select
              ref="telcoSelect"
              v-model="selectedTelco"
              :options="TELCO"
              label="Select Telco"
              item-text="name"
              multiple
              attach
            />
          </div>
        </div>
        <v-row
          v-if="selectedTelco.length"
          class="c-mt-4 align-center justify-center"
        >
          <v-chip
            v-for="(telco, idx) in selectedTelco"
            :key="idx"
            class="selected-chips mx-3"
            :color="setColor(telco)"
            outlined
            label
            large
          >
            <v-icon
              left
              @click="onClose(telco)"
              size="12"
              color="#898989"
              class="ml-1"
            >
              mdi-close
            </v-icon>
            <div class="text-container">
              <span>{{ telco }}</span>
            </div>
          </v-chip>
        </v-row>
        <v-row class="c-mt-5">
          <v-col>
            <apexchart
              ref="telcoChart"
              width="100%"
              height="500"
              type="line"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Select from '@/components/common/select.vue';
// constants
import { TELCO } from '@/components/dashboard/api/constants';
import { formatAmount } from '@/utils/helpers';
import { format } from 'date-fns';
export default {
  components: {
    Select,
  },

  props: {
    options: {
      type: Array,
      default: () => [],
    },

    footerTitle: {
      type: String,
      default: format(new Date(), 'MMMM'),
    },
  },

  data() {
    return {
      TELCO,
      selectedTelco: [],
      series: [],
      chartOptions: {
        chart: {
          type: 'line',
          stacked: false,
          toolbar: {
            show: false,
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: [],
          },
          zoom: {
            enabled: false,
          },
        },

        xaxis: {
          type: 'category',
          categories: [],
          labels: {
            show: true,
            style: {
              color: '#667085',
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              cssClass: '',
            },
          },
          title: {
            text: this.footerTitle,
            style: {
              color: '#667085',
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              cssClass: '',
            },
          },
          tooltip: {
            enabled: false,
          },
        },

        yaxis: {
          labels: {
            show: true,
            style: {
              color: '#667085',
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              cssClass: '',
            },
          },
          title: {
            text: '',
            style: {
              color: '#667085',
              fontSize: '12px',
              fontFamily: 'Satoshi',
              fontWeight: 400,
              cssClass: '',
            },
          },
          tooltip: {
            enabled: false,
          },
        },

        states: {
          active: {
            allowMultipleDataPointsSelection: true,
            filter: {
              type: 'lighten',
              value: 0.35,
            },
          },
        },

        tooltip: {
          shared: false,
          intersect: true,
          followCursor: true,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const date = format(
              new Date(w.globals.categoryLabels[dataPointIndex]),
              'MMMM d'
            );
            const value =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            return `<div class="px-3 py-2" >
              <div class="font-weight-400 font-12">${date}</div>
              <div class="font-weight-400 font-10">SMS Sent: <b>${formatAmount(
                value
              )}</b></div>
              </div>`;
          },
        },

        grid: {
          show: true,
          borderColor: '#B0B0B0',
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },

        markers: {
          size: 5,
          hover: {
            size: 8,
          },
        },

        stroke: {
          width: 6,
        },

        legend: {
          show: false,
        },
      },
    };
  },

  created() {
    this.setCategories();
  },

  mounted() {
    this.selectAll();
  },

  watch: {
    selectedTelco(val) {
      let color = '';

      this.series = val.map((name) => {
        const data = TELCO.find((i) => i.name == name)?.data || [];
        switch (name) {
          case 'Globe':
            color = '#008DF0';
            break;
          case 'Smart':
            color = '#18E2CE';
            break;
          case 'DITO':
            color = '#DA4175';
            break;
          case 'International':
            color = '#6D3D91';
            break;
          case 'Unknown':
            color = '#FFB838';
            break;
          default:
            color = '#008DF0';
        }

        return {
          name,
          data,
          color,
        };
      });
    },
  },

  methods: {
    onClose(telco) {
      const index = this.selectedTelco.findIndex((i) => i === telco);
      this.selectedTelco.splice(index, 1);
    },

    setColor(telco) {
      return TELCO.find((i) => i.name == telco)?.color || '';
    },

    selectAll() {
      const selectAll = TELCO.map((i) => i.name);
      this.selectedTelco = selectAll;
      this.$refs.telcoSelect.value = selectAll;
    },

    setCategories() {
      const { startDate, endDate } =
        this.$store.getters['dashboard/GET_DATE_FILTER'];

      let categories = [];

      for (
        const dateFrom = new Date(startDate);
        dateFrom <= new Date(endDate);
        dateFrom.setDate(dateFrom.getDate() + 1)
      ) {
        categories.push(format(new Date(dateFrom), 'MMM dd yyyy'));
      }

      this.chartOptions.xaxis.categories = categories;
    },
  },
};
</script>
<style lang="scss" scoped>
.telco-graph-container {
  box-shadow: 1px 2px 4px rgb(0 0 0 /0.07) !important;
  border-radius: 8px;
  border: 1px solid #f1f1f1;
  .sent-message {
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
  }
  .selected-chips {
    height: 42px;
    text-align: center;
    .text-container {
      width: 90px;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
