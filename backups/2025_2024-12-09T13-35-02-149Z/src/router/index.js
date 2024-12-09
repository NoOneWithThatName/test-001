import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import LoginView from '../views/LoginView.vue'
import LicensesView from '../views/LicensesView.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/licenses',
      name: 'Licenses',
      component: LicensesView,
      meta: { requiresAuth: true, isSystemPage: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else if (to.meta.userId && authStore.currentUserId !== to.meta.userId) {
    // Redirect to dashboard if trying to access another user's view
    next('/')
  } else if (to.path === '/login' && authStore.isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
