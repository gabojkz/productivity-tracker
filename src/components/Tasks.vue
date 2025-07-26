<template>
  <div class="tasks">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-0">Tasks</h1>
            <p class="text-muted">Manage your tasks and stay organized</p>
          </div>
          <button class="btn btn-primary" @click="showAddTaskModal = true">
            <i class="bi bi-plus"></i> Add Task
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search tasks..."
            v-model="searchQuery"
          >
        </div>
      </div>
      <div class="col-md-4">
        <div class="d-flex gap-2">
          <select class="form-select" v-model="statusFilter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select class="form-select" v-model="priorityFilter">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">All Tasks ({{ filteredTasks.length }})</h5>
              <div class="d-flex gap-2">
                <select class="form-select form-select-sm" v-model="sortBy" style="width: auto;">
                  <option value="created_at">Created Date</option>
                  <option value="due_date">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
                <button class="btn btn-outline-secondary btn-sm" @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
                  <i :class="sortOrder === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down'"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="filteredTasks.length === 0" class="text-center py-5">
              <i class="bi bi-list-check fs-1 text-muted"></i>
              <p class="text-muted mt-2">No tasks found. Create your first task!</p>
            </div>
            <div v-else>
              <div v-for="task in paginatedTasks" :key="task.id" class="task-item border-bottom py-3">
                <div class="row align-items-center">
                  <div class="col-md-6">
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
                        <p class="text-muted mb-0 small">{{ task.description }}</p>
                        <small class="text-muted">
                          Created: {{ formatDate(task.created_at) }}
                          <span v-if="task.due_date">• Due: {{ formatDate(task.due_date) }}</span>
                        </small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="d-flex gap-2">
                      <span :class="getPriorityBadgeClass(task.priority)" class="badge">
                        {{ task.priority }}
                      </span>
                      <span :class="getStatusBadgeClass(task.status)" class="badge">
                        {{ task.status }}
                      </span>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="d-flex justify-content-end gap-2">
                      <button class="btn btn-outline-primary btn-sm" @click="editTask(task)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" @click="deleteTask(task.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="row mt-4">
      <div class="col-12">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--">Previous</button>
            </li>
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link" @click="currentPage = page">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage++">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <div class="modal fade" :class="{ show: showAddTaskModal }" :style="{ display: showAddTaskModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTask">
              <div class="mb-3">
                <label class="form-label">Task Title *</label>
                <input type="text" class="form-control" v-model="taskForm.title" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="taskForm.description" rows="3"></textarea>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Priority</label>
                    <select class="form-select" v-model="taskForm.priority">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Status</label>
                    <select class="form-select" v-model="taskForm.status">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Due Date</label>
                <input type="date" class="form-control" v-model="taskForm.due_date">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveTask">
              {{ editingTask ? 'Update' : 'Add' }} Task
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddTaskModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'Tasks',
  data() {
    return {
      tasks: [],
      searchQuery: '',
      statusFilter: '',
      priorityFilter: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      currentPage: 1,
      itemsPerPage: 10,
      showAddTaskModal: false,
      editingTask: null,
      taskForm: {
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: ''
      }
    }
  },
  computed: {
    filteredTasks() {
      let filtered = this.tasks;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(task => 
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(task => task.status === this.statusFilter);
      }
      
      if (this.priorityFilter) {
        filtered = filtered.filter(task => task.priority === this.priorityFilter);
      }
      
      // Sort
      filtered.sort((a, b) => {
        let aVal = a[this.sortBy];
        let bVal = b[this.sortBy];
        
        if (this.sortBy === 'created_at' || this.sortBy === 'due_date') {
          aVal = new Date(aVal || 0);
          bVal = new Date(bVal || 0);
        }
        
        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      return filtered;
    },
    
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.itemsPerPage);
    },
    
    paginatedTasks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTasks.slice(start, end);
    },
    
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    async loadTasks() {
      // Mock data - replace with actual database calls
      this.tasks = [
        {
          id: 1,
          title: 'Complete project proposal',
          description: 'Finish the Q4 project proposal document with all requirements',
          status: 'pending',
          priority: 'high',
          created_at: '2024-01-15',
          due_date: '2024-01-20'
        },
        {
          id: 2,
          title: 'Review code changes',
          description: 'Review pull requests for the main branch',
          status: 'completed',
          priority: 'medium',
          created_at: '2024-01-14',
          due_date: '2024-01-16'
        },
        {
          id: 3,
          title: 'Team meeting',
          description: 'Weekly team sync meeting',
          status: 'in-progress',
          priority: 'low',
          created_at: '2024-01-13',
          due_date: '2024-01-18'
        },
        {
          id: 4,
          title: 'Update documentation',
          description: 'Update API documentation for new features',
          status: 'pending',
          priority: 'medium',
          created_at: '2024-01-12',
          due_date: '2024-01-25'
        }
      ];
    },
    
    getPriorityBadgeClass(priority) {
      const classes = {
        low: 'bg-secondary',
        medium: 'bg-warning',
        high: 'bg-danger'
      };
      return classes[priority] || 'bg-secondary';
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        pending: 'bg-secondary',
        'in-progress': 'bg-info',
        completed: 'bg-success'
      };
      return classes[status] || 'bg-secondary';
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },
    
    toggleTaskStatus(task) {
      task.status = task.status === 'completed' ? 'pending' : 'completed';
    },
    
    editTask(task) {
      this.editingTask = task;
      this.taskForm = { ...task };
      this.showAddTaskModal = true;
    },
    
    deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      }
    },
    
    closeModal() {
      this.showAddTaskModal = false;
      this.editingTask = null;
      this.taskForm = {
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: ''
      };
    },
    
    saveTask() {
      if (this.taskForm.title.trim()) {
        if (this.editingTask) {
          // Update existing task
          const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
          if (index !== -1) {
            this.tasks[index] = { ...this.editingTask, ...this.taskForm };
          }
        } else {
          // Add new task
          const newTask = {
            id: Date.now(),
            ...this.taskForm,
            created_at: new Date().toISOString().split('T')[0]
          };
          this.tasks.unshift(newTask);
        }
        
        this.closeModal();
      }
    }
  }
}
</script>

<style scoped>
.task-item:last-child {
  border-bottom: none !important;
}

.pagination .page-link {
  border-radius: 0.375rem;
  margin: 0 2px;
}
</style> 