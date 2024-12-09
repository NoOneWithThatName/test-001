<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ item ? 'Edit' : 'Add' }} Item</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div v-if="!columns || columns.length === 0" class="no-columns">
          <p>Please configure columns for this view first.</p>
          <button @click="closeModal">Close</button>
        </div>
        <form v-else @submit.prevent="handleSubmit">
          <div v-for="col in columns" :key="col.id" class="form-group">
            <label :for="col.id">{{ col.name }}</label>
            <input
              :id="col.id"
              v-model="formData[col.id]"
              :type="getInputType(col.type)"
              :step="getInputStep(col.type)"
              :min="getInputMin(col.type)"
              required
            >
          </div>
          <div class="button-group">
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
            <button type="submit" class="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    default: null
  },
  columns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:show', 'save'])

const formData = ref({})

// Initialize form data when item or columns change
watch([() => props.item, () => props.columns], ([newItem, newColumns]) => {
  if (newItem) {
    // When editing existing item
    formData.value = { ...newItem }
  } else if (newColumns) {
    // When adding new item
    formData.value = newColumns.reduce((acc, col) => {
      acc[col.id] = ''
      return acc
    }, {})
  }
}, { immediate: true })

function getInputType(columnType) {
  switch (columnType?.toLowerCase()) {
    case 'date':
      return 'date'
    case 'number':
    case 'decimal':
    case 'currency':
    case 'percentage':
      return 'number'
    case 'email':
      return 'email'
    default:
      return 'text'
  }
}

function getInputStep(columnType) {
  switch (columnType?.toLowerCase()) {
    case 'decimal':
    case 'currency':
    case 'percentage':
      return '0.01'
    case 'number':
      return '1'
    default:
      return undefined
  }
}

function getInputMin(columnType) {
  switch (columnType?.toLowerCase()) {
    case 'number':
    case 'decimal':
    case 'currency':
      return '0'
    default:
      return undefined
  }
}

function closeModal() {
  emit('update:show', false)
}

function handleSubmit() {
  const finalData = {
    id: props.item?.id || Date.now(),
    ...formData.value
  }
  emit('save', finalData)
  closeModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  border-color: #4CAF50;
  outline: none;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.save-btn {
  background: #4CAF50;
  border: 1px solid #45a049;
  color: white;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.save-btn:hover {
  background: #45a049;
}

.no-columns {
  text-align: center;
  padding: 20px;
}

.no-columns p {
  margin-bottom: 15px;
  color: #666;
}
</style>
