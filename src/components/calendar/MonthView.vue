<template>
  <div class="calendar-container">
    <div class="calendar-grid">
      <div class="day-header" v-for="day in adjustedDayNames" :key="day">
        {{ day }}
      </div>
      
      <div 
        v-for="day in filteredCalendarDays" 
        :key="day.date" 
        class="calendar-day"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'has-events': day.events.length > 0,
          'weekend': day.isWeekend && !this.showWeekends
        }"
        @click="$emit('select-date', day)"
        v-show="showWeekends || !day.isWeekend"
      >
        <div class="day-number">{{ day.dayNumber }}</div>
        <div class="day-events" v-if="showEventDots">
          <div 
            v-for="event in day.events.slice(0, 3)" 
            :key="event.id"
            class="event-dot"
            :style="{ backgroundColor: getCategoryColor(event.categoryId) }"
            :title="`${event.title} (${getCategoryName(event.categoryId)})`"
          ></div>
          <div v-if="day.events.length > 3" class="more-events">
            +{{ day.events.length - 3 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthView',
  props: {
    currentDate: {
      type: Date,
      required: true
    },
    events: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: [Number, null],
      default: null
    },
    weekStartDay: {
      type: Number,
      default: 0 // 0 = Sunday, 1 = Monday
    },
    showWeekends: {
      type: Boolean,
      default: true
    },
    showEventDots: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    adjustedDayNames() {
      if (this.weekStartDay === 1) {
        // Start with Monday
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      }
      // Default: start with Sunday
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      
      // Adjust start date based on week start day setting
      const firstDayOfWeek = firstDay.getDay();
      const adjustedStart = firstDayOfWeek - this.weekStartDay;
      startDate.setDate(startDate.getDate() - (adjustedStart < 0 ? adjustedStart + 7 : adjustedStart));
      
      const days = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayEvents = this.events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === date.toDateString();
        });
        
        days.push({
          date: date.toISOString().split('T')[0],
          dayNumber: date.getDate(),
          isCurrentMonth: date.getMonth() === month,
          isToday: date.toDateString() === today.toDateString(),
          events: dayEvents,
          isWeekend: date.getDay() === 0 || date.getDay() === 6
        });
      }
      
      return days;
    },
    filteredCalendarDays() {
      if (this.selectedCategory === null) {
        return this.calendarDays;
      }
      return this.calendarDays.map(day => ({
        ...day,
        events: day.events.filter(event => event.categoryId === this.selectedCategory)
      }));
    }
  },
  methods: {
    getCategoryColor(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.color : '#6c757d';
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    }
  }
}
</script>

<style scoped>
.calendar-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-header {
  background-color: #f8f9fa;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
}

.calendar-day {
  min-height: 100px;
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.calendar-day.other-month {
  background-color: #f8f9fa;
  color: #6c757d;
}

.calendar-day.today {
  background-color: #e3f2fd;
  font-weight: bold;
}

.calendar-day.has-events {
  background-color: #fff3cd;
}

.day-number {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 5px;
}

.day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 5px;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.more-events {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: bold;
}
</style> 