<template>
  <div class="page-content-padded">
    <v-row v-if="!loading" class="row-stats">
      <v-col class="col-spacer" cols="6" sm="6" md="3">
        <card
          tool-tip
          class="pa-2 card-stats"
          color="#008DF0"
          tip-info="This includes both completed and ongoing campaigns."
          card-title="Campaigns"
          :card-value="messenger[0].campaigns"
        />
      </v-col>
      <v-col class="col-spacer" cols="6" sm="6" md="3">
        <card
          is-wide
          tool-tip
          class="pa-2 card-stats"
          color="#008DF0"
          tipname="msg-delivered-count"
          tip-info="The Delivered metric tracks the number of times a user received the message across different devices."
          card-title="Delivered Count"
          :card-value="messenger[0].deliveredCount"
        />
      </v-col>
      <v-col class="col-spacer" cols="6" sm="6" md="3">
        <card
          class="pa-2 card-stats"
          color="#DA4175"
          card-title="Failed Count"
          :card-value="messenger[0].failedCount"
      /></v-col>
      <v-col class="col-spacer" cols="6" sm="6" md="3">
        <card
          is-wide
          tool-tip
          class="pa-2 card-stats"
          color="#008DF0"
          tipname="msg-seen-count"
          tip-info="The Seen metric tracks the number of times a user viewed the message across different devices."
          card-title="Seen Count"
          :card-value="messenger[0].seenCount"
      /></v-col>

      <v-col cols="12" sm="12" md="6">
        <line-graph
          title="Outgoing Messages"
          :series="outgoing.series"
          :xaxis="outgoing.xaxis"
          :annotations="outgoing.annotations"
          :colors="outgoing.colors"
          :tooltip="outgoing.tooltip"
          :footer-title="outgoing.footerTitle"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <bar-graph
          title="Seen Rate"
          :series="seen.series"
          :xaxis="seen.xaxis"
          :annotations="seen.annotations"
          :colors="seen.colors"
          :tooltip="seen.tooltip"
          :footer-title="seen.footerTitle"
        />
      </v-col>
    </v-row>
    <loader v-else />
  </div>
</template>

<script>
// utils
import { format } from 'date-fns';
import { logger } from '@/utils/logger';
import { formatAmount, sort } from '@/utils/helpers';
// components
import Card from '@/components/dashboard/cards/card';
import Loader from '@/components/dashboard/messenger/loader';
import BarGraph from '@/components/dashboard/graphs/bar-graph';
import LineGraph from '@/components/dashboard/graphs/line-graph';
// mixins
import AllServicesStats from '@/mixins/all-services-stats';

const log = logger('dashboard:messenger');

