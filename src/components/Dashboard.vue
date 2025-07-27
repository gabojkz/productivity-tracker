<template>
  <div class="dashboard">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-0">Dashboard</h1>
        <p class="text-muted">Welcome back! Here's your productivity overview.</p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Today's Tasks</h6>
                <h3 class="mb-0">{{ todayTasks.length }}</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-list-check fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Completed</h6>
                <h3 class="mb-0">{{ completedTasks.length }}</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-check-circle fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Focus Time</h6>
                <h3 class="mb-0">{{ focusHours }}h</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-clock fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Productivity Score</h6>
                <h3 class="mb-0">{{ productivityScore }}%</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-graph-up fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row">
      <!-- Today's Tasks -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Today's Tasks</h5>
            <button class="btn btn-primary btn-sm" @click="showAddTaskModal = true">
              <i class="bi bi-plus"></i> Add Task
            </button>
          </div>
          <div class="card-body">
            <div v-if="todayTasks.length === 0" class="text-center py-4">
              <i class="bi bi-list-check fs-1 text-muted"></i>
              <p class="text-muted mt-2">No tasks for today. Add your first task!</p>
            </div>
            <div v-else>
              <div v-for="task in todayTasks" :key="task.id" class="task-item border-bottom py-3">
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
                      <p class="text-muted mb-0 small">{{ task.description }}</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center">
                    <span :class="getPriorityBadgeClass(task.priority)" class="badge me-2">
                      {{ task.priority }}
                    </span>
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

      <!-- Quick Actions & Recent Activity -->
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary" @click="openFocusSessionModal()">
                <i class="bi bi-play-circle"></i> Start Focus Session
              </button>
              <button class="btn btn-outline-success" @click="showAddTaskModal = true">
                <i class="bi bi-plus-circle"></i> Add New Task
              </button>
              <button class="btn btn-outline-info" @click="startTimeTracking">
                <i class="bi bi-clock"></i> Start Time Tracking
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Recent Activity</h5>
          </div>
          <div class="card-body">
            <div v-if="recentActivity.length === 0" class="text-center py-3">
              <p class="text-muted small">No recent activity</p>
            </div>
            <div v-else>
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item py-2">
                <div class="d-flex align-items-center">
                  <div class="activity-icon me-3">
                    <i :class="getActivityIcon(activity.type)" class="text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-0 small">{{ activity.description }}</p>
                    <small class="text-muted">{{ formatTime(activity.timestamp) }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Task</h5>
            <button type="button" class="btn-close" @click="showAddTaskModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Task Title</label>
              <input type="text" class="form-control" v-model="newTask.title" placeholder="Enter task title">
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="newTask.description" rows="3" placeholder="Enter task description"></textarea>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <select class="form-select" v-model="newTask.priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Due Date</label>
                  <input type="date" class="form-control" v-model="newTask.dueDate">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddTaskModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addTask">Add Task</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddTaskModal" class="modal-backdrop fade show"></div>

    <!-- Focus Session Modal -->
    <div v-if="showFocusSessionModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Start Focus Session</h5>
            <button type="button" class="btn-close" @click="showFocusSessionModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">What are you working on?</label>
              <input type="text" class="form-control" v-model="focusSession.task" placeholder="Enter task or activity">
            </div>
            <div class="mb-3">
              <label class="form-label">Description (optional)</label>
              <textarea class="form-control" v-model="focusSession.description" rows="2" placeholder="Brief description of your focus session"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Session Duration</label>
              <select class="form-select" v-model="focusSession.duration">
                <option value="25">25 minutes (Pomodoro)</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div class="alert alert-info">
              <i class="bi bi-info-circle"></i>
              <strong>Focus Session Tips:</strong>
              <ul class="mb-0 mt-2">
                <li>Choose a quiet environment</li>
                <li>Turn off notifications</li>
                <li>Have everything you need ready</li>
                <li>Take short breaks between sessions</li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showFocusSessionModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="startFocusSession">
              <i class="bi bi-play-circle"></i> Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showFocusSessionModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      todayTasks: [],
      completedTasks: [],
      focusHours: 0,
      productivityScore: 85,
      recentActivity: [],
      showAddTaskModal: false,
      newTask: {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      },
      showFocusSessionModal: false,
      focusSession: {
        task: '',
        description: '',
        duration: 25,
        startTime: null
      },
      settings: {
        defaultSessionDuration: 25
      }
    }
  },
  mounted() {
    this.loadDashboardData();
    this.loadSettings();
  },
  methods: {
    loadSettings() {
      try {
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          this.settings = settings;
          
          // Set default focus session duration from settings
          if (settings.defaultSessionDuration) {
            this.focusSession.duration = settings.defaultSessionDuration;
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    },
    async loadDashboardData() {
      // Load today's tasks
      this.todayTasks = [
        { id: 1, title: 'Complete project proposal', description: 'Finish the Q4 project proposal document', status: 'pending', priority: 'high' },
        { id: 2, title: 'Review code changes', description: 'Review pull requests for the main branch', status: 'completed', priority: 'medium' },
        { id: 3, title: 'Team meeting', description: 'Weekly team sync meeting', status: 'pending', priority: 'low' }
      ];
      
      this.completedTasks = this.todayTasks.filter(task => task.status === 'completed');
      this.focusHours = 4.5;
      this.recentActivity = [
        { id: 1, type: 'task', description: 'Completed "Review code changes"', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { id: 2, type: 'session', description: 'Started focus session', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { id: 3, type: 'task', description: 'Added new task "Team meeting"', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) }
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
    
    getActivityIcon(type) {
      const icons = {
        task: 'bi bi-list-check',
        session: 'bi bi-clock',
        goal: 'bi bi-target'
      };
      return icons[type] || 'bi bi-info-circle';
    },
    
    formatTime(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours < 1) return 'Just now';
      if (hours === 1) return '1 hour ago';
      return `${hours} hours ago`;
    },
    
    toggleTaskStatus(task) {
      task.status = task.status === 'completed' ? 'pending' : 'completed';
      this.completedTasks = this.todayTasks.filter(t => t.status === 'completed');
    },
    
    deleteTask(taskId) {
      this.todayTasks = this.todayTasks.filter(task => task.id !== taskId);
    },
    
    openFocusSessionModal() {
      this.showFocusSessionModal = true;
      this.focusSession.startTime = new Date();
    },
    
    startFocusSession() {
      if (!this.focusSession.task.trim()) {
        alert('Please enter what you are working on');
        return;
      }
      
      // Create a focus session with the configured settings
      const session = {
        task: this.focusSession.task,
        description: this.focusSession.description,
        duration: parseInt(this.focusSession.duration),
        startTime: this.focusSession.startTime,
        type: 'focus'
      };
      
      // Store the focus session in localStorage for the TimeTracking component to access
      localStorage.setItem('currentFocusSession', JSON.stringify(session));
      
      // Close the modal
      this.showFocusSessionModal = false;
      
      // Reset the form
      this.focusSession = {
        task: '',
        description: '',
        duration: 25,
        startTime: null
      };
      
      // Navigate to the TimeTracking page to start the session
      this.$router.push('/time-tracking');
      
      // Add to recent activity
      this.recentActivity.unshift({
        id: Date.now(),
        type: 'session',
        description: `Started focus session: ${session.task}`,
        timestamp: new Date()
      });
      
      console.log('Focus session started:', session);
    },
    
    startTimeTracking() {
      // Create a general time tracking session (not a focus session)
      const timeTrackingSession = {
        task: 'Time Tracking',
        description: 'General time tracking session',
        duration: null, // No fixed duration for general tracking
        startTime: new Date(),
        type: 'tracking'
      };
      
      // Store the time tracking session in localStorage
      localStorage.setItem('currentTimeTrackingSession', JSON.stringify(timeTrackingSession));
      
      // Navigate to the TimeTracking page
      this.$router.push('/time-tracking');
      
      // Add to recent activity
      this.recentActivity.unshift({
        id: Date.now(),
        type: 'session',
        description: 'Started time tracking session',
        timestamp: new Date()
      });
      
      console.log('Time tracking started:', timeTrackingSession);
    },
    
    addTask() {
      if (this.newTask.title.trim()) {
        const task = {
          id: Date.now(),
          title: this.newTask.title,
          description: this.newTask.description,
          status: 'pending',
          priority: this.newTask.priority,
          dueDate: this.newTask.dueDate
        };
        
        this.todayTasks.push(task);
        this.showAddTaskModal = false;
        this.newTask = {
          title: '',
          description: '',
          priority: 'medium',
          dueDate: ''
        };
      }
    }
  }
}
</script>

<style scoped>
.task-item:last-child {
  border-bottom: none !important;
}

.activity-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.activity-icon {
  width: 24px;
  text-align: center;
}
</style> 