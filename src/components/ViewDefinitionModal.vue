<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Define View Structure</h2>
      <form @submit.prevent="handleSubmit">
        <div class="columns-container">
          <div class="column-headers">
            <div class="name-header">Column Name</div>
            <div class="type-header">Type</div>
            <div class="action-header"></div>
          </div>
          <div v-for="(column, index) in columns" :key="index" class="column-form">
            <div class="form-row">
              <div class="name-group">
                <input
                  v-model="column.name"
                  type="text"
                  placeholder="Enter column name"
                  required
                  :class="{ error: column.error }"
                  @input="validateColumn(index)"
                />
                <div v-if="column.error" class="error-message">{{ column.error }}</div>
              </div>
              <div class="type-group">
                <select v-model="column.type" required>
                  <option value="">Select type</option>
                  <option v-for="type in columnTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>
              <div class="action-group">
                <button
                  v-if="columns.length > 1"
                  type="button"
                  class="btn-icon"
                  @click="removeColumn(index)"
                  title="Remove column"
                >×</button>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <button 
            type="button" 
            class="btn-secondary add-column" 
            @click="addColumn"
            :disabled="!canAddColumn"
          >
            + Add Another Column
          </button>
        </div>
        <div class="button-group">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button 
            type="submit" 
            class="btn-primary" 
            :disabled="!isValid"
          >
            Create View
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useColumnStore } from '../stores/columnStore'
import { useViewStore } from '../stores/viewStore'

const props = defineProps({
  show: Boolean,
  viewName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'view-created'])
const columnStore = useColumnStore()
const viewStore = useViewStore()
const columns = ref([
  {
    name: '',
    type: '',
    error: ''
  }
])

const columnTypes = columnStore.getColumnTypes()

// Validation function for column names
const validateColumn = (index) => {
  const column = columns.value[index]
  const name = column.name.trim()

  // Clear previous error
  column.error = ''

  // Check if name is empty
  if (!name) {
    column.error = 'Column name is required'
    return
  }

  // Check for duplicate names
  const duplicates = columns.value.filter(
    (col, idx) => idx !== index && col.name.trim().toLowerCase() === name.toLowerCase()
  )
  if (duplicates.length > 0) {
    column.error = 'Column name must be unique'
  }
}

// Add a new empty column
const addColumn = () => {
  columns.value.push({
    name: '',
    type: '',
    error: ''
  })
}

// Remove a column
const removeColumn = (index) => {
  columns.value.splice(index, 1)
}

// Check if we can add another column
const canAddColumn = computed(() => {
  const lastColumn = columns.value[columns.value.length - 1]
  return lastColumn && 
         lastColumn.name.trim() && 
         lastColumn.type && 
         !lastColumn.error
})

// Check if the form is valid
const isValid = computed(() => {
  return columns.value.every(col => 
    col.name.trim() && 
    col.type && 
    !col.error
  )
})

// Close the modal
const close = () => {
  emit('close')
}

// Handle form submission
const handleSubmit = async () => {
  try {
    // Create view config with columns
    const viewConfig = {
      name: props.viewName,
      columns: columns.value.map(col => ({
        id: col.name.toLowerCase().replace(/\s+/g, '-'),
        name: col.name.trim(),
        type: col.type,
        visible: true
      })),
      filters: [],
      data: []
    }

    // Add the view
    const newView = await viewStore.addView(viewConfig)
    emit('view-created', newView)
    close()
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.columns-container {
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 1rem;
}

.column-headers {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f7fafc;
  border-radius: 4px 4px 0 0;
  font-weight: 500;
  color: #4a5568;
  font-size: 0.875rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.name-header {
  flex: 2;
}

.type-header {
  flex: 1;
}

.action-header {
  width: 24px;
}

.column-form {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.name-group {
  flex: 2;
}

.type-group {
  flex: 1;
}

.action-group {
  width: 24px;
  display: flex;
  justify-content: center;
}

.error-message {
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
}

input.error {
  border-color: #e53e3e;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-icon:hover {
  background-color: #e2e8f0;
  color: #e53e3e;
}

.actions {
  margin: 1.5rem 0;
}

.add-column {
  width: 100%;
  text-align: center;
  padding: 0.75rem;
}

.add-column:disabled {
  background-color: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
  border: none;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3182ce;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #cbd5e0;
}

.btn-primary:disabled {
  background-color: #90cdf4;
  cursor: not-allowed;
}
</style>
