import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes.js'
import { ROLE } from '@/utils/role'
//layout
import AuthLayout from '@/layouts/AuthLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

//user
// import AboutView from '@/views/user/AboutView.vue'
// import HomeView from '../views/user/HomeView.vue'
// import HelpView from '@/views/user/HelpView.vue'

//admin

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
import ProductVariantDetail from '@/views/admin/product-variant/ProductVariantDetail.vue'
import CollectionDetail from '@/views/admin/collection/CollectionDetail.vue'
import ProductVariantItemDetail from '@/views/admin/product-variant-item/ProductVariantItemDetail.vue'

//notfound
import NotFoundPage from '@/components/common/NotFoundPage.vue'

//
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   }

  //   return {
  //     top: 0,
  //   }
  // },
  routes: [
    //--------------------------------------------------------------------------
    //public
    {
      path: '/',
      component: UserLayout,
      children: [
        {
          path: '',
          name: ROUTE_NAMES.HOME,
          component: () => import('@/views/user/public/HomeView.vue'),
        },
        {
          path: 'disccover-you',
          name: ROUTE_NAMES.DISCOVER_YOU,
          component: () => import('@/views/user/public/DiscoverYOUView.vue'),
        },
        {
          path: 'about',
          name: ROUTE_NAMES.ABOUT,
          component: () => import('@/views/user/public/AboutView.vue'),
        },

        {
          path: 'product-lists',
          name: ROUTE_NAMES.PRODUCT_LISTS,
          component: () => import('@/views/user/public/ProductList.vue'),
        },

        {
          path: 'product-detail/:id',
          name: ROUTE_NAMES.PRODUCT_VIEW,
          component: () => import('@/views/user/public/ProductDetail.vue'),
        },
        // Not Found
        {
          path: ':pathMatch(.*)*',
          component: () => NotFoundPage,
        },
      ],
    },
    //--------------------------------------------------------------------------
    //user -> auth
    {
      path: '/',
      component: UserLayout,
      meta: {
        requiresAuth: true,
        role: [ROLE.USER],
      },
      children: [
        {
          path: 'you-cart',
          name: ROUTE_NAMES.YOU_CART,
          component: () => import('@/views/user/private/YouCart.vue'),
        },
        {
          path: 'shipping-infomation',
          name: ROUTE_NAMES.SHIPPING,
          component: () => import('@/views/user/private/ShippingInfomation.vue'),
        },
        {
          path: '/order-success',
          name: ROUTE_NAMES.ORDER_SUCCESS,
          component: () => import('@/views/user/private/OrderSuccessView.vue'),
        },
        {
          path: '/orders',
          name: ROUTE_NAMES.MY_ORDERS,
          component: () => import('@/views/user/private/OrderPage.vue'),
        },
        {
          path: '/my-order-detail',
          name: ROUTE_NAMES.MY_ORDER_DETAIL,
          component: () => import('@/views/user/private/OrderDetail.vue'),
        },
      ],
    },
    //--------------------------------------------------------------------------
    // auth
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: ROUTE_NAMES.LOGIN,
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: '/register',
          name: ROUTE_NAMES.REGISTER,
          component: () => import('@/views/auth/RegisterView.vue'),
        },
        {
          path: '/forgot-password',
          name: ROUTE_NAMES.FORGOT_PASSWORD,
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
        },
      ],
    },

    //--------------------------------------------------------------------------
    //help
    {
      path: '/help',
      name: ROUTE_NAMES.HELP,
      component: () => import('@/views/user/public/HelpView.vue'),
    },
    //--------------------------------------------------------------------------
    //admin
    {
      path: '/admin',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        role: [ROLE.ADMIN, ROLE.SUPER_ADMIN],
      },
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
          component: () => import('@/views/order/OrderView.vue'),
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

        {
          path: 'orders',
          name: ROUTE_NAMES.ORDERS,
          component: () => import('@/views/admin/order/OrderPage.vue'),
        },

        //--------------------------------------------------------------------------
        // detail
        {
          path: 'categories/:slug',
          name: ROUTE_NAMES.CATEGORY_DETAIL,
          component: CategoryDetail,
          meta: {
            activeMenu: ROUTE_NAMES.CATEGORIES,
          },
        },

        {
          path: 'brands/:slug',
          name: ROUTE_NAMES.BRAND_DETAIL,
          component: BrandDetail,
          meta: {
            activeMenu: ROUTE_NAMES.BRANDS,
          },
        },

        {
          path: 'product-lines/:slug',
          name: ROUTE_NAMES.PRODUCT_LINE_DETAIL,
          component: ProductLineDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCT_LINES,
          },
        },

        {
          path: 'styles/:slug',
          name: ROUTE_NAMES.STYLE_DETAIL,
          component: StyleDetail,
          meta: {
            activeMenu: ROUTE_NAMES.STYLES,
          },
        },

        {
          path: 'collections/:slug',
          name: ROUTE_NAMES.COLLECTION_DETAIL,
          component: CollectionDetail,
          meta: {
            activeMenu: ROUTE_NAMES.COLLECTIONS,
          },
        },
        {
          path: 'product-types/:slug',
          name: ROUTE_NAMES.PRODUCT_TYPE_DEAIL,
          component: ProductTypeDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCT_TYPES,
          },
        },
        {
          path: 'products/:slug',
          name: ROUTE_NAMES.PRODUCT_DETAIL,
          component: ProductDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCTS,
          },
        },

        {
          path: 'product-variants/:id',
          name: ROUTE_NAMES.PRODUCT_VARIANT_DETAIL,
          component: ProductVariantDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCT_VARIANTS,
          },
        },

        {
          path: 'product-variant-items/:sku',
          name: ROUTE_NAMES.PRODUCT_VARIANT_ITEM_DETAIL,
          component: ProductVariantItemDetail,
          meta: {
            activeMenu: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS,
          },
        },
        // Not Found
        {
          path: '404',
          name: ROUTE_NAMES.NOT_FOUND,
          component: () => import('@/views/admin/system/NotFoundPage.vue'),
        },
        {
          path: ':pathMatch(.*)*',
          component: () => NotFoundPage,
        },
      ],
    },
  ],
})
//kiểm tra trước
//to chính là route mà người dùng đang muốn đi tới
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  const isAuthPage = [
    ROUTE_NAMES.LOGIN,
    ROUTE_NAMES.REGISTER,
    ROUTE_NAMES.FORGOT_PASSWORD,
  ].includes(to.name)

  if (isAuthPage) {
    if (!authStore.user) {
      try {
        await authStore.getMe()
      } catch {
        return true
      }
    }

    if (authStore.user) {
      return {
        name: ROUTE_NAMES.HOME,
      }
    }

    return true
  }

  if (to.meta.requiresAuth) {
    if (!authStore.user) {
      try {
        await authStore.getMe()
      } catch {
        return {
          name: ROUTE_NAMES.LOGIN,
        }
      }
    }

    if (!authStore.user) {
      return {
        name: ROUTE_NAMES.LOGIN,
      }
    }

    const allowedRoles = to.meta.role

    if (allowedRoles && !allowedRoles.includes(authStore.user.role)) {
      return {
        name: ROUTE_NAMES.HOME,
      }
    }
  }

  return true
})

export default router
