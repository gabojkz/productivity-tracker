<template>
  <div class="momento-mori">
    <h1>Momento Mori</h1>
    
    <div class="debug-info">
      <p>Total momentos: {{ momentos.length }}</p>
      <p>Current date: {{ currentDate.toISOString().split('T')[0] }}</p>
    </div>

    <div class="clock-section">
      <h3>Today's Progress</h3>
      <div class="clock-container">
        <div class="current-time">{{ currentTime }}</div>
        <div class="day-progress">
          <div class="progress-bar">
            <div class="progress-fill day-fill" :style="{ width: dayProgressPercentage + '%' }"></div>
          </div>
          <div class="progress-stats">
            <span class="time-elapsed">{{ timeElapsed }} elapsed</span>
            <span class="time-remaining">{{ timeRemaining }} remaining</span>
            <span class="percentage">{{ dayProgressPercentage.toFixed(1) }}% of day</span>
          </div>
        </div>
      </div>
      
      <div class="life-comparison">
        <h4>Life vs Today</h4>
        <div class="comparison-bars">
          <div class="comparison-item">
            <span class="label">Life Progress</span>
            <div class="mini-progress-bar">
              <div class="mini-fill life-fill" :style="{ width: lifeProgressPercentage + '%' }"></div>
            </div>
            <span class="mini-percentage">{{ lifeProgressPercentage.toFixed(1) }}%</span>
          </div>
          <div class="comparison-item">
            <span class="label">Today Progress</span>
            <div class="mini-progress-bar">
              <div class="mini-fill day-fill" :style="{ width: dayProgressPercentage + '%' }"></div>
            </div>
            <span class="mini-percentage">{{ dayProgressPercentage.toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="life-progress">
      <h3>Life Progress</h3>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: lifeProgressPercentage + '%' }"></div>
        </div>
        <div class="progress-stats">
          <span class="years-lived">{{ yearsLived }} years lived</span>
          <span class="years-left">{{ yearsLeft }} years left</span>
          <span class="percentage">{{ lifeProgressPercentage.toFixed(1) }}% complete</span>
        </div>
      </div>
    </div>

    <div class="momento-grid">
      <div v-for="momento in momentos" :key="momento.id" class="momento-mori-item" :class="{ 'day-has-passed': momento.hasPassed, 'day-is-weekend': momento.isWeekend }">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MomentoMori',
  data() {
    return {
      momentos: [],
      currentDate: new Date(),
      currentTime: '',
      currentDay: new Date().getDate(),
      lifeExpectancy: 80,
      daysInLife: this.lifeExpectancy * 365,
      yearBorn: 1990,
      yearOfDeath: this.yearBorn + this.lifeExpectancy,
      daysSinceBirth: (new Date().getFullYear() - this.yearBorn) * 365,
      daysSinceDeath: (new Date().getFullYear() - this.yearOfDeath) * 365,
      timeInterval: null,
      userSettings: null
    }
  },
  computed: {
    yearsLived() {
      const currentYear = new Date().getFullYear();
      return currentYear - this.yearBorn;
    },
    yearsLeft() {
      return this.lifeExpectancy - this.yearsLived;
    },
    lifeProgressPercentage() {
      return (this.yearsLived / this.lifeExpectancy) * 100;
    },
    dayProgressPercentage() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      
      const totalDayMs = endOfDay.getTime() - startOfDay.getTime();
      const elapsedMs = now.getTime() - startOfDay.getTime();
      
      return (elapsedMs / totalDayMs) * 100;
    },
    timeElapsed() {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const elapsedMs = now.getTime() - startOfDay.getTime();
      const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    },
    timeRemaining() {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const remainingMs = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
  },
  methods: {
    loadUserSettings() {
      try {
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        if (savedSettings) {
          this.userSettings = JSON.parse(savedSettings);
          this.updateLifeExpectancy();
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
      }
    },
    updateLifeExpectancy() {
      if (this.userSettings && this.userSettings.userProfile) {
        const profile = this.userSettings.userProfile;
        
        // Use user's life expectancy if available
        if (profile.lifeExpectancy) {
          this.lifeExpectancy = profile.lifeExpectancy;
        }
        
        // Use user's date of birth if available
        if (profile.dateOfBirth) {
          const birthDate = new Date(profile.dateOfBirth);
          this.yearBorn = birthDate.getFullYear();
          this.yearOfDeath = this.yearBorn + this.lifeExpectancy;
          this.daysInLife = this.lifeExpectancy * 365;
          this.daysSinceBirth = (new Date().getFullYear() - this.yearBorn) * 365;
          this.daysSinceDeath = (new Date().getFullYear() - this.yearOfDeath) * 365;
        }
      }
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
      this.currentDate = now;
    },
    startClock() {
      this.updateTime();
      this.timeInterval = setInterval(this.updateTime, 1000);
    },
    stopClock() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
    },
    getMomentos() {
      this.momentos = []; // Clear array before populating
      
      // number of weeks in a year
      const weeksInYear = 52;
      const weeksInLife = this.lifeExpectancy * weeksInYear;


      for (let i = 0; i < weeksInLife; i++) {
        
        this.momentos.push({
          id: i,
          date: dayOfLife.toISOString().split('T')[0],
          hasPassed: dayOfLife < this.currentDate,
          isWeekend: dayOfLife.getDay() === 0 || dayOfLife.getDay() === 6
        });
      }
      
      console.log('Generated momentos:', this.momentos.length);
      console.log('First few momentos:', this.momentos.slice(0, 5));
    }
  },
  mounted() {
    this.loadUserSettings(); // Load settings on mount
    this.getMomentos();
    this.startClock();
  },
  beforeDestroy() {
    this.stopClock();
  }
}
</script>

<style scoped>
.momento-mori {
  padding: 20px;
}

.clock-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.clock-section h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.clock-container {
  margin-bottom: 20px;
}

.current-time {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #007bff;
  margin-bottom: 15px;
  font-family: 'Courier New', monospace;
}

.day-progress {
  margin-top: 15px;
}

.life-comparison {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.life-comparison h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.comparison-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comparison-item .label {
  min-width: 120px;
  font-weight: bold;
  color: #666;
}

.mini-progress-bar {
  flex: 1;
  height: 12px;
  background-color: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  transition: width 0.3s ease-in-out;
  border-radius: 6px;
}

.life-fill {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.day-fill {
  background: linear-gradient(90deg, #007bff, #0056b3);
}

.mini-percentage {
  min-width: 50px;
  text-align: right;
  font-weight: bold;
  font-size: 12px;
}

.life-progress {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.life-progress h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.progress-container {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.5s ease-in-out;
  border-radius: 10px;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

.years-lived {
  color: #007bff;
  font-weight: bold;
}

.years-left {
  color: #dc3545;
  font-weight: bold;
}

.percentage {
  color: #28a745;
  font-weight: bold;
}

.momento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  max-height: 600px;
  overflow-y: auto;
}

.momento-mori-item {
  border: 1px solid #ccc;
  padding: 8px;
  margin: 2px;
  border-radius: 4px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  text-align: center;
}

.date-text {
  font-size: 8px;
  word-break: break-all;
}

.day-has-passed {
  background-color: #333;
  color: blue;
}

.day-is-weekend {
  background-color: red;
}
</style>