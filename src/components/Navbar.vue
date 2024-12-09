<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <button class="menu-btn" @click="toggleSidebar">☰</button>
      <span class="brand-text">Vue Tracker</span>
    </div>
    <div class="navbar-end">
      <span class="user-email">{{ authStore.currentUser?.email }}</span>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const emit = defineEmits(['toggle-sidebar']);
const router = useRouter();
const authStore = useAuthStore();

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #1a73e8;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.menu-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  margin-right: 15px;
  transition: background-color 0.2s;
  border-radius: 4px;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.brand-text {
  font-size: 1.2rem;
  font-weight: 500;
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #c82333;
}
</style>
