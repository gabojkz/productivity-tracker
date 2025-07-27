<template>
  <div class="yearly-goals">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-bullseye me-2"></i>
          {{ currentYear }} Goals
        </h5>
        <button 
          class="btn btn-sm btn-outline-primary"
          @click="addGoal"
          title="Add new goal"
        >
          <i class="fas fa-plus me-1"></i>
          Add Goal
        </button>
      </div>
      <div class="card-body">
        <div v-if="goals.length === 0" class="text-center text-muted py-4">
          <i class="fas fa-bullseye fa-2x mb-3"></i>
          <p>No goals set for {{ currentYear }}</p>
          <button class="btn btn-primary btn-sm" @click="addGoal">
            <i class="fas fa-plus me-1"></i>
            Add Your First Goal
          </button>
        </div>
        
        <div v-else class="goals-list">
          <div 
            v-for="goal in goals" 
            :key="goal.id"
            class="goal-item"
            :class="{ 'completed': goal.completed }"
            :data-goal-id="goal.id"
          >
            <div class="goal-header">
              <div class="goal-title">
                <i 
                  class="fas fa-check-circle me-2"
                  :class="{ 'text-success': goal.completed, 'text-muted': !goal.completed }"
                ></i>
                <span 
                  v-if="!goal.editing"
                  :class="{ 'text-decoration-line-through': goal.completed }"
                  @click="startEditing(goal.id)"
                  class="goal-text"
                >
                  {{ goal.emoji }} {{ goal.title }}
                </span>
                <div v-else class="goal-edit">
                  <input 
                    v-model="goal.emoji" 
                    type="text" 
                    class="form-control form-control-sm d-inline-block me-2"
                    style="width: 60px;"
                    placeholder="🎯"
                    maxlength="2"
                  />
                  <input 
                    v-model="goal.title" 
                    type="text" 
                    class="form-control form-control-sm d-inline-block"
                    placeholder="Enter your goal"
                    @keyup.enter="saveGoal(goal.id)"
                    @blur="saveGoal(goal.id)"
                  />
                </div>
              </div>
              <div class="goal-actions">
                <button 
                  v-if="!goal.editing"
                  class="btn btn-sm btn-outline-primary me-1"
                  @click="startEditing(goal.id)"
                  title="Edit goal"
                >
                  <i class="fas fa-edit me-1"></i>
                  Edit
                </button>
                <button 
                  class="btn btn-sm btn-outline-success me-1"
                  @click="toggleGoal(goal.id)"
                  :title="goal.completed ? 'Mark as incomplete' : 'Mark as complete'"
                >
                  <i class="fas me-1" :class="goal.completed ? 'fa-undo' : 'fa-check'"></i>
                  {{ goal.completed ? 'Undo' : 'Complete' }}
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteGoal(goal.id)"
                  title="Delete goal"
                >
                  <i class="fas fa-trash me-1"></i>
                  Delete
                </button>
              </div>
            </div>
            
            <div v-if="goal.description" class="goal-description">
              {{ goal.description }}
            </div>
            
            <div class="goal-progress">
              <div class="progress-info">
                <span class="progress-text">
                  {{ goal.completed ? 'Completed' : 'In Progress' }}
                </span>
                <span class="progress-date">
                  {{ formatDate(goal.created_at) }}
                </span>
              </div>
              <div class="progress-bar-container">
                <div 
                  class="progress-bar"
                  :style="{ width: goal.completed ? '100%' : '0%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="goals-summary mt-3">
          <div class="row text-center">
            <div class="col-4">
              <div class="summary-item">
                <div class="summary-number">{{ goals.length }}</div>
                <div class="summary-label">Total Goals</div>
              </div>
            </div>
            <div class="col-4">
              <div class="summary-item">
                <div class="summary-number text-success">{{ completedGoals }}</div>
                <div class="summary-label">Completed</div>
              </div>
            </div>
            <div class="col-4">
              <div class="summary-item">
                <div class="summary-number text-primary">{{ completionRate }}%</div>
                <div class="summary-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YearlyGoals',
  props: {
    currentYear: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      goals: []
    }
  },
  computed: {
    completedGoals() {
      return this.goals.filter(goal => goal.completed).length;
    },
    completionRate() {
      if (this.goals.length === 0) return 0;
      return Math.round((this.completedGoals / this.goals.length) * 100);
    }
  },
  mounted() {
    this.loadGoals();
  },
  methods: {
    loadGoals() {
      const storedGoals = localStorage.getItem(`yearly_goals_${this.currentYear}`);
      if (storedGoals) {
        this.goals = JSON.parse(storedGoals);
      }
    },
    saveGoals() {
      localStorage.setItem(`yearly_goals_${this.currentYear}`, JSON.stringify(this.goals));
    },
    addGoal() {
      const newGoal = {
        id: Date.now(),
        emoji: '🎯',
        title: 'New Goal',
        description: '',
        completed: false,
        editing: true,
        created_at: new Date().toISOString().split('T')[0]
      };
      this.goals.unshift(newGoal);
      this.saveGoals();
      this.$emit('goal-added', newGoal);
    },
    toggleGoal(goalId) {
      const goal = this.goals.find(g => g.id === goalId);
      if (goal) {
        goal.completed = !goal.completed;
        this.saveGoals();
        this.$emit('goal-toggled', goal);
      }
    },
    deleteGoal(goalId) {
      if (confirm('Are you sure you want to delete this goal?')) {
        this.goals = this.goals.filter(g => g.id !== goalId);
        this.saveGoals();
        this.$emit('goal-deleted', goalId);
      }
    },
    
    startEditing(goalId) {
      const goal = this.goals.find(g => g.id === goalId);
      if (goal) {
        goal.editing = true;
        this.$nextTick(() => {
          // Focus on the title input
          const titleInput = document.querySelector(`[data-goal-id="${goalId}"] input[placeholder="Enter your goal"]`);
          if (titleInput) {
            titleInput.focus();
          }
        });
      }
    },
    
    saveGoal(goalId) {
      const goal = this.goals.find(g => g.id === goalId);
      if (goal) {
        goal.editing = false;
        // Ensure emoji and title are not empty
        if (!goal.emoji.trim()) goal.emoji = '🎯';
        if (!goal.title.trim()) goal.title = 'New Goal';
        this.saveGoals();
        this.$emit('goal-updated', goal);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.yearly-goals {
  height: 100%;
}

.card-body {
  padding: 1rem;
}

.goals-list {
  max-height: 250px;
  overflow-y: auto;
}

.goal-item {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  background: white;
  transition: all 0.2s ease;
}

.goal-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.goal-item.completed {
  background: #f8f9fa;
  border-color: #28a745;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.goal-title {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.goal-text {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.goal-text:hover {
  background-color: #f8f9fa;
}

.goal-edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.goal-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.goal-actions .btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  min-width: 60px;
}

.goal-description {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 8px;
  font-style: italic;
}

.goal-progress {
  margin-top: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8rem;
}

.progress-text {
  color: #666;
}

.progress-date {
  color: #999;
}

.progress-bar-container {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}

.goals-summary {
  border-top: 1px solid #e9ecef;
  padding-top: 12px;
}

.summary-item {
  padding: 8px;
}

.summary-number {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}

.summary-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

/* Scrollbar styling */
.goals-list::-webkit-scrollbar {
  width: 6px;
}

.goals-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.goals-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.goals-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .goal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .goal-actions {
    align-self: flex-end;
  }
  
  .goals-summary .row {
    gap: 10px;
  }
}
</style> 