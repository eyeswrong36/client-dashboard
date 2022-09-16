import { COLORS } from '@/constants';
import { formatAmount } from '@/utils/helpers';
export const SMS_API_SERVICE_ID = 7;
export const VIBER_API_SERVICE_ID = 17;
export const TELCO = [
  {
    name: 'Globe',
    color: '#008DF0',
    data: [],
  },
  {
    name: 'Smart',
    color: '#18E2CE',
    data: [],
  },
  {
    name: 'DITO',
    color: '#DA4175',
    data: [],
  },
  {
    name: 'International',
    color: '#6D3D91 ',
    data: [],
  },
  {
    name: 'Unknown',
    color: '#FFB838',
    data: [],
  },
];
export const viberDefault = () =>
  Object.freeze([
    {
      label: 'Transactions',
      value: 0,
    },
    {
      label: 'Messages Sent',
      value: 0,
    },
    {
      label: 'Success Rate',
      value: `0%`,
    },
    {
      label: 'Failed Rate',
      value: `0%`,
      color: '#DA4175',
    },
    {
      label: 'Opt Out Count',
      value: 0,
      hasTooltip: true,
      tooltip: {
        name: 'optOutCount',
        tipInfo:
          "This includes all mobile numbers on your current Viber opt-out list. It can't be filtered based on the date range you have selected.",
        isWide: true,
        size: 'large',
      },
    },
    {
      label: 'Seen Rate',
      value: `0%`,
    },
  ]);
export const smsDefault = () =>
  Object.freeze([
    {
      label: 'Transactions',
      value: 0,
    },
    {
      label: 'Messages Sent',
      value: 0,
    },
    {
      label: 'Success Rate',
      value: `0%`,
    },
    {
      label: 'Failed Rate',
      value: `0%`,
    },
  ]);
export const charOptionDefault = ({
  chart = {},
  xaxis = {},
  yaxis = {},
  annotations = {},
  states = {},
  title = {},
  legend = {},
  stroke = {},
  markers = {},
  tooltip = {},
  dataLabels = {},
  setOptions = {},
  footerTitle = '',
}) => {
  // console.log('tooltip', tooltip);
  return {
    chart: {
      type: 'line',
      stacked: false,
      toolbar: {
        show: false,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Satoshi',
      ...chart,
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        show: true,
        style: {
          color: '#667085',
          fontSize: '12px',
          fontFamily: 'Satoshi',
          fontWeight: 400,
          cssClass: '',
        },
      },
      title: {
        text: footerTitle,
        style: {
          color: '#667085',
          fontSize: '12px',
          fontFamily: 'Satoshi',
          fontWeight: 400,
          cssClass: '',
        },
      },
      tooltip: {
        enabled: false,
      },
      ...xaxis,
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          color: '#667085',
          fontSize: '12px',
          fontFamily: 'Satoshi',
          fontWeight: 400,
          cssClass: '',
        },
        formatter: function (value) {
          return formatAmount(value) || value;
        },
      },
      title: {
        text: '',
        style: {
          color: '#667085',
          fontSize: '12px',
          fontFamily: 'Satoshi',
          fontWeight: 400,
          cssClass: '',
        },
      },
      tooltip: {
        enabled: false,
      },
      ...yaxis,
    },
    states: {
      active: {
        allowMultipleDataPointsSelection: true,
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      ...states,
    },
    stroke: {
      width: 3,
      ...stroke,
    },
    markers: {
      size: 0,
      fillOpacity: 0.5,
      strokeColors: COLORS.PRIMARY,
      hover: {
        size: 5,
      },
      ...markers,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      fontSize: '12px',
      fontFamily: 'Satoshi',
      color: '#151C36',
      fontWeight: 400,
      offsetX: 0,
      offsetY: -48,
      ...legend,
    },
    title: {
      text: 'Title',
      align: 'left',
      floating: false,
      margin: 20,
      style: {
        fontSize: '16px',
        fontWeight: '500',
        fontFamily: 'Satoshi',
        color: '#151C36',
      },
      ...title,
    },
    tooltip: {
      shared: false,
      intersect: true,
      followCursor: false,
      ...tooltip,
    },
    dataLabels: {
      enabled: false,
      ...dataLabels,
    },
    annotations: {
      xaxis: [],
      yaxis: [],
      ...annotations,
    },
    ...setOptions,
  };
};
export const barChartOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    stackType: '100%',
    toolbar: {
      show: false,
      autoSelected: 'zoom',
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
        customIcons: [],
      },
    },
    zoom: {
      enabled: false,
    },
    fontFamily: 'Satoshi',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      barHeight: '100%',
      rangeBarOverlap: false,
      endingShape: 'rounded',
      borderRadius: [8, 8],
      colors: {
        backgroundBarColors: ['transparent', 'transparent'],
        backgroundBarOpacity: 1,
        backgroundBarRadius: 0,
      },
    },
  },
  yaxis: {
    tickAmount: 4,
    labels: {
      minWidth: 0,
      maxWidth: 100,
      formatter: (val) => {
        return `${val}%`;
      },
      style: {
        color: '#66687B',
        fontSize: '12px',
        fontFamily: 'Satoshi',
        fontWeight: 400,
        lineHeight: '18px',
      },
    },
  },
  fill: {
    opacity: 1,
    colors: ['#6D3D91', '#f1f1f1'],
    type: 'solid',
    pattern: {
      style: 'verticalLines',
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none',
        value: 0,
      },
    },
    active: {
      filter: {
        type: 'none',
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent'],
  },
  grid: {
    show: false,
  },
};
