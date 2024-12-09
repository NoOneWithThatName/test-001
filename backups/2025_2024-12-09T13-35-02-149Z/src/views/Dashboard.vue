<template>
  <div class="dashboard">
    <div class="view-header">
      <h1>{{ currentView?.name || 'Dashboard' }}</h1>
      <div class="view-actions" v-if="currentView">
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
  return viewStore.getUserViews().find(view => view.path === route.path);
});

const handleEditColumns = async (columns) => {
  if (currentView.value) {
    await viewStore.updateViewColumns(currentView.value.id, columns);
    showEditModal.value = false;
  }
};

const deleteView = async (view) => {
  if (confirm(`Are you sure you want to delete the view "${view.name}"?`)) {
    await viewStore.deleteView(view.id);
    router.push('/');
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.view-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.view-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.btn-icon:hover {
  color: #1f2937;
  background: #f3f4f6;
}

.btn-icon.edit {
  font-size: 1.2rem;
}

.btn-icon.delete {
  font-size: 1.4rem;
}
</style>
