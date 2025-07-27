<template>
  <div class="circular-progress-demo">
    <h2>Circular Progress Bar Examples</h2>
    
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Default</h4>
          <CircularProgress :percentage="75" />
        </div>
        <div class="demo-item">
          <h4>With Label</h4>
          <CircularProgress :percentage="60" label="Progress" />
        </div>
        <div class="demo-item">
          <h4>Custom Color</h4>
          <CircularProgress :percentage="85" stroke-color="#dc3545" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Different Sizes</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Small (60px)</h4>
          <CircularProgress :percentage="45" :size="60" />
        </div>
        <div class="demo-item">
          <h4>Medium (100px)</h4>
          <CircularProgress :percentage="65" :size="100" />
        </div>
        <div class="demo-item">
          <h4>Large (150px)</h4>
          <CircularProgress :percentage="80" :size="150" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Different Stroke Widths</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Thin (4px)</h4>
          <CircularProgress :percentage="70" :stroke-width="4" />
        </div>
        <div class="demo-item">
          <h4>Default (8px)</h4>
          <CircularProgress :percentage="70" :stroke-width="8" />
        </div>
        <div class="demo-item">
          <h4>Thick (12px)</h4>
          <CircularProgress :percentage="70" :stroke-width="12" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Custom Content with Slots</h3>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Custom Content</h4>
          <CircularProgress :percentage="90" stroke-color="#28a745">
            <div class="custom-content">
              <div class="custom-percentage">90%</div>
              <div class="custom-label">Complete</div>
            </div>
          </CircularProgress>
        </div>
        <div class="demo-item">
          <h4>Icon + Text</h4>
          <CircularProgress :percentage="75" stroke-color="#ffc107">
            <div class="custom-content">
              <i class="bi bi-star-fill text-warning"></i>
              <div class="custom-label">Rating</div>
            </div>
          </CircularProgress>
        </div>
        <div class="demo-item">
          <h4>Time Progress</h4>
          <CircularProgress :percentage="25" stroke-color="#17a2b8">
            <div class="custom-content">
              <div class="custom-time">15:30</div>
              <div class="custom-label">Remaining</div>
            </div>
          </CircularProgress>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Interactive Demo</h3>
      <div class="interactive-demo">
        <div class="controls">
          <label>
            Progress: {{ interactiveProgress }}%
            <input 
              type="range" 
              v-model="interactiveProgress" 
              min="0" 
              max="100" 
              step="5"
              class="form-range"
            >
          </label>
          <label>
            Size: {{ interactiveSize }}px
            <input 
              type="range" 
              v-model="interactiveSize" 
              min="60" 
              max="200" 
              step="10"
              class="form-range"
            >
          </label>
          <label>
            Stroke Width: {{ interactiveStrokeWidth }}px
            <input 
              type="range" 
              v-model="interactiveStrokeWidth" 
              min="2" 
              max="20" 
              step="2"
              class="form-range"
            >
          </label>
          <div class="color-picker">
            <label>Color:</label>
            <input 
              type="color" 
              v-model="interactiveColor" 
              class="form-control"
            >
          </div>
        </div>
        <div class="preview">
          <CircularProgress 
            :percentage="interactiveProgress"
            :size="interactiveSize"
            :stroke-width="interactiveStrokeWidth"
            :stroke-color="interactiveColor"
            label="Interactive"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircularProgress from './CircularProgress.vue'

export default {
  name: 'CircularProgressDemo',
  components: {
    CircularProgress
  },
  data() {
    return {
      interactiveProgress: 65,
      interactiveSize: 120,
      interactiveStrokeWidth: 8,
      interactiveColor: '#007bff'
    }
  }
}
</script>

<style scoped>
.circular-progress-demo {
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h3 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 20px;
}

.demo-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.demo-item h4 {
  margin-bottom: 15px;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.custom-percentage {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
}

.custom-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 2px;
}

.custom-time {
  font-size: 1.2rem;
  font-weight: bold;
  color: #17a2b8;
  font-family: 'Courier New', monospace;
}

.interactive-demo {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: 500;
  color: #495057;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker label {
  margin: 0;
}

.preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

@media (max-width: 768px) {
  .interactive-demo {
    grid-template-columns: 1fr;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style> 