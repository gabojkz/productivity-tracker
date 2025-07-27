<template>
  <div class="col-lg-6 mb-4">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Yesterday's Completed Tasks</h5>
      </div>
      <div class="card-body">
        <div v-if="tasks.length === 0" class="text-center py-4">
          <i class="bi bi-check-circle fs-1 text-muted"></i>
          <p class="text-muted mt-2">No tasks completed yesterday</p>
        </div>
        <div v-else>
          <div v-for="task in tasks.slice(0, 3)" :key="task.id" class="completed-task-item py-2">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1 text-success">{{ task.title }}</h6>
                <small class="text-muted">
                  Completed: {{ formatDate(task.completed_at) }} • 
                  Duration: {{ task.duration }}h
                </small>
              </div>
              <i class="bi bi-check-circle text-success"></i>
            </div>
          </div>
          <div v-if="tasks.length > 3" class="text-center mt-3">
            <button class="btn btn-outline-success btn-sm" @click="goToTasks">
              View All {{ tasks.length }} Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YesterdayTasks',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },
    goToTasks() {
      this.$router.push('/tasks');
    }
  }
}
</script>

<style scoped>
.completed-task-item:last-child {
  border-bottom: none !important;
}
</style> 