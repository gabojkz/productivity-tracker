<template>
  <div class="col-lg-8 mb-4">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Today's Tasks ({{ tasks.length }})</h5>
        <button class="btn btn-primary btn-sm" @click="goToTasks">
          <i class="bi bi-plus"></i> Add Task
        </button>
      </div>
      <div class="card-body">
        <div v-if="tasks.length === 0" class="text-center py-4">
          <i class="bi bi-list-check fs-1 text-muted"></i>
          <p class="text-muted mt-2">No tasks for today. Add your first task!</p>
        </div>
        <div v-else>
          <div v-for="task in tasks.slice(0, 5)" :key="task.id" class="task-item border-bottom py-2">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <input 
                  type="checkbox" 
                  class="form-check-input me-3" 
                  :checked="task.status === 'completed'"
                  @change="toggleTaskStatus(task)"
                >
                <div>
                  <h6 class="mb-1" :class="{ 'text-decoration-line-through': task.status === 'completed' }">
                    {{ task.title }}
                  </h6>
                  <small class="text-muted">
                    {{ task.duration }}h • 
                    <span :class="getPriorityBadgeClass(task.priority)" class="badge">{{ task.priority }}</span>
                  </small>
                </div>
              </div>
              <div class="d-flex gap-1">
                <button 
                  v-if="!task.isRunning" 
                  class="btn btn-success btn-sm" 
                  @click="startTask(task)"
                  :disabled="task.status === 'completed'"
                >
                  <i class="bi bi-play"></i>
                </button>
                <button 
                  v-if="task.isRunning" 
                  class="btn btn-warning btn-sm" 
                  @click="pauseTask(task)"
                >
                  <i class="bi bi-pause"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-if="tasks.length > 5" class="text-center mt-3">
            <button class="btn btn-outline-primary btn-sm" @click="goToTasks">
              View All {{ tasks.length }} Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodayTasks',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleTaskStatus(task) {
      this.$emit('toggle-task-status', task);
    },
    startTask(task) {
      this.$emit('start-task', task);
    },
    pauseTask(task) {
      this.$emit('pause-task', task);
    },
    goToTasks() {
      this.$router.push('/tasks');
    },
    getPriorityBadgeClass(priority) {
      const classes = {
        low: 'bg-secondary',
        medium: 'bg-warning',
        high: 'bg-danger'
      };
      return classes[priority] || 'bg-secondary';
    }
  }
}
</script>

<style scoped>
.task-item:last-child {
  border-bottom: none !important;
}
</style> 