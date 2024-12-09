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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useViewStore } from '../stores/viewStore'
import AddViewModal from './AddViewModal.vue'

const router = useRouter()
const viewStore = useViewStore()
const showAddViewModal = ref(false)
const newViewName = ref('')

// Handle view name submission
const handleViewNameSubmitted = (viewName) => {
  newViewName.value = viewName
  showAddViewModal.value = false
  
  try {
    // Create view immediately with default columns
    const view = viewStore.addView({
      name: viewName,
      columns: [
        { id: 'title', label: 'Title', type: 'text', visible: true },
        { id: 'description', label: 'Description', type: 'text', visible: true }
      ],
      data: []
    })
    
    // Close modals and navigate to new view
    closeAddViewModal()
    router.push(view.path)
  } catch (error) {
    console.error('Failed to create view:', error)
    alert(error.message)
  }
}

// Close modals
const closeAddViewModal = () => {
  showAddViewModal.value = false
  newViewName.value = ''
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
