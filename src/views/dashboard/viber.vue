<template>
  <div class="page-content-padded">
    <v-row v-if="!isLoading" class="row-spacing">
      <StatsCard :items="viber" :isLoading="isLoading" color="#6D3D91" />
      <PlanUsage v-if="plan.isGauge" :planData="plan" color="#6D3D91" />
      <PayG
        v-if="!plan.isGauge"
        metrics-title="Viber Transactions"
        :cut-off="plan.cutOff"
        :incoming="plan.incoming"
        :outgoing="plan.outgoing"
        :failover-count="plan.failoverCount"
        :failover-cost="plan.failoverCost"
        failover
      />

      <v-col cols="12" md="6" sm="12">
        <!-- <LineChart
          :series="lineChart.outgoing.series"
          title="Outgoing Messages"
          :color="['#6D3D91', '#DA4175']"
         /> -->
        <LineGraph
          title="Outgoing Messages"
          :series="lineChart.outgoing.series"
          :xaxis="lineChart.outgoing.xaxis"
          :annotations="lineChart.outgoing.annotations"
          :colors="lineChart.outgoing.colors"
          :tooltip="lineChart.outgoing.tooltip"
          :footer-title="lineChart.outgoing.footerTitle"
        />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <BarGraph
          title="Seen Rate"
          :series="lineChart.seen.series"
          :xaxis="lineChart.outgoing.xaxis"
          :annotations="lineChart.seen.annotations"
          :colors="lineChart.outgoing.colors"
          :tooltip="lineChart.seen.tooltip"
          :footer-title="lineChart.seen.footerTitle"
        />
      </v-col>
      <!-- <v-col cols="12" md="6" sm="12">
        <Bar />
      </v-col> -->
    </v-row>
    <DashboardLoader v-else />
  </div>
</template>

<script>
import StatsCard from '@/components/dashboard/api/viber-stats.vue';
import DashboardLoader from '@/components/common/dashboard-loader';
import DashboardStatsLoader from '@/components/common/dashboard-stats-loader';
import PlanUsage from '@/components/dashboard/plan-usage.vue';
import PayG from '@/components/dashboard/graphs/gauge-no-metrics.vue';
import LineChart from '@/components/dashboard/charts/viber-line-chart.vue';
import LineGraph from '@/components/dashboard/graphs/line-graph';
import BarGraph from '@/components/dashboard/graphs/bar-graph.vue';
// import Bar from '@/components/dashboard/charts/viber-bar-graph.vue';
// constants
import { planDefault } from '@/components/dashboard/constants';
//mixins
import dateFilter from '@/mixins/date-filter';
import { COLORS } from '@/constants';
import { formatAmount, toProperCase, sort } from '@/utils/helpers';
import { format } from 'date-fns';

