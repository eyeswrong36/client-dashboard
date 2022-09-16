<template>
  <div class="datepicker-container">
    <v-menu
      :close-on-content-click="false"
      :close-on-click="false"
      nudge-bottom="10"
      transition="slide-y-transition"
      left
      v-model="showDatePicker"
    >
      <template v-slot:activator="{ on }">
        <v-btn outlined color="white" v-on="on" class="btn-datepicker pa-5">
          <v-icon small color="#151C36">mdi-calendar</v-icon>
          <span class="mx-8 muted-text" style="color: #151c36">{{
            displayDates
          }}</span>
          <v-icon color="#151C36">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-card class="calendar-content" elevation="0">
        <div class="d-flex">
          <ul class="calendar-menus">
            <li v-for="(menu, idx) in calendarMenus" :key="idx">
              <a
                :ref="menu.ref"
                href="javascript:void(0)"
                :class="menu.class"
                @click="menu.onClick($event)"
              >
                {{ menu.text }}
                <ToolTip
                  v-if="menu.ref == 'customRange'"
                  tipname="optOutCount"
                  tipInfo="To view data for a single day, click twice on the date you choose."
                  :isLarge="true"
                  iconClasses="ml-2"
                  :icon="tooltipIcon"
                  :isWide="true"
                />
              </a>
            </li>
          </ul>

          <v-date-picker
            v-if="showDatePicker"
            v-model="dates"
            no-title
            scrollable
            range
            color="#008DF0"
            first-day-of-week="1"
            :max="maxDate"
            :weekday-format="formatPickerWeekday"
            @input="onInput"
          />
        </div>

        <div class="actions d-flex align-center justify-center mt-2">
          <v-btn depressed class="btn btn-secondary mx-3" @click="onCancel">
            Cancel
          </v-btn>
          <v-btn
            depressed
            class="btn primary mx-3"
            :disabled="
              dates.length < 2 || currentDate.toString() === dates.toString()
            "
            @click="onUpdate"
          >
            Update
          </v-btn>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import ToolTip from '@/components/common/tooltip.vue';
import { format, subDays } from 'date-fns';
import hasChange from '@/utils/discardValidate';

