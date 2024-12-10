<template>
  <div class="view-creator">
    <button @click="showAddViewModal = true" class="add-view-btn">
      + Add View
    </button>

    <!-- Modal for creating new view -->
    <AddViewModal 
      :show="showAddViewModal"
      @close="closeAddViewModal"
      @view-name-submitted="handleViewNameSubmitted"
    />

    <!-- Modal for managing columns -->
    <ManageColumnsModal
      :show="showManageColumnsModal"
      :viewId="newViewId"
      :columns="[]"
      @close="closeManageColumnsModal"
      @save="handleSaveColumns"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useViewStore } from '../stores/viewStore'
import AddViewModal from './AddViewModal.vue'
import ManageColumnsModal from './ManageColumnsModal.vue'

const router = useRouter()
const viewStore = useViewStore()
const showAddViewModal = ref(false)
const showManageColumnsModal = ref(false)
const newViewName = ref('')
const newViewId = ref(null)

// Handle view name submission
const handleViewNameSubmitted = (viewName) => {
  newViewName.value = viewName
  showAddViewModal.value = false
  
  try {
    // Create view with no columns initially
    const view = viewStore.createView({
      name: viewName,
      columns: [],
      data: []
    })
    
    if (view && view.id) {
      newViewId.value = view.id
      // Show columns modal immediately
      showManageColumnsModal.value = true
    }
  } catch (error) {
    console.error('Failed to create view:', error)
    alert(error.message)
  }
}

const handleSaveColumns = (columns) => {
  if (!newViewId.value) return

  try {
    viewStore.updateView(newViewId.value, { columns })
    closeManageColumnsModal()
    router.push(`/views/${newViewId.value}`)
  } catch (error) {
    console.error('Failed to update columns:', error)
    alert(error.message)
  }
}

const closeAddViewModal = () => {
  showAddViewModal.value = false
  newViewName.value = ''
}

const closeManageColumnsModal = () => {
  showManageColumnsModal.value = false
  newViewId.value = null
}
</script>

<style scoped>
.view-creator {
  margin: 1rem 0;
}

.add-view-btn {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 2px dashed #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-view-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
  color: #333;
}
</style>