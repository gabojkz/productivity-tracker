<template>
  <div class="full-year-view">
    <div class="year-calendar">
      <!-- Month Headers -->
      <div class="month-headers">
        <div
          v-for="month in yearMonths"
          :key="month.monthIndex"
          class="month-header"
          :class="getMonthColorClass(month.monthIndex)"
        >
          {{ month.monthName }}
          <span v-if="isQuarterEnd(month.monthIndex)" class="quarter-label">
            (Q{{ getQuarter(month.monthIndex) }})
          </span>
        </div>
      </div>

      <!-- Day Rows - Show actual days for each month -->
      <div
        v-for="dayNumber in getMaxDaysInYear()" 
        :key="dayNumber" 
        class="day-row"
      >
        <div 
          v-for="month in yearMonths" 
          :key="month.monthIndex" 
          class="day-cell"
          :class="[
            getMonthColorClass(month.monthIndex),
            { 
              'has-events': getDayEvents(month.monthIndex, dayNumber).length > 0,
              'valid-day': isValidDay(month.monthIndex, dayNumber),
              'invalid-day': !isValidDay(month.monthIndex, dayNumber),
              'weekend': isWeekend(month.monthIndex, dayNumber) && !showWeekends
            }
          ]"
          @click="isValidDay(month.monthIndex, dayNumber) && selectDateFromYear(getDayData(month.monthIndex, dayNumber))"
          v-show="showWeekends || !isWeekend(month.monthIndex, dayNumber)"
        >
          <div class="day-content" v-if="isValidDay(month.monthIndex, dayNumber)">
            <div class="day-number">{{ dayNumber }}</div>
            <div class="day-of-week">{{ getDayOfWeek(month.monthIndex, dayNumber) }}</div>
            <div v-if="getDayEvents(month.monthIndex, dayNumber).length > 0" class="event-indicator"></div>
            <div class="week-number" v-if="getWeekNumber(month.monthIndex, dayNumber)">
              {{ getWeekNumber(month.monthIndex, dayNumber) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FullYearView",
  props: {
    currentDate: {
      type: Date,
      required: true,
    },
    events: {
      type: Array,
      required: true,
    },
    viewPeriod: {
      type: Number,
      default: 12,
    },
    showWeekends: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    yearMonths() {
      const months = [];
      const year = this.currentDate.getFullYear();
      
      for (let i = 0; i < 12; i++) {
        const month = new Date(year, i, 1);
        months.push({
          monthIndex: i,
          monthName: month.toLocaleDateString("en-US", { month: "long" }),
          year: year,
        });
      }

      return months;
    },
  },
  methods: {
    getDaysInMonth(year, month) {
      if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12");
      }
      if (year < 1000 || year > 9999) {
        throw new Error("Year must be between 1000 and 9999");
      }

      const days = [];

      // JS Date month is 0-based, so subtract 1
      const targetMonth = month - 1;

      // Start with the first day of the month
      let date = new Date(year, targetMonth, 1);

      // loop until the next month
      let id = 0;
      while (date.getMonth() === targetMonth) {
        days.push({ id: id++, date });
        date.setDate(date.getDate() + 1);
      }

      return days;
    },
    getMonthColorClass(monthIndex) {
      const colorClasses = [
        "month-blue", // January, February, March
        "month-blue",
        "month-blue",
        "month-green", // April, May
        "month-green",
        "month-yellow", // June, July
        "month-yellow",
        "month-orange", // August, September
        "month-orange",
        "month-pink", // October
        "month-purple", // November
        "month-light-blue", // December
      ];
      return colorClasses[monthIndex] || "month-default";
    },
    isQuarterEnd(monthIndex) {
      return (
        monthIndex === 2 ||
        monthIndex === 5 ||
        monthIndex === 8 ||
        monthIndex === 11
      );
    },
    getQuarter(monthIndex) {
      return Math.floor(monthIndex / 3) + 1;
    },
    getDayOfWeek(monthIndex, dayNumber) {
      const date = new Date(
        this.currentDate.getFullYear(),
        monthIndex,
        dayNumber
      );
      return date.toLocaleDateString("en-US", { weekday: "short" });
    },
    getDayData(monthIndex, dayNumber) {
      const date = new Date(
        this.currentDate.getFullYear(),
        monthIndex,
        dayNumber
      );
      const dayEvents = this.events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });

      return {
        date: date.toISOString().split("T")[0],
        dayNumber: dayNumber,
        isCurrentMonth: date.getMonth() === monthIndex,
        isToday: date.toDateString() === new Date().toDateString(),
        events: dayEvents,
      };
    },
    getDayEvents(monthIndex, dayNumber) {
      const dayData = this.getDayData(monthIndex, dayNumber);
      return dayData.events;
    },
    getWeekNumber(monthIndex, dayNumber) {
      const date = new Date(
        this.currentDate.getFullYear(),
        monthIndex,
        dayNumber
      );
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

      // Only show week numbers for specific days (like in the image)
      const showWeekNumbers = [
        { month: 1, day: 2 }, // February 2nd
        { month: 2, day: 3 }, // March 3rd
        { month: 3, day: 3 }, // April 3rd
        { month: 5, day: 2 }, // June 2nd
        { month: 7, day: 4 }, // August 4th
        { month: 8, day: 1 }, // September 1st
        { month: 9, day: 6 }, // October 6th
        { month: 10, day: 3 }, // November 3rd
        { month: 11, day: 1 }, // December 1st
      ];

      const shouldShow = showWeekNumbers.some(
        (item) => item.month === monthIndex && item.day === dayNumber
      );

      return shouldShow ? weekNumber : null;
    },
    selectDateFromYear(day) {
      this.$emit("select-date", day);
    },
    getMaxDaysInYear() {
      // Return 31 to show all possible days, but we'll handle invalid days with isValidDay()
      return 31;
    },
    isValidDay(monthIndex, dayNumber) {
      const year = this.currentDate.getFullYear();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      return dayNumber <= daysInMonth;
    },
    isWeekend(monthIndex, dayNumber) {
      if (!this.isValidDay(monthIndex, dayNumber)) return false;
      const year = this.currentDate.getFullYear();
      const date = new Date(year, monthIndex, dayNumber);
      return date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
    },
  },
};
</script>