export default {
  name: 'DashboardMessenger',
  components: {
    Card,
    Loader,
    BarGraph,
    LineGraph,
  },
  mixins: [AllServicesStats],

  data() {
    return {
      show: false,
      loading: true,
      messenger: [
        {
          campaigns: '',
          deliveredCount: '',
          failedCount: '',
          seenCount: '',
        },
      ],
      timerId: null,

      // LineGraph
      outgoing: {
        series: [
          {
            name: 'Sent',
            color: '#008DF0',
            data: [],
            meta: {
              percentage: [],
              totalMessages: [],
              tooltipLabel: [],
            },
          },
          {
            name: 'Failed',
            color: '#DA4175',
            data: [],
            meta: {
              percentage: [],
              totalMessages: [],
              tooltipLabel: [],
            },
          },
        ],
        xaxis: {
          tickAmount: 12,
          categories: [],
        },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const date = w.globals.categoryLabels[dataPointIndex];
            const label = w.globals.seriesNames[seriesIndex];
            const count =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            const { percentage, tooltipLabel, totalMessages } =
              w.globals.initialSeries[seriesIndex].meta;

            const rate = percentage[dataPointIndex];
            const total = totalMessages[dataPointIndex];

            return `<div class="px-3 py-2" >
                <div class="font-weight-400 font-12">
                  ${tooltipLabel[dataPointIndex] || date}
                </div>
                <div class="font-weight-400 font-10">
                  Total Messages: <b>${formatAmount(total)}</b></div>
                <div class="font-weight-400 font-10">
                  ${label}: <b>${formatAmount(count)} (${formatAmount(
              rate,
              0,
              2
            )}%)</b>
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
        colors: ['#008DF0', '#DA4175'],
        footerTitle: '',
      },

      // BarGraph
      seen: {
        series: [
          {
            name: 'SeenRate',
            color: '#008DF0',
            data: [],
            meta: {
              count: [],
              tooltipLabel: [],
            },
          },
          {
            name: 'UnseenRate',
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
            const tooltipLabel =
              w.globals.initialSeries[seriesIndex].meta.tooltipLabel[
                dataPointIndex
              ];

            return `<div class="px-3 py-2" >
                <div class="font-weight-400 font-12 mb-1">
                  ${tooltipLabel || date}
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
    };
  },

  computed: {
    dateFilter() {
      return this.$store.getters['dashboard/GET_DATE_FILTER'];
    },
  },

  beforeDestroy() {
    // just to make sure that interval is properly disposed
    clearInterval(this.timerId);
  },

  watch: {
    dateFilter: {
      deep: true,
      immediate: true,
      async handler() {
        this.loading = true;
        let timer = 0;

        try {
          // add a timer to adjust for loader to have atleast 500ms of show time
          this.timerId = setInterval(() => timer++, 1);

          await Promise.allSettled([
            this.getMessengerStats(),
            this.getGraphDetails(),
          ]);

          // clear right after API call
          clearInterval(this.timerId);
        } catch (error) {
          console.error(error);
        } finally {
          // just to make sure that interval is properly disposed
          if (this.timerId) clearInterval(this.timerId);

          const timerDiff = 500 - timer;
          if (timerDiff > 0) {
            setTimeout(() => (this.loading = false), timerDiff);
          } else {
            this.loading = false;
          }
        }
      },
    },
  },

  methods: {
    async getMessengerStats() {
      const { startDate, endDate } = this.dateFilter;
      if (!startDate || !endDate) return;

      const res = await this.getStats(
        startDate,
        endDate,
        'dashboard/getHighlevelStats',
        13
      );

      this.messenger = [
        {
          campaigns: res.campaign_count,
          deliveredCount: res.delivered_count,
          failedCount: res.failed_count,
          seenCount: res.seen_count,
        },
      ];
    },

    async getGraphDetails() {
      const { startDate, endDate } = this.dateFilter;
      if (!startDate || !endDate) return;

      this.resetGraphData();

      const res = await this.$store.dispatch('dashboard/getGraphStats', {
        startDate,
        endDate,
        serviceId: '13',
      });

      const { outgoing, seen } = res?.data || {};
      const dates = Object.keys(outgoing) || [];
      const monthYearRange = [];
      const yearsRange = [];

      // Iterate through all the dates given
      dates.forEach((date) => {
        const monthYear = format(new Date(date), 'MMM yyyy');
        const year = format(new Date(date), 'yyyy');

        if (!monthYearRange.includes(monthYear)) {
          monthYearRange.push(monthYear);
        }

        if (!yearsRange.includes(year)) yearsRange.push(year);

        // LineGraph
        const [sentSeries, failedSeries] = this.outgoing.series;

        outgoing[date].forEach(({ label, value }) => {
          switch (label) {
            case 'success': {
              sentSeries.data.push(value || 0);
              break;
            }
            case 'success rate': {
              sentSeries.meta.percentage.push(value || 0);
              break;
            }
            case 'total messages': {
              sentSeries.meta.totalMessages.push(value || 0);
              failedSeries.meta.totalMessages.push(value || 0);
              break;
            }
            case 'failed': {
              failedSeries.data.push(value || 0);
              break;
            }
            case 'failed rate': {
              failedSeries.meta.percentage.push(value || 0);
              break;
            }
          }
        });

        // Formatted tooltip date label for LineGraph
        sentSeries.meta.tooltipLabel.push(
          this.formatDate(date, monthYearRange, 'MMMM')
        );
        failedSeries.meta.tooltipLabel.push(
          this.formatDate(date, monthYearRange, 'MMMM')
        );

        // BarGraph
        const [seenSeries, unseenSeries] = this.seen.series;
        const seenRate =
          seen[date].find((v) => v.label === 'seen rate').value || 0;

        seenSeries.data.push(formatAmount(seenRate, 0, 2));
        seenSeries.meta.count.push(
          seen[date].find((v) => v.label === 'seen').value || 0
        );
        seenSeries.meta.tooltipLabel.push(
          this.formatDate(date, monthYearRange, 'MMMM')
        );
        unseenSeries.data.push(formatAmount(100 - seenRate, 0, 2));
      });

      // Set Categories for both graphs
      this.seen.xaxis.categories = this.outgoing.xaxis.categories = dates.map(
        (d) => this.formatDate(d, monthYearRange)
      );

      // Add annotating line for year range
      if (yearsRange.length > 1) {
        yearsRange.forEach((year) => {
          const datesInYear = dates.filter((d) => d.toString().includes(year));

          const annotationDate = sort(datesInYear, {
            sortOrder: 'asc',
          }).pop();

          const annoItem = {
            x: this.formatDate(annotationDate, monthYearRange),
            borderColor: '#6D3D91',
            label: {
              style: {
                color: '#6D3D91',
              },
              text: year,
            },
          };

          this.outgoing.annotations.xaxis.push(annoItem);
          this.seen.annotations.xaxis.push(annoItem);
        });
      }

      log('getGraphDetails#outgoing: ', this.outgoing);
      log('getGraphDetails#seen: ', this.seen);
    },

    resetGraphData() {
      // LineGraph
      this.outgoing.series.forEach((s) => {
        s.data = [];
        s.meta.percentage = [];
        s.meta.tooltipLabel = [];
        s.meta.totalMessages = [];
      });

      this.outgoing.xaxis.categories = [];
      this.outgoing.annotations.xaxis = [];

      // BarGraph
      this.seen.series.forEach((s) => {
        s.data = [];
      });

      this.seen.series[0].meta.count = [];
      this.seen.series[0].meta.tooltipLabel = [];

      this.seen.xaxis.categories = [];
      this.seen.annotations.xaxis = [];
    },

    formatDate(date, monthYearRange, monthFormat = 'MMM') {
      return format(
        new Date(date),
        monthYearRange.length >= 7 && monthYearRange.length <= 12
          ? `${monthFormat}`
          : monthYearRange.length > 12
          ? `${monthFormat} yyyy`
          : `${monthFormat} dd`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.row-stats {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
