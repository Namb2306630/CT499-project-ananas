import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue'
//user
import UserLayout from '@/layouts/UserLayout.vue'
import AboutView from '@/views/user/AboutView.vue'

import { ROUTE_NAMES } from '@/constants/routes.js'

//admin
import AdminLayout from '@/layouts/AdminLayout.vue'
// import DashBoardPage from '@/views/admin/DashBoardPage.vue'
// import CategoryPage from '@/views/admin/category/CategoryPage.vue'
// import CollectionPage from '@/views/admin/collection/CollectionPage.vue'
// import SystemConfigPage from '@/views/admin/system/SystemConfigPage.vue'
// import StylePage from '@/views/admin/style/StylePage.vue'
// import OrderPage from '@/views/order/OrderPage.vue'
// import ProductLinePage from '@/views/admin/product/ProductLinePage.vue'
// import ProductPage from '@/views/admin/product/ProductPage.vue'
// import UserPage from '@/views/admin/user/UserPage.vue'
// import BrandPage from '@/views/admin/brand/BrandPage.vue'
// import ProductVariantPage from '@/views/admin/product/ProductVariantPage.vue'
// import ProductTypePage from '@/views/admin/product-type/ProductTypePage.vue'
// import SystemNotFoundPage from '@/views/admin/system/NotFoundPage.vue'

//Detail
import CategoryDetail from '@/views/admin/category/CategoryDetail.vue'
import BrandDetail from '@/views/admin/brand/BrandDetail.vue'
import ProductLineDetail from '@/views/admin/product-line/ProductLineDetail.vue'
import StyleDetail from '@/views/admin/style/StyleDetail.vue'
import ProductTypeDetail from '@/views/admin/product-type/ProductTypeDetail.vue'
import ProductDetail from '@/views/admin/product/ProductDetail.vue'
import CollectionDetail from '@/views/admin/collection/CollectionDetail.vue'

//notfound
import NotFoundPage from '@/views/NotFoundPage.vue'

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
          component: () => import('@/views/admin/DashBoardPage.vue'),
        },
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => import('@/views/admin/DashBoardPage.vue'),
        },

        {
          path: 'categories',
          name: ROUTE_NAMES.CATEGORIES,
          component: () => import('@/views/admin/category/CategoryPage.vue'),
        },

        {
          path: 'users',
          name: ROUTE_NAMES.USERS,
          component: () => import('@/views/admin/user/UserPage.vue'),
        },

        {
          path: 'brands',
          name: ROUTE_NAMES.BRANDS,
          component: () => import('@/views/admin/brand/BrandPage.vue'),
        },

        {
          path: 'products',
          name: ROUTE_NAMES.PRODUCTS,
          component: () => import('@/views/admin/product/ProductPage.vue'),
        },

        {
          path: 'styles',
          name: ROUTE_NAMES.STYLES,
          component: () => import('@/views/admin/style/StylePage.vue'),
        },
        {
          path: 'product-types',
          name: ROUTE_NAMES.PRODUCT_TYPES,
          component: () => import('@/views/admin/product-type/ProductTypePage.vue'),
        },

        {
          path: 'system-config',
          name: ROUTE_NAMES.SYSTEM_CONFIG,
          component: () => import('@/views/admin/system/SystemConfigPage.vue'),
        },

        {
          path: 'collections',
          name: ROUTE_NAMES.COLLECTIONS,
          component: () => import('@/views/admin/collection/CollectionPage.vue'),
        },

        {
          path: 'product-lines',
          name: ROUTE_NAMES.PRODUCT_LINES,
          component: () => import('@/views/admin/product-line/ProductLinePage.vue'),
        },

        {
          path: 'orders',
          name: ROUTE_NAMES.ORDERS,
          component: () => import('@/views/order/OrderPage.vue'),
        },

        {
          path: 'product-variants',
          name: ROUTE_NAMES.PRODUCT_VARIANTS,
          component: () => import('@/views/admin/product-variant/ProductVariantPage.vue'),
        },

        {
          path: 'product-variant-items',
          name: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS,
          component: () => import('@/views/admin/product-variant-item/ProductVariantItemPage.vue'),
        },

        // Not Found
        {
          path: '404',
          name: ROUTE_NAMES.NOT_FOUND,
          component: import('@/views/admin/system/NotFoundPage.vue'),
        },
        {
          path: ':pathMatch(.*)*',
          component: () => NotFoundPage,
        },

        // detail
        {
          path: 'categories/:slug',
          name: ROUTE_NAMES.CATEGORY_DETAIL,
          component: () => CategoryDetail,
          meta: {
            activeMenu: ROUTE_NAMES.CATEGORIES,
          },
        },

        {
          path: 'brands/:slug',
          name: ROUTE_NAMES.BRAND_DETAIL,
          component: () => BrandDetail,
          meta: {
            activeMenu: ROUTE_NAMES.BRANDS,
          },
        },

        {
          path: 'product-lines/:slug',
          name: ROUTE_NAMES.PRODUCT_LINE_DETAIL,
          component: () => ProductLineDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCT_LINES,
          },
        },

        {
          path: 'styles/:slug',
          name: ROUTE_NAMES.STYLE_DETAIL,
          component: () => StyleDetail,
          meta: {
            activeMenu: ROUTE_NAMES.STYLES,
          },
        },

        {
          path: 'collections/:slug',
          name: ROUTE_NAMES.COLLECTION_DETAIL,
          component: () => CollectionDetail,
          meta: {
            activeMenu: ROUTE_NAMES.COLLECTIONS,
          },
        },
        {
          path: 'product-types/:slug',
          name: ROUTE_NAMES.PRODUCT_TYPE_DEAIL,
          component: () => ProductTypeDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCT_TYPES,
          },
        },
        {
          path: 'products/:slug',
          name: ROUTE_NAMES.PRODUCT_DETAIL,
          component: () => ProductDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCTS,
          },
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
