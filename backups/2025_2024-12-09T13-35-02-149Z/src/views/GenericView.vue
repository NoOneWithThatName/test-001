<template>
  <div class="generic-view">
    <div class="view-header">
      <h1>{{ viewStore.userViews.find(v => v.id === viewId)?.name }}</h1>
      <div class="view-actions">
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
    </div>
    <div class="content-placeholder">
      <p>This is a newly created view. Add your content here.</p>
    </div>

    <!-- Edit Columns Modal -->
    <EditColumnsModal
      v-if="showEditModal"
      :view-id="viewId"
      @close="showEditModal = false"
      @save="handleEditColumns"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useViewStore } from '../stores/viewStore';
import EditColumnsModal from '../components/EditColumnsModal.vue';

const props = defineProps({
  viewId: {
    type: String,
    required: true
  }
});

const router = useRouter();
const viewStore = useViewStore();
const showEditModal = ref(false);

const currentView = computed(() => {
  return viewStore.userViews.find(v => v.id === props.viewId);
});

const handleEditColumns = async (columns) => {
  await viewStore.updateViewColumns(props.viewId, columns);
  showEditModal.value = false;
};

const deleteView = async () => {
  if (currentView.value && confirm(`Are you sure you want to delete the view "${currentView.value.name}"?`)) {
    await viewStore.deleteView(props.viewId);
    router.push('/');
  }
};
</script>

<style scoped>
.generic-view {
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

.content-placeholder {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  color: #666;
}
</style>
