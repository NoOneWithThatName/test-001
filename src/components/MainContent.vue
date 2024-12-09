<template>
  <div class="main-content">
    <div class="view-header" v-if="currentView">
      <h1>{{ currentView.name }}</h1>
      <div class="view-actions" v-if="showViewActions">
        <button 
          class="btn-icon edit"
          title="Edit View"
          @click="handleEditView"
        >
          ✎
        </button>
        <button 
          class="btn-icon delete"
          title="Delete View"
          @click="handleDeleteView"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Generic Data Display -->
    <div class="view-content" v-if="currentView">
      <div class="view-controls">
        <div class="filters">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search..."
            class="search-input"
          >
        </div>
        <button 
          class="add-item-btn"
          @click="handleAddItem"
        >
          + Add Item
        </button>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-if="!viewData.length">
        <div class="empty-icon">📋</div>
        <h3>No Items Yet</h3>
        <p>Click "Add Item" to get started.</p>
      </div>

      <!-- Data Grid -->
      <div class="data-grid" v-else>
        <table v-if="currentView.columns">
          <thead>
            <tr>
              <th v-for="col in currentView.columns.filter(col => col.visible)" 
                  :key="col.id"
                  @click="sortBy(col.id)"
                  class="sortable-header"
              >
                {{ col.label || col.id }}
                <span class="sort-indicator" v-if="sortColumn === col.id">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAndSortedData" :key="item.id">
              <td v-for="col in currentView.columns.filter(col => col.visible)" 
                  :key="col.id"
              >
                {{ formatCellValue(item[col.id], col.type) }}
              </td>
              <td class="actions-cell">
                <button 
                  class="btn-icon edit"
                  title="Edit Item"
                  @click="handleEditItem(item)"
                >
                  ✎
                </button>
                <button 
                  class="btn-icon delete"
                  title="Delete Item"
                  @click="handleDeleteItem(item)"
                >
                  ×
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <EditColumnsModal
      v-model:show="showEditColumnsModal"
      :columns="currentView?.columns || []"
      @close="closeEditColumnsModal"
      @save="saveColumns"
    />

    <!-- Edit Item Modal -->
    <EditItemModal
      v-model:show="showEditItemModal"
      :item="editingItem"
      :columns="currentView?.columns?.map(col => {
        console.log('Column:', col);
        return col;
      }) || []"
      @save="handleSaveItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useViewStore } from '../stores/viewStore'
import EditColumnsModal from './EditColumnsModal.vue'
import EditItemModal from './EditItemModal.vue'

const route = useRoute()
const router = useRouter()
const viewStore = useViewStore()

// State
const searchQuery = ref('')
const showEditColumnsModal = ref(false)
const showEditItemModal = ref(false)
const editingItem = ref(null)

// Sort state
const sortColumn = ref(null)
const sortDirection = ref('asc')

// Get current view based on route
const currentView = computed(() => {
  return viewStore.getViewByPath(route.path)
})

// Get view data
const viewData = computed(() => {
  if (!currentView.value) return []
  return currentView.value.data || []
})

// Show view actions only for user views
const showViewActions = computed(() => {
  return currentView.value && !currentView.value.isSystemView
})

// Computed properties for filtering and sorting
const filteredAndSortedData = computed(() => {
  let data = [...viewData.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(query)
      )
    })
  }

  // Apply sorting
  if (sortColumn.value) {
    data.sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      
      if (aVal === bVal) return 0
      
      const result = aVal > bVal ? 1 : -1
      return sortDirection.value === 'asc' ? result : -result
    })
  }

  return data
})

// Methods
function handleEditView() {
  console.log('Opening edit modal, currentView:', currentView.value);
  showEditColumnsModal.value = true;
  console.log('showEditColumnsModal:', showEditColumnsModal.value);
}

function closeEditColumnsModal() {
  showEditColumnsModal.value = false
}

