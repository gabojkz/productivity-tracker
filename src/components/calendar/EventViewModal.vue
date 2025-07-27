<template>
  <div class="modal fade" id="eventViewModal" tabindex="-1" ref="eventViewModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">View Events</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <!-- Search and Filter Controls -->
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Search by Title</label>
              <input 
                v-model="searchTitle" 
                type="text" 
                class="form-control" 
                placeholder="Search events..."
              >
            </div>
            <div class="col-md-3">
              <label class="form-label">Category</label>
              <select v-model="selectedCategory" class="form-select">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Date Range</label>
              <select v-model="dateFilter" class="form-select">
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Event Type</label>
              <select v-model="eventTypeFilter" class="form-select">
                <option value="all">All Events</option>
                <option value="single">Single Day</option>
                <option value="multi">Multi-day</option>
              </select>
            </div>
          </div>

          <!-- Custom Date Range (shown when custom is selected) -->
          <div v-if="dateFilter === 'custom'" class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Start Date</label>
              <input v-model="customStartDate" type="date" class="form-control">
            </div>
            <div class="col-md-6">
              <label class="form-label">End Date</label>
              <input v-model="customEndDate" type="date" class="form-control">
            </div>
          </div>

          <!-- Event Count -->
          <div class="mb-3">
            <span class="badge bg-primary">{{ filteredEvents.length }} events found</span>
          </div>

          <!-- Events List -->
          <div class="events-list">
            <div v-if="filteredEvents.length === 0" class="text-center py-4">
              <i class="bi bi-calendar-x fs-1 text-muted"></i>
              <p class="text-muted mt-2">No events found matching your criteria</p>
            </div>
            <div v-else>
              <div 
                v-for="event in filteredEvents" 
                :key="event.id" 
                class="event-item"
                :style="{ borderLeftColor: getCategoryColor(event.categoryId) }"
                @click="editEvent(event)"
              >
                <div class="event-header">
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-category">{{ getCategoryName(event.categoryId) }}</div>
                </div>
                <div class="event-dates">
                  <span class="event-date">
                    <i class="bi bi-calendar"></i>
                    {{ formatEventDates(event) }}
                  </span>
                  <span v-if="event.startTime || event.endTime" class="event-time">
                    <i class="bi bi-clock"></i>
                    {{ formatEventTimes(event) }}
                  </span>
                </div>
                <div v-if="event.description" class="event-description">
                  {{ event.description }}
                </div>
                <div class="event-type-badge">
                  <span v-if="event.isMultiDay" class="badge bg-warning">Multi-day</span>
                  <span v-else class="badge bg-info">Single day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary" @click="addNewEvent">
            <i class="bi bi-plus"></i> Add New Event
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventViewModal',
  props: {
    events: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchTitle: '',
      selectedCategory: '',
      dateFilter: 'all',
      eventTypeFilter: 'all',
      customStartDate: '',
      customEndDate: ''
    }
  },
  computed: {
    filteredEvents() {
      let filtered = [...this.events];

      // Filter by title search
      if (this.searchTitle) {
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(this.searchTitle.toLowerCase())
        );
      }

      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(event => 
          event.categoryId == this.selectedCategory
        );
      }

      // Filter by event type
      if (this.eventTypeFilter !== 'all') {
        filtered = filtered.filter(event => {
          if (this.eventTypeFilter === 'multi') {
            return event.isMultiDay;
          } else {
            return !event.isMultiDay;
          }
        });
      }

      // Filter by date range
      if (this.dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(event => {
          const eventStartDate = new Date(event.startDate || event.date);
          const eventEndDate = new Date(event.endDate || event.startDate || event.date);
          
          switch (this.dateFilter) {
            case 'today':
              return eventStartDate <= today && eventEndDate >= today;
            case 'week':
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 6);
              return eventStartDate <= weekEnd && eventEndDate >= weekStart;
            case 'month':
              const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              return eventStartDate <= monthEnd && eventEndDate >= monthStart;
            case 'year':
              const yearStart = new Date(today.getFullYear(), 0, 1);
              const yearEnd = new Date(today.getFullYear(), 11, 31);
              return eventStartDate <= yearEnd && eventEndDate >= yearStart;
            case 'custom':
              if (this.customStartDate && this.customEndDate) {
                const customStart = new Date(this.customStartDate);
                const customEnd = new Date(this.customEndDate);
                return eventStartDate <= customEnd && eventEndDate >= customStart;
              }
              return true;
            default:
              return true;
          }
        });
      }

      // Sort by start date
      return filtered.sort((a, b) => {
        const dateA = new Date(a.startDate || a.date);
        const dateB = new Date(b.startDate || b.date);
        return dateA - dateB;
      });
    }
  },
  methods: {
    getCategoryColor(categoryId) {
      const category = this.categories.find(c => c.id == categoryId);
      return category ? category.color : '#6c757d';
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id == categoryId);
      return category ? category.name : 'Uncategorized';
    },
    formatEventDates(event) {
      if (event.isMultiDay) {
        const startDate = new Date(event.startDate).toLocaleDateString();
        const endDate = new Date(event.endDate).toLocaleDateString();
        return `${startDate} - ${endDate}`;
      } else {
        const date = new Date(event.startDate || event.date);
        return date.toLocaleDateString();
      }
    },
    formatEventTimes(event) {
      if (event.startTime && event.endTime) {
        return `${event.startTime} - ${event.endTime}`;
      } else if (event.startTime) {
        return event.startTime;
      } else if (event.endTime) {
        return event.endTime;
      }
      return 'All day';
    },
    editEvent(event) {
      this.$emit('edit-event', event);
    },
    addNewEvent() {
      this.$emit('add-new-event');
    },
    closeModal() {
      this.$emit('close-modal');
    }
  }
}
</script>

<style scoped>
.events-list {
  max-height: 400px;
  overflow-y: auto;
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
  margin-bottom: 8px;
}

.event-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.event-category {
  font-size: 0.8rem;
  color: #007bff;
  font-weight: bold;
  background-color: #e3f2fd;
  padding: 4px 8px;
  border-radius: 5px;
}

.event-dates {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}

.event-date, .event-time {
  display: flex;
  align-items: center;
  gap: 5px;
}

.event-description {
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 8px;
}

.event-type-badge {
  display: flex;
  gap: 5px;
}

.event-type-badge .badge {
  font-size: 0.7rem;
}
</style> 