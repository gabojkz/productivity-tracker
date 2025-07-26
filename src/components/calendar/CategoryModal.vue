<template>
  <div class="modal fade" id="categoryModal" tabindex="-1" ref="categoryModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Manage Categories</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Category Name</label>
            <input 
              v-model="newCategory.name" 
              type="text" 
              class="form-control" 
              required
            >
          </div>
          <div class="mb-3">
            <label class="form-label">Color</label>
            <div class="color-picker">
              <div 
                v-for="color in categoryColors" 
                :key="color"
                class="color-option"
                :class="{ 'selected': newCategory.color === color }"
                :style="{ backgroundColor: color }"
                @click="newCategory.color = color"
              ></div>
            </div>
          </div>
          
          <div class="existing-categories">
            <h6>Existing Categories</h6>
            <div class="category-list">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="category-item"
              >
                <span class="category-dot" :style="{ backgroundColor: category.color }"></span>
                <span class="category-name">{{ category.name }}</span>
                <button 
                  @click="$emit('delete-category', category.id)"
                  class="btn btn-sm btn-outline-danger"
                  :disabled="getEventsForCategory(category.id).length > 0"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="saveCategory">Add Category</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryModal',
  props: {
    categories: {
      type: Array,
      required: true
    },
    events: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newCategory: {
        name: '',
        color: '#007bff'
      },
      categoryColors: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c']
    }
  },
  methods: {
    saveCategory() {
      if (this.newCategory.name.trim() === '') return;
      
      const existingCategory = this.categories.find(c => 
        c.name.toLowerCase() === this.newCategory.name.toLowerCase()
      );
      if (existingCategory) {
        alert('Category with this name already exists.');
        return;
      }
      
      this.$emit('save-category', {
        id: Date.now(),
        name: this.newCategory.name,
        color: this.newCategory.color
      });
      
      this.newCategory = { name: '', color: '#007bff' };
    },
    closeModal() {
      this.$emit('close-modal');
    },
    getEventsForCategory(categoryId) {
      return this.events.filter(e => e.categoryId === categoryId);
    }
  }
}
</script>

<style scoped>
.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.color-option.selected {
  border-color: #333;
}

.color-option:hover {
  border-color: #666;
}

.category-list {
  margin-top: 15px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

.category-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.category-name {
  flex-grow: 1;
}
</style> 