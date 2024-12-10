<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Manage Columns</h2>
      <p class="modal-description">
        Define the columns that will appear in your view. Each column represents a field of data that you can track.
        Column names should be clear and descriptive (e.g., "First Name", "Email Address", "Due Date").
        
        <strong>Tip:</strong> Choose a column type that best matches your data.
      </p>

      <div class="columns-header">
        <div class="column-header-drag">Move</div>
        <div class="column-header-name">Column Name</div>
        <div class="column-header-type">Column Type</div>
        <div class="column-header-required">Required</div>
        <div class="column-header-remove">Remove</div>
      </div>
      <div class="columns-container">
        <div 
          v-for="(column, index) in localColumns" 
          :key="index" 
          class="column-row"
          :class="{
            'dragging': draggedIndex === index,
            'drag-over': dragOverIndex === index
          }"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover="handleDragOver($event, index)"
          @dragend="handleDragEnd"
          @drop="handleDrop($event, index)"
        >
          <div 
            class="drag-handle" 
            draggable="true"
          >
            ☰
          </div>
          <input 
            v-model="column.label" 
            placeholder="Column Name" 
            @blur="validateColumnName(index)"
            class="column-input"
          />
          <select 
            v-model="column.type" 
            class="column-select"
          >
            <option value="" disabled>Select Type</option>
            <option 
              v-for="type in columnTypes" 
              :key="type.value" 
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
          <input 
            type="checkbox" 
            v-model="column.required" 
            class="column-required-checkbox"
            :title="'Make column required'"
          />
          <button 
            @click="removeColumn(index)" 
            class="remove-btn"
            title="Remove Column"
          >
            ✕
          </button>
          <span v-if="localColumns[index].error" class="error-message">{{ localColumns[index].error }}</span>
        </div>
        <button 
          @click="addColumn" 
          class="add-column-btn"
          :disabled="!canAddNewColumn"
        >
          + Add Column
        </button>
      </div>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button @click="close" class="cancel-btn">Cancel</button>
        <button 
          @click="save" 
          class="save-btn" 
          :disabled="!isValid"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useColumnStore } from '../stores/columnStore'

const props = defineProps({
  show: Boolean,
  columns: {
    type: Array,
    default: () => []
  },
  viewId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])
const columnStore = useColumnStore()
const localColumns = ref(props.columns.map(col => ({ ...col, required: false })))
const columnTypes = columnStore.getColumnTypes()
const draggedIndex = ref(null)
const dragOverIndex = ref(null)

// Column name validation regex
const validNameRegex = /^[a-zA-Z0-9\s!#,\-<>?/]+$/

// Computed property to check if a single column is valid
const isColumnValid = (column) => {
  return column.label.trim() !== '' && 
         validNameRegex.test(column.label) &&
         column.type !== ''
}

// Computed property to check if we can add a new column
const canAddNewColumn = computed(() => {
  return localColumns.value.every(isColumnValid)
})

// Computed property to check if the form is valid
const isValid = computed(() => {
  return localColumns.value.length > 0 && 
         localColumns.value.every(isColumnValid)
})

// Initialize local columns when the modal is shown
watch(() => props.show, (newVal) => {
  if (newVal) {
    // If existing columns, use those
    if (props.columns && props.columns.length > 0) {
      localColumns.value = props.columns.map(col => ({ 
        ...col, 
        required: false,
        error: null 
      }))
    } else {
      // Otherwise, start with one empty column
      localColumns.value = [{
        id: Date.now().toString(),
        label: '',
        type: '',  
        visible: true,
        required: false,
        error: null
      }]
    }
  }
})

function handleDragStart(event, index) {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index)
}

function handleDragOver(event, index) {
  event.preventDefault()
  dragOverIndex.value = index
}

function handleDrop(event, targetIndex) {
  event.preventDefault()
  
  // Ensure we have a valid dragged index
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return
  
  // Remove the dragged item from its original position
  const [removedColumn] = localColumns.value.splice(draggedIndex.value, 1)
  
  // Insert the dragged item at the new position
  localColumns.value.splice(targetIndex, 0, removedColumn)
  
  // Reset the dragged index
  draggedIndex.value = null
  dragOverIndex.value = null
}

