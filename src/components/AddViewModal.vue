<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h2>Add New View</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="viewName">View Name</label>
          <input
            id="viewName"
            v-model="viewName"
            type="text"
            required
            placeholder="Enter view name"
            @keyup.esc="close"
          />
        </div>
        <div class="button-group">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button type="submit" class="btn-primary">Next</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'view-name-submitted'])
const viewName = ref('')

const close = () => {
  viewName.value = ''
  emit('close')
}

const handleSubmit = () => {
  if (viewName.value.trim()) {
    emit('view-name-submitted', viewName.value.trim())
    viewName.value = ''
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
  border: none;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
}

.btn-primary:hover {
  background-color: #3182ce;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}
</style>