function saveColumns(columns) {
  if (!currentView.value) return
  
  // Update view with new columns
  viewStore.updateView(currentView.value.id, {
    columns: columns.map(col => ({
      ...col,
      visible: true
    }))
  })

  // Convert existing data to match new column types
  const updatedData = viewData.value.map(item => {
    const newItem = { ...item }
    columns.forEach(col => {
      if (col.type === 'number' && typeof newItem[col.id] === 'string') {
        const num = Number(newItem[col.id])
        newItem[col.id] = isNaN(num) ? '' : num
      }
    })
    return newItem
  })

  // Update view data with converted values
  viewStore.updateViewData(currentView.value.id, updatedData)
  
  showEditColumnsModal.value = false
}

function handleDeleteView() {
  if (!currentView.value || currentView.value.isSystemView) return
  
  if (confirm('Are you sure you want to delete this view?')) {
    viewStore.removeView(currentView.value.id)
    router.push('/')
  }
}

function sortBy(columnId) {
  if (sortColumn.value === columnId) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnId
    sortDirection.value = 'asc'
  }
}

function formatCellValue(value, type) {
  if (value === null || value === undefined || value === '') return ''
  
  switch (type?.toLowerCase()) {
    case 'date':
      const date = new Date(value)
      return isNaN(date.getTime()) ? value : date.toLocaleDateString()
    case 'datetime':
      const datetime = new Date(value)
      return isNaN(datetime.getTime()) ? value : datetime.toLocaleString()
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'decimal':
      const decimalNum = Number(value)
      return isNaN(decimalNum) ? value : decimalNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    case 'number':
      const num = Number(value)
      return isNaN(num) ? value : num.toLocaleString()
    default:
      return value
  }
}

function handleAddItem() {
  if (!currentView.value?.columns?.length) {
    alert('Please configure columns for this view first.')
    return
  }

  editingItem.value = currentView.value.columns.reduce((acc, col) => {
    acc[col.id] = col.id
    return acc
  }, { id: Date.now() })

  showEditItemModal.value = true
}

function handleEditItem(item) {
  if (!currentView.value?.columns?.length) {
    alert('Please configure columns for this view first.')
    return
  }

  editingItem.value = { ...item }
  showEditItemModal.value = true
}

function handleSaveItem(updatedItem) {
  if (!currentView.value) return
  
  const data = [...viewData.value]
  const index = data.findIndex(item => item.id === updatedItem.id)
  
  if (index !== -1) {
    // Update existing item
    data[index] = updatedItem
  } else {
    // Add new item
    data.push(updatedItem)
  }
  
  viewStore.updateViewData(currentView.value.id, data)
  showEditItemModal.value = false
  editingItem.value = null
}

function handleDeleteItem(item) {
  if (!currentView.value) return
  
  if (confirm('Are you sure you want to delete this item?')) {
    const data = viewData.value.filter(i => i.id !== item.id)
    viewStore.updateViewData(currentView.value.id, data)
  }
}

// Watch for route changes to reset state
watch(route, () => {
  searchQuery.value = ''
  sortColumn.value = null
  sortDirection.value = 'asc'
})

// Initialize
onMounted(() => {
  viewStore.loadViews()
})
</script>

<style scoped>
.main-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow-y: auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.view-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-icon.edit {
  color: #4CAF50;
}

.btn-icon.delete {
  color: #f44336;
}

.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.view-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.data-grid {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
}

.sortable-header:hover {
  background: #eee;
}

.sort-indicator {
  margin-left: 4px;
  opacity: 0.6;
}

tr:hover {
  background: #f9f9f9;
}

.actions-header {
  width: 100px;
  text-align: center;
}

.actions-cell {
  text-align: center;
  white-space: nowrap;
}

.btn-icon {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 4px 8px;
  margin: 0 2px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: #f0f0f0;
}

.btn-icon.edit {
  color: #2196F3;
}

.btn-icon.delete {
  color: #f44336;
}

.add-item-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-item-btn:hover {
  background: #45a049;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: #495057;
}

.empty-state p {
  margin: 0;
  color: #6c757d;
}
</style>