function handleDragEnd() {
  // Reset the dragged index
  draggedIndex.value = null
  dragOverIndex.value = null
}

function removeColumn(index) {
  // Prevent removing the last column
  if (localColumns.value.length > 1) {
    if (confirm('Are you sure you want to remove this column?')) {
      localColumns.value.splice(index, 1)
    }
  } else {
    alert('You must have at least one column.')
  }
}

function validateColumnName(index) {
  const column = localColumns.value[index]
  if (!column.label.trim()) {
    column.error = 'Column name is required'
    return false
  }
  if (!validNameRegex.test(column.label)) {
    column.error = 'Invalid characters in column name'
    return false
  }
  column.error = null
  return true
}

function addColumn() {
  if (!canAddNewColumn.value) return

  localColumns.value.push({
    id: Date.now().toString(),
    label: '',
    type: '',  
    visible: true,
    required: false,
    error: null
  })
}

function save() {
  // Validate all columns before saving
  const validColumns = localColumns.value.every(column => {
    // Ensure label is not empty and trimmed
    const hasValidLabel = column.label && column.label.trim() !== ''
    
    // Ensure type is selected
    const hasValidType = column.type && column.type !== ''
    
    return hasValidLabel && hasValidType
  })

  if (!validColumns) {
    alert('Please fill in all column names and select valid types.')
    return
  }

  // Map local columns to the format expected by the parent component
  const columnsToSave = localColumns.value.map(column => ({
    id: column.id || `col-${Date.now()}`, // Ensure each column has a unique ID
    label: column.label.trim(),
    type: column.type,
    visible: column.visible !== false, // Default to true if not explicitly set to false
    required: !!column.required // Ensure boolean
  }))

  // Update column order in the store
  columnStore.updateColumnOrder(props.viewId, columnsToSave)

  // Emit save event with the columns
  emit('save', columnsToSave)
  
  // Close the modal
  emit('close')
}

function close() {
  // Reset columns when closing
  localColumns.value = [{
    id: Date.now().toString(),
    label: '',
    type: '',
    visible: true,
    required: false,
    error: null
  }]
  emit('close')
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

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 800px;
  width: 100%;
  margin: 10px auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  font-size: 0.9rem;
  text-align: left;
}

.columns-header, .column-row {
  display: grid;
  grid-template-columns: 50px 1fr 200px 100px 50px;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.columns-header {
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.columns-header div {
  text-align: left;
}

.column-header-drag {
  text-align: center;
}

.column-required-checkbox {
  justify-self: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  transition: color 0.2s ease;
  text-align: center;
  width: 100%;
}

.remove-btn:hover {
  color: #a71d2a;
}

.columns-container {
  border-radius: 4px;
  background-color: transparent;
}

.column-row {
  cursor: move;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #eee;
  position: relative;
}

.column-row.dragging {
  opacity: 0.5;
  background-color: #f0f0f0;
}

.column-row.drag-over::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff;
  top: -1px;
}

.column-row.drag-over::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff;
  bottom: -1px;
}

.column-row:hover {
  border-color: #e0e0e0;
}

.column-inputs {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.column-input {
  flex-grow: 2;
  min-width: 0;
}

.column-select {
  flex-grow: 1;
  min-width: 120px;
}

.column-input, 
.column-select {
  margin-right: 10px;
  padding: 5px;
}

.drag-handle {
  cursor: move;
  color: #6c757d;
  transition: color 0.2s ease;
  margin-right: 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.drag-handle:hover {
  color: #007bff;
}

.column-row:hover .drag-handle {
  color: #007bff;
}

.add-column-btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-column-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, 
.save-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.save-btn {
  background-color: #2196F3;
  color: white;
}

.save-btn:disabled,
.cancel-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff1744;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.column-required-checkbox {
  margin-right: 10px;
}
</style>
