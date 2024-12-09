<template>
  <aside id="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="page-links">
      <h3>Navigation</h3>
      <router-link to="/" class="page-link">Dashboard</router-link>
    </div>
    <div class="view-links">
      <h3>Views</h3>
      <router-link to="/licenses" class="page-link">Licenses</router-link>
      <ViewCreator />
      <router-link 
        v-for="view in userViews" 
        :key="view.id"
        :to="view.path"
        class="page-link"
      >
        {{ view.name }}
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useViewStore } from '@/stores/viewStore';
import ViewCreator from './ViewCreator.vue';

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const viewStore = useViewStore();

// Filter out system pages from user views
const userViews = computed(() => {
  return viewStore.getUserViews().filter(view => {
    const route = router.getRoutes().find(r => r.path === view.path);
    return !route?.meta?.isSystemPage;
  });
});
</script>

<style scoped>
#sidebar {
  width: 250px;
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

#sidebar.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.page-links, .view-links {
  margin-bottom: 20px;
}

.page-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.25rem 0;
  transition: all 0.2s ease;
}

.page-link:hover {
  background: #e9ecef;
}

.router-link-active {
  background: #4CAF50;
  color: white;
  font-weight: 500;
}

.router-link-active:hover {
  background: #45a049;
}

.view-links {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.view-links h3, .page-links h3 {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
