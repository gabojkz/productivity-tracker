<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <h1>Calendar</h1>
      <div class="calendar-controls">
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
      <h4>Controls</h4>
      <div class="category-buttons">
        <button @click="showCategoryManagement()" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-plus"></i> Add Category
        </button>

        <button @click="showEventModal()" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-plus"></i> Add Event
        </button>

        <button @click="showEventViewModal()" class="btn btn-sm btn-outline-primary">
          <i class="bi bi-eye"></i> View Events
        </button>

        <!-- <button @click="togglePastMonths()" class="btn btn-sm btn-outline-danger" :class="{ 'btn-danger': !showPastMonths }">
          <i class="bi bi-eye-slash"></i> {{ showPastMonths ? 'Hide past months' : 'Past months are hidden' }}
        </button> -->
      </div>
    </div>

    <!-- Full Year View -->
    <FullYearView 
      :current-date="currentDate"
      :events="events"
      :view-period="viewPeriod"
      :show-weekends="calendarSettings?.showWeekends !== false"
      :bank-holidays="calendarSettings?.bankHolidays || 'None'"
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

    <!-- Event View Modal -->
    <EventViewModal
      ref="eventViewModal"
      :events="events"
      :categories="categories"
      @edit-event="editEventFromView"
      @add-new-event="showEventModal"
      @close-modal="closeEventViewModal"
    />

    <!-- Display Events for Selected Date -->
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
import FullYearView from './calendar/FullYearView.vue'
import EventModal from './calendar/EventModal.vue'
import EventViewModal from './calendar/EventViewModal.vue'
import CategoryModal from './calendar/CategoryModal.vue'

export default {
  name: 'Calendar',
  components: {
    FullYearView,
    EventModal,
    EventViewModal,
    CategoryModal
  },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      events: [],
      newEvent: {
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        categoryId: '',
        isMultiDay: false,
        eventDays: ''
      },
      isEditing: false,
      editingEventId: null,
      openedFromEventView: false,
      categories: [
        { id: 1, name: 'Work', color: '#007bff' },
        { id: 2, name: 'Personal', color: '#28a745' },
        { id: 3, name: 'Meeting', color: '#dc3545' },
        { id: 4, name: 'Education', color: '#ffc107' },
        { id: 5, name: 'Other', color: '#6f42c1' },
      ],
      selectedCategory: null,
      viewPeriod: 1,
      calendarSettings: null,
      showPastMonths: false
    }
  },
  computed: {
    currentPeriodTitle() {
      return this.currentDate.toLocaleDateString('en-US', { year: 'numeric' });
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
        // Apply default event duration
        if (this.calendarSettings.defaultEventDuration) {
          this.newEvent.duration = this.calendarSettings.defaultEventDuration;
        }
        
        // Apply default event category
        if (this.calendarSettings.defaultEventCategory) {
          this.newEvent.categoryId = this.calendarSettings.defaultEventCategory;
        }

        // Apply show past months setting
        if (this.calendarSettings.showPastMonths !== undefined) {
          this.showPastMonths = this.calendarSettings.showPastMonths;
        }
      }
    },
    previousPeriod() {
      this.currentDate = new Date(this.currentDate.getFullYear() - this.viewPeriod, 0, 1);
    },
    nextPeriod() {
      this.currentDate = new Date(this.currentDate.getFullYear() + this.viewPeriod, 0, 1);
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
      this.openedFromEventView = false; // Reset flag when opening normally
      const selectedDate = this.selectedDate || new Date().toISOString().split('T')[0];
      this.newEvent = {
        title: '',
        startDate: selectedDate,
        endDate: selectedDate,
        startTime: '',
        endTime: '',
        description: '',
        categoryId: '',
        isMultiDay: false,
        eventDays: ''
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
    showEventViewModal() {
      this.$nextTick(() => {
        // Show modal using Vue refs
        if (this.$refs.eventViewModal) {
          this.$refs.eventViewModal.$el.style.display = 'block';
          this.$refs.eventViewModal.$el.classList.add('show');
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
      
      // If the event modal was opened from the event view modal, don't close the view modal
      if (this.openedFromEventView) {
        this.openedFromEventView = false;
        // Keep the event view modal open
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
        }p
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
    editEventFromView(event) {
      // Don't close the view modal, just open the edit modal with the selected event
      this.openedFromEventView = true;
      this.editEvent(event);
    },
    closeEventViewModal() {
      if (this.$refs.eventViewModal) {
        this.$refs.eventViewModal.$el.style.display = 'none';
        this.$refs.eventViewModal.$el.classList.remove('show');
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
    },
    togglePastMonths() {
      this.showPastMonths = !this.showPastMonths;
      if (this.calendarSettings) {
        this.calendarSettings.showPastMonths = this.showPastMonths;
        this.saveCalendarSettings();
      }
    },
    
    saveCalendarSettings() {
      try {
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        let settings = savedSettings ? JSON.parse(savedSettings) : {};
        
        // Update calendar settings
        settings.calendar = { ...settings.calendar, ...this.calendarSettings };
        
        // Save back to localStorage
        localStorage.setItem('productivity-tracker-settings', JSON.stringify(settings));
        
        // Show success message
        console.log('Calendar settings saved successfully');
      } catch (error) {
        console.error('Failed to save calendar settings:', error);
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