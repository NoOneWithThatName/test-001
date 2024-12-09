<template>
  <div class="view-creator">
    <button @click="showAddViewModal = true" class="add-view-btn">
      + Add View
    </button>

    <!-- Modal for creating new view -->
    <AddViewModal 
      :show="showAddViewModal"
      @close="showAddViewModal = false"
      @view-created="handleViewCreated"
    />

    <!-- Modal for adding columns -->
    <AddColumnsModal
      :show="showAddColumnsModal"
      :view-id="selectedViewId"
      @close="closeColumnsModal"
      @columns-added="handleColumnsAdded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useViewStore } from '../stores/viewStore'
import AddViewModal from './AddViewModal.vue'
import AddColumnsModal from './AddColumnsModal.vue'

const router = useRouter()
const viewStore = useViewStore()
const showAddViewModal = ref(false)
const showAddColumnsModal = ref(false)
const selectedViewId = ref(null)

const handleViewCreated = (newView) => {
  showAddViewModal.value = false
  selectedViewId.value = newView.id
  showAddColumnsModal.value = true
}

const closeColumnsModal = () => {
  showAddColumnsModal.value = false
  selectedViewId.value = null
}

const handleColumnsAdded = () => {
  closeColumnsModal()
  // Navigate to the new view if needed
  if (selectedViewId.value) {
    const view = viewStore.getUserViews().find(v => v.id === selectedViewId.value)
    if (view) {
      router.push(view.path)
    }
  }
}
</script>

<style scoped>
.view-creator {
  margin: 10px 0;
}

.add-view-btn {
  width: 100%;
  padding: 8px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-view-btn:hover {
  background: #45a049;
}
</style>
