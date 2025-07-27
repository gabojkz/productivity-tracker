<template>
  <div class="col-lg-6 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Upcoming Events</h5>
      </div>
      <div class="card-body">
        <div v-if="events.length === 0" class="text-center py-4">
          <i class="bi bi-calendar-event fs-1 text-muted"></i>
          <p class="text-muted mt-2">No upcoming events</p>
        </div>
        <div v-else>
          <div v-for="event in events.slice(0, 3)" :key="event.id" class="event-item py-2">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">{{ event.title }}</h6>
                <small class="text-muted">
                  {{ formatEventDate(event) }} • 
                  <span :style="{ color: getCategoryColor(event.categoryId) }">
                    {{ getCategoryName(event.categoryId) }}
                  </span>
                </small>
              </div>
              <i class="bi bi-calendar-event text-primary"></i>
            </div>
          </div>
          <div v-if="events.length > 3" class="text-center mt-3">
            <button class="btn btn-outline-primary btn-sm" @click="goToCalendar">
              View All {{ events.length }} Events
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpcomingEvents',
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
  methods: {
    formatEventDate(event) {
      const date = new Date(event.startDate || event.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getCategoryColor(categoryId) {
      const category = this.categories.find(c => c.id == categoryId);
      return category ? category.color : '#6c757d';
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id == categoryId);
      return category ? category.name : 'Uncategorized';
    },
    goToCalendar() {
      this.$router.push('/calendar');
    }
  }
}
</script>

<style scoped>
.event-item:last-child {
  border-bottom: none !important;
}
</style> 