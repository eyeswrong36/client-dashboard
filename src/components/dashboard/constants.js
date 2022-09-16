export const TAB_MENU = Object.freeze([
  {
    text: 'SMS',
    routeName: 'dashboard-sms',
    channel: 'sms',
    show: false,
  },
  {
    text: 'Viber',
    routeName: 'dashboard-viber',
    channel: 'viber',
    show: false,
  },
  {
    text: 'Messenger',
    routeName: 'dashboard-messenger',
    channel: 'messenger',
    show: false,
  },
  {
    text: 'API',
    routeName: 'dashboard-api',
    channel: 'api',
    show: false,
  },
]);

export const planDefault = (override) => {
  return {
    name: '',
    credits: '',
    creditResetDate: '',
    isGauge: true,
    gaugeData: [],
    usageData: [],
    isGlabs: false,
    cutOff: '',
    incoming: 0,
    outgoing: 0,
    failover: false,
    failoverCount: 0,
    failoverCost: 0,
    ...override,
  };
};

// export const Item = Object.freeze([
//   {
//     id: '123',
//     dashboards: {
//       plans: {
//         'amber-plan': [
//           {
//             'remaining-credits': { outgoing: 570, incoming: 1368 },
//             'excess-usage': { outgoing: 120, incoming: 30 },
//           },
//         ],
//         'mobile-360': [
//           {
//             'credits-usage': { consumed: 1430, remaining: 570 },
//             'consumed-credits': { outgoing: 570, incoming: 1368 },
//           },
//         ],
//         'sms-diy': [
//           {
//             'remaining-credits': { outgoing: 600, incoming: 1368 },
//             'excess-usage': { outgoing: 200, incoming: 300 },
//           },
//         ],
//         'sms-api': [
//           {
//             'remaining-balance': 570,
//             consumed: 1430,
//             'consumed-credits': { outgoing: 570, incoming: 1368 },
//             'excess-usage': { outgoing: 0, incoming: 0 },
//           },
//         ],
//         glabs: [
//           {
//             consumed: 1430,
//             'remaining-balance': 570,
//             'consumed-credits': { outgoing: 570, incoming: 1368 },
//           },
//         ],
//         'sms-diy-payg': { incoming: 500, outgoing: 2500 },
//       },
//       sms: {
//         'sms-blast': [
//           {
//             campaigns: 456,
//             msgSent: 456,
//             successRate: '89%',
//             failedRate: '2%',
//             optOutCnt: '12%',
//             outgoing: 2200,
//             incoming: 1000,
//             max: 4000,
//           },
//         ],
//         'two-way-sms': [
//           {
//             campaigns: 789,
//             msgSent: 789,
//             successRate: '29%',
//             failedRate: '2%',
//             optOutCnt: '12%',
//             outgoing: 200,
//             incoming: 800,
//             max: 1000,
//           },
//         ],
//       },
//       viber: [
//         {
//           date: '2022-07-21',
//           campaigns: 5,
//           msgSent: 1,
//           successRate: '19%',
//           failedRate: '20%',
//           optOutCnt: '2%',
//           seenRate: '29%',
//         },
//         {
//           date: '2022-08-01',
//           campaigns: 1,
//           msgSent: 2,
//           successRate: '19%',
//           failedRate: '20%',
//           optOutCnt: '2%',
//           seenRate: '29%',
//         },
//         {
//           date: '2022-08-19',
//           campaigns: 2,
//           msgSent: 3,
//           successRate: '19%',
//           failedRate: '20%',
//           optOutCnt: '2%',
//           seenRate: '29%',
//         },
//         {
//           date: '2022-08-21',
//           campaigns: 3,
//           msgSent: 4,
//           successRate: '25%',
//           failedRate: '20%',
//           optOutCnt: '9%',
//           seenRate: '29%',
//         },
//       ],
//       api: [
//         {
//           campaigns: 443,
//           msgSent: 11123,
//           successRate: '19%',
//           failedRate: '20%',
//           optOutCnt: '6%',
//         },
//       ],
//       messenger: [
//         {
//           campaigns: 443,
//           deliveredCount: 11123,
//           failedCount: '19%',
//           seenCount: 40,
//         },
//       ],
//     },
//   },
// ]);
