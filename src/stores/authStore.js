import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'

export const useAuthStore = defineStore('auth', () => {
  // Initialize currentUser from localStorage if available
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)
  
  // Computed properties
  const currentUserId = computed(() => currentUser.value?.id)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function login(email, password) {
    const userStore = useUserStore()
    console.log('Looking up user:', email)
    const user = userStore.getUserByEmail(email)
    console.log('Found user:', user)
    
    if (user && user.password === password) {
      console.log('Password matches, logging in')
      currentUser.value = { id: user.id, email: user.email }
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      userStore.updateLastLogin(user.id)
      return true
    }
    console.log('Login failed: invalid credentials')
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