export default {
  name: 'DashboardDatePicker',
  components: {
    ToolTip,
  },

  data: () => ({
    dates: [],
    currentDate: [],
    currentActiveMenu: -1,
    activeMenu: -1,
    displayDates: '',
    showDatePicker: false,
    startDate: null,
    endDate: null,
  }),

  mounted() {
    const { startDate, endDate } =
      this.$store.getters['dashboard/GET_DATE_FILTER'];

    const firstDate = startDate ? startDate : format(new Date(), 'Y-MM-01');
    const secondDate = endDate ? endDate : format(new Date(), 'Y-MM-dd');

    this.dates = [firstDate, secondDate];
    this.displayDates = this.dateSelected();
    this.currentDate = this.dates;

    if (!startDate && !endDate)
      this.$store.commit('dashboard/SET_DATE_FILTER', {
        startDate: format(new Date(this.firstDate), 'Y-MM-dd'),
        endDate: format(new Date(this.secondDate), 'Y-MM-dd'),
      });
  },

  computed: {
    tooltipIcon() {
      return this.activeMenu === -1
        ? require('@/assets/icons/info-white.svg')
        : require('@/assets/icons/info-grey.svg');
    },

    calendarMenus() {
      return [
        {
          ref: 'lastSevenDays',
          text: 'Last 7 days',
          class: this.activeMenu === 7 ? 'active' : '',
          onClick: (e) => {
            this.setDates(7, e);
          },
        },
        {
          ref: 'lastTwoWeeks',
          text: 'Last 14 days',
          class: this.activeMenu === 14 ? 'active' : '',
          onClick: (e) => {
            this.setDates(14, e);
          },
        },
        {
          ref: 'lastThirtyDays',
          text: 'Last 30 days',
          class: this.activeMenu === 30 ? 'active' : '',
          onClick: (e) => {
            this.setDates(30, e);
          },
        },
        {
          ref: 'oneYear',
          text: '1 year',
          class: this.activeMenu === 365 ? 'active' : '',
          onClick: (e) => {
            this.setDates(365, e);
          },
        },
        {
          ref: 'customRange',
          text: 'Custom Range',
          class: this.activeMenu === -1 ? 'active' : '',
          onClick: (e) => {
            this.activeMenu = -1;
            this.dates = [];
          },
        },
      ];
    },

    maxDate() {
      const dateNow = new Date();
      const endDate = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth(),
        dateNow.getDate() + 1
      );
      return endDate.toISOString();
    },
  },

  methods: {
    dateSelected() {
      const firstDate = new Date(this.dates[0]);
      const secondDate = new Date(this.dates[1]);

      if (firstDate > secondDate) {
        this.startDate = secondDate;
        this.endDate = firstDate;
      } else {
        this.startDate = firstDate;
        this.endDate = secondDate;
      }

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      if (this.dates.length !== 2) return 'Select Date Range';

      if (
        format(new Date(this.startDate), 'Y-MM-dd') ===
        format(new Date(this.endDate), 'Y-MM-dd')
      ) {
        return `${monthNames[this.endDate.getMonth()]} ${format(
          this.endDate,
          'dd'
        )}, ${this.endDate.getFullYear()}`;
      }

      return `${monthNames[this.startDate.getMonth()]} ${format(
        this.startDate,
        'dd'
      )}${
        this.startDate.getFullYear() !== this.endDate.getFullYear()
          ? ', ' + this.startDate.getFullYear()
          : ''
      } - ${monthNames[this.endDate.getMonth()]} ${format(
        this.endDate,
        'dd'
      )}, ${this.endDate.getFullYear()}`;
    },

    setDates(lastDays, e) {
      this.dates = [
        format(subDays(new Date(), lastDays - 1), 'Y-MM-dd'),
        format(new Date(), 'Y-MM-dd'),
      ];
      this.activeMenu = lastDays;
    },

    onInput() {
      this.activeMenu = -1;
    },

    onUpdate() {
      this.currentActiveMenu = this.activeMenu;
      this.displayDates = this.dateSelected();
      this.currentDate = this.dates;
      this.showDatePicker = false;
      this.$store.commit('dashboard/SET_DATE_FILTER', {
        startDate: format(new Date(this.startDate), 'Y-MM-dd'),
        endDate: format(new Date(this.endDate), 'Y-MM-dd'),
      });
    },

    onCancel() {
      this.showDatePicker = false;
      this.dates = this.currentDate;
      this.activeMenu = this.currentActiveMenu;
    },

    hasChange,

    formatPickerWeekday(v) {
      const date = new Date(v);
      return format(date, 'EEE');
    },
  },
};
</script>
<style lang="scss">
.calendar-content {
  padding: 16px 16px 25px 25px;
  .v-date-picker-table .v-btn:hover {
    box-shadow: none !important;
  }
  .calendar-menus {
    width: 130px;
    text-decoration: none;
    list-style-type: none;
    padding: 0 !important;
    margin-top: 35px !important;
    margin-right: 20px !important;

    a {
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: #151c36;
      padding: 13px;
      border-radius: 5px;
      margin: 2px 0;

      &.active {
        background-color: #008df0;
        color: #ffffff;
      }
      &:hover:not(.active) {
        background-color: rgba(0, 141, 240, 0.1);
      }
    }
  }

  .actions {
    .btn {
      width: 150px !important;
      height: 48px !important;
    }
  }
}

.v-date-picker-header__value {
  button {
    color: #151c36 !important;
  }
}

.v-date-picker-table {
  table {
    border-collapse: collapse !important;
    th {
      color: #898989 !important;
    }
    td {
      padding: 2px !important;
      width: 100px !important;
    }
  }

  .v-btn {
    border-radius: 0 !important;
    width: 32px !important;
    height: 30px !important;
    .v-btn__content {
      color: #151c36 !important;
    }
    &.v-btn--disabled {
      .v-btn__content {
        color: #898989 !important;
      }
    }
    &.v-btn--active {
      .v-btn__content {
        color: #fff !important;
      }
    }
  }

  .v-btn--active:not(.v-date-picker--first-in-range):not(.v-date-picker--last-in-range) {
    background: rgba(0, 141, 240, 0.1) !important;
    .v-btn__content {
      color: #151c36 !important;
    }
  }

  .v-date-picker--first-in-range,
  .v-date-picker--last-in-range,
  .v-btn--outlined,
  .v-btn--text {
    border-radius: 8px !important;
  }
}
</style>
