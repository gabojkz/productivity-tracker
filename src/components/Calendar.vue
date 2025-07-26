<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <h1>Calendar</h1>
      <div class="calendar-controls">
        <div class="view-controls">
          <button 
            @click="currentView = 'month'" 
            class="btn btn-sm"
            :class="currentView === 'month' ? 'btn-primary' : 'btn-outline-primary'"
          >
            Month
          </button>
          <button 
            @click="currentView = 'week'" 
            class="btn btn-sm"
            :class="currentView === 'week' ? 'btn-primary' : 'btn-outline-primary'"
          >
            Week
          </button>
          <button 
            @click="currentView = 'full'" 
            class="btn btn-sm"
            :class="currentView === 'full' ? 'btn-primary' : 'btn-outline-primary'"
          >
            Full Year
          </button>
        </div>
        <div class="navigation-controls">
          <button @click="previousPeriod" class="btn btn-outline-primary">
            <i class="bi bi-chevron-left"></i>
          </button>
          <h2 class="current-period">{{ currentPeriodTitle }}</h2>
          <button @click="nextPeriod" class="btn btn-outline-primary">
            <i class="bi bi-chevron-right"></i>
          </button>
          <button @click="goToToday" class="btn btn-primary ms-3">
            Today
          </button>
        </div>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="category-filter">
      <h4>Filter by Category</h4>
      <div class="category-buttons">
        <button 
          @click="selectedCategory = null" 
          class="btn btn-sm"
          :class="selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'"
        >
          All Events
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category.id" 
          class="btn btn-sm"
          :class="selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'"
        >
          <span class="category-dot" :style="{ backgroundColor: category.color }"></span>
          {{ category.name }}
        </button>
        <button @click="showCategoryManagement()" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-plus"></i> Add Category
        </button>
      </div>
    </div>

    <!-- Month View -->
    <MonthView 
      v-if="currentView === 'month'"
      :current-date="currentDate"
      :events="events"
      :categories="categories"
      :selected-category="selectedCategory"
      :week-start-day="weekStartDay"
      :show-weekends="calendarSettings?.showWeekends !== false"
      :show-event-dots="calendarSettings?.showEventDots !== false"
      @select-date="selectDate"
    />

    <!-- Week View -->
    <WeekView 
      v-if="currentView === 'week'"
      :current-date="currentDate"
      :events="events"
      :categories="categories"
      :week-start-day="weekStartDay"
      :business-hours-start="businessHoursStart"
      :business-hours-end="businessHoursEnd"
      @edit-event="editEvent"
    />

    <!-- Full Year View -->
    <FullYearView 
      v-if="currentView === 'full'"
      :current-date="currentDate"
      :events="events"
      :view-period="viewPeriod"
      :show-weekends="calendarSettings?.showWeekends !== false"
      @select-date="selectDate"
    />

    <!-- Event Modal -->
    <EventModal
      ref="eventModal"
      :is-editing="isEditing"
      :event="newEvent"
      :categories="categories"
      @save-event="saveEvent"
      @delete-event="deleteEvent"
      @close-modal="closeModal"
    />

    <!-- Category Management Modal -->
    <CategoryModal
      ref="categoryModal"
      :categories="categories"
      :events="events"
      @save-category="saveCategory"
      @delete-category="deleteCategory"
      @close-modal="closeCategoryModal"
    />

    <!-- Events for Selected Date -->
    <div v-if="selectedDateEvents.length > 0" class="selected-date-events">
      <h4>Events for {{ selectedDateFormatted }}</h4>
      <div class="event-list">
        <div 
          v-for="event in selectedDateEvents" 
          :key="event.id"
          class="event-item"
          :style="{ borderLeftColor: getCategoryColor(event.categoryId) }"
          @click="editEvent(event)"
        >
          <div class="event-header">
            <div class="event-time">{{ event.time || 'All day' }}</div>
            <div class="event-category">{{ getCategoryName(event.categoryId) }}</div>
          </div>
          <div class="event-title">{{ event.title }}</div>
          <div v-if="event.description" class="event-description">{{ event.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MonthView from './calendar/MonthView.vue'
import WeekView from './calendar/WeekView.vue'
import FullYearView from './calendar/FullYearView.vue'
import EventModal from './calendar/EventModal.vue'
import CategoryModal from './calendar/CategoryModal.vue'

export default {
  name: 'Calendar',
  components: {
    MonthView,
    WeekView,
    FullYearView,
    EventModal,
    CategoryModal
  },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      events: [],
      newEvent: {
        title: '',
        date: '',
        time: '',
        description: '',
        categoryId: '',
        duration: 1
      },
      isEditing: false,
      editingEventId: null,
      categories: [
        { id: 1, name: 'Work', color: '#007bff' },
        { id: 2, name: 'Personal', color: '#28a745' },
        { id: 3, name: 'Meeting', color: '#dc3545' },
        { id: 4, name: 'Education', color: '#ffc107' },
        { id: 5, name: 'Other', color: '#6f42c1' },
      ],
      selectedCategory: null,
      currentView: 'month',
      viewPeriod: 1,
      calendarSettings: null,
      weekStartDay: 0, // Default to Sunday
      businessHoursStart: '09:00',
      businessHoursEnd: '17:00'
    }
  },
  computed: {
    currentPeriodTitle() {
      if (this.currentView === 'month') {
        return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else if (this.currentView === 'week') {
        const startDate = new Date(this.currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return `${startDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`;
      } else if (this.currentView === 'full') {
        return this.currentDate.toLocaleDateString('en-US', { year: 'numeric' });
      }
      return '';
    },
    selectedDateEvents() {
      if (!this.selectedDate) return [];
      return this.events.filter(event => event.date === this.selectedDate);
    },
    selectedDateFormatted() {
      if (!this.selectedDate) return '';
      return new Date(this.selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  methods: {
    loadCalendarSettings() {
      try {
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          this.calendarSettings = settings.calendar || {};
          this.applyCalendarSettings();
        }
      } catch (error) {
        console.error('Failed to load calendar settings:', error);
      }
    },
    applyCalendarSettings() {
      if (this.calendarSettings) {
        // Apply default view
        if (this.calendarSettings.defaultView) {
          this.currentView = this.calendarSettings.defaultView;
        }
        
        // Apply default event duration
        if (this.calendarSettings.defaultEventDuration) {
          this.newEvent.duration = this.calendarSettings.defaultEventDuration;
        }
        
        // Apply default event category
        if (this.calendarSettings.defaultEventCategory) {
          this.newEvent.categoryId = this.calendarSettings.defaultEventCategory;
        }

        // Apply week start day setting
        if (this.calendarSettings.weekStartDay !== undefined) {
          // This will be used by the calendar views
          this.weekStartDay = this.calendarSettings.weekStartDay;
        }

        // Apply business hours settings
        if (this.calendarSettings.businessHoursStart) {
          this.businessHoursStart = this.calendarSettings.businessHoursStart;
        }
        if (this.calendarSettings.businessHoursEnd) {
          this.businessHoursEnd = this.calendarSettings.businessHoursEnd;
        }
      }
    },
    previousPeriod() {
      if (this.currentView === 'month') {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - this.viewPeriod, 1);
      } else if (this.currentView === 'week') {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7 * this.viewPeriod);
      } else if (this.currentView === 'full') {
        this.currentDate = new Date(this.currentDate.getFullYear() - this.viewPeriod, 0, 1);
      }
    },
    nextPeriod() {
      if (this.currentView === 'month') {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.viewPeriod, 1);
      } else if (this.currentView === 'week') {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 7 * this.viewPeriod);
      } else if (this.currentView === 'full') {
        this.currentDate = new Date(this.currentDate.getFullYear() + this.viewPeriod, 0, 1);
      }
    },
    goToToday() {
      this.currentDate = new Date();
      this.selectedDate = new Date().toISOString().split('T')[0];
    },
    selectDate(day) {
      this.selectedDate = day.date;
      this.newEvent.date = day.date;
      this.showEventModal();
    },
    showEventModal() {
      this.isEditing = false;
      this.newEvent = {
        title: '',
        date: this.selectedDate || new Date().toISOString().split('T')[0],
        time: '',
        description: '',
        categoryId: '',
        duration: 1
      };
      this.$nextTick(() => {
        // Show modal using Vue refs
        if (this.$refs.eventModal) {
          this.$refs.eventModal.$el.style.display = 'block';
          this.$refs.eventModal.$el.classList.add('show');
          document.body.classList.add('modal-open');
          
          // Add backdrop
          this.addModalBackdrop();
        }
      });
    },
    editEvent(event) {
      this.isEditing = true;
      this.editingEventId = event.id;
      this.newEvent = { ...event };
      this.$nextTick(() => {
        // Show modal using Vue refs
        if (this.$refs.eventModal) {
          this.$refs.eventModal.$el.style.display = 'block';
          this.$refs.eventModal.$el.classList.add('show');
          document.body.classList.add('modal-open');
          
          // Add backdrop
          this.addModalBackdrop();
        }
      });
    },
    saveEvent(eventData) {
      if (this.isEditing) {
        const index = this.events.findIndex(e => e.id === this.editingEventId);
        if (index !== -1) {
          this.events[index] = { ...eventData, id: this.editingEventId };
        }
      } else {
        this.events.push({
          ...eventData,
          id: Date.now()
        });
      }
      
      this.saveEventsToStorage();
      this.closeModal();
    },
    deleteEvent() {
      this.events = this.events.filter(e => e.id !== this.editingEventId);
      this.saveEventsToStorage();
      this.closeModal();
    },
    closeModal() {
      if (this.$refs.eventModal) {
        this.$refs.eventModal.$el.style.display = 'none';
        this.$refs.eventModal.$el.classList.remove('show');
        document.body.classList.remove('modal-open');
        this.removeModalBackdrop();
      }
    },
    showCategoryManagement() {
      this.$nextTick(() => {
        if (this.$refs.categoryModal) {
          this.$refs.categoryModal.$el.style.display = 'block';
          this.$refs.categoryModal.$el.classList.add('show');
          document.body.classList.add('modal-open');
          
          // Add backdrop
          this.addModalBackdrop();
        }
      });
    },
    saveCategory(category) {
      this.categories.push(category);
      this.saveCategoriesToStorage();
    },
    deleteCategory(categoryId) {
      const eventsInCategory = this.getEventsForCategory(categoryId);
      if (eventsInCategory.length > 0) {
        if (!confirm(`This category has ${eventsInCategory.length} events. Delete anyway?`)) {
          return;
        }
        this.events = this.events.filter(e => e.categoryId !== categoryId);
        this.saveEventsToStorage();
      }
      
      this.categories = this.categories.filter(c => c.id !== categoryId);
      this.saveCategoriesToStorage();
    },
    closeCategoryModal() {
      if (this.$refs.categoryModal) {
        this.$refs.categoryModal.$el.style.display = 'none';
        this.$refs.categoryModal.$el.classList.remove('show');
        document.body.classList.remove('modal-open');
        this.removeModalBackdrop();
      }
    },
    addModalBackdrop() {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.id = 'modal-backdrop';
      document.body.appendChild(backdrop);
    },
    removeModalBackdrop() {
      const backdrop = document.getElementById('modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    },
    getEventsForCategory(categoryId) {
      return this.events.filter(e => e.categoryId === categoryId);
    },
    getCategoryColor(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.color : '#6c757d';
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown';
    },
    saveEventsToStorage() {
      localStorage.setItem('calendar-events', JSON.stringify(this.events));
    },
    loadEventsFromStorage() {
      const saved = localStorage.getItem('calendar-events');
      if (saved) {
        this.events = JSON.parse(saved);
      }
    },
    saveCategoriesToStorage() {
      localStorage.setItem('calendar-categories', JSON.stringify(this.categories));
    },
    loadCategoriesFromStorage() {
      const saved = localStorage.getItem('calendar-categories');
      if (saved) {
        this.categories = JSON.parse(saved);
      }
    },
    handleSettingsChange(event) {
      if (event.key === 'productivity-tracker-settings') {
        this.loadCalendarSettings();
      }
    }
  },
  mounted() {
    this.loadEventsFromStorage();
    this.loadCategoriesFromStorage();
    this.loadCalendarSettings(); // Call the new method here
    this.selectedDate = new Date().toISOString().split('T')[0];
    
    // Listen for settings changes
    window.addEventListener('storage', this.handleSettingsChange);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleSettingsChange);
  },
}
</script>

<style scoped>
.calendar-page {
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.view-controls {
  display: flex;
  gap: 10px;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-period {
  margin: 0;
  min-width: 200px;
  text-align: center;
}

.category-filter {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-buttons .btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.category-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.selected-date-events {
  margin-top: 30px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.event-list {
  margin-top: 15px;
}

.event-item {
  padding: 15px;
  border-left: 4px solid;
  background-color: #f8f9fa;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.event-item:hover {
  background-color: #e9ecef;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.event-time {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: bold;
}

.event-category {
  font-size: 0.8rem;
  color: #007bff;
  font-weight: bold;
  background-color: #e3f2fd;
  padding: 4px 8px;
  border-radius: 5px;
}

.event-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.event-description {
  font-size: 0.9rem;
  color: #495057;
}

/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

/* Ensure modals display properly */
.modal.show {
  display: block !important;
}

.modal-open {
  overflow: hidden;
}
</style> 