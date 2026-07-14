import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue'
//user
import UserLayout from '@/layouts/UserLayout.vue'
import AboutView from '@/views/user/AboutView.vue'

import { ROUTE_NAMES } from '@/constants/routes.js'

//admin
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashBoardPage from '@/views/admin/DashBoardPage.vue'
import CategoryPage from '@/views/admin/category/CategoryPage.vue'
import CollectionPage from '@/views/admin/collection/CollectionPage.vue'
import SystemConfigPage from '@/views/admin/system/SystemConfigPage.vue'
import StylePage from '@/views/admin/style/StylePage.vue'
import OrderPage from '@/views/order/OrderPage.vue'
import ProductLinePage from '@/views/admin/product/ProductLinePage.vue'
import ProductPage from '@/views/admin/product/ProductPage.vue'
import UserPage from '@/views/admin/user/UserPage.vue'
import BrandPage from '@/views/admin/brand/BrandPage.vue'
import ProductVariantPage from '@/views/admin/product/ProductVariantPage.vue'
import SystemNotFoundPage from '@/views/admin/system/NotFoundPage.vue'
import ProductTypePage from '@/views/admin/product-type/ProductTypePage.vue'

//Detail
import ProductVariantItemPage from '@/views/admin/product/ProductVariantItemPage.vue'
import CategoryDetail from '@/views/admin/category/CategoryDetail.vue'
import BrandDetail from '@/views/admin/brand/BrandDetail.vue'
import ProductLineDetail from '@/views/admin/product/ProductLineDetail.vue'
import StyleDetail from '@/views/admin/style/StyleDetail.vue'
import ProductTypeDetail from '@/views/admin/product-type/ProductTypeDetail.vue'
//notfound
import NotFoundPage from '@/views/NotFoundPage.vue'

//
import { useAuthStore } from '@/stores/auth'
import CollectionDetail from '@/views/admin/collection/CollectionDetail.vue'

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
          component: () => NotFoundPage,
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
          redirect: { name: ROUTE_NAMES.DASHBOARD },
        },
        {
          path: 'dashboard',
          name: ROUTE_NAMES.DASHBOARD,
          component: () => DashBoardPage,
        },
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => DashBoardPage,
        },

        {
          path: 'categories',
          name: ROUTE_NAMES.CATEGORIES,
          component: () => CategoryPage,
        },

        {
          path: 'users',
          name: ROUTE_NAMES.USERS,
          component: () => UserPage,
        },

        {
          path: 'brands',
          name: ROUTE_NAMES.BRANDS,
          component: () => BrandPage,
        },

        {
          path: 'products',
          name: ROUTE_NAMES.PRODUCTS,
          component: () => ProductPage,
        },

        {
          path: 'styles',
          name: ROUTE_NAMES.STYLES,
          component: () => StylePage,
        },
        {
          path: 'product-types',
          name: ROUTE_NAMES.PRODUCT_TYPES,
          component: () => ProductTypePage,
        },

        {
          path: 'system-config',
          name: ROUTE_NAMES.SYSTEM_CONFIG,
          component: () => SystemConfigPage,
        },

        {
          path: 'collections',
          name: ROUTE_NAMES.COLLECTIONS,
          component: () => CollectionPage,
        },

        {
          path: 'product-lines',
          name: ROUTE_NAMES.PRODUCT_LINES,
          component: () => ProductLinePage,
        },

        {
          path: 'orders',
          name: ROUTE_NAMES.ORDERS,
          component: () => OrderPage,
        },

        {
          path: 'product-variants',
          name: ROUTE_NAMES.PRODUCT_VARIANTS,
          component: () => ProductVariantPage,
        },

        {
          path: 'product-variant-items',
          name: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS,
          component: () => ProductVariantItemPage,
        },

        // Not Found
        {
          path: '404',
          name: ROUTE_NAMES.NOT_FOUND,
          component: SystemNotFoundPage,
        },
        {
          path: ':pathMatch(.*)*',
          component: () => NotFoundPage,
        },
      ],
    },
    {
      path: '/admin/categories/:slug',
      name: ROUTE_NAMES.CATEGORY_DETAIL,
      component: () => CategoryDetail,
    },

    {
      path: '/admin/brands/:slug',
      name: ROUTE_NAMES.BRAND_DETAIL,
      component: () => BrandDetail,
    },

    {
      path: '/admin/product-lines/:slug',
      name: ROUTE_NAMES.PRODUCT_LINE_DETAIL,
      component: () => ProductLineDetail,
    },

    {
      path: '/admin/styles/:slug',
      name: ROUTE_NAMES.STYLE_DETAIL,
      component: () => StyleDetail,
    },

    {
      path: '/admin/collestions/:slug',
      name: ROUTE_NAMES.COLLECTION_DETAIL,
      component: () => CollectionDetail,
    },
    {
      path: '/admin/product-types/:slug',
      name: ROUTE_NAMES.PRODUCT_TYPE_DEAIL,
      component: () => ProductTypeDetail,
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
