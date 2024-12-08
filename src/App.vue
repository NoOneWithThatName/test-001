<template>
  <div class="app-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-brand">Vue Tracker Platform</div>
    </nav>

    <div class="main-layout">
      <!-- Sidebar -->
      <aside id="sidebar" class="sidebar">
        <div class="page-links">
          <h3>Pages</h3>
          <a href="#" class="page-link">Dashboard</a>
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
// Component logic will be added here
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
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
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
</style>
