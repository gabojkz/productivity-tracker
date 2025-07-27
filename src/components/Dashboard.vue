<template>
  <div class="dashboard">
    <!-- Header with Time and Weather -->
    <TimeWeatherDisplay 
      :current-time="currentTime"
      :current-date="currentDate"
      :weather="weather"
      @refresh-location="refreshLocation"
    />

    <!-- Quick Actions, Today's Tasks, and Yearly Goals -->
    <div class="row mb-4 g-2">
      <!-- Quick Actions -->
      <div class="col-md-3">
        <QuickActions 
          @start-focus-session="startFocusSession"
          @start-time-tracking="startTimeTracking"
        />
      </div>

      <!-- Today's Tasks -->
      <div class="col-md-5">
        <TodayTasks 
          :tasks="todayTasks"
          @toggle-task-status="toggleTaskStatus"
          @start-task="startTask"
          @pause-task="pauseTask"
        />
      </div>

      <!-- Yearly Goals -->
      <div class="col-md-4">
        <YearlyGoals 
          :current-year="currentYear"
          @goal-added="handleGoalAdded"
          @goal-toggled="handleGoalToggled"
          @goal-deleted="handleGoalDeleted"
        />
      </div>
    </div>


    <!-- Yesterday's Completed Tasks and Upcoming Events -->
    <div class="row">
      <!-- Yesterday's Completed Tasks -->
      <YesterdayTasks :tasks="yesterdayCompletedTasks" />

      <!-- Upcoming Calendar Events -->
      <UpcomingEvents :events="upcomingEvents" :categories="categories" />
    </div>

    <!-- Focus Session Modal -->
    <FocusSessionModal 
      :show-modal="showFocusSessionModal"
      :session="focusSession"
      @close-modal="closeFocusSessionModal"
      @start-session="startFocusSessionFromModal"
    />
  </div>
</template>

<script>
import TimeWeatherDisplay from './dashboard/TimeWeatherDisplay.vue'
import QuickActions from './dashboard/QuickActions.vue'
import TodayTasks from './dashboard/TodayTasks.vue'
import YesterdayTasks from './dashboard/YesterdayTasks.vue'
import UpcomingEvents from './dashboard/UpcomingEvents.vue'
import FocusSessionModal from './dashboard/FocusSessionModal.vue'
import YearlyGoals from './dashboard/YearlyGoals.vue'

