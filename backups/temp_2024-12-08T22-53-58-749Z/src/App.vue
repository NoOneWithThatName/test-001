<template>
  <div class="app-container">
    <!-- Navbar -->
    <nav class="navbar">
      <button class="hamburger-btn" @click="toggleSidebar">
        <div class="hamburger-icon" :class="{ 'active': isSidebarOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <div class="navbar-brand">Vue Tracker Platform</div>
    </nav>

    <div class="main-layout">
      <!-- Sidebar -->
      <aside id="sidebar" class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
        <div class="page-links">
          <h3>Pages</h3>
          <router-link to="/" class="page-link">Dashboard</router-link>
        </div>
        
        <div class="view-links">
          <h3>Views</h3>
          <!-- View links will be dynamically added here -->
        </div>
      </aside>

      <!-- Main Content -->
      <main id="main-content" class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
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
  position: relative;
}

.page-links, .view-links {
  margin-bottom: 20px;
}

.page-link {
  display: block;
  padding: 8px 0;
  color: #2c3e50;
  text-decoration: none;
}

h3 {
  margin-bottom: 10px;
  color: #2c3e50;
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
</style>
