<template>
  <div>
    <apexchart
      width="100%"
      type="line"
      height="350px"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import dateFilter from '@/mixins/date-filter';
import getDaysMixin from '@/mixins/charts-get-days-between';
export default {
  data() {
    return {
      options: {
        chart: {
          id: 'vuechart-example',
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
        },
        colors: ['#008DF0', '#DA4175'],

        stroke: {
          width: 3,
        },
        xaxis: {
          categories: [],
          type: 'category',
          // labels: {
          //   format: `MMM dd'yy`,
          // },
          title: {
            text: 'Total Sent: 2000',
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
        },
        annotations: {
          xaxis: [],
        },
      },
      series: [
        {
          name: ['Success'],
          data: [],
        },
        {
          name: ['Failed'],
          data: [],
        },
      ],

      dayCount: 0,
    };
  },
  mixins: [getDaysMixin, dateFilter],
};
</script>

<style></style>
