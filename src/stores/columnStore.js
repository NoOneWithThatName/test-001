import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useColumnStore = defineStore('columns', () => {
  const columns = ref({}) // viewId -> columns map

  // Available column types
  const columnTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Whole Number' },
    { value: 'decimal', label: 'Decimal Number', format: '0.00' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'url', label: 'URL' },
    { value: 'currency', label: 'Currency', format: '$0.00' },
    { value: 'percentage', label: 'Percentage', format: '0.00%' },
    { value: 'multiline', label: 'Multiline Text' }
  ]

  function initializeColumns(viewId) {
    if (!columns.value[viewId]) {
      columns.value[viewId] = []
    }
  }

  function addColumn(viewId, column) {
    if (!columns.value[viewId]) {
      initializeColumns(viewId)
    }
    columns.value[viewId].push({
      ...column,
      id: `${viewId}-col-${Date.now()}`
    })
  }

  function removeColumn(viewId, columnId) {
    if (columns.value[viewId]) {
      columns.value[viewId] = columns.value[viewId].filter(col => col.id !== columnId)
    }
  }

  function getColumns(viewId) {
    return columns.value[viewId] || []
  }

  function getColumnTypes() {
    return columnTypes
  }

  // Update columns for a view
  const updateViewColumns = (viewId, newColumns) => {
    // First remove all existing columns for this view
    columns.value[viewId] = []
    // Then add the new columns
    newColumns.forEach(column => {
      addColumn(viewId, column)
    })
  }

  function updateColumnOrder(viewId, newColumns) {
    // Ensure the view exists in the columns map
    if (!columns.value[viewId]) {
      columns.value[viewId] = []
    }

    // Create a map of existing columns by their ID or label
    const existingColumnsMap = new Map(
      columns.value[viewId].map(col => [col.id || col.label, col])
    )

    // Create new column list maintaining the new order and existing properties
    const updatedColumns = newColumns.map(newCol => {
      // Try to find an existing column by ID first, then by label
      const existingCol = existingColumnsMap.get(newCol.id) || 
                          existingColumnsMap.get(newCol.label)
      
      // Merge existing column properties with new column data
      return existingCol 
        ? { 
            ...existingCol, 
            ...newCol,
            // Preserve the original ID if it exists
            id: existingCol.id || newCol.id 
          }
        : { 
            ...newCol, 
            // Generate a new ID if not present
            id: newCol.id || `${viewId}-col-${Date.now()}` 
          }
    })

    // Update columns for the view
    columns.value[viewId] = updatedColumns
  }

  return {
    columns,
    addColumn,
    removeColumn,
    getColumns,
    getColumnTypes,
    initializeColumns,
    updateViewColumns,
    updateColumnOrder
  }
})
