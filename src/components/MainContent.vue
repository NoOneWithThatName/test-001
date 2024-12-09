<template>
  <div class="main-content">
    <div class="view-actions" v-if="showViewActions">
      <button 
        class="btn-icon edit"
        title="Edit Columns"
        @click="showEditModal = true"
      >
        ✎
      </button>
      <button 
        class="btn-icon delete"
        title="Delete View"
        @click="deleteView"
      >
        ×
      </button>
    </div>
    <router-view></router-view>
    
    <EditColumnsModal
      v-if="showEditModal"
      :show="showEditModal"
      :columns="currentView?.columns || []"
      @close="showEditModal = false"
      @save="handleEditColumns"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useViewStore } from '../stores/viewStore';
import EditColumnsModal from '../components/EditColumnsModal.vue';

const route = useRoute();
const router = useRouter();
const viewStore = useViewStore();
const showEditModal = ref(false);

const currentView = computed(() => {
  if (route.path === '/') return null;
  return viewStore.getUserViews().find(view => view.path === route.path);
});

const showViewActions = computed(() => {
  return currentView.value && route.path !== '/';
});

const handleEditColumns = async (columns) => {
  if (currentView.value) {
    try {
      await viewStore.updateViewColumns(currentView.value.id, columns);
      showEditModal.value = false;
    } catch (error) {
      console.error('Failed to update columns:', error);
    }
  }
};

const deleteView = async () => {
  if (!currentView.value) return;
  
  if (confirm(`Are you sure you want to delete "${currentView.value.name}"?`)) {
    try {
      await viewStore.removeView(currentView.value.id);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete view:', error);
    }
  }
};
</script>

<style scoped>
.main-content {
  padding: 16px;
  flex-grow: 1;
  position: relative;
}

.view-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 16px;
  z-index: 1;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.btn-icon.edit {
  color: #4CAF50;
}

.btn-icon.delete {
  color: #f44336;
}
</style>
