<template>
  <div class="row mb-4">
    <div class="col-12">
      <div class="digital-display">
        <div class="display-container">
          <div class="time-section">
            <div class="current-time">{{ currentTime }}</div>
            <div class="current-date">{{ currentDate }}</div>
          </div>
          <div class="weather-section">
            <div class="weather-location">
              <i class="bi bi-geo-alt"></i>
              <span class="location-name">{{ weather.location || 'Location not set' }}</span>
              <button @click="refreshLocation" class="btn btn-sm btn-outline-primary ms-2" title="Refresh location">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div class="weather-main">
              <div class="temperature">{{ weather.temperature }}°C</div>
              <div class="weather-icon">
                <i :class="getWeatherIcon()"></i>
              </div>
            </div>
            <div class="weather-details">
              <div class="temp-range">
                <span class="high">{{ weather.high }}°</span>
                <span class="separator">/</span>
                <span class="low">{{ weather.low }}°</span>
              </div>
              <div class="wind-speed">{{ weather.windSpeed }} mph</div>
            </div>
            <div class="sun-times">
              <div class="sunrise">
                <i class="bi bi-sunrise"></i>
                <span>{{ weather.sunrise }}</span>
              </div>
              <div class="sunset">
                <i class="bi bi-sunset"></i>
                <span>{{ weather.sunset }}</span>
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
  name: 'TimeWeatherDisplay',
  props: {
    currentTime: {
      type: String,
      required: true
    },
    currentDate: {
      type: String,
      required: true
    },
    weather: {
      type: Object,
      required: true
    }
  },
  methods: {
    getWeatherIcon() {
      const condition = this.weather.condition.toLowerCase();
      if (condition.includes('sunny') || condition.includes('clear')) {
        return 'bi bi-sun-fill text-warning';
      } else if (condition.includes('cloudy')) {
        return 'bi bi-cloud-fill text-secondary';
      } else if (condition.includes('rain')) {
        return 'bi bi-cloud-rain-fill text-info';
      } else if (condition.includes('snow')) {
        return 'bi bi-snow text-info';
      } else if (condition.includes('storm')) {
        return 'bi bi-lightning-fill text-warning';
      } else {
        return 'bi bi-cloud-fill text-secondary';
      }
    },
    refreshLocation() {
      this.$emit('refresh-location');
    }
  }
}
</script>

<style scoped>
.digital-display {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.display-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.time-section {
  flex: 1;
}

.current-time {
  font-size: 3.5rem;
  font-weight: 300;
  font-family: 'Courier New', monospace;
  color: #2c3e50;
  margin-bottom: 5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.current-date {
  font-size: 1.2rem;
  color: #6c757d;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.weather-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
}

.weather-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.location-name {
  font-weight: 500;
  color: #495057;
}

.weather-location .btn {
  padding: 2px 6px;
  font-size: 0.8rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 15px;
}

.temperature {
  font-size: 2.5rem;
  font-weight: 300;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
}

.weather-icon {
  font-size: 2rem;
}

.weather-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.temp-range {
  font-size: 1rem;
  color: #6c757d;
}

.temp-range .high {
  color: #dc3545;
  font-weight: 500;
}

.temp-range .separator {
  margin: 0 5px;
  color: #6c757d;
}

.temp-range .low {
  color: #007bff;
  font-weight: 500;
}

.wind-speed {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 400;
}

.sun-times {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #6c757d;
}

.sunrise, .sunset {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sunrise i {
  color: #ffc107;
}

.sunset i {
  color: #fd7e14;
}

@media (max-width: 768px) {
  .display-container {
    flex-direction: column;
    text-align: center;
  }
  
  .weather-section {
    align-items: center;
  }
  
  .current-time {
    font-size: 2.5rem;
  }
  
  .temperature {
    font-size: 2rem;
  }
}
</style> 