<template>
  <div class="week-view">
    <div class="week-grid">
      <div class="time-column">
        <div class="time-header">Time</div>
        <div 
          v-for="hour in 24" 
          :key="hour" 
          class="time-slot"
        >
          {{ formatHour(hour - 1) }}
        </div>
      </div>
      
      <div 
        v-for="day in weekDays" 
        :key="day.date" 
        class="day-column"
        :class="{ 'today': day.isToday }"
      >
        <div class="day-header">
          <div class="day-name">{{ day.dayName }}</div>
          <div class="day-date">{{ day.dayNumber }}</div>
        </div>
        
        <div class="day-events-container">
          <div 
            v-for="event in day.events" 
            :key="event.id"
            class="week-event"
            :style="{ 
              backgroundColor: getCategoryColor(event.categoryId),
              top: getEventTop(event.time),
              height: getEventHeight(event.duration)
            }"
            @click="$emit('edit-event', event)"
            :title="`${event.title} (${getCategoryName(event.categoryId)})`"
          >
            <div class="event-title">{{ event.title }}</div>
            <div class="event-time">{{ formatTime(event.time) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeekView',
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
    weekStartDay: {
      type: Number,
      default: 0 // 0 = Sunday, 1 = Monday
    },
    businessHoursStart: {
      type: String,
      default: '09:00'
    },
    businessHoursEnd: {
      type: String,
      default: '17:00'
    }
  },
  computed: {
    weekDays() {
      const startDate = new Date(this.currentDate);
      // Adjust start date based on week start day setting
      const currentDay = startDate.getDay();
      const adjustedStart = currentDay - this.weekStartDay;
      startDate.setDate(startDate.getDate() - (adjustedStart < 0 ? adjustedStart + 7 : adjustedStart));
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        
        const dayEvents = this.events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === day.toDateString();
        });
        
        days.push({
          date: day.toISOString().split('T')[0],
          dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: day.getDate(),
          isToday: day.toDateString() === new Date().toDateString(),
          events: dayEvents
        });
      }
      return days;
    }
  },
  methods: {
    formatHour(hour) {
      return hour < 12 ? `${hour} AM` : `${hour === 12 ? 12 : hour - 12} PM`;
    },
    formatTime(time) {
      if (!time) return 'All day';
      const [hours, minutes] = time.split(':');
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const displayHours = parseInt(hours) % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    },
    getEventTop(time) {
      if (!time) return '0%';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      const totalMinutes = hour * 60 + minute;
      return `${(totalMinutes / 1440) * 100}%`;
    },
    getEventHeight(duration) {
      const minutes = duration * 60;
      return `${(minutes / 1440) * 100}%`;
    },
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
.week-view {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  height: 600px;
  display: flex;
}

.week-grid {
  display: flex;
  width: 100%;
  height: 100%;
}

.time-column {
  width: 80px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
}

.time-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-bottom: 1px solid #dee2e6;
  background-color: #e9ecef;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #6c757d;
  border-bottom: 1px solid #dee2e6;
}

.day-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dee2e6;
}

.day-column:last-child {
  border-right: none;
}

.day-column .day-header {
  height: 60px;
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.day-name {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 2px;
}

.day-date {
  font-size: 1.1rem;
  font-weight: 500;
}

.day-events-container {
  flex: 1;
  position: relative;
  overflow-y: auto;
  min-height: 540px;
}

.week-event {
  position: absolute;
  left: 2px;
  right: 2px;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  color: white;
  font-size: 0.8rem;
  overflow: hidden;
  z-index: 10;
}

.week-event:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.week-event .event-title {
  font-weight: bold;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.week-event .event-time {
  font-size: 0.7rem;
  opacity: 0.9;
}
</style> 