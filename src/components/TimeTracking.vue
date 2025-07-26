<template>
  <div class="time-tracking">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-0">Time Tracking</h1>
            <p class="text-muted">Track your time and focus sessions</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-success" @click="startTracking" :disabled="isTracking">
              <i class="bi bi-play-circle"></i> Start Tracking
            </button>
            <button class="btn btn-danger" @click="stopTracking" :disabled="!isTracking">
              <i class="bi bi-stop-circle"></i> Stop Tracking
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Session -->
    <div v-if="isTracking" class="row mb-4">
      <div class="col-12">
        <div class="card border-success">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-clock"></i> Active Session
            </h5>
          </div>
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <h4 class="mb-2">{{ currentSession.task || 'Focus Session' }}</h4>
                <p class="text-muted mb-0">{{ currentSession.description || 'No description' }}</p>
              </div>
              <div class="col-md-3 text-center">
                <div class="display-4 text-success">{{ formatTime(currentSession.elapsed) }}</div>
                <small class="text-muted">Elapsed Time</small>
              </div>
              <div class="col-md-3 text-end">
                <button class="btn btn-outline-success btn-sm" @click="pauseTracking">
                  <i class="bi bi-pause"></i> Pause
                </button>
                <button class="btn btn-outline-danger btn-sm ms-2" @click="stopTracking">
                  <i class="bi bi-stop"></i> Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Start -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Start Session</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <label class="form-label">Task/Activity</label>
                <input type="text" class="form-control" v-model="quickSession.task" placeholder="What are you working on?">
              </div>
              <div class="col-md-4">
                <label class="form-label">Description</label>
                <input type="text" class="form-control" v-model="quickSession.description" placeholder="Optional description">
              </div>
              <div class="col-md-4">
                <label class="form-label">Duration (minutes)</label>
                <select class="form-select" v-model="quickSession.duration">
                  <option value="25">25 min (Pomodoro)</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Time Entries -->
    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Recent Time Entries</h5>
              <div class="d-flex gap-2">
                <select class="form-select form-select-sm" v-model="timeFilter" style="width: auto;">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="filteredTimeEntries.length === 0" class="text-center py-4">
              <i class="bi bi-clock fs-1 text-muted"></i>
              <p class="text-muted mt-2">No time entries yet. Start tracking your time!</p>
            </div>
            <div v-else>
              <div v-for="entry in filteredTimeEntries" :key="entry.id" class="time-entry border-bottom py-3">
                <div class="row align-items-center">
                  <div class="col-md-6">
                    <h6 class="mb-1">{{ entry.task }}</h6>
                    <p class="text-muted mb-0 small">{{ entry.description }}</p>
                    <small class="text-muted">
                      {{ formatDateTime(entry.start_time) }} - {{ formatDateTime(entry.end_time) }}
                    </small>
                  </div>
                  <div class="col-md-3 text-center">
                    <span class="badge bg-primary fs-6">{{ formatDuration(entry.duration_minutes) }}</span>
                  </div>
                  <div class="col-md-3 text-end">
                    <div class="d-flex gap-2 justify-content-end">
                      <button class="btn btn-outline-primary btn-sm" @click="editEntry(entry)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" @click="deleteEntry(entry.id)">
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

      <!-- Summary -->
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Today's Summary</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-6">
                <h4 class="text-primary">{{ todayTotalHours }}h</h4>
                <small class="text-muted">Total Time</small>
              </div>
              <div class="col-6">
                <h4 class="text-success">{{ todaySessions }}</h4>
                <small class="text-muted">Sessions</small>
              </div>
            </div>
            <hr>
            <div class="row text-center">
              <div class="col-6">
                <h4 class="text-info">{{ averageSessionLength }}m</h4>
                <small class="text-muted">Avg Session</small>
              </div>
              <div class="col-6">
                <h4 class="text-warning">{{ productivityRating }}%</h4>
                <small class="text-muted">Focus Score</small>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Top Activities</h5>
          </div>
          <div class="card-body">
            <div v-if="topActivities.length === 0" class="text-center py-3">
              <p class="text-muted small">No activities yet</p>
            </div>
            <div v-else>
              <div v-for="activity in topActivities" :key="activity.task" class="activity-item py-2">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">{{ activity.task }}</h6>
                    <small class="text-muted">{{ activity.sessions }} sessions</small>
                  </div>
                  <span class="badge bg-primary">{{ formatDuration(activity.totalMinutes) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Entry Modal -->
    <div class="modal fade" :class="{ show: showEditModal }" :style="{ display: showEditModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Time Entry</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEntry">
              <div class="mb-3">
                <label class="form-label">Task/Activity</label>
                <input type="text" class="form-control" v-model="editForm.task" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="editForm.description" rows="2"></textarea>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Start Time</label>
                    <input type="datetime-local" class="form-control" v-model="editForm.start_time" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">End Time</label>
                    <input type="datetime-local" class="form-control" v-model="editForm.end_time" required>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes</label>
                <textarea class="form-control" v-model="editForm.notes" rows="2"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveEntry">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'TimeTracking',
  data() {
    return {
      isTracking: false,
      isPaused: false,
      currentSession: {
        task: '',
        description: '',
        startTime: null,
        elapsed: 0
      },
      quickSession: {
        task: '',
        description: '',
        duration: 25
      },
      timeEntries: [],
      timeFilter: 'today',
      showEditModal: false,
      editingEntry: null,
      editForm: {
        task: '',
        description: '',
        start_time: '',
        end_time: '',
        notes: ''
      },
      timer: null
    }
  },
  computed: {
    filteredTimeEntries() {
      let filtered = this.timeEntries;
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      switch (this.timeFilter) {
        case 'today':
          filtered = filtered.filter(entry => new Date(entry.start_time) >= today);
          break;
        case 'week':
          filtered = filtered.filter(entry => new Date(entry.start_time) >= weekStart);
          break;
        case 'month':
          filtered = filtered.filter(entry => new Date(entry.start_time) >= monthStart);
          break;
      }
      
      return filtered.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
    },
    
    todayTotalHours() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEntries = this.timeEntries.filter(entry => 
        new Date(entry.start_time) >= today
      );
      
      const totalMinutes = todayEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0);
      return (totalMinutes / 60).toFixed(1);
    },
    
    todaySessions() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return this.timeEntries.filter(entry => 
        new Date(entry.start_time) >= today
      ).length;
    },
    
    averageSessionLength() {
      if (this.timeEntries.length === 0) return 0;
      
      const totalMinutes = this.timeEntries.reduce((sum, entry) => sum + entry.duration_minutes, 0);
      return Math.round(totalMinutes / this.timeEntries.length);
    },
    
    productivityRating() {
      // Mock productivity rating based on session consistency
      const recentEntries = this.timeEntries.slice(0, 10);
      if (recentEntries.length === 0) return 0;
      
      const consistentSessions = recentEntries.filter(entry => entry.duration_minutes >= 25).length;
      return Math.round((consistentSessions / recentEntries.length) * 100);
    },
    
    topActivities() {
      const activityMap = {};
      
      this.timeEntries.forEach(entry => {
        if (!activityMap[entry.task]) {
          activityMap[entry.task] = { sessions: 0, totalMinutes: 0 };
        }
        activityMap[entry.task].sessions++;
        activityMap[entry.task].totalMinutes += entry.duration_minutes;
      });
      
      return Object.entries(activityMap)
        .map(([task, data]) => ({ task, ...data }))
        .sort((a, b) => b.totalMinutes - a.totalMinutes)
        .slice(0, 5);
    }
  },
  mounted() {
    this.loadTimeEntries();
  },
  methods: {
    async loadTimeEntries() {
      // Mock data - replace with actual database calls
      this.timeEntries = [
        {
          id: 1,
          task: 'Project Development',
          description: 'Working on new features',
          start_time: '2024-01-15T09:00:00',
          end_time: '2024-01-15T10:30:00',
          duration_minutes: 90,
          notes: 'Made good progress on the main features'
        },
        {
          id: 2,
          task: 'Code Review',
          description: 'Reviewing team pull requests',
          start_time: '2024-01-15T11:00:00',
          end_time: '2024-01-15T11:45:00',
          duration_minutes: 45,
          notes: 'Reviewed 3 PRs'
        },
        {
          id: 3,
          task: 'Documentation',
          description: 'Updating API docs',
          start_time: '2024-01-15T14:00:00',
          end_time: '2024-01-15T15:00:00',
          duration_minutes: 60,
          notes: 'Updated main API endpoints'
        }
      ];
    },
    
    startTracking() {
      if (!this.quickSession.task.trim()) {
        alert('Please enter a task name to start tracking');
        return;
      }
      
      this.isTracking = true;
      this.currentSession = {
        task: this.quickSession.task,
        description: this.quickSession.description,
        startTime: new Date(),
        elapsed: 0
      };
      
      this.timer = setInterval(() => {
        if (!this.isPaused) {
          this.currentSession.elapsed += 1;
        }
      }, 1000);
      
      // Clear quick session form
      this.quickSession = {
        task: '',
        description: '',
        duration: 25
      };
    },
    
    pauseTracking() {
      this.isPaused = !this.isPaused;
    },
    
    stopTracking() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      
      // Save the session
      const endTime = new Date();
      const duration = Math.floor(this.currentSession.elapsed / 60);
      
      const entry = {
        id: Date.now(),
        task: this.currentSession.task,
        description: this.currentSession.description,
        start_time: this.currentSession.startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: duration,
        notes: ''
      };
      
      this.timeEntries.unshift(entry);
      
      // Reset
      this.isTracking = false;
      this.isPaused = false;
      this.currentSession = {
        task: '',
        description: '',
        startTime: null,
        elapsed: 0
      };
    },
    
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    },
    
    formatDateTime(dateString) {
      return new Date(dateString).toLocaleString();
    },
    
    editEntry(entry) {
      this.editingEntry = entry;
      this.editForm = {
        task: entry.task,
        description: entry.description,
        start_time: entry.start_time.slice(0, 16), // Format for datetime-local input
        end_time: entry.end_time.slice(0, 16),
        notes: entry.notes || ''
      };
      this.showEditModal = true;
    },
    
    deleteEntry(entryId) {
      if (confirm('Are you sure you want to delete this time entry?')) {
        this.timeEntries = this.timeEntries.filter(entry => entry.id !== entryId);
      }
    },
    
    closeEditModal() {
      this.showEditModal = false;
      this.editingEntry = null;
      this.editForm = {
        task: '',
        description: '',
        start_time: '',
        end_time: '',
        notes: ''
      };
    },
    
    saveEntry() {
      if (this.editingEntry) {
        const index = this.timeEntries.findIndex(entry => entry.id === this.editingEntry.id);
        if (index !== -1) {
          const startTime = new Date(this.editForm.start_time);
          const endTime = new Date(this.editForm.end_time);
          const duration = Math.floor((endTime - startTime) / (1000 * 60));
          
          this.timeEntries[index] = {
            ...this.editingEntry,
            task: this.editForm.task,
            description: this.editForm.description,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            duration_minutes: duration,
            notes: this.editForm.notes
          };
        }
      }
      
      this.closeEditModal();
    }
  }
}
</script>

<style scoped>
.time-entry:last-child {
  border-bottom: none !important;
}

.activity-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style> 