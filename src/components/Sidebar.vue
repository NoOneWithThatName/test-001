<template>
  <aside id="sidebar" :class="{ collapsed: isCollapsed }">
<!--
    <div class="page-links">
      <h3>Navigation</h3>
      <router-link to="/" class="page-link">Dashboard</router-link>
    </div>
  -->    
  <router-link to="/" class="sidebar-link">Dashboard</router-link>

    <div class="view-links">
      <ViewCreator />
      <router-link 
        v-for="view in allViews" 
        :key="view.id"
        :to="view.path"
        class="view-link"
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

const allViews = computed(() => viewStore.allViews);
</script>

<style scoped>
#sidebar {
  width: 250px;
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#sidebar.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

/*
  .page-links, .view-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
*/

.sidebar-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  background: yellow;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}


.view-link {
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 5px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}


.sidebar-link:hover {
  background-color: #c0c0c0;
}

.view-link:hover {
  background-color: #c0c0c0;
}

.router-link-active {
  background: #808080;
  color: white;
  font-weight: 500;
}

.router-link-active:hover {
  background: #45a049;
}

.view-links {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.view-links h3 {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-links h3 {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
