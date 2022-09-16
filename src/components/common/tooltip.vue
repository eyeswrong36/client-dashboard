<template>
  <div :class="`tooltip tool-${tipname}`">
    <img
      :height="isLarge ? '16px' : '10px'"
      :width="isLarge ? '16px' : '10px'"
      style="position: relative; z-index: 2; top: 2px"
      :class="iconClasses"
      :src="icon"
    />
    <span
      v-if="isWide"
      :class="`tooltiptext wide text-start ${tipname} ${inverted}`"
      ><p>{{ tipInfo }}</p></span
    >
    <span v-else :class="`tooltiptext normal text-start ${tipname} ${inverted}`"
      ><p>{{ tipInfo }}</p></span
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  props: {
    icon: {
      type: String,
      default: require('@/assets/icons/info-grey.svg'),
    },

    tipInfo: {
      type: String,
    },

    isWide: {
      type: Boolean,
      default: false,
    },

    tipname: {
      type: String,
    },

    isLarge: {
      type: Boolean,
      default: true,
    },

    iconClasses: {
      type: String,
    },

    inverted: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  display: none;
  margin-top: 10px;
  padding: 15px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  p {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #ffffff;
    white-space: pre-line;
  }
}

.wide {
  width: 270px;
  background-image: url('../../assets/icons/chat-bubble-grey-wide.svg');
  &.inverted {
    background-image: url('../../assets/icons/chat-bubble-grey-wide-inverted.svg') !important;
    right: 25px !important;
  }
}
.normal {
  width: 200px;
  background-image: url('../../assets/icons/chat-bubble-grey.svg');
  &.inverted {
    background-image: url('../../assets/icons/chat-bubble-grey-inverted.svg') !important;
    right: 25px !important;
  }
}

.tool-payg-failover {
  img:first-child {
    top: -3px !important;
  }

  .payg-failover {
    @media #{map-get($display-breakpoints, 'md-only')} , #{map-get($display-breakpoints, 'xs-only')} {
      right: 10px !important;
      background-image: url('../../assets/icons/chat-bubble-grey-wide-inverted.svg') !important;
    }
  }
}

.failover {
  @media #{map-get($display-breakpoints, 'lg-and-down')} {
    right: 30px !important;
    background-image: url('../../assets/icons/chat-bubble-grey-wide-inverted.svg') !important;
  }
}
.msg-seen-count {
  background-image: url('../../assets/icons/chat-bubble-grey-wide.svg') !important;

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    right: 5px !important;
    background-image: url('../../assets/icons/chat-bubble-grey-wide-inverted.svg') !important;
  }
}
.msg-delivered-count {
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    right: 5px !important;
    background-image: url('../../assets/icons/chat-bubble-grey-wide-inverted.svg') !important;
  }
}
.sms-excess-usage,
.excess-usage {
  padding-top: 10px !important;
  @media #{map-get($display-breakpoints, 'xs-only')} , #{map-get($display-breakpoints, 'md-only')} {
    right: 25px !important;
    background-image: url('../../assets/icons/chat-bubble-grey-inverted.svg') !important;
  }
}

.optOutCount {
  padding-top: 10px !important;
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    right: 5px !important;
    background-image: url('../../assets/icons/chat-bubble-grey-wide-inverted.svg') !important;
  }
}

.tooltip:hover .tooltiptext {
  display: inline-block;
  animation: fadein 0.5s;
  -moz-animation: fadein 0.5s; /* Firefox */
  -webkit-animation: fadein 0.5s; /* Safari and Chrome */
  -o-animation: fadein 0.5s; /* Opera */
}

@keyframes fadein {
  from {
    opacity: 0;
    top: -10px;
  }
  to {
    opacity: 1;
    top: 0px;
  }
}
@-moz-keyframes fadein {
  /* Firefox */
  from {
    opacity: 0;
    top: -10px;
  }
  to {
    opacity: 1;
    top: 0px;
  }
}
@-webkit-keyframes fadein {
  /* Safari and Chrome */
  from {
    opacity: 0;
    top: -10px;
  }
  to {
    opacity: 1;
    top: 0px;
  }
}
@-o-keyframes fadein {
  /* Opera */
  from {
    opacity: 0;
    top: -10px;
  }
  to {
    opacity: 1;
    top: 0px;
  }
}
</style>
