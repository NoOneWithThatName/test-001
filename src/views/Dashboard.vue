<template>
  <div class="dashboard">
    <div class="view-header">
      <h1>{{ currentView?.name || 'Dashboard' }}</h1>
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
          @click="deleteView(currentView)"
        >
          ×
        </button>
      </div>
    </div>
    <router-view></router-view>
    
    <!-- Edit Columns Modal -->
    <EditColumnsModal
      v-if="showEditModal"
      :view-id="currentView?.id"
      @close="showEditModal = false"
      @save="handleEditColumns"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useViewStore } from '@/stores/viewStore';
import EditColumnsModal from '@/components/EditColumnsModal.vue';

const route = useRoute();
const router = useRouter();
const viewStore = useViewStore();
const showEditModal = ref(false);

const currentView = computed(() => {
  if (route.path === '/') return null;
  /*
  // Handle Licenses view
  if (route.path === '/licenses') {
    return {
      id: 'licenses',
      name: 'Licenses',
      path: '/licenses'
    };
  }
  */
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

const deleteView = async (view) => {
  if (!view) return;
  
  if (confirm(`Are you sure you want to delete the view "${view.name}"?`)) {
    try {
      await viewStore.removeView(view.id);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete view:', error);
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
