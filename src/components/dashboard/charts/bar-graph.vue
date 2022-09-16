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
        xaxis: {
          categories: [],
          type: 'category',
          // labels: {
          //   format: `MMM dd'yy`,
          // },
          title: {
            text: 'TEST',
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
        },
        annotations: { xaxis: [] },
      },
      dataLabels: {
        enabled: false,
      },
      series: [
        {
          type: 'column',
          name: 'series-1',
          data: [],
        },
        {
          name: 'series-2',
          data: [],
        },
      ],
      stacked: true,
    };
  },
  mixins: [getDaysMixin, dateFilter],
};
</script>

<style></style>
