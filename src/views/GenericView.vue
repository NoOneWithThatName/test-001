<template>
  <div class="generic-view">
    <h1>{{ viewTitle }}</h1>
    <div class="content-placeholder">
      <p>{{ contentMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useViewStore } from '../stores/viewStore';

const router = useRouter();
const route = useRoute();
const viewStore = useViewStore();

// Get viewId from route params
const viewId = computed(() => route.params.viewId || route.path.split('/').pop());

// Check if this is a user view (not a system view)
const isUserView = computed(() => !route.meta.isSystemPage);

// Get current view
const currentView = computed(() => {
  if (route.meta.isSystemPage) {
    // For system pages like Licenses
    return {
      name: route.name,
      id: viewId.value
    };
  }
  return viewStore.userViews.find(v => v.id === viewId.value);
});

// Get view title
const viewTitle = computed(() => currentView.value?.name || route.name);

// Get content message
const contentMessage = computed(() => {
  if (route.meta.isSystemPage) {
    return `This is the ${route.name} view. System functionality will be added here.`;
  }
  return 'This is a user-created view. Add your content here.';
});

const deleteView = async () => {
  if (confirm('Are you sure you want to delete this view?')) {
    try {
      await viewStore.removeView(viewId.value);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete view:', error);
    }
  }
};
</script>

<style scoped>
.generic-view {
}

h1 {
  margin-bottom: 20px;
}

.content-placeholder {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
