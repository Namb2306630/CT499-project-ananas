<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes'
import { useProductVariant } from '@/stores/product-variant'
import AppLoading from '@/components/common/LoadingState.vue'
import { formatFreeShip } from '@/utils/formatCurrency'

const BASE_URL = import.meta.env.VITE_BACKEND
const router = useRouter()
const route = useRoute()
const productVariantStore = useProductVariant()
const { error, loading, productVariants } = storeToRefs(productVariantStore)
const Banner = '/banners/Desktop_Homepage_Banner.jpg'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const pageLoading = ref(true)

onMounted(async () => {
  productVariantStore.clearError()

  try {
    await Promise.all([productVariantStore.fetchForUser(), delay(200)])
  } finally {
    pageLoading.value = false
  }
})
</script>

<template>
  <div class="product-box">
    <img :src="Banner" alt="banner" />
    <div>
      <AppLoading v-if="pageLoading" />
      <div v-else class="product-list">
        <div v-if="error.general" class="error">
          {{ error.errors?.[0] || error.general || 'Có lỗi xảy ra' }}
        </div>
        <div v-else>
          <div v-if="productVariants.length === 0" class="text-center">
            Không có sản phẩm nào được tìm thấy
          </div>
          <div class="product-card">
            <div v-for="productVariant in productVariants" :key="productVariant._id">
              <RouterLink
                :to="{
                  name: ROUTE_NAMES.PRODUCT_VIEW,
                  params: {
                    id: productVariant._id,
                  },
                }"
                :class="{ 'disabled-link': productVariant.status === 'out_of_stock' }"
                @click="productVariant.status === 'out_of_stock' && $event.preventDefault()"
              >
                <div class="card">
                  <div class="card-image">
                    <img
                      :src="`${BASE_URL}/${productVariant.mainImage}`"
                      alt="Ảnh sản phẩm"
                      class="main-image"
                    />
                    <img
                      :src="`${BASE_URL}/${productVariant.hoverImage}`"
                      alt="Ảnh sản phẩm"
                      class="hover-image"
                    />

                    <div
                      v-if="productVariant.status === 'out_of_stock'"
                      class="out-of-stock-overlay"
                    >
                      HẾT HÀNG
                    </div>
                    <RouterLink
                      v-else
                      class="shopping"
                      :to="{
                        name: ROUTE_NAMES.PRODUCT_VIEW,
                        params: {
                          id: productVariant._id,
                        },
                      }"
                    >
                      MUA HÀNG
                    </RouterLink>

                    <button class="favorite-btn">
                      <i class="fa-regular fa-heart"></i>
                    </button>
                  </div>
                  <div class="card-body">
                    <div
                      v-if="
                        productVariant.product.isSale ||
                        productVariant.product.isBestSeller ||
                        productVariant.product.isNewArrival
                      "
                      class="product-badge"
                    >
                      <span v-if="productVariant.product.isSale" class="sale-off"> Sale off </span>

                      <span v-if="productVariant.product.isBestSeller" class="bestseller">
                        Best seller
                      </span>

                      <span v-if="productVariant.product.isNewArrival" class="new-arrival">
                        New arrival
                      </span>
                    </div>
                    <p class="card-title">{{ productVariant.product.name }}</p>

                    <div class="card-color">
                      <span>{{ productVariant.colorName }}</span>
                    </div>

                    <div
                      class="card-price"
                      :class="{
                        'has-discount-percent': productVariant.product.discountPercent > 0,
                      }"
                    >
                      <span class="selling-price">{{
                        formatFreeShip(productVariant.product.sellingPrice)
                      }}</span>
                      <span v-if="productVariant.product.discountPercent > 0" class="old-price">{{
                        formatFreeShip(productVariant.product.originalPrice)
                      }}</span>
                    </div>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  border: none;
}
.disabled-link {
  cursor: not-allowed;
}
.product-box {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.product-box img {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.product-list {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 20px 0;
}

.product-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.main-image {
  position: relative;
  z-index: 1;
}

.hover-image {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  transition: opacity 0s ease;
}

.card:hover .hover-image {
  opacity: 1;
}

a {
  text-decoration: none;
  color: var(--text-gray-4);
}

a:hover {
  text-decoration: none;
}

.favorite-btn {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  font-size: 20px;
}

.favorite-btn i {
  color: var(--color-23);
}

.card-title {
  color: black;
  font-weight: bold;
  padding: 0;
  margin: 0;
  font-size: 18px;
  text-align: center;
}

.card-color {
  font-size: 15px;
  text-align: center;
}
.card-price {
  display: flex;
  align-items: center;
  justify-content: center;
}

.has-discount-percent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selling-price {
  color: black;
  font-weight: bold;
  font-size: 17px;
  text-align: center;
}
.old-price {
  font-size: 17px;
  text-decoration: line-through;
}

.out-of-stock-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(64, 64, 64, 0.6);
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
}

.shopping {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) translateY(20px);
  z-index: 10;
  text-transform: uppercase;
  font-size: 20px;
  color: white;
  padding: 10px 20px;
  background-color: var(--color-23);
  border: none;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  font-weight: bold;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.card:hover .shopping {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.product-badge {
  text-align: center;
  color: var(--color-23);
  padding-bottom: 10px;
  border-bottom: 1.5px dashed var(--border-gray);
  margin-bottom: 5px;
}
.product-badge span:not(:last-child)::after {
  content: '-';
}
</style>
