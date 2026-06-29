import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue'
//user
import UserLayout from '@/layouts/UserLayout.vue'
import AboutView from '@/views/user/AboutView.vue'

//admin
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashBoardPage from '@/views/admin/DashBoardPage.vue'
import CategoryPage from '@/views/admin/CategoryPage.vue'
import CollectionPage from '@/views/admin/CollectionPage.vue'
import SettingPage from '@/views/admin/SettingPage.vue'
import StylePage from '@/views/admin/StylePage.vue'
import OrderPage from '@/views/admin/OrderPage.vue'
import ProductLinePage from '@/views/admin/ProductLinePage.vue'
import ProductPage from '@/views/admin/ProductPage.vue'
import UserPage from '@/views/admin/UserPage.vue'
import BrandPage from '@/views/admin/BrandPage.vue'
import ProductVariantPage from '@/views/admin/ProductVariantPage.vue'
import ProductVariantItemPage from '@/views/admin/ProductVariantItemPage.vue'

//notfound
import NotFoudPage from '@/views/NotFoundPage.vue'

//
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //user
    {
      path: '/',
      component: () => UserLayout,
      children: [
        {
          path: '',
          component: () => HomeView,
        },
        {
          path: 'about',
          component: () => AboutView,
        },
        // Not Found
        {
          path: ':pathMatch(.*)*',
          component: () => NotFoudPage,
        },
      ],
    },
    //admin
    {
      path: '/admin',
      component: () => AdminLayout,
      // meta: {
      //   requiresAuth: true,
      //   role: 'ADMIN',
      // },
      children: [
        {
          path: '',
          component: () => DashBoardPage,
        },
        {
          path: 'dashboard',
          component: () => DashBoardPage,
        },
        {
          path: 'categories',
          component: () => CategoryPage,
        },

        {
          path: 'users',
          component: () => UserPage,
        },

        {
          path: 'brands',
          component: () => BrandPage,
        },

        {
          path: 'products',
          component: () => ProductPage,
        },

        {
          path: 'styles',
          component: () => StylePage,
        },

        {
          path: 'settings',
          component: () => SettingPage,
        },

        {
          path: 'collections',
          component: () => CollectionPage,
        },

        {
          path: 'product-lines',
          component: () => ProductLinePage,
        },

        {
          path: 'orders',
          component: () => OrderPage,
        },

        {
          path: 'product-variants',
          component: () => ProductVariantPage,
        },

        {
          path: 'product-variant-items',
          component: () => ProductVariantItemPage,
        },

        // Not Found
        {
          path: ':pathMatch(.*)*',
          component: () => NotFoudPage,
        },
      ],
    },
  ],
})
//kiểm tra trước
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    // chưa có user thì hỏi BE
    if (!authStore.user) {
      try {
        await authStore.getMe()
      } catch {
        return '/login'
      }
    }
    //so sánh quyền của user hiện tại với quyền yêu cầu của route
    if (authStore.user.role !== to.meta.role) {
      return '/'
    }
  }

  return true
})

export default router
