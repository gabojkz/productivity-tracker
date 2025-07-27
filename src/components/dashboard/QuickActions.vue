<template>
  <div class="col-lg-4 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Quick Actions</h5>
      </div>
      <div class="card-body">
        <div class="d-grid gap-2">
          <button class="btn btn-primary" @click="startFocusSession">
            <i class="bi bi-play-circle"></i> Start Focus Session
          </button>
          <button class="btn btn-success" @click="startTimeTracking">
            <i class="bi bi-clock"></i> Start Time Tracking
          </button>
          <button class="btn btn-info" @click="goToTasks">
            <i class="bi bi-list-check"></i> View All Tasks
          </button>
          <button class="btn btn-warning" @click="goToCalendar">
            <i class="bi bi-calendar"></i> View Calendar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickActions',
  methods: {
    startFocusSession() {
      this.$emit('start-focus-session');
    },
    startTimeTracking() {
      this.$emit('start-time-tracking');
    },
    goToTasks() {
      this.$router.push('/tasks');
    },
    goToCalendar() {
      this.$router.push('/calendar');
    }
  }
}
</script>

<style scoped>
/* No additional styles needed - using Bootstrap classes */
</style> 