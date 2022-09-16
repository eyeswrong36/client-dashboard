<template>
  <v-container fluid class="pa-0">
    <v-row v-if="!isLoading" class="row-spacing">
      <StatsCard :items="stats" :color="COLORS.PRIMARY" />
      <PlanUsage v-if="plan.isGauge" :planData="plan" :color="COLORS.PRIMARY" />
      <PlanUsagePayG
        v-else
        metrics-title="SMS Transactions"
        :cutOff="plan.cutOff"
        :incoming="plan.incoming"
        :outgoing="plan.outgoing"
      />
    </v-row>
    <Telco
      v-if="!isLoading"
      :telco="TELCO"
      :color="COLORS.PRIMARY"
      borderColor="#111"
    />
    <TelcoGraph v-if="!isLoading" :options="TELCO" />
    <v-row v-if="!isLoading">
      <v-col>
        <LineGraph
          title="Outgoing Messages"
          :series="graph.outgoing.series"
          :xaxis="graph.outgoing.xaxis"
          :annotations="graph.outgoing.annotations"
          :colors="graph.outgoing.colors"
          :tooltip="graph.outgoing.tooltip"
          :footer-title="graph.outgoing.footerTitle"
        />
      </v-col>
    </v-row>
    <v-row v-if="!isLoading">
      <v-col>
        <LineGraph
          title="Incoming Messages"
          :series="graph.incoming.series"
          :colors="graph.incoming.colors"
          :tooltip="graph.incoming.tooltip"
        />
      </v-col>
    </v-row>
    <DashboardLoader v-if="isLoading" />
  </v-container>
</template>
<script>
import StatsCard from '@/components/dashboard/api/sms-stats';
import PlanUsage from '@/components/dashboard/plan-usage.vue';
import Telco from '@/components/dashboard/api/sms-telco';
import TelcoGraph from '@/components/dashboard/api/sms-telco-graph';
import LineGraph from '@/components/dashboard/graphs/line-graph';
import DashboardLoader from '@/components/common/dashboard-loader';
import PlanUsagePayG from '@/components/dashboard/graphs/gauge-no-metrics.vue';
// constants
import {
  smsDefault,
  SMS_API_SERVICE_ID,
  TELCO,
} from '@/components/dashboard/api/constants';
import { COLORS } from '@/constants';
import { planDefault } from '@/components/dashboard/constants';
//helpers
import { formatAmount, toProperCase, sort } from '@/utils/helpers';
import { format } from 'date-fns';
import dateFilter from '@/mixins/date-filter';

