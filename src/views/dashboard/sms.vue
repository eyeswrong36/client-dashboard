<template>
  <div class="page-content-padded">
    <Services :e1="e1" :services="services" :filterServices="filterServices" />
    <v-row v-if="!isLoading" class="row-spacing">
      <v-col class="high-level-stats" cols="12" sm="12" md="6">
        <Stats :item="stats" color="#008DF0" />
      </v-col>
      <PlanUsage v-if="plan.isGauge" :planData="plan" color="#008DF0" />
      <NoMetrics
        v-if="!plan.isGauge"
        metrics-title="SMS Transactions"
        :cut-off="plan.cutOff"
        :incoming="plan.incoming"
        :outgoing="plan.outgoing"
      />
      <!-- OUTGOING -->
      <v-col
        :cols="serviceName !== 'sms-blast' && !$phoneView ? '6' : '12'"
        class="py-3 col-spacer"
      >
        <LineChart
          :series="chartData.outgoing[0].series"
          :outgoingRates="chartData.outgoing[0].rates || []"
          :categories="chartData.categories"
          title="Outgoing Messages"
          :color="['#008DF0', '#DA4175']"
          :startDate="startDate"
          :endDate="endDate"
        />
      </v-col>
      <!-- INCOMING -->
      <v-col
        :cols="$phoneView ? 12 : 6"
        v-if="serviceName !== 'sms-blast' && serviceName !== 'sms-polls'"
        class="py-3 col-spacer"
      >
        <LineChart
          :series="chartData.incoming"
          :categories="chartData.categories"
          title="Incoming Messages"
          :color="['#DA4175']"
          :startDate="startDate"
          :endDate="endDate"
        />
      </v-col>
      <!-- OPTOUT -->
      <v-col
        v-if="serviceName !== 'two-way-sms' && serviceName !== 'sms-polls'"
        :cols="serviceName !== 'sms-blast' && !$phoneView ? '6' : '12'"
        class="py-3 col-spacer"
      >
        <LineChart
          :series="chartData.optout"
          :categories="chartData.categories"
          title="Opt-out Rate"
          :color="['#008DF0']"
          :startDate="startDate"
          :endDate="endDate"
        />
      </v-col>
      <!-- SMS POLLS -->
      <v-col
        :cols="$phoneView ? 12 : 6"
        v-if="serviceName !== 'sms-blast' && serviceName !== 'two-way-sms'"
        class="py-3 col-spacer"
      >
        <BarGraph
          :series="chartData.polls[0].series"
          :categories="chartData.categories"
          :pollRates="chartData.polls[0].rates || []"
          title="SMS Polls"
          :color="['#6D3D91', '#008DF0', '#008DF099']"
          :startDate="startDate"
          :endDate="endDate"
        />
      </v-col>
    </v-row>
    <DashboardLoader v-else />
  </div>
</template>

<script>
import Stats from '@/components/dashboard/high-level-stats.vue';
import NoMetrics from '@/components/dashboard/graphs/gauge-no-metrics.vue';
import PlanUsage from '@/components/dashboard/plan-usage.vue';
import DashboardStatsLoader from '@/components/common/dashboard-stats-loader';
import DashboardLoader from '@/components/common/dashboard-loader';
import Services from '@/components/common/services-select.vue';
import LineChart from '@/components/dashboard/charts/sms-line-chart.vue';
import BarGraph from '@/components/dashboard/charts/sms-bar-graph.vue';
// constants
import { planDefault } from '@/components/dashboard/constants';
//mixins
import dateFilter from '@/mixins/date-filter';
import { format } from 'date-fns';

