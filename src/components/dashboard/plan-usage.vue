<template>
  <GaugeMetrics
    :color="color"
    :metrics-title="plan.credits"
    :metrics-plan="plan.name"
    :credit-reset="plan.creditResetDate"
    :gaugeData="plan.gaugeData"
    :usageData="plan.usageData"
    :glabs="plan.isGlabs"
  />
</template>
<script>
import GaugeMetrics from '@/components/dashboard/graphs/gauge-metrics.vue';
import { toProperCase, toLowerCase, formatAmount, sort } from '@/utils/helpers';
import { planDefault } from '@/components/dashboard/constants';
import { format } from 'date-fns';
export default {
  name: 'plan-usage',

  components: {
    GaugeMetrics,
  },

  props: {
    color: {
      type: String,
      default: '#008DF0',
    },

    planData: {
      type: Object,
      default: () => {},
    },
  },

  data: () => ({
    plan: planDefault(),
  }),

  mounted() {
    this.setPlan();
  },

  methods: {
    async setPlan() {
      try {
        const data = this.planData || {};

        if (
          !data.hasOwnProperty('header') ||
          !data.hasOwnProperty('body') ||
          !data.hasOwnProperty('footer')
        )
          return;

        let gauge = data?.body.gauge ?? [];
        this.plan.isGauge = isGauge;
        const isGauge = data.body?.with_gauge || false;
        const footer = data.footer ?? {};

        const {
          plan_name,
          plan_label,
          billing_cycle_date,
          billing_cycle_lable,
        } = data?.header;
        this.plan.credits = plan_label || '';
        this.plan.name = plan_name || '';
        this.plan.creditResetDate = `${billing_cycle_lable}: ${format(
          new Date(billing_cycle_date),
          'MMMM dd, Y'
        )}`;

        this.plan.isGlabs = toLowerCase(plan_name)?.includes('glabs') || false;

        if (!Array.isArray(gauge)) {
          gauge = [gauge];
        }

        for (const child of gauge) {
          const guageItem = {
            label: child?.label,
            series: [(child?.used / child?.max) * 100 || 0],
            maxValue: child?.max,
            value: child?.used,
            color: this.color,
          };

          this.plan.gaugeData.push(guageItem);
        }
        if (typeof footer === 'object') {
          for (const columnText of Object.keys(footer)) {
            const columnObj = footer[columnText];
            const index = columnObj?.index ?? Object.keys(footer).length + 1;
            let tooltip = false;
            let defineValue = false;
            if (columnObj.hasOwnProperty('tooltip')) {
              tooltip = {
                name: columnText.includes('excess')
                  ? 'excess-usage'
                  : columnText || '',
                tipInfo: columnObj?.tooltip || '',
                isWide: columnText === 'sms_failover' || false,
              };
              delete columnObj['tooltip'];
            }

            if (columnObj.hasOwnProperty('cost')) {
              defineValue = formatAmount(columnObj.cost, 2, 2);
              delete columnObj['cost'];
            }

            let columnValues = [];

            if (typeof columnObj === 'object')
              for (const colChilds of Object.keys(columnObj)) {
                if (colChilds !== 'index') {
                  const itemRow = {
                    label: toProperCase(colChilds),
                    value: columnObj[colChilds],
                    defineValue,
                  };

                  columnValues.push(itemRow);
                }
              }
            else
              columnValues.push({
                label: columnText,
                value: footer[columnText],
                defineValue,
              });

            const columnItem = {
              textColumn: toProperCase(columnText),
              values: columnValues,
              tooltip,
              index,
            };

            this.plan.usageData.push(columnItem);
          }
        }

        return sort(this.plan.usageData, { key: 'index' });
      } catch (err) {
        console.error(err);
        this.plan = plan();
      }
    },
  },
};
</script>
