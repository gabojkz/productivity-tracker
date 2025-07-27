<template>
  <div class="modal fade" id="eventModal" tabindex="-1" ref="eventModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditing ? 'Edit Event' : 'Add Event' }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEvent">
            <div class="mb-3">
              <label class="form-label">Event Title</label>
              <input 
                v-model="eventData.title" 
                type="text" 
                class="form-control" 
                required
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select v-model="eventData.categoryId" class="form-select" required>
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Start Date</label>
                  <input 
                    v-model="eventData.startDate" 
                    type="date" 
                    class="form-control" 
                    required
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">End Date</label>
                  <input 
                    v-model="eventData.endDate" 
                    type="date" 
                    class="form-control" 
                    required
                  >
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Start Time</label>
                  <input 
                    v-model="eventData.startTime" 
                    type="time" 
                    class="form-control"
                  >
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">End Time</label>
                  <input 
                    v-model="eventData.endTime" 
                    type="time" 
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input 
                  v-model="eventData.isMultiDay" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="multiDayEvent"
                >
                <label class="form-check-label" for="multiDayEvent">
                  Multi-day event (can span multiple days with gaps)
                </label>
              </div>
            </div>
            <div v-if="eventData.isMultiDay" class="mb-3">
              <label class="form-label">Event Days (comma-separated dates)</label>
              <input 
                v-model="eventData.eventDays" 
                type="text" 
                class="form-control"
                placeholder="2024-01-15, 2024-01-17, 2024-01-19"
              >
              <small class="text-muted">Leave empty to use start and end date range</small>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea 
                v-model="eventData.description" 
                class="form-control" 
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button v-if="isEditing" type="button" class="btn btn-danger" @click="deleteEvent">Delete</button>
          <button type="button" class="btn btn-primary" @click="saveEvent">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventModal',
  props: {
    isEditing: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: () => ({
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        categoryId: '',
        isMultiDay: false,
        eventDays: ''
      })
    },
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      eventData: {
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: '',
        categoryId: '',
        isMultiDay: false,
        eventDays: ''
      }
    }
  },
  watch: {
    event: {
      handler(newEvent) {
        this.eventData = { ...newEvent };
      },
      immediate: true
    },
    'eventData.startDate': {
      handler() {
        this.checkMultiDay();
      }
    },
    'eventData.endDate': {
      handler() {
        this.checkMultiDay();
      }
    }
  },
  methods: {
    checkMultiDay() {
      if (this.eventData.startDate && this.eventData.endDate) {
        const startDate = new Date(this.eventData.startDate);
        const endDate = new Date(this.eventData.endDate);
        this.eventData.isMultiDay = startDate.getTime() !== endDate.getTime();
      }
    },
    saveEvent() {
      this.$emit('save-event', this.eventData);
    },
    deleteEvent() {
      this.$emit('delete-event');
    },
    closeModal() {
      this.$emit('close-modal');
    }
  }
}
</script> 