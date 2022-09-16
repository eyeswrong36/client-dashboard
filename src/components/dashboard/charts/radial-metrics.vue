<template>
  <div class="radial">
    <apexchart
      width="100%"
      height="195%"
      :options="options"
      :series="series"
      style="z-index: 0; position: relative"
    ></apexchart>
    <div
      class="text-center"
      style="bottom: 175px; height: 0; z-index: 0; position: relative"
    >
      <p style="font-weight: 500; font-size: 16px; line-height: 20px">
        {{
          glabs
            ? `₱${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : value.toLocaleString()
        }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {},
    };
  },
  props: {
    series: { type: Array },
    color: { type: String },
    label: { type: String },
    glabs: { type: Boolean, default: false },
    value: { type: Number },
  },
  methods: {
    apexChartInit() {
      this.options = {
        chart: {
          type: 'radialBar',
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
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: '#ebebeb',
              startAngle: -90,
              endAngle: 90,
            },
            dataLabels: {
              showOn: 'always',
              name: {
                offsetY: -20,
                show: true,
                color: '#898989',
                fontSize: '10px',
                fontFamily: 'Satoshi',
                fontWeight: '700',
              },
              value: {
                offsetY: -15,
                color: '#151C36',
                fontSize: '16px',
                show: false,
                formatter: function (val) {
                  return val.toLocaleString();
                },
              },
            },
          },
        },
        fill: {
          type: 'solid',
          colors: [this.color],
        },
        stroke: {
          lineCap: 'butt',
        },
        labels: [this.label],
        stroke: {
          lineCap: 'round',
        },
      };
    },
  },
  created() {
    this.apexChartInit();
  },
};
</script>

<style lang="scss" scoped>
.radial {
  margin-top: -55px;
}
</style>
