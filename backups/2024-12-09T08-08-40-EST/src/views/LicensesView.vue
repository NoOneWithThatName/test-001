<template>
  <div class="licenses-view">
    <h1>License Management</h1>
    
    <div class="licenses-container">
      <div class="license-filters">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search licenses..."
          class="search-input"
        >
        <select v-model="statusFilter" class="status-filter">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div class="licenses-grid">
        <div v-for="license in filteredLicenses" 
             :key="license.id" 
             class="license-card"
             :class="{ 'expired': license.status === 'expired' }">
          <div class="license-header">
            <h3>{{ license.name }}</h3>
            <span :class="['status-badge', license.status]">
              {{ license.status }}
            </span>
          </div>
          <div class="license-details">
            <p><strong>Key:</strong> {{ license.key }}</p>
            <p><strong>Expires:</strong> {{ formatDate(license.expiryDate) }}</p>
            <p><strong>Type:</strong> {{ license.type }}</p>
          </div>
          <div class="license-actions">
            <button @click="renewLicense(license.id)" 
                    :disabled="license.status === 'active'"
                    class="action-button renew">
              Renew
            </button>
            <button @click="deactivateLicense(license.id)"
                    :disabled="license.status === 'expired'"
                    class="action-button deactivate">
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock data for User 1's licenses
const licenses = ref([
  {
    id: 1,
    name: 'Development IDE Pro',
    key: 'IDE-PRO-2024-001',
    status: 'active',
    expiryDate: '2024-12-31',
    type: 'Professional'
  },
  {
    id: 2,
    name: 'Cloud Services Suite',
    key: 'CLOUD-ENT-2024-002',
    status: 'active',
    expiryDate: '2024-06-30',
    type: 'Enterprise'
  },
  {
    id: 3,
    name: 'Legacy System Tools',
    key: 'LST-2023-003',
    status: 'expired',
    expiryDate: '2023-12-31',
    type: 'Standard'
  }
])

const searchQuery = ref('')
const statusFilter = ref('all')

const filteredLicenses = computed(() => {
  return licenses.value.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         license.key.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || license.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const renewLicense = (licenseId) => {
  const license = licenses.value.find(l => l.id === licenseId)
  if (license) {
    license.status = 'active'
    const currentDate = new Date()
    license.expiryDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
      .toISOString().split('T')[0]
  }
}

const deactivateLicense = (licenseId) => {
  const license = licenses.value.find(l => l.id === licenseId)
  if (license) {
    license.status = 'expired'
  }
}
</script>

<style scoped>
.licenses-view {
  padding: 20px;
}

.licenses-container {
  max-width: 1200px;
  margin: 0 auto;
}

.license-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input, .status-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.licenses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.license-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.license-card.expired {
  opacity: 0.8;
  background: #f8f8f8;
}

.license-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.license-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #e6f4ea;
  color: #1e7e34;
}

.status-badge.expired {
  background: #feeced;
  color: #dc3545;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.license-details {
  margin-bottom: 15px;
}

.license-details p {
  margin: 8px 0;
  font-size: 14px;
}

.license-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.renew {
  background: #28a745;
  color: white;
}

.action-button.renew:hover:not(:disabled) {
  background: #218838;
}

.action-button.deactivate {
  background: #dc3545;
  color: white;
}

.action-button.deactivate:hover:not(:disabled) {
  background: #c82333;
}
</style>