export default {
  name: 'dashboard-sms',
  components: {
    Stats,
    Services,
    NoMetrics,
    PlanUsage,
    DashboardLoader,
    DashboardStatsLoader,
    LineChart,
    BarGraph,
  },

  data: () => ({
    e1: '',
    services: [],
    stats: [],
    serviceName: '',
    isLoading: true,
    plan: planDefault(),
    chartData: {
      categories: [],
      outgoing: [{ series: [] }, { rates: [] }],
      polls: [{ series: [] }, { rates: [] }],
      optout: [{ name: [], data: [] }],
      incoming: [{ name: [], data: [] }],
    },
  }),

  mixins: [dateFilter],

  computed: {
    channel() {
      return this.$store.getters['dashboard/GET_USER_SERVICES'];
    },

    startDate() {
      return this.GET_DATE_FILTER.startDate;
    },

    endDate() {
      return this.GET_DATE_FILTER.endDate;
    },

    isDevENV() {
      return process.env.VUE_APP_ENV === 'development';
    },
  },

  async mounted() {
    try {
      await Promise.all([
        this.getHighLevelStats(),
        this.getPlanUsage(),
        this.filterServices(''),
      ]);
    } catch (err) {
      console.log('err', err);
      //this.$router.push({ name: 'dashboard-error' });
    }
  },

  watch: {
    GET_DATE_FILTER: {
      deep: true,
      handler(dates) {
        const { startDate, endDate } = dates;
        if (startDate === null || endDate === null) return;

        this.filterServices(this.serviceName);
      },
    },
  },

  methods: {
    async getPlanUsage() {
      const res = await this.$store.dispatch('dashboard/getPlan');
      const data = res?.data || {};

      if (data?.hasOwnProperty('sms')) {
        const smsPlan = data?.sms;
        this.plan = {
          isGauge: false,
          cutOff: `${smsPlan?.header?.billing_cycle_lable}: ${smsPlan?.header?.billing_cycle_date}`,
          outgoing: smsPlan.body.content[0]['count'] ?? 0,
          incoming: smsPlan.body.content[1]['count'] ?? 0,
        };
        return;
      }

      this.plan = { ...planDefault(data) };
    },

    async getHighLevelStats() {
      let service = Object.keys(this.channel.sms);
      if (service.length > 2) {
        this.services.push('All Services');
        this.e1 = 'All Services';
      } else {
        if (service[1] == 6) {
          this.e1 = 'SMS Blast';
        } else if (service[1] == 1) {
          this.e1 = 'SMS Polls';
        } else if (service[1] == 4) {
          this.e1 = 'Two-Way SMS';
        }
      }

      if (this.channel.sms[6] !== undefined) {
        this.services.push('SMS Blast');
      }
      if (this.channel.sms[1] !== undefined) {
        this.services.push('SMS Polls');
      }
      if (this.channel.sms[4] !== undefined) {
        this.services.push('Two-Way SMS');
      }

      this.serviceName = 'all-services';
    },

    async filterServices(a) {
      let service = a.replace(/\s+/g, '-').toLowerCase();
      this.isLoading = true;
      try {
        let outgoing = [
          {
            series: [
              { name: ['Success'], data: [] },
              { name: ['Failed'], data: [] },
            ],
            rates: [{ success_rate: [], failed_rate: [], totalSMS: [] }],
          },
        ];
        let incoming = [
          {
            series: [
              {
                name: ['Received'],
                data: [],
              },
            ],
          },
        ];
        let opt_out = [
          {
            series: [
              {
                name: ['Opted Out'],
                data: [],
              },
            ],
          },
        ];
        let polls = [
          {
            series: [
              {
                name: 'Campaigns',
                data: [],
              },
              {
                name: 'Invalid',
                data: [],
              },
              {
                name: 'Valid',
                data: [],
              },
              {
                name: 'Responses',
                data: [],
              },
            ],
            rates: [{ valid_rate: [], invalid_rate: [], totalResponses: [] }],
          },
        ];
        switch (service) {
          case 'sms-blast': {
            this.serviceName = 'sms-blast';
            this.stats = [];
            let sms = await this.getStats(6);

            this.stats = [
              {
                label: 'Campaigns',
                value: sms.campaign_count,
                tooltip: {
                  name: 'campaign',
                  tipInfo:
                    'This includes both completed and ongoing campaigns.',
                  isWide: false,
                  isLarge: false,
                },
              },
              {
                label: 'Messages Sent',
                value: sms.msg_sent_count,
              },
              {
                label: 'Success Rate',
                value: sms.success_rate.toFixed(0) + '%',
              },
              {
                label: 'Failed Rate',
                value: sms.failed_rate.toFixed(0) + '%',
              },
              {
                label: 'Opt Out Count',
                value: sms.optout_count,
              },
            ];
            // get chart
            const data = await this.getChartStats(6);
            const date = data?.outgoing || data?.opt_out || {};
            const arrDates = Object.keys(date) || [];

            for (let [i, dates] of arrDates.entries()) {
              // OUTGOING
              // Success
              outgoing[0].series[0].data[i] = data?.outgoing[dates][2].value;
              // Failed
              outgoing[0].series[1].data[i] = data?.outgoing[dates][4].value;
              // success rate
              outgoing[0].rates[0].success_rate[i] =
                data?.outgoing[dates][3].value;

              // failed rate
              outgoing[0].rates[0].failed_rate[i] =
                data?.outgoing[dates][5].value;

              // total SMS
              outgoing[0].rates[0].totalSMS[i] = data?.outgoing[dates][6].value;

              // opt_out
              opt_out[0].series[0].data[i] = data?.opt_out[dates][2].value;
              this.chartData.categories[i] = dates;
            }

            this.chartData.outgoing[0].series = outgoing[0].series;
            this.chartData.outgoing[0].rates = outgoing[0].rates;

            this.chartData.optout = opt_out[0].series;

            break;
          }
          case 'two-way-sms': {
            // = SMS CHAT
            this.serviceName = 'two-way-sms';
            this.stats = [];
            const sms = await this.getStats(4);

            this.stats = [
              {
                label: 'Campaigns',
                value: sms.campaign_count,
                tooltip: {
                  name: 'campaign',
                  tipInfo:
                    'This includes both completed and ongoing campaigns.',
                  isWide: false,
                  isLarge: false,
                },
              },
              {
                label: 'Messages Sent',
                value: sms.msg_sent_count,
              },
              {
                label: 'Success Rate',
                value: sms.success_rate.toFixed(0) + '%',
              },
              {
                label: 'Failed Rate',
                value: sms.failed_rate.toFixed(0) + '%',
              },
            ];

            // get chart
            const data = await this.getChartStats(4);
            const date = data?.outgoing || data?.incoming || {};
            const arrDates = Object.keys(date) || [];

            for (let [i, dates] of arrDates.entries()) {
              // OUTGOING
              // Success
              outgoing[0].series[0].data[i] = data?.outgoing[dates][2].value;
              // Failed
              outgoing[0].series[1].data[i] = data?.outgoing[dates][4].value;
              // success rate
              outgoing[0].rates[0].success_rate[i] =
                data?.outgoing[dates][3].value;

              // failed rate
              outgoing[0].rates[0].failed_rate[i] =
                data?.outgoing[dates][5].value;

              // total SMS
              outgoing[0].rates[0].totalSMS[i] = data?.outgoing[dates][6].value;

              // incoming
              incoming[0].series[0].data[i] = data?.incoming[dates][2].value;
              this.chartData.categories[i] = dates;
            }

            this.chartData.outgoing[0].series = outgoing[0].series;
            this.chartData.outgoing[0].rates = outgoing[0].rates;
            this.chartData.incoming = incoming[0].series;

            break;
          }
          case 'sms-polls': {
            this.serviceName = 'sms-polls';
            this.stats = [];
            const sms = await this.getStats(1);

            this.stats = [
              {
                label: 'Campaigns',
                value: sms.campaign_count,
                tooltip: {
                  name: 'campaign',
                  tipInfo:
                    'This includes both completed and ongoing campaigns.',
                  isWide: false,
                  isLarge: false,
                },
              },
              {
                label: 'Messages Sent',
                value: sms.msg_sent_count,
              },
              {
                label: 'Responses',
                value: sms.responses.total_responses,
              },
              {
                label: 'Valid Responses',
                value: sms.responses.valid,
              },
            ];
            // get chart
            const data = await this.getChartStats(1);
            const date = data?.outgoing || data?.incoming || {};
            const arrDates = Object.keys(date) || [];

            for (let [i, dates] of arrDates.entries()) {
              // OUTGOING
              // Success // VALID
              outgoing[0].series[0].data[i] = data?.outgoing[dates][2].value;
              // Failed // INVALID
              outgoing[0].series[1].data[i] = data?.outgoing[dates][4].value;
              // success rate // VALID RATE
              outgoing[0].rates[0].success_rate[i] =
                data?.outgoing[dates][3].value;

              // failed rate // INVALID RATE
              outgoing[0].rates[0].failed_rate[i] =
                data?.outgoing[dates][5].value;

              // total SMS
              outgoing[0].rates[0].totalSMS[i] = data?.outgoing[dates][6].value;

              // Polls Bar
              // CAMPAIGN
              polls[0].series[0].data[i] = data?.polls[dates][7].value;
              // INVALID
              polls[0].series[1].data[i] = data?.polls[dates][4].value;
              // VALID
              polls[0].series[2].data[i] = data?.polls[dates][2].value;
              // TOTAL RESPONSES
              polls[0].series[3].data[i] = data?.polls[dates][6].value;

              // success rate // VALID RATE
              polls[0].rates[0].valid_rate[i] = data?.polls[dates][3].value;

              // failed rate // INVALID RATE
              polls[0].rates[0].invalid_rate[i] = data?.polls[dates][5].value;

              // total SMS
              polls[0].rates[0].totalResponses[i] = data?.polls[dates][6].value;
              this.chartData.categories[i] = dates;
            }

            this.chartData.outgoing[0].series = outgoing[0].series;
            this.chartData.outgoing[0].rates = outgoing[0].rates;
            this.chartData.polls[0].series = polls[0].series;
            this.chartData.polls[0].rates = polls[0].rates;

            break;
          }
          default: {
            // ALL SERVICES
            this.stats = [];
            this.serviceName = 'all-services';
            const sms = await this.getStats();

            this.stats = [
              {
                label: 'Campaigns',
                value: sms.campaign_count,
                tooltip: {
                  name: 'campaign',
                  tipInfo:
                    'This includes both completed and ongoing campaigns.',

                  isWide: false,
                  isLarge: false,
                },
              },
              {
                label: 'Messages Sent',
                value: sms.msg_sent_count,
              },
              {
                label: 'Success Rate',
                value: sms.success_rate.toFixed(0) + '%',
              },
              {
                label: 'Failed Rate',
                value: sms.failed_rate.toFixed(0) + '%',
              },
              {
                label: 'Opt Out Count',
                value: sms.optout_count,
              },
            ];

            // get chart
            const data = await this.getChartStats(0);
            const date =
              data?.outgoing ||
              data?.incoming ||
              data?.opt_out ||
              data?.polls ||
              {};
            const arrDates = Object.keys(date) || [];

            for (let [i, dates] of arrDates.entries()) {
              // OUTGOING
              // Success
              outgoing[0].series[0].data[i] = data?.outgoing[dates][2].value;
              // Failed
              outgoing[0].series[1].data[i] = data?.outgoing[dates][4].value;
              // success rate // VALID RATE
              (outgoing[0].rates[0].success_rate[i] =
                data?.outgoing[dates][3].value),
                // failed rate // INVALID RATE
                (outgoing[0].rates[0].failed_rate[i] =
                  data?.outgoing[dates][5].value),
                // total SMS
                (outgoing[0].rates[0].totalSMS[i] =
                  data?.outgoing[dates][6].value);

              // INCOMING
              // received
              // Success
              incoming[0].series[0].data[i] = data?.incoming[dates][2].value;
              // OPT OUT
              opt_out[0].series[0].data[i] = data?.opt_out[dates][2].value;

              // Polls Bar
              // CAMPAIGN
              polls[0].series[0].data[i] = data?.polls[dates][7].value;
              // INVALID
              polls[0].series[1].data[i] = data?.polls[dates][4].value;
              // VALID
              polls[0].series[2].data[i] = data?.polls[dates][2].value;
              // TOTAL RESPONSES
              polls[0].series[3].data[i] = data?.polls[dates][6].value;

              // success rate // VALID RATE
              polls[0].rates[0].valid_rate[i] = data?.polls[dates][3].value;

              // failed rate // INVALID RATE
              polls[0].rates[0].invalid_rate[i] = data?.polls[dates][5].value;

              // total SMS
              polls[0].rates[0].totalResponses[i] = data?.polls[dates][6].value;

              this.chartData.categories[i] = dates;
            }

            this.chartData.outgoing[0].series = outgoing[0].series;
            this.chartData.outgoing[0].rates = outgoing[0].rates;
            this.chartData.incoming = incoming[0].series;
            this.chartData.optout = opt_out[0].series;
            this.chartData.polls[0].series = polls[0].series;
            this.chartData.polls[0].rates = polls[0].rates;
          }
        }

        await this.getPlanUsage();
      } catch (error) {
        //this.$router.push({ name: 'dashboard-error' });
      } finally {
        setTimeout(() => (this.isLoading = false), 500);
      }
    },

    async getStats(serviceId = 0) {
      const res = await this.$store.dispatch('dashboard/getHighlevelStats', {
        startDate: this.startDate,
        endDate: this.endDate,
        serviceId,
      });

      return res?.data;
    },

    async getChartStats(serviceId = 0) {
      try {
        const res = await this.$store.dispatch('dashboard/getGraphStats', {
          startDate: this.startDate,
          endDate: this.endDate,
          serviceId,
        });

        return res?.data;
      } catch (err) {
        console.log(err);
        //this.$router.push({ name: 'dashboard-error' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-skeleton-loader__image {
  height: 305px !important;
}
</style>
