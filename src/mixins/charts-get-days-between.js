import { format } from 'date-fns';
export default {
  methods: {
    getDaysInBetween(s, e) {
      // s = start, e = end Date
      for (
        var a = [], d = new Date(s);
        d <= new Date(e);
        d.setDate(d.getDate() + 1)
      ) {
        a.push(format(new Date(d), 'MMM dd Y'));
      }
      return a;
    },
  },
  created() {
    var daylist = this.getDaysInBetween(
      new Date(this.GET_DATE_FILTER.startDate),
      new Date(this.GET_DATE_FILTER.endDate)
    );
    this.options.xaxis.categories = daylist;
    let years = [];
    for (let x = 0; x != daylist.length; x++) {
      // this.series[0].data.push(x);
      // if (this.series[1]?.data) {
      //   this.series[1].data.push(Math.floor(Math.random() * 100));
      // }
      // if (this.series[2]?.data) {
      //   this.series[2].data.push(Math.floor(Math.random() * 100));
      // }
      if (this.options.xaxis.categories[x].includes('Dec-31')) {
        years.push(this.options.xaxis.categories[x]);
      }
    }
    if (this.options.chart.type !== 'bar') {
      for (let x = 0; x != years.length; x++) {
        this.options.annotations.xaxis.push({
          x: years[x],
          strokeDashArray: 0,
          borderColor: '#775DD0',
          label: {
            borderColor: '#775DD0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: years[x],
          },
        });
        console.log(this.options.annotations.xaxis);
      }
    }

    this.dayCount = daylist.length;

    let days = this.dayCount;
    if (this.options.chart.type !== 'bar') {
      // 7-14 days
      if (days >= 7 && days <= 14) {
        this.options.xaxis.tickAmount = 0;
        console.log('less 14');
      }

      // 2 weeks - a month dates will appear in 3-day intervals
      if (days >= 15 && days <= 22) {
        this.options.xaxis.tickAmount = 8;
        console.log('less 22');
      }
      if (days >= 23 && days <= 31) {
        this.options.xaxis.tickAmount = 13;
        console.log('less 30');
      }

      // 1 - 3 months  dates will be in weekly (7-day) intervals
      if (days >= 32 && days <= 42) {
        this.options.xaxis.tickAmount = 5;
        console.log('less 42');
      }
      if (days >= 43 && days <= 91) {
        this.options.xaxis.tickAmount = 8;
        console.log('less 73');
      }

      // 4 - 6 mos dates will be in 2 weeks (14-day) intervals
      if (days >= 92 && days <= 182) {
        this.options.xaxis.tickAmount = 13;
        console.log('less 182 / 6mos');
      }

      // 6+ mos
      if (days >= 183) {
        this.options.xaxis.tickAmount = 6;
        console.log('above 183 / 6mos');
      }
    }
  },
};
