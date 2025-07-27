<template>
  <div class="months-visual">
    <div class="months-header">
      <h5 class="mb-2">Life Timeline (Months)</h5>
      <div class="months-stats">
        <span class="months-lived">{{ monthsLived }} months lived</span>
        <span class="months-remaining">{{ monthsRemaining }} months remaining</span>
      </div>
      <div class="year-info">
        <small class="text-muted">Each row = 10 years (120 months) | Each column = 1 month</small>
      </div>
    </div>
    
    <div class="months-container">
      <div class="months-grid">
        <div 
          v-for="month in totalMonths" 
          :key="month"
          class="month-box"
          :class="{
            'month-lived': month <= monthsLived,
            'month-remaining': month > monthsLived,
            'year-end': month % 12 === 0,
            'decade-end': month % 120 === 0
          }"
          :title="`Month ${month} (Year ${Math.ceil(month / 12)})`"
        ></div>
      </div>
    </div>
    
    <div class="months-legend">
      <div class="legend-item">
        <div class="legend-box month-lived"></div>
        <span>Lived</span>
      </div>
      <div class="legend-item">
        <div class="legend-box month-remaining"></div>
        <span>Remaining</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthsVisual',
  props: {
    yearsLived: {
      type: Number,
      required: true
    },
    yearsRemaining: {
      type: Number,
      required: true
    },
    lifeExpectancy: {
      type: Number,
      default: 80
    }
  },
  computed: {
    monthsLived() {
      return this.yearsLived * 12;
    },
    monthsRemaining() {
      return this.yearsRemaining * 12;
    },
    totalMonths() {
      return this.lifeExpectancy * 12; // 80 years * 12 months = 960 months
    }
  }
}
</script>

<style scoped>
.months-visual {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.months-header {
  margin-bottom: 15px;
}

.months-header h5 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.months-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.months-lived {
  color: #28a745;
  font-weight: 500;
}

.months-remaining {
  color: #6c757d;
  font-weight: 500;
}

.year-info {
  text-align: center;
  margin-top: 5px;
}

.months-container {
  margin-bottom: 15px;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(120, 4px);
  gap: 1px;
  justify-content: center;
  max-width: 100%;
  overflow-x: auto;
  padding: 10px 0;
}

.month-box {
  width: 4px;
  height: 4px;
  border-radius: 1px;
  transition: all 0.2s ease;
}

.month-lived {
  background-color: #000;
  border: 1px solid #000;
}

.month-remaining {
  background-color: transparent;
  border: 1px solid #000;
}

.month-box.year-end {
  margin-bottom: 3px;
  border-bottom: 2px solid #ddd;
}

.month-box.decade-end {
  margin-bottom: 8px;
  border-bottom: 3px solid #999;
}

.month-box:hover {
  transform: scale(1.5);
  z-index: 1;
}

.months-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: #666;
}

.legend-box {
  width: 4px;
  height: 4px;
  border-radius: 1px;
}

.legend-box.month-lived {
  background-color: #000;
  border: 1px solid #000;
}

.legend-box.month-remaining {
  background-color: transparent;
  border: 1px solid #000;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .months-grid {
    grid-template-columns: repeat(120, 3px);
    gap: 1px;
  }
  
  .month-box {
    width: 3px;
    height: 3px;
  }
  
  .legend-box {
    width: 3px;
    height: 3px;
  }
  
  .months-stats {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}

/* Scrollbar styling for overflow */
.months-grid::-webkit-scrollbar {
  height: 4px;
}

.months-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.months-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.months-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 