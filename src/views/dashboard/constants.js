import { format } from 'date-fns';
export const getValue = {
  convertRadialPercentage(outgoing, incoming, consumed, usage, max) {
    const seriesOutgoing = [(outgoing / max) * 100];
    const seriesIncoming = [(incoming / max) * 100];
    const seriesUsage = [(usage / max) * 100];
    const seriesConsumed = [(consumed / max) * 100];
    return { seriesOutgoing, seriesIncoming, seriesUsage, seriesConsumed };
  },
  getDaysInBetween(s, e) {
    // s = start, e = end Date
    for (
      var a = [], d = new Date(s);
      d <= new Date(e);
      d.setDate(d.getDate() + 1)
    ) {
      a.push(format(new Date(d), 'Y-MM-dd'));
      //   console.log(format(new Date(d), 'Y-MM-dd'))
    }
    return a;
  },
};
