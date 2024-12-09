<template>
  <div class="view-creator">
    <button @click="showCreator = true" class="add-view-btn">
      + Add View
    </button>

    <!-- Modal for creating new view -->
    <div v-if="showCreator" class="modal">
      <div class="modal-content">
        <h3>Create New View</h3>
        <div v-if="error" class="error-message">{{ error }}</div>
        <input 
          v-model="viewName" 
          type="text" 
          placeholder="Enter view name"
          class="view-input"
          @keyup.enter="createView"
        >
        <div class="modal-actions">
          <button @click="createView" :disabled="!viewName.trim()" class="create-btn">
            Create
          </button>
          <button @click="closeModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useViewStore } from '../stores/viewStore'
import { defineAsyncComponent } from 'vue'

const router = useRouter()
const viewStore = useViewStore()
const showCreator = ref(false)
const viewName = ref('')
const error = ref('')

const closeModal = () => {
  showCreator.value = false
  viewName.value = ''
  error.value = ''
}

const createView = async () => {
  if (!viewName.value.trim()) return
  
  try {
    error.value = ''
    const view = viewStore.addView(viewName.value)
    
    // Create the route for the new view
    const viewComponent = defineAsyncComponent(() =>
      import(`../views/GenericView.vue`)
    )
    
    router.addRoute({
      path: view.path,
      name: view.id,
      component: viewComponent,
      props: { viewId: view.id }
    })

    closeModal()
    // Navigate to the new view
    router.push(view.path)
  } catch (err) {
    error.value = err.message
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.error-message {
  color: #f44336;
  margin-bottom: 10px;
  font-size: 14px;
}

.view-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.create-btn, .cancel-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn {
  background: #4CAF50;
  color: white;
}

.create-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f44336;
  color: white;
}
</style>
