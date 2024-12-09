<template>
  <div class="licenses-view">
    <div class="view-header">
      <h1>License Management</h1>
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
            <button @click="editLicense(license.id)"
                    class="action-button edit">
              Edit
            </button>
            <button @click="deleteLicense(license.id)"
                    class="action-button delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Columns Modal -->
    <EditColumnsModal
      v-if="showEditModal"
      view-id="licenses"
      @close="showEditModal = false"
      @save="handleEditColumns"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import EditColumnsModal from '../components/EditColumnsModal.vue';
import { useViewStore } from '../stores/viewStore';

const router = useRouter();
const viewStore = useViewStore();
const showEditModal = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');

// Mock license data
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
]);

const filteredLicenses = computed(() => {
  return licenses.value.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         license.key.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || license.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleEditColumns = (columns) => {
  showEditModal.value = false;
  // Handle column updates here
};

const deleteView = async () => {
  if (confirm('Are you sure you want to delete this view?')) {
    try {
      await viewStore.removeView('licenses');
      router.push('/');
    } catch (error) {
      console.error('Failed to delete view:', error);
    }
  }
};

const renewLicense = (licenseId) => {
  const license = licenses.value.find(l => l.id === licenseId);
  if (license) {
    license.status = 'active';
    const currentDate = new Date();
    license.expiryDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
      .toISOString().split('T')[0];
  }
};

const deactivateLicense = (licenseId) => {
  const license = licenses.value.find(l => l.id === licenseId);
  if (license) {
    license.status = 'expired';
  }
};

const editLicense = (licenseId) => {
  // Handle edit license logic here
  console.log(`Edit license ${licenseId}`);
};

const deleteLicense = (licenseId) => {
  // Handle delete license logic here
  console.log(`Delete license ${licenseId}`);
};
</script>

<style scoped>
.licenses-view {
  padding: 20px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.btn-icon.edit {
  color: #4CAF50;
}

.btn-icon.delete {
  color: #f44336;
}

.license-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input,
.status-filter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.license-card.expired {
  background: #fff5f5;
}

.license-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.license-header h3 {
  margin: 0;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.status-badge.active {
  background: #e6ffe6;
  color: #008000;
}

.status-badge.expired {
  background: #ffe6e6;
  color: #cc0000;
}

.status-badge.pending {
  background: #fff3e6;
  color: #cc7700;
}

.license-details {
  margin-bottom: 15px;
}

.license-details p {
  margin: 5px 0;
  color: #666;
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
  font-weight: 500;
  transition: opacity 0.2s;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.renew {
  background: #4CAF50;
  color: white;
}

.action-button.deactivate {
  background: #f44336;
  color: white;
}

.action-button.edit {
  background: #03A9F4;
  color: white;
}

.action-button.delete {
  background: #f44336;
  color: white;
}
</style>