export default {
  name: 'dashboard-api-sms',

  components: {
    StatsCard,
    PlanUsage,
    PlanUsagePayG,
    Telco,
    TelcoGraph,
    LineGraph,
    DashboardLoader,
  },

  data: () => ({
    isLoading: true,
    stats: smsDefault(),
    plan: planDefault(),
    graph: {
      outgoing: {
        series: [
          {
            name: 'Success',
            color: COLORS.VIBER,
            data: [],
            meta: {
              rate: [],
              totalMessages: [],
            },
          },
          {
            name: 'Failed',
            color: COLORS.FAILED,
            data: [],
            meta: {
              rate: [],
              totalMessages: [],
            },
          },
        ],
        xaxis: {
          tickAmount: 12,
          categories: [],
        },
        tooltip: {
          shared: true,
          intersect: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const date = w.globals.categoryLabels[dataPointIndex];
            const successCount =
              w.globals.initialSeries[0].data[dataPointIndex];
            const failedCount = w.globals.initialSeries[1].data[dataPointIndex];
            const successMeta = w.globals.initialSeries[0].meta;
            const failedMeta = w.globals.initialSeries[1].meta;
            const successRate = successMeta.rate[dataPointIndex];
            const failedRate = failedMeta.rate[dataPointIndex];

            const totalSMS =
              successMeta.totalMessages[dataPointIndex] ||
              failedMeta.totalMessages[dataPointIndex];

            const displaySuccess = `${formatAmount(
              successCount
            )} (${formatAmount(successRate, 0, 2)}%)`;

            const displayFailed = `${formatAmount(failedCount)} (${formatAmount(
              failedRate,
              0,
              2
            )}%)`;

            return `<div class="px-3 py-2" >
                <div class="font-weight-700 font-12 mb-1">
                  ${date}
                </div>
                <div class="font-weight-400 font-10">
                  Total SMS: <b>${formatAmount(totalSMS)}</b></div>
                <div class="font-weight-400 font-10">
                  Sent: <b>${displaySuccess}</b>
                </div>
                <div class="font-weight-400 font-10">
                  Failed: <b>${displayFailed}</b>
                </div>
              </div>`;
          },

          onDatasetHover: {
            highlightDataSeries: true,
          },
        },
        annotations: {
          xaxis: [],
        },
        colors: [COLORS.PRIMARY, COLORS.FAILED],
        footerTitle: '',
      },
      incoming: {
        series: [
          {
            name: 'Received',
            color: COLORS.FAILED,
            data: [],
          },
        ],
        xaxis: {
          tickAmount: 12,
          categories: [],
        },
        tooltip: {
          intersect: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const date = w.globals.categoryLabels[dataPointIndex];
            const seriesValue =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            return `<div class="px-3 py-2" >
                <div class="font-weight-700 font-12 mb-1">
                  ${date}
                </div>
                <div class="font-weight-400 font-10">
                  Received: <b>${formatAmount(seriesValue)}</b>
                </div>
              </div>`;
          },
        },
        annotations: {
          xaxis: [],
        },
        colors: [COLORS.FAILED],
        footerTitle: '',
      },
    },
    TELCO,
    COLORS,
  }),

  mixins: [dateFilter],

  async mounted() {
    try {
      this.isLoading = true;
      await Promise.all([
        this.getHighLevelStats(),
        this.getPlanUsage(),
        this.getGraphStats(),
      ]);
    } catch (err) {
      console.log('err', err);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  },

  computed: {
    startDate() {
      return this.GET_DATE_FILTER.startDate;
    },

    endDate() {
      return this.GET_DATE_FILTER.endDate;
    },
  },

  watch: {
    GET_DATE_FILTER: {
      deep: true,
      async handler(dates) {
        const { startDate, endDate } = dates;
        if (startDate === null || endDate === null) return;

        try {
          this.isLoading = true;
          await Promise.all([
            this.getHighLevelStats(),
            this.getPlanUsage(),
            this.getGraphStats(),
          ]);
        } catch (err) {
        } finally {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      },
    },
  },

  methods: {
    async getPlanUsage() {
      const res = await this.$store.dispatch('dashboard/getPlan');
      const data = res?.data || {};

      if (data.hasOwnProperty('sms')) {
        const smsPlan = data.sms;
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
      const res = await this.$store.dispatch('dashboard/getHighlevelStats', {
        startDate: this.startDate,
        endDate: this.endDate,
        serviceId: SMS_API_SERVICE_ID,
      });

      const data = res.data;
      const telcoData = data?.telco;

      if (telcoData)
        this.TELCO = TELCO.map((item) => {
          return {
            ...item,
            value: telcoData[toProperCase(item.name)],
          };
        });

      this.stats = [
        {
          label: 'Transactions',
          value: data.txn_count,
        },
        {
          label: 'Messages Sent',
          value: data.msg_sent_count,
        },
        {
          label: 'Success Rate',
          value: `${data.success_rate?.toFixed(0)}%`,
        },
        {
          label: 'Failed Rate',
          value: `${data.failed_rate?.toFixed(0)}%`,
        },
      ];
    },

    async getGraphStats() {
      this.resetGraphData();
      const monthsYearRange = [];
      const yearsRange = [];
      const outgoingDataSet = this.graph.outgoing;
      const incomingDataSet = this.graph.incoming;

      const res = await this.$store.dispatch('dashboard/getGraphStats', {
        startDate: this.startDate,
        endDate: this.endDate,
        serviceId: SMS_API_SERVICE_ID,
      });
      const data = res.data;

      if (!data) return;

      const outgoingObj = data?.outgoing || {};
      const incomingObj = data?.incoming || {};
      const outgoingDates = Object.keys(outgoingObj) || [];
      const incomingDates = Object.keys(incomingObj) || [];

      for (const date of outgoingDates) {
        const monthYear = format(new Date(date), 'MMM yyyy');
        const year = format(new Date(date), 'yyyy');

        // store month with year and count to categorized x-axis format
        if (!monthsYearRange.includes(monthYear))
          monthsYearRange.push(monthYear);
        // store years for annotations
        if (!yearsRange.includes(year)) yearsRange.push(year);

        for (const content of outgoingObj[date])
          for (const setSeries of outgoingDataSet.series)
            if (setSeries.name === toProperCase(content.label)) {
              setSeries.data.push(content.value);
              // Custom meta for rate and total SMS
              const rate =
                outgoingObj[date].find(
                  (i) => i.label === `${content.label} rate`
                )?.value || 0;
              const totalMessages =
                outgoingObj[date].find((i) => i.label === 'total messages')
                  ?.value || 0;

              setSeries.meta.rate.push(rate);
              setSeries.meta.totalMessages.push(totalMessages);
            }
      }

      for (const date of incomingDates)
        for (const content of incomingObj[date])
          for (const setSeries of incomingDataSet.series)
            if (content.label === 'incoming')
              setSeries.data.push(content.value);

      outgoingDataSet.xaxis.categories = outgoingDates.map((d) =>
        this.formatDate(d, monthsYearRange)
      );

      incomingDataSet.xaxis.categories = incomingDates.map((d) =>
        this.formatDate(d, monthsYearRange)
      );

      // set annotations
      if (yearsRange.length > 1)
        for (const year of yearsRange) {
          const filteredDates = outgoingDates.filter((d) =>
            d.toString().includes(year)
          );

          const annotationDate = sort(filteredDates, {
            sortOrder: 'asc',
          }).pop();

          const annoItem = {
            x: this.formatDate(annotationDate, monthsYearRange),
            borderColor: COLORS.SERIOUS_NAVY,
            label: {
              style: {
                color: COLORS.SERIOUS_NAVY,
              },
              text: year,
            },
          };

          outgoingDataSet.annotations.xaxis.push(annoItem);
          incomingDataSet.annotations.xaxis.push(annoItem);
        }

      console.log('Graph', this.graph);
    },

    resetGraphData() {
      for (const series of this.graph.outgoing.series) {
        series.data = [];
        series.meta.rate = [];
        series.meta.totalMessages = [];
      }
      for (const series of this.graph.incoming.series) series.data = [];

      this.graph.outgoing.xaxis.categories = [];
      this.graph.incoming.xaxis.categories = [];

      this.graph.outgoing.annotations.xaxis = [];
      this.graph.incoming.annotations.xaxis = [];
    },

    /**
     * format x-axis date base on criteria
     * criteria: if date range is 7-12+ months, x-axis will show the months
     */
    formatDate(date, monthsYearRange) {
      return format(
        new Date(date),
        monthsYearRange.length >= 7 && monthsYearRange.length <= 12
          ? 'MMM'
          : monthsYearRange.length > 12
          ? 'MMM yyyy'
          : 'MMM dd'
      );
    },
  },
};
</script>
