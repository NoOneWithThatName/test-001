import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '../router'
import { useAuthStore } from './authStore'

// System view configurations
const systemViews = {
  licenses: {
    id: 'licenses',
    name: 'Licenses',
    isSystemView: true,
    path: '/views/licenses',
    columns: [
      { id: 'name', label: 'Name', visible: true },
      { id: 'key', label: 'License Key', visible: true },
      { id: 'status', label: 'Status', visible: true },
      { id: 'expiryDate', label: 'Expiry Date', visible: true },
      { id: 'type', label: 'License Type', visible: true }
    ],
    data: [
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
    ]
  }
}

export const useViewStore = defineStore('views', {
  state: () => ({
    views: [
      {
        id: 'licenses',
        name: 'Licenses',
        path: '/views/licenses',
        columns: [
          { id: 'name', label: 'Name', visible: true },
          { id: 'key', label: 'License Key', visible: true },
          { id: 'status', label: 'Status', visible: true },
          { id: 'expiryDate', label: 'Expiry Date', visible: true },
          { id: 'type', label: 'License Type', visible: true }
        ],
        data: [
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
        ]
      }
    ],
    nextId: 1
  }),

  getters: {
    allViews: (state) => {
      if (!useAuthStore().isAuthenticated) return []
      return state.views
    }
  },

  actions: {
    loadViews() {
      if (!useAuthStore().isAuthenticated) return

      const currentUserId = useAuthStore().currentUserId
      if (!currentUserId) return

      // Load views from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('view-')) {
          try {
            const view = JSON.parse(localStorage.getItem(key))
            if (view.userId === currentUserId) {
              this.views.push(view)
              // Add route for the view
              if (!router.hasRoute(view.path)) {
                router.addRoute({
                  path: view.path,
                  name: view.id,
                  component: () => import('../components/MainContent.vue')
                })
              }
            }
          } catch (error) {
            console.error('Failed to load view:', error)
          }
        }
      }
    },

    addView(viewConfig) {
      if (!useAuthStore().isAuthenticated) {
        throw new Error('Must be logged in to add views')
      }

      const currentUserId = useAuthStore().currentUserId
      if (!currentUserId) {
        throw new Error('User ID not found')
      }

      const viewId = viewConfig.name.toLowerCase().replace(/\s+/g, '-')
      
      // Check if view already exists
      const existingView = this.views.find(view => view.id === viewId)
      
      if (existingView) {
        throw new Error('A view with this name already exists')
      }

      // Create the new view with proper structure
      const newView = {
        id: viewId,
        name: viewConfig.name,
        path: `/views/${viewId}`,
        userId: currentUserId,
        columns: viewConfig.columns || [],
        filters: viewConfig.filters || [],
        sortBy: viewConfig.sortBy || null,
        sortDesc: viewConfig.sortDesc || false,
        data: viewConfig.data || []
      }

      // Add the view to the store
      this.views.push(newView)
      
      // Add route for the new view
      if (!router.hasRoute(newView.path)) {
        router.addRoute({
          path: newView.path,
          name: newView.id,
          component: () => import('../components/MainContent.vue')
        })
      }

      // Save to localStorage
      localStorage.setItem(`view-${newView.id}`, JSON.stringify(newView))

      return newView
    },

    removeView(viewId) {
      if (!useAuthStore().isAuthenticated) {
        throw new Error('Must be logged in to remove views')
      }

      const view = this.views.find(v => v.id === viewId)
      if (!view) {
        throw new Error('View not found')
      }

      // Remove from views array
      this.views = this.views.filter(v => v.id !== viewId)
      
      // Remove route if it exists
      if (router.hasRoute(view.path)) {
        router.removeRoute(view.path)
      }
      
      // Remove from localStorage
      localStorage.removeItem(`view-${viewId}`)
    },

    updateView(viewId, updates) {
      if (!useAuthStore().isAuthenticated) {
        throw new Error('Must be logged in to update views')
      }

      const view = this.views.find(v => v.id === viewId)
      if (!view) {
        throw new Error('View not found')
      }

      // Update the view
      Object.assign(view, updates)

      // Save to localStorage
      localStorage.setItem(`view-${viewId}`, JSON.stringify(view))

      return view
    },

    updateViewData(viewId, data) {
      if (!useAuthStore().isAuthenticated) {
        throw new Error('Must be logged in to update views')
      }

      const view = this.views.find(v => v.id === viewId)
      if (!view) {
        throw new Error('View not found')
      }

      // Update just the data
      view.data = data

      // Save to localStorage
      localStorage.setItem(`view-${viewId}`, JSON.stringify(view))

      return view
    },

    getViewById(viewId) {
      return this.views.find(view => view.id === viewId)
    },

    getViewByPath(path) {
      return this.views.find(view => view.path === path)
    }
  }
})
