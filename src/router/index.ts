import { createRouter, createWebHistory } from 'vue-router'
import ProdHome from '../views/prod/HomeView.vue'
import LocalHome from '../views/local/HomeView.vue'

const mode = import.meta.env.MODE
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: mode === 'production' ? ProdHome : LocalHome,
    },
    {
      path: '/interactive',
      name: 'interactive',
      component: () =>
        import(
          import.meta.env.MODE === 'production'
            ? '../views/prod/InteractiveView.vue'
            : '../views/local/InteractiveView.vue'
        ),
      // component: () => import('../views/InteractiveView.vue'),
    },
  ],
})

export default router
