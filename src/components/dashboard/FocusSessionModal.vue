<template>
  <div>
    <!-- Focus Session Modal -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Start Focus Session</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Task Description</label>
              <input type="text" class="form-control" v-model="session.task" placeholder="What are you working on?">
            </div>
            <div class="mb-3">
              <label class="form-label">Duration (minutes)</label>
              <select class="form-select" v-model="session.duration">
                <option value="25">25 minutes (Pomodoro)</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="session.description" rows="3" placeholder="Additional details..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="startSession">Start Session</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'FocusSessionModal',
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    session: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
    startSession() {
      this.$emit('start-session', this.session);
    }
  }
}
</script>

<style scoped>
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
</style> 