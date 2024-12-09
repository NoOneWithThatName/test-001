import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useViewStore } from './viewStore'

export const useAuthStore = defineStore('auth', () => {
  // Initialize currentUser from localStorage if available
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)
  const viewStore = useViewStore()
  
  // Mock user database
  const users = [
    { 
      id: '1', 
      email: 'pd@example.com', 
      password: 'password',
      defaultViews: [
        {
          id: 'licenses',
          name: 'Licenses',
          path: '/licenses'
        }
      ]
    },
    { 
      id: '2', 
      email: 'nd@example.com', 
      password: 'password',
      defaultViews: [] // No default views for user 2
    }
  ]

  // Computed property for current user ID
  const currentUserId = computed(() => currentUser.value?.id)

  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = { id: user.id, email: user.email }
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      
      // Initialize default views for the user
      viewStore.clearViews() // Clear any existing views first
      user.defaultViews.forEach(view => {
        try {
          viewStore.addView(view.name)
        } catch (err) {
          console.error('Failed to add default view:', err)
        }
      })
      
      return true
    }
    return false
  }

  function logout() {
    currentUser.value = null
    // Clear from localStorage
    localStorage.removeItem('currentUser')
    viewStore.clearViews()
  }

  function isAuthenticated() {
    return currentUser.value !== null
  }

  return {
    currentUser,
    currentUserId,
    login,
    logout,
    isAuthenticated
  }
})