<style scoped>
.full-year-view {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
}

.year-calendar {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  overflow-x: auto;

  /* Apply to any element you want to make unselectable */
  -webkit-user-select: none;  /* Chrome, Safari, newer Opera */
  -moz-user-select: none;     /* Firefox */
  -ms-user-select: none;      /* Internet Explorer/Edge Legacy */
  user-select: none;          /* Standard */

}

/* Optionally, prevent the default highlight color on selected text */
.year-calendar::selection {
  background: transparent;
}

.month-headers {
  display: flex;
  border-bottom: 2px solid #dee2e6;
  font-weight: bold;
  background-color: #f8f9fa;
}

.day-label {
  min-width: 60px;
  padding: 15px 10px;
  text-align: center;
  font-weight: bold;
  background-color: #e9ecef;
  border-right: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-header {
  flex: 1;
  min-width: 120px;
  padding: 15px 10px;
  text-align: center;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.quarter-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

.day-row {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.day-row:last-child {
  border-bottom: none;
}

.day-cell {
  flex: 1;
  min-width: 120px;
  min-height: 80px;
  padding: 8px;
  border-right: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.day-cell:hover {
  background-color: #f8f9fa;
}

.invalid-day {
  background-color: #f8f9fa;
  opacity: 0.3;
  cursor: not-allowed;
}

.valid-day {
  cursor: pointer;
}

.day-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.day-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.day-of-week {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

.event-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background-color: #dc3545;
  border-radius: 50%;
}

.week-number {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 0.7rem;
  color: #007bff;
  font-weight: bold;
}

/* Month Color Classes */
.month-blue {
  background-color: #e3f2fd;
}

.month-green {
  background-color: #e8f5e8;
}

.month-yellow {
  background-color: #fff8e1;
}

.month-orange {
  background-color: #fff3e0;
}

.month-pink {
  background-color: #fce4ec;
}

.month-purple {
  background-color: #f3e5f5;
}

.month-light-blue {
  background-color: #e1f5fe;
}

.month-default {
  background-color: white;
}

/* Highlight specific days */
.day-cell .day-number:first-child {
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

/* Responsive design */
@media (max-width: 1200px) {
  .month-header,
  .day-cell {
    min-width: 100px;
  }

  .day-label {
    min-width: 50px;
  }
}

@media (max-width: 768px) {
  .full-year-view {
    padding: 10px;
  }

  .month-header,
  .day-cell {
    min-width: 80px;
    min-height: 60px;
  }

  .day-number {
    font-size: 1rem;
  }

  .day-of-week {
    font-size: 0.7rem;
  }
}
</style> 