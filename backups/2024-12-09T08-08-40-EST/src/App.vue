<template>
  <div class="app-container">
    <template v-if="authStore.isAuthenticated()">
      <!-- Navbar - Only shown when authenticated -->
      <nav class="navbar">
        <button class="hamburger-btn" @click="toggleSidebar">
          <div class="hamburger-icon" :class="{ 'active': isSidebarOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div class="navbar-brand">Vue Tracker Platform</div>
        <div class="user-menu">
          <span class="user-email">{{ authStore.currentUser?.email }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </nav>

      <div class="main-layout">
        <!-- Sidebar - Only shown when authenticated -->
        <aside id="sidebar" class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
          <div class="page-links">
            <h3>Pages</h3>
            <router-link to="/" class="page-link">Dashboard</router-link>
          </div>
          
          <div class="view-links">
            <h3>Views</h3>
            <ViewCreator />
            <router-link 
              v-for="view in viewStore.getUserViews()" 
              :key="view.id"
              :to="view.path"
              class="page-link"
            >
              <span>{{ view.name }}</span>
              <div class="view-actions">
                <button 
                  class="btn-icon edit"
                  title="Edit Columns"
                  @click.stop="editColumns(view.id)"
                >
                  ✎
                </button>
                <button 
                  class="btn-icon delete"
                  title="Delete View"
                  @click.stop="deleteView(view)"
                >
                  ×
                </button>
              </div>
            </router-link>
          </div>
        </aside>

        <!-- Main Content -->
        <main id="main-content" class="main-content">
          <router-view></router-view>
        </main>
      </div>
    </template>

    <!-- Login view when not authenticated -->
    <template v-else>
      <div class="login-container">
        <router-view></router-view>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ViewCreator from './components/ViewCreator.vue';
import { useViewStore } from './stores/viewStore';
import { useAuthStore } from './stores/authStore';

const router = useRouter();
const viewStore = useViewStore();
const authStore = useAuthStore();
const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = () => {
  viewStore.clearViews();
  authStore.logout();
  router.push('/login');
};

const editColumns = (viewId) => {
  // Add implementation for editing columns
};

const deleteView = (view) => {
  // Add implementation for deleting view
};
</script>

<style>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
}

.main-layout {
  display: flex;
  height: calc(100vh - 60px);
  margin-top: 60px;
}

.sidebar {
  width: 250px;
  background: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fff;
  position: relative;
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

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin-right: 10px;
}

.hamburger-icon {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: white;
  transition: all 0.3s ease;
}

.hamburger-icon.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger-icon.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-icon.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.app-container .login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 2rem;
  min-width: 100%;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  padding-right: 1rem;
}

.user-email {
  color: white;
  font-size: 0.9rem;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #c82333;
}

#sidebar .view-links a {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.25rem 0;
  transition: all 0.2s ease;
}

#sidebar .view-links a:hover {
  background: #e9ecef;
}

#sidebar .view-links a .view-actions {
  display: none;
  gap: 0.5rem;
}

#sidebar .view-links a:hover .view-actions {
  display: flex;
}

#sidebar .view-links a .btn-icon {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

#sidebar .view-links a .btn-icon:hover {
  color: #1f2937;
}
</style>
