<template>
  <div class="generic-view">
    <h1>{{ viewStore.userViews.find(v => v.id === viewId)?.name }}</h1>
    <div class="content-placeholder">
      <p>This is a newly created view. Add your content here.</p>
    </div>
  </div>
</template>

<script setup>
import { useViewStore } from '../stores/viewStore'

const props = defineProps({
  viewId: {
    type: String,
    required: true
  }
})

const viewStore = useViewStore()
</script>

<style scoped>
.generic-view {
  padding: 20px;
}

.content-placeholder {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  color: #666;
}
</style>
