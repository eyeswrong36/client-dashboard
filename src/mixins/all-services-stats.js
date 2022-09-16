import { getValue } from '@/views/dashboard/constants';
import { format } from 'date-fns';
export default {
  methods: {
    getAllServices() {
      let smsBlast = this.item[0].dashboards.sms['sms-blast'][0];
      let twoWaySMS = this.item[0].dashboards.sms['two-way-sms'][0];

      let campaigns = smsBlast.campaigns + twoWaySMS.campaigns;
      let msgSent = smsBlast.msgSent + twoWaySMS.msgSent;
      let successRate =
        ((parseFloat(smsBlast.successRate) +
          parseFloat(twoWaySMS.successRate)) /
          100) *
          100 +
        '%';
      let failedRate =
        ((parseFloat(smsBlast.failedRate) + parseFloat(twoWaySMS.failedRate)) /
          100) *
          100 +
        '%';
      let optOutCnt =
        ((parseFloat(smsBlast.optOutCnt) + parseFloat(twoWaySMS.optOutCnt)) /
          100) *
          100 +
        '%';
      let outgoing = smsBlast.outgoing + twoWaySMS.outgoing;
      let incoming = smsBlast.incoming + twoWaySMS.incoming;
      this.allServices[0] = {
        campaigns,
        msgSent,
        successRate,
        failedRate,
        optOutCnt,
        outgoing,
        incoming,
      };
      let fn = getValue.convertRadialPercentage(
        this.allServices[0].outgoing,
        this.allServices[0].incoming,
        this.allServices[0].outgoing + this.allServices[0].incoming
      );
      this.incoming = this.allServices[0].incoming;
      this.outgoing = this.allServices[0].outgoing;
      this.max = this.allServices[0].outgoing + this.allServices[0].incoming;
      this.seriesOutgoing = fn.seriesOutgoing;
      this.seriesIncoming = fn.seriesIncoming;

      this.itemData = this.allServices;
    },

    // integration fetch API
    async getStats(start, end, actionName, serviceID) {
      let startDate = format(new Date(new Date(start)), 'Y-MM-dd');
      let endDate = format(new Date(new Date(end)), 'Y-MM-dd');
      try {
        const res = await this.$store.dispatch(actionName, {
          startDate: startDate,
          endDate: endDate,
          serviceId: serviceID,
        });

        let data = res.data;
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
