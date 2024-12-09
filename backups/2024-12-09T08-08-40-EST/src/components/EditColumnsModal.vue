<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit View Columns</h2>
      <div class="columns-container">
        <!-- Column Headers -->
        <div class="column-headers">
          <div class="name-header">Column Name</div>
          <div class="type-header">Type</div>
          <div class="action-header"></div>
        </div>
        <!-- Column Rows -->
        <div v-for="(column, index) in columns" :key="index" class="column-form">
          <div class="form-row">
            <div class="name-group">
              <input
                :id="'columnName' + index"
                v-model="column.name"
                type="text"
                required
                placeholder="Enter column name"
                @input="validateColumnName(index)"
                :class="{ 'error': column.error }"
              />
              <div v-if="column.error" class="error-message">{{ column.error }}</div>
            </div>
            <div class="type-group">
              <select
                :id="'columnType' + index"
                v-model="column.type"
                required
              >
                <option value="" disabled>Select type</option>
                <option 
                  v-for="type in columnTypes" 
                  :key="type.value" 
                  :value="type.value"
                >
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
              >
                ×
              </button>
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
          type="button" 
          class="btn-primary" 
          @click="handleSave"
          :disabled="!isValid"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useColumnStore } from '../stores/columnStore'

const props = defineProps({
  show: Boolean,
  viewId: String,
  initialColumns: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'columns-updated'])
const columnStore = useColumnStore()
const columns = ref([])
const columnTypes = columnStore.getColumnTypes()

// Load initial columns when mounted and when they change
onMounted(() => {
  loadInitialColumns()
})

const loadInitialColumns = () => {
  // Create a deep copy of the initial columns with error field
  columns.value = props.initialColumns.map(col => ({
    ...col,
    error: ''
  }))

  // Add an empty column if there are no columns
  if (columns.value.length === 0) {
    addColumn()
  }
}

// Validate column name for duplicates
const validateColumnName = (currentIndex) => {
  const currentName = columns.value[currentIndex].name.trim().toLowerCase()
  columns.value[currentIndex].error = ''

  if (currentName) {
    const duplicateIndex = columns.value.findIndex((col, index) => 
      index !== currentIndex && 
      col.name.trim().toLowerCase() === currentName
    )
    
    if (duplicateIndex !== -1) {
      columns.value[currentIndex].error = 'Column name must be unique'
    }
  }
}

// Computed property to check if the last column is complete and valid
const canAddColumn = computed(() => {
  const lastColumn = columns.value[columns.value.length - 1]
  return lastColumn && 
         lastColumn.name.trim() && 
         lastColumn.type && 
         !lastColumn.error
})

// Computed property to check if all columns are valid
const isValid = computed(() => {
  return columns.value.every(col => 
    col.name.trim() && 
    col.type && 
    !col.error
  ) && columns.value.length > 0
})

const addColumn = () => {
  if (canAddColumn.value || columns.value.length === 0) {
    columns.value.push({
      name: '',
      type: '',
      error: ''
    })
  }
}

const removeColumn = (index) => {
  columns.value.splice(index, 1)
  // Revalidate all columns after removal
  columns.value.forEach((_, idx) => validateColumnName(idx))
}

const close = () => {
  emit('close')
}

const handleSave = () => {
  if (!isValid.value) {
    alert('Please fix all errors before saving')
    return
  }

  // Update columns in store
  columnStore.updateViewColumns(props.viewId, columns.value.map(column => {
    const { error, ...columnData } = column // Remove error field before saving
    return columnData
  }))

  emit('columns-updated')
  close()
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