export default {
  name: 'Dashboard',
  components: {
    TimeWeatherDisplay,
    QuickActions,
    TodayTasks,
    YesterdayTasks,
    UpcomingEvents,
    FocusSessionModal,
    YearlyGoals
  },
  data() {
    return {
      currentTime: '',
      currentDate: '',
      currentYear: new Date().getFullYear(),
      weather: {
        temperature: 23,
        condition: 'Cloudy',
        high: 31,
        low: 18,
        windSpeed: 11,
        sunrise: '06:00',
        sunset: '20:10',
        location: null,
        latitude: null,
        longitude: null,
        lastUpdated: null
      },
      showFocusSessionModal: false,
      focusSession: {
        task: '',
        duration: 25,
        description: ''
      },
      tasks: [],
      events: [],
      categories: [],
      // Time awareness reactive values
      yearProgress: 0,
      quarterProgress: 0,
      dayProgress: 0,
      daysLeftInYear: 0,
      currentQuarter: 'Q1',
      timeLeftToday: '',
      lifeProgress: 0,
      yearsLeft: 50
    }
  },
  computed: {
    todayTasks() {
      const today = new Date().toISOString().split('T')[0];
      return this.tasks.filter(task => 
        task.due_date === today && task.status !== 'completed'
      );
    },
    yesterdayCompletedTasks() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      return this.tasks.filter(task => 
        task.status === 'completed' && task.completed_at === yesterdayStr
      );
    },
    upcomingEvents() {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      return this.events.filter(event => {
        const eventDate = new Date(event.startDate || event.date);
        return eventDate >= today && eventDate <= nextWeek;
      }).sort((a, b) => {
        const dateA = new Date(a.startDate || a.date);
        const dateB = new Date(b.startDate || b.date);
        return dateA - dateB;
      });
    }
  },
  mounted() {
    this.updateTime();
    this.loadData();
    this.loadWeatherSettings();
    setInterval(this.updateTime, 1000);
    
    // Try to get location on startup if not already set
    if (!this.weather.location) {
      this.refreshLocation();
    }
  },
  methods: {
    updateTime() {
      const now = new Date();
      
      // Update current time and date
      this.currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      this.currentDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Calculate year progress
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      const yearTotal = endOfYear - startOfYear;
      const yearElapsed = now - startOfYear;
      this.yearProgress = Math.round((yearElapsed / yearTotal) * 100);
      
      // Calculate quarter progress
      const quarter = Math.floor(now.getMonth() / 3);
      const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
      const endOfQuarter = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
      const quarterTotal = endOfQuarter - startOfQuarter;
      const quarterElapsed = now - startOfQuarter;
      this.quarterProgress = Math.round((quarterElapsed / quarterTotal) * 100);
      
      // Calculate day progress
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const dayTotal = endOfDay - startOfDay;
      const dayElapsed = now - startOfDay;
      this.dayProgress = Math.round((dayElapsed / dayTotal) * 100);
      
      // Calculate days left in year
      const diffTime = endOfYear - now;
      this.daysLeftInYear = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Calculate current quarter
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      this.currentQuarter = quarters[Math.floor(now.getMonth() / 3)];
      
      // Calculate time left today
      const timeLeft = endOfDay - now;
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      this.timeLeftToday = `${hours}h ${minutes}m`;
      
      // Calculate life progress (mock values)
      const age = 30; // Mock age
      const lifeExpectancy = 80; // Mock life expectancy
      this.lifeProgress = Math.round((age / lifeExpectancy) * 100);
      this.yearsLeft = lifeExpectancy - age;
    },
    loadData() {
      // Load tasks from localStorage
      const savedTasks = localStorage.getItem('calendar-events');
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      }
      
      // Load events from localStorage
      const savedEvents = localStorage.getItem('calendar-events');
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }
      
      // Load categories from localStorage
      const savedCategories = localStorage.getItem('calendar-categories');
      if (savedCategories) {
        this.categories = JSON.parse(savedCategories);
      }
    },
    startFocusSession() {
      this.showFocusSessionModal = true;
    },
    closeFocusSessionModal() {
      this.showFocusSessionModal = false;
      this.focusSession = {
        task: '',
        duration: 25,
        description: ''
      };
    },
    startFocusSessionFromModal() {
      if (this.focusSession.task.trim()) {
        const session = {
          task: this.focusSession.task,
          description: this.focusSession.description,
          duration: this.focusSession.duration,
          startTime: new Date(),
          type: 'focus'
        };
        localStorage.setItem('currentFocusSession', JSON.stringify(session));
        this.$router.push('/time-tracking');
        this.closeFocusSessionModal();
      }
    },
    startTimeTracking() {
      const timeTrackingSession = {
        task: 'Time Tracking',
        description: 'General time tracking session',
        duration: null,
        startTime: new Date(),
        type: 'tracking'
      };
      localStorage.setItem('currentTimeTrackingSession', JSON.stringify(timeTrackingSession));
      this.$router.push('/time-tracking');
    },
    startTask(task) {
      // Navigate to tasks page and start the specific task
      this.$router.push('/tasks');
      // The task starting logic is in the Tasks component
    },
    pauseTask(task) {
      // This would be handled in the Tasks component
      console.log('Pause task:', task.title);
    },
    toggleTaskStatus(task) {
      task.status = task.status === 'completed' ? 'pending' : 'completed';
      if (task.status === 'completed') {
        task.completed_at = new Date().toISOString().split('T')[0];
      }
    },

    
    async getCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });
    },
    
    async getLocationName(latitude, longitude) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.display_name) {
          // Extract city and country from the full address
          const parts = data.display_name.split(', ');
          const city = parts[0];
          const country = parts[parts.length - 1];
          return `${city}, ${country}`;
        }
        return 'Unknown location';
      } catch (error) {
        console.error('Error getting location name:', error);
        return 'Unknown location';
      }
    },
    
    async fetchWeatherData(latitude, longitude) {
      try {
        // Using OpenWeatherMap API (you'll need to get a free API key)
        // For now, we'll use mock data but structure it for real API integration
        const apiKey = this.getWeatherApiKey();
        
        if (!apiKey) {
          // Use mock data if no API key is available
          return this.getMockWeatherData();
        }
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Weather API request failed');
        }
        
        const data = await response.json();
        
        return {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          high: Math.round(data.main.temp_max),
          low: Math.round(data.main.temp_min),
          windSpeed: Math.round(data.wind.speed * 2.237), // Convert m/s to mph
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching weather data:', error);
        return this.getMockWeatherData();
      }
    },
    
    getMockWeatherData() {
      return {
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        high: Math.floor(Math.random() * 15) + 20,
        low: Math.floor(Math.random() * 10) + 10,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        sunrise: '06:00',
        sunset: '20:10',
        lastUpdated: new Date().toISOString()
      };
    },
    
    getWeatherApiKey() {
      // Get API key from settings or environment
      const settings = localStorage.getItem('productivity-tracker-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.weather?.apiKey || null;
      }
      return null;
    },
    
    async refreshLocation() {
      try {
        const coords = await this.getCurrentLocation();
        const locationName = await this.getLocationName(coords.latitude, coords.longitude);
        const weatherData = await this.fetchWeatherData(coords.latitude, coords.longitude);
        
        this.weather = {
          ...this.weather,
          ...weatherData,
          location: locationName,
          latitude: coords.latitude,
          longitude: coords.longitude
        };
        
        // Save location to settings
        this.saveWeatherSettings();
        
      } catch (error) {
        console.error('Error refreshing location:', error);
        alert('Unable to get your location. Please check your browser permissions.');
      }
    },
    
    saveWeatherSettings() {
      try {
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        let settings = savedSettings ? JSON.parse(savedSettings) : {};
        
        settings.weather = {
          ...settings.weather,
          location: this.weather.location,
          latitude: this.weather.latitude,
          longitude: this.weather.longitude,
          lastUpdated: this.weather.lastUpdated
        };
        
        localStorage.setItem('productivity-tracker-settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save weather settings:', error);
      }
    },
    
    loadWeatherSettings() {
      try {
        const savedSettings = localStorage.getItem('productivity-tracker-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.weather) {
            this.weather = {
              ...this.weather,
              location: settings.weather.location || null,
              latitude: settings.weather.latitude || null,
              longitude: settings.weather.longitude || null,
              lastUpdated: settings.weather.lastUpdated || null
            };
          }
        }
      } catch (error) {
        console.error('Failed to load weather settings:', error);
      }
    },
    
    // Yearly Goals Event Handlers
    handleGoalAdded(goal) {
      console.log('Goal added:', goal);
      // You can add additional logic here, like notifications
    },
    
    handleGoalToggled(goal) {
      console.log('Goal toggled:', goal);
      // You can add additional logic here, like analytics
    },
    
    handleGoalDeleted(goalId) {
      console.log('Goal deleted:', goalId);
      // You can add additional logic here, like cleanup
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style> 