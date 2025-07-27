<template>
  <div class="circular-progress-container" :style="containerStyle">
    <svg 
      class="circular-progress" 
      :width="size" 
      :height="size" 
      :viewBox="`0 0 ${size} ${size}`"
    >
      <!-- Background circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        stroke="#e9ecef"
        fill="none"
      />
      
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke="strokeColor"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
        transform="rotate(-90 50 50)"
        class="progress-circle"
      />
    </svg>
    
    <!-- Content inside the circle -->
    <div class="circular-progress-content" :style="contentStyle">
      <slot>
        <div class="progress-percentage">{{ percentage }}%</div>
        <div v-if="label" class="progress-label">{{ label }}</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircularProgress',
  props: {
    percentage: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 100
    },
    size: {
      type: Number,
      default: 100
    },
    strokeWidth: {
      type: Number,
      default: 8
    },
    strokeColor: {
      type: String,
      default: '#007bff'
    },
    label: {
      type: String,
      default: ''
    },
    showPercentage: {
      type: Boolean,
      default: true
    },
    animated: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    center() {
      return this.size / 2;
    },
    radius() {
      return (this.size - this.strokeWidth) / 2;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    strokeDashoffset() {
      const progress = this.percentage / 100;
      return this.circumference * (1 - progress);
    },
    containerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      };
    },
    contentStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      };
    }
  }
}
</script>

<style scoped>
.circular-progress-container {
  position: relative;
  display: inline-block;
}

.circular-progress {
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.circular-progress-content {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.progress-percentage {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.progress-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Animation for the progress circle */
.progress-circle {
  animation: progress-animation 0.5s ease-out;
}

@keyframes progress-animation {
  from {
    stroke-dashoffset: v-bind(circumference);
  }
  to {
    stroke-dashoffset: v-bind(strokeDashoffset);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .progress-percentage {
    font-size: 1rem;
  }
  
  .progress-label {
    font-size: 0.7rem;
  }
}
</style> 