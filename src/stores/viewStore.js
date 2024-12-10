import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { useRouter } from 'vue-router'

export const useViewStore = defineStore('views', () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const views = ref(JSON.parse(localStorage.getItem('views')) || {})

  // Save views to localStorage
  function saveViews() {
    localStorage.setItem('views', JSON.stringify(views.value))
  }

  // Get views for current user
  function getUserViews() {
    const userId = authStore.currentUserId
    if (!userId || !views.value[userId]) return []
    
    return Object.values(views.value[userId]).map(view => ({
      ...view,
      path: `/views/${view.id}`
    }))
  }

  // Computed property for all views
  const allViews = computed(() => getUserViews())

  // Create a new view
  function createView(viewData) {
    const userId = authStore.currentUserId
    if (!userId) return null

    if (!views.value[userId]) {
      views.value[userId] = {}
    }

    const newView = {
      id: Date.now().toString(),
      name: viewData.name,
      columns: [],
      data: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    views.value[userId][newView.id] = newView
    saveViews()

    // Add route for the new view
    if (router) {
      router.addRoute({
        path: `/views/${newView.id}`,
        name: newView.id,
        component: () => import('../components/ViewContent.vue')
      })
    }

    return newView
  }

  // Update a view
  function updateView(viewId, updates) {
    const userId = authStore.currentUserId
    if (!userId || !views.value[userId]?.[viewId]) return false

    // Merge updates, ensuring columns are saved
    views.value[userId][viewId] = {
      ...views.value[userId][viewId],
      ...updates,
      columns: updates.columns || views.value[userId][viewId].columns || [],
      updatedAt: new Date().toISOString()
    }
    saveViews()
    return views.value[userId][viewId]
  }

  // Update just the data portion of a view
  function updateViewData(viewId, newData) {
    const userId = authStore.currentUserId
    if (!userId || !views.value[userId]?.[viewId]) return false

    views.value[userId][viewId].data = newData
    views.value[userId][viewId].updatedAt = new Date().toISOString()
    saveViews()
    return true
  }

  // Delete a view
  function deleteView(viewId) {
    const userId = authStore.currentUserId
    if (!userId || !views.value[userId]?.[viewId]) return false

    delete views.value[userId][viewId]
    saveViews()
    return true
  }

  // Get a specific view
  function getView(viewId) {
    const userId = authStore.currentUserId
    if (!userId || !views.value[userId]?.[viewId]) return null

    return {
      ...views.value[userId][viewId],
      path: `/views/${viewId}`
    }
  }

  // Get a specific view by path
  function getViewByPath(path) {
    const userId = authStore.currentUserId
    if (!userId || !views.value[userId]) return null

    const viewId = path.split('/').pop() // Get the last part of the path
    return views.value[userId]?.[viewId] ? {
      ...views.value[userId][viewId],
      path: `/views/${viewId}`
    } : null
  }

  return {
    views,
    allViews,
    getUserViews,
    createView,
    updateView,
    updateViewData,
    deleteView,
    getView,
    getViewByPath
  }
})
