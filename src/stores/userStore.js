import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('users', () => {
  // Initialize users with default data if localStorage is empty
  const initialUsers = [
    { 
      id: '1', 
      email: 'pd@example.com', 
      password: 'password',
      createdAt: new Date().toISOString(),
      lastLoginAt: null
    },
    { 
      id: '2', 
      email: 'nd@example.com', 
      password: 'password',
      createdAt: new Date().toISOString(),
      lastLoginAt: null
    }
  ]

  // Always start with initialUsers for testing
  localStorage.setItem('users', JSON.stringify(initialUsers))
  const users = ref(JSON.parse(localStorage.getItem('users')))

  function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  function getUserByEmail(email) {
    return users.value.find(u => u.email === email)
  }

  function getUserById(id) {
    return users.value.find(u => u.id === id)
  }

  function createUser(email, password) {
    if (getUserByEmail(email)) {
      throw new Error('User with this email already exists')
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date().toISOString(),
      lastLoginAt: null
    }

    users.value.push(newUser)
    saveUsers()
    return newUser
  }

  function updateUser(id, updates) {
    const index = users.value.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }

    users.value[index] = { ...users.value[index], ...updates }
    saveUsers()
    return users.value[index]
  }

  function updateLastLogin(id) {
    const user = getUserById(id)
    if (user) {
      user.lastLoginAt = new Date().toISOString()
      saveUsers()
    }
  }

  return {
    users,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    updateLastLogin
  }
})
