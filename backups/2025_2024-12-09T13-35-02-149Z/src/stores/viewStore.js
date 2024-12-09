import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import router from '../router'

export const useViewStore = defineStore('views', () => {
  const userViews = ref([])
  const authStore = useAuthStore()

  // Helper to create user-specific route name
  function getUserSpecificRouteName(viewId, userId) {
    return `${userId}-${viewId}`
  }

  function addView(viewName) {
    if (!authStore.isAuthenticated()) {
      throw new Error('Must be logged in to add views')
    }

    const currentUserId = authStore.currentUserId
    if (!currentUserId) {
      throw new Error('User ID not found')
    }

    // Check for system page names
    const systemPages = ['dashboard', 'licenses']
    if (systemPages.includes(viewName.toLowerCase())) {
      throw new Error(`"${viewName}" is a reserved system page name`)
    }

    // Check if view name already exists for this user (case-insensitive)
    const existingView = userViews.value.find(view => 
      view.name.toLowerCase() === viewName.toLowerCase() && 
      view.userId === currentUserId
    )
    
    if (existingView) {
      throw new Error(`A view with name "${viewName}" already exists for this user`)
    }

    const viewId = viewName.toLowerCase().replace(/\s+/g, '-')
    const newView = {
      id: viewId,
      name: viewName,
      path: `/${currentUserId}/${viewId}`, // Make path user-specific
      userId: currentUserId,
      routeName: getUserSpecificRouteName(viewId, currentUserId)
    }

    userViews.value.push(newView)
    
    // Add route for the new view with user-specific route name
    if (!router.hasRoute(newView.routeName)) {
      router.addRoute({
        path: newView.path,
        name: newView.routeName,
        component: () => import('../views/GenericView.vue'),
        meta: { isUserView: true }
      })
    }

    return newView
  }

  function removeView(viewId) {
    const currentUserId = authStore.currentUserId
    if (!currentUserId) {
      throw new Error('User ID not found')
    }

    const index = userViews.value.findIndex(view => 
      view.id === viewId && view.userId === currentUserId
    )

    if (index === -1) {
      throw new Error('View not found')
    }

    const view = userViews.value[index]

    // Remove route if it exists
    if (router.hasRoute(view.routeName)) {
      router.removeRoute(view.routeName)
    }
    
    // Remove from userViews array
    userViews.value.splice(index, 1)
    
    return {
      id: view.id,
      name: view.name
    }
  }

  function getUserViews() {
    const currentUserId = authStore.currentUserId
    if (!currentUserId) return []

    return userViews.value.filter(view => view.userId === currentUserId)
  }

  function clearViews() {
    const currentUserId = authStore.currentUserId
    if (!currentUserId) return

    // Remove all routes for current user's views
    userViews.value.forEach(view => {
      if (view.userId === currentUserId && router.hasRoute(view.routeName)) {
        router.removeRoute(view.routeName)
      }
    })

    // Filter out current user's views
    userViews.value = userViews.value.filter(view => 
      view.userId !== currentUserId
    )
  }

  return {
    userViews,
    addView,
    removeView,
    getUserViews,
    clearViews
  }
})
