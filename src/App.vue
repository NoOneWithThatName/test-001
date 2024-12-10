<template>
  <div class="app-container">
    <template v-if="authStore.isAuthenticated">
      <!-- Navbar -->
      <Navbar @toggle-sidebar="toggleSidebar" />
      <!-- Main Layout -->
      <div class="app" style="display: flex; min-height: calc(100vh - 60px); margin-top: 60px;">
        <Sidebar :is-collapsed="isSidebarCollapsed" />
        <ViewContent />
<!--
        <MainContent />
-->
      </div>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Navbar from './components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import ViewContent from './components/ViewContent.vue';

/*
import MainContent from './components/MainContent.vue';
*/
const router = useRouter();
const authStore = useAuthStore();
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
.app-container {
  height: 100vh;
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
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
}

.navbar-start, .navbar-end {
  display: flex;
  align-items: center;
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: 500;
  margin-left: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fff;
  position: relative;
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

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #c82333;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  background: #f5f5f5;
}

h1, h2, h3, h4, h5, h6 {
  color: #333;
  margin-bottom: 0.5rem;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>