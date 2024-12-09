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
        props: { 
          viewId: viewId,
          userId: currentUserId
        },
        meta: { 
          requiresAuth: true,
          userId: currentUserId // Add userId to meta for route guard
        }
      })
    }

    return newView
  }

  function removeView(viewId) {
    if (!authStore.isAuthenticated()) return

    const currentUserId = authStore.currentUserId
    if (!currentUserId) return

    const index = userViews.value.findIndex(view => 
      view.id === viewId && 
      view.userId === currentUserId
    )
    
    if (index !== -1) {
      const view = userViews.value[index]
      
      // Remove the route using the user-specific route name
      const routeName = getUserSpecificRouteName(view.id, currentUserId)
      if (router.hasRoute(routeName)) {
        router.removeRoute(routeName)
      }
      
      // Remove from userViews array
      userViews.value.splice(index, 1)
      
      return {
        id: view.id,
        name: view.name
      }
    }
    return null
  }

  function getUserViews() {
    if (!authStore.isAuthenticated()) return []

    const currentUserId = authStore.currentUserId
    if (!currentUserId) return []

    return userViews.value.filter(view => view.userId === currentUserId)
  }

  function clearViews() {
    if (!authStore.isAuthenticated()) return

    const currentUserId = authStore.currentUserId
    if (!currentUserId) return

    // Get all views for current user
    const viewsToRemove = userViews.value.filter(view => 
      view.userId === currentUserId
    )

    // Remove routes and views
    viewsToRemove.forEach(view => {
      const routeName = getUserSpecificRouteName(view.id, currentUserId)
      if (router.hasRoute(routeName)) {
        router.removeRoute(routeName)
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
