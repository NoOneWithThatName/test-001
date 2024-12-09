import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Initialize currentUser from localStorage if available
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)
  
  // Mock user database
  const users = [
    { 
      id: '1', 
      email: 'pd@example.com', 
      password: 'password',
      defaultViews: [
        {
          name: 'My Projects',
          columns: [
            { id: 'name', label: 'Name', visible: true },
            { id: 'status', label: 'Status', visible: true },
            { id: 'dueDate', label: 'Due Date', visible: true }
          ]
        }
      ]
    },
    { 
      id: '2', 
      email: 'nd@example.com', 
      password: 'password',
      defaultViews: []
    }
  ]

  // Computed properties
  const currentUserId = computed(() => currentUser.value?.id)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = { id: user.id, email: user.email }
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return {
    currentUser,
    currentUserId,
    isAuthenticated,
    login,
    logout
  }
})
