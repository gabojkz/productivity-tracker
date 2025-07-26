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
            <div class="mb-3">
              <label class="form-label">Date</label>
              <input 
                v-model="eventData.date" 
                type="date" 
                class="form-control" 
                required
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Time</label>
              <input 
                v-model="eventData.time" 
                type="time" 
                class="form-control"
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Duration (hours)</label>
              <input 
                v-model="eventData.duration" 
                type="number" 
                class="form-control"
                min="0.5"
                max="24"
                step="0.5"
                value="1"
              >
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
        date: '',
        time: '',
        description: '',
        categoryId: '',
        duration: 1
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
        date: '',
        time: '',
        description: '',
        categoryId: '',
        duration: 1
      }
    }
  },
  watch: {
    event: {
      handler(newEvent) {
        this.eventData = { ...newEvent };
      },
      immediate: true
    }
  },
  methods: {
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