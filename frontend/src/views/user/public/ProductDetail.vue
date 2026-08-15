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
    
  </div>
</template>
<style scoped>

</style>