export default {
  name: 'dashboard-sms',

  components: {
    StatsCard,
    DashboardLoader,
    DashboardStatsLoader,
    PayG,
    PlanUsage,
    LineChart,
    LineGraph,
    BarGraph,
    // Bar,
  },

  data() {
    return {
      show: false,
      viber: [],
      filtered: [],
      isLoading: false,
      plan: planDefault(),
      lineChart: {
        outgoing: {
          series: [
            {
              name: 'Success',
              color: '#6D3D91',
              data: [],
              meta: {
                rate: [],
                totalMessages: [],
              },
            },
            {
              name: 'Failed',
              color: '#DA4175',
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
              const failedCount =
                w.globals.initialSeries[1].data[dataPointIndex];
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

              const displayFailed = `${formatAmount(
                failedCount
              )} (${formatAmount(failedRate, 0, 2)}%)`;

              return `<div class="px-3 py-2" >
                  <div class="font-weight-700 font-12 mb-1">
                    ${date}
                  </div>
                  <div class="font-weight-400 font-10">
                    Total SMS: <b>${formatAmount(totalSMS)}</b></div>
                  <div class="font-weight-400 font-10">
                    Success: <b>${displaySuccess}</b>
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
          colors: ['#6D3D91', '#DA4175'],
          footerTitle: '',
        },

        seen: {
          series: [
            {
              name: 'seen',
              color: '#6D3D91',
              data: [],
              meta: {
                count: [],
              },
            },
            {
              name: 'excess-rate',
              color: '#f1f1f1',
              data: [],
            },
          ],
          xaxis: {
            tickAmount: 12,
            categories: [],
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const date = w.globals.labels[dataPointIndex];
              const seenCount =
                w.globals.initialSeries[seriesIndex].meta.count[dataPointIndex];
              const seenRate =
                w.globals.seriesPercent[seriesIndex][dataPointIndex];

              return `<div class="px-3 py-2" >
                  <div class="font-weight-700 font-12 mb-1">
                    ${date}
                  </div>
                  <div class="font-weight-400 font-10">
                    Seen Count:
                    <b>${formatAmount(seenCount)} (${seenRate}%)</b>
                  </div>
                </div>`;
            },
          },
          annotations: {
            xaxis: [],
          },
          footerTitle: '',
        },
      },
    };
  },

  mixins: [dateFilter],

  async mounted() {
    try {
      this.isLoading = true;
      await Promise.all([
        this.getHighLevelStats(),
        this.getPlanUsage(),
        this.getGraphData(),
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
            this.getGraphData(),
          ]);
        } catch (err) {
          console.log('err', err);
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

      if (data.hasOwnProperty('viber')) {
        const viberPlan = data.viber;
        this.plan = {
          isGauge: false,
          cutOff: `${viberPlan?.header?.billing_cycle_lable}: ${viberPlan?.header?.billing_cycle_date}`,
          outgoing: viberPlan.body.content[0]['count'] ?? 0,
          incoming: viberPlan.body.content[1]['count'] ?? 0,
          failover: true,
          failoverCount: viberPlan.footer.sms_failover.count ?? 0,
          failoverCost: viberPlan.footer.sms_failover.cost ?? 0,
        };

        return;
      }

      this.plan = { ...planDefault(data) };
      console.log('plan', this.plan);
    },

    async getHighLevelStats() {
      this.isLoading = true;
      const res = await this.$store.dispatch('dashboard/getHighlevelStats', {
        startDate: this.startDate,
        endDate: this.endDate,
        serviceId: 14,
      });
      if (res.code >= 200 && res.code <= 300) {
        let viberData = res.data;
        this.viber = [
          {
            label: 'Campaigns',
            value: viberData.campaign_count,
            hasTooltip: true,
            tooltip: {
              name: 'campaign',
              isWide: false,
              tipInfo: 'This includes both completed and ongoing campaigns.',
            },
          },
          {
            label: 'Messages Sent',
            value: viberData.msg_sent_count,
          },
          {
            label: 'Success Rate',
            value: viberData.success_rate.toFixed(0) + '%',
          },
          {
            label: 'Failed Rate',
            value: viberData.failed_rate.toFixed(0) + '%',
            color: '#DA4175',
          },
          {
            label: 'Opt Out Count',
            value: viberData.optout_count,
            hasTooltip: true,
            tooltip: {
              name: 'optOutCount',
              isLarge: false,
              isWide: true,
              tipInfo: `This includes all mobile numbers on your current Viber opt-out list. It can't be filtered based on the date range you have selected.`,
              size: 'large',
            },
          },
          {
            label: 'Seen Rate',
            value: viberData.seen_rate.toFixed(0) + '%',
          },
        ];
      }
    },

    async getGraphData() {
      this.resetGraphData();
      const monthsYearRange = [];
      const yearsRange = [];
      const outgoingDataSet = this.lineChart.outgoing;
      const seenRateDataSet = this.lineChart.seen;

      const res = await this.$store.dispatch('dashboard/getGraphStats', {
        startDate: this.startDate,
        endDate: this.endDate,
        serviceId: 14,
      });
      const data = res.data;
      console.log(data, 'dataaa');

      if (!data) return;

      const outgoingObj = data?.outgoing || {};
      const outgoingDates = Object.keys(outgoingObj) || [];
      const seenRateObj = data?.seen || {};
      const seenRateDates = Object.keys(seenRateObj) || [];

      for (const date of outgoingDates) {
        const monthYear = format(new Date(date), 'MMM yyyy');
        const year = format(new Date(date), 'yyyy');

        if (!monthsYearRange.includes(monthYear))
          monthsYearRange.push(monthYear);

        if (!yearsRange.includes(year)) yearsRange.push(year);

        for (const content of outgoingObj[date])
          for (const setSeries of outgoingDataSet.series)
            if (setSeries.name === toProperCase(content.label)) {
              setSeries.data.push(content.value);

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

      for (const date of seenRateDates)
        for (const content of seenRateObj[date])
          for (const setSeries of seenRateDataSet.series) {
            // seen count
            content.label === 'seen' &&
              setSeries.name === 'seen' &&
              setSeries.meta.count.push(content.value);

            // seen rate
            content.label === 'seen rate' &&
              setSeries.name === 'seen' &&
              setSeries.data.push(formatAmount(content.value, 0, 2));

            // seen excess rate
            content.label === 'seen rate' &&
              setSeries.name === 'excess-rate' &&
              setSeries.data.push(formatAmount(100 - content.value, 0, 2));
          }

      outgoingDataSet.xaxis.categories = outgoingDates.map((d) =>
        this.formatDate(d, monthsYearRange)
      );
      seenRateDataSet.xaxis.categories = seenRateDates.map((d) =>
        this.formatDate(d, monthsYearRange)
      );

      // outgoingDataSet.xaxis.categories = outgoingDates;
      // seenRateDataSet.xaxis.categories = seenRateDates;

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
          seenRateDataSet.annotations.xaxis.push(annoItem);
        }

      console.log('Graph', this.lineChart);
    },

    resetGraphData() {
      for (const series of this.lineChart.outgoing.series) {
        series.data = [];
        series.meta.rate = [];
        series.meta.totalMessages = [];
      }

      for (const series of this.lineChart.outgoing.series) series.data = [];
      for (const series of this.lineChart.seen.series) {
        series.hasOwnProperty('meta') && (series.meta.count = []);
        series.data = [];
      }

      this.lineChart.outgoing.xaxis.categories = [];
      this.lineChart.seen.xaxis.categories = [];

      this.lineChart.outgoing.annotations.xaxis = [];
      this.lineChart.seen.annotations.xaxis = [];
    },

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

<style lang="scss" scoped>
::v-deep .v-skeleton-loader__image {
  height: 305px !important;
}
</style>
