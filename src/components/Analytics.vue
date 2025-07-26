<template>
  <div class="analytics">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-0">Analytics</h1>
            <p class="text-muted">Track your productivity trends and insights</p>
          </div>
          <div class="d-flex gap-2">
            <select class="form-select" v-model="timeRange" style="width: auto;">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="card-title">Total Hours</h6>
                <h3 class="mb-0">{{ totalHours }}h</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-clock fs-1"></i>
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
                <h6 class="card-title">Tasks Completed</h6>
                <h3 class="mb-0">{{ completedTasks }}</h3>
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
                <h6 class="card-title">Avg Session</h6>
                <h3 class="mb-0">{{ avgSessionLength }}m</h3>
              </div>
              <div class="align-self-center">
                <i class="bi bi-graph-up fs-1"></i>
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
                <i class="bi bi-star fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row">
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Daily Productivity Trend</h5>
          </div>
          <div class="card-body">
            <canvas ref="productivityChart" height="300"></canvas>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Time Distribution</h5>
          </div>
          <div class="card-body">
            <canvas ref="timeDistributionChart" height="300"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Top Activities</h5>
          </div>
          <div class="card-body">
            <div v-if="topActivities.length === 0" class="text-center py-4">
              <p class="text-muted">No activity data available</p>
            </div>
            <div v-else>
              <div v-for="(activity, index) in topActivities" :key="activity.name" class="activity-item py-2">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <span class="badge bg-primary me-2">{{ index + 1 }}</span>
                    <div>
                      <h6 class="mb-0">{{ activity.name }}</h6>
                      <small class="text-muted">{{ activity.sessions }} sessions</small>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold">{{ activity.hours }}h</div>
                    <small class="text-muted">{{ activity.percentage }}%</small>
                  </div>
                </div>
                <div class="progress mt-2" style="height: 4px;">
                  <div class="progress-bar" :style="{ width: activity.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Weekly Comparison</h5>
          </div>
          <div class="card-body">
            <canvas ref="weeklyComparisonChart" height="250"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Productivity Insights</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-success">
                  <i class="bi bi-arrow-up"></i> Positive Trends
                </h6>
                <ul class="list-unstyled">
                  <li v-for="insight in positiveInsights" :key="insight" class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    {{ insight }}
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6 class="text-warning">
                  <i class="bi bi-exclamation-triangle"></i> Areas for Improvement
                </h6>
                <ul class="list-unstyled">
                  <li v-for="insight in improvementInsights" :key="insight" class="mb-2">
                    <i class="bi bi-lightbulb text-warning me-2"></i>
                    {{ insight }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'Analytics',
  data() {
    return {
      timeRange: 30,
      productivityChart: null,
      timeDistributionChart: null,
      weeklyComparisonChart: null,
      chartData: {
        dailyProductivity: [],
        timeDistribution: [],
        weeklyComparison: []
      }
    }
  },
  computed: {
    totalHours() {
      return this.chartData.dailyProductivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1);
    },
    
    completedTasks() {
      return this.chartData.dailyProductivity.reduce((sum, day) => sum + day.tasks, 0);
    },
    
    avgSessionLength() {
      const sessions = this.chartData.dailyProductivity.reduce((sum, day) => sum + day.sessions, 0);
      const totalMinutes = this.chartData.dailyProductivity.reduce((sum, day) => sum + day.minutes, 0);
      return sessions > 0 ? Math.round(totalMinutes / sessions) : 0;
    },
    
    productivityScore() {
      const recentDays = this.chartData.dailyProductivity.slice(-7);
      if (recentDays.length === 0) return 0;
      
      const avgHours = recentDays.reduce((sum, day) => sum + day.hours, 0) / recentDays.length;
      const avgTasks = recentDays.reduce((sum, day) => sum + day.tasks, 0) / recentDays.length;
      
      // Calculate score based on hours and tasks
      const hoursScore = Math.min(avgHours / 8 * 100, 100);
      const tasksScore = Math.min(avgTasks / 5 * 100, 100);
      
      return Math.round((hoursScore + tasksScore) / 2);
    },
    
    topActivities() {
      const activityMap = {};
      
      this.chartData.dailyProductivity.forEach(day => {
        if (day.activities) {
          day.activities.forEach(activity => {
            if (!activityMap[activity.name]) {
              activityMap[activity.name] = { hours: 0, sessions: 0 };
            }
            activityMap[activity.name].hours += activity.hours;
            activityMap[activity.name].sessions += activity.sessions;
          });
        }
      });
      
      const totalHours = Object.values(activityMap).reduce((sum, activity) => sum + activity.hours, 0);
      
      return Object.entries(activityMap)
        .map(([name, data]) => ({
          name,
          hours: data.hours.toFixed(1),
          sessions: data.sessions,
          percentage: totalHours > 0 ? Math.round((data.hours / totalHours) * 100) : 0
        }))
        .sort((a, b) => parseFloat(b.hours) - parseFloat(a.hours))
        .slice(0, 5);
    },
    
    positiveInsights() {
      const insights = [];
      
      if (this.productivityScore > 80) {
        insights.push('Excellent productivity score! Keep up the great work.');
      }
      
      if (this.avgSessionLength > 45) {
        insights.push('Good focus sessions - you\'re maintaining concentration well.');
      }
      
      if (this.completedTasks > 20) {
        insights.push('High task completion rate shows good follow-through.');
      }
      
      return insights.length > 0 ? insights : ['No specific positive trends identified yet.'];
    },
    
    improvementInsights() {
      const insights = [];
      
      if (this.productivityScore < 60) {
        insights.push('Consider setting more realistic daily goals to improve productivity.');
      }
      
      if (this.avgSessionLength < 25) {
        insights.push('Try longer focus sessions to improve deep work capability.');
      }
      
      if (this.totalHours < 20) {
        insights.push('Increase daily work hours to boost overall productivity.');
      }
      
      return insights.length > 0 ? insights : ['Great job! No major areas for improvement identified.'];
    }
  },
  mounted() {
    this.loadAnalyticsData();
  },
  watch: {
    timeRange() {
      this.loadAnalyticsData();
    }
  },
  methods: {
    async loadAnalyticsData() {
      // Mock data - replace with actual database calls
      this.chartData = {
        dailyProductivity: this.generateMockDailyData(),
        timeDistribution: this.generateMockDistributionData(),
        weeklyComparison: this.generateMockWeeklyData()
      };
      
      this.$nextTick(() => {
        this.createCharts();
      });
    },
    
    generateMockDailyData() {
      const data = [];
      const days = parseInt(this.timeRange);
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          hours: Math.random() * 8 + 2,
          tasks: Math.floor(Math.random() * 8) + 1,
          sessions: Math.floor(Math.random() * 5) + 1,
          minutes: Math.floor(Math.random() * 300) + 120,
          activities: [
            { name: 'Development', hours: Math.random() * 4 + 1, sessions: Math.floor(Math.random() * 3) + 1 },
            { name: 'Meetings', hours: Math.random() * 2 + 0.5, sessions: Math.floor(Math.random() * 2) + 1 },
            { name: 'Planning', hours: Math.random() * 2 + 0.5, sessions: Math.floor(Math.random() * 2) + 1 }
          ]
        });
      }
      
      return data;
    },
    
    generateMockDistributionData() {
      return [
        { label: 'Development', value: 45, color: '#007bff' },
        { label: 'Meetings', value: 25, color: '#28a745' },
        { label: 'Planning', value: 20, color: '#ffc107' },
        { label: 'Other', value: 10, color: '#dc3545' }
      ];
    },
    
    generateMockWeeklyData() {
      const weeks = [];
      for (let i = 3; i >= 0; i--) {
        weeks.push({
          week: `Week ${4 - i}`,
          hours: Math.random() * 40 + 20,
          tasks: Math.floor(Math.random() * 30) + 10
        });
      }
      return weeks;
    },
    
    createCharts() {
      this.createProductivityChart();
      this.createTimeDistributionChart();
      this.createWeeklyComparisonChart();
    },
    
    createProductivityChart() {
      const ctx = this.$refs.productivityChart;
      if (!ctx) return;
      
      if (this.productivityChart) {
        this.productivityChart.destroy();
      }
      
      this.productivityChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartData.dailyProductivity.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Hours Worked',
              data: this.chartData.dailyProductivity.map(day => day.hours),
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Tasks Completed',
              data: this.chartData.dailyProductivity.map(day => day.tasks),
              borderColor: '#28a745',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              tension: 0.4,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    
    createTimeDistributionChart() {
      const ctx = this.$refs.timeDistributionChart;
      if (!ctx) return;
      
      if (this.timeDistributionChart) {
        this.timeDistributionChart.destroy();
      }
      
      this.timeDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.chartData.timeDistribution.map(item => item.label),
          datasets: [{
            data: this.chartData.timeDistribution.map(item => item.value),
            backgroundColor: this.chartData.timeDistribution.map(item => item.color),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    },
    
    createWeeklyComparisonChart() {
      const ctx = this.$refs.weeklyComparisonChart;
      if (!ctx) return;
      
      if (this.weeklyComparisonChart) {
        this.weeklyComparisonChart.destroy();
      }
      
      this.weeklyComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.chartData.weeklyComparison.map(week => week.week),
          datasets: [
            {
              label: 'Hours',
              data: this.chartData.weeklyComparison.map(week => week.hours),
              backgroundColor: '#007bff',
              borderColor: '#0056b3',
              borderWidth: 1
            },
            {
              label: 'Tasks',
              data: this.chartData.weeklyComparison.map(week => week.tasks),
              backgroundColor: '#28a745',
              borderColor: '#1e7e34',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.activity-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style> 