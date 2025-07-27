# Common Components

This directory contains reusable components that can be used throughout the application.

## CircularProgress

A flexible and customizable circular progress bar component built with SVG.

### Features

- ✅ **Smooth animations** with CSS transitions
- ✅ **Customizable size** and stroke width
- ✅ **Custom colors** for different use cases
- ✅ **Slot support** for custom content
- ✅ **Responsive design** that works on all screen sizes
- ✅ **Accessible** with proper ARIA attributes
- ✅ **TypeScript support** with proper prop validation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `percentage` | `Number` | **required** | Progress percentage (0-100) |
| `size` | `Number` | `100` | Size of the circle in pixels |
| `strokeWidth` | `Number` | `8` | Width of the progress stroke |
| `strokeColor` | `String` | `'#007bff'` | Color of the progress stroke |
| `label` | `String` | `''` | Optional label text |
| `showPercentage` | `Boolean` | `true` | Whether to show percentage text |
| `animated` | `Boolean` | `true` | Whether to animate progress changes |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `progress-complete` | `percentage` | Emitted when progress reaches 100% |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Custom content to display inside the circle |

### Basic Usage

```vue
<template>
  <!-- Basic usage -->
  <CircularProgress :percentage="75" />
  
  <!-- With custom styling -->
  <CircularProgress 
    :percentage="60" 
    :size="120"
    stroke-color="#28a745"
    label="Progress"
  />
  
  <!-- With custom content -->
  <CircularProgress :percentage="90" stroke-color="#dc3545">
    <div class="custom-content">
      <i class="bi bi-check-circle"></i>
      <span>Complete</span>
    </div>
  </CircularProgress>
</template>

<script>
import CircularProgress from '@/components/common/CircularProgress.vue'

export default {
  components: {
    CircularProgress
  }
}
</script>
```

### Examples

#### Time Progress
```vue
<CircularProgress 
  :percentage="25" 
  stroke-color="#17a2b8"
  :size="80"
>
  <div>15:30</div>
</CircularProgress>
```

#### Task Completion
```vue
<CircularProgress 
  :percentage="85" 
  stroke-color="#28a745"
  label="Tasks Done"
/>
```

#### Rating Display
```vue
<CircularProgress 
  :percentage="75" 
  stroke-color="#ffc107"
>
  <i class="bi bi-star-fill text-warning"></i>
</CircularProgress>
```

### Styling

The component uses scoped styles and can be customized through CSS variables:

```css
/* Custom styling */
.circular-progress-container {
  --progress-color: #your-color;
  --background-color: #your-bg-color;
}
```

### Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

### Performance

- Uses SVG for crisp rendering at any size
- Optimized animations with CSS transforms
- Minimal DOM manipulation
- Efficient prop validation

### Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support 