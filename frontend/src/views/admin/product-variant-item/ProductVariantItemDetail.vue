<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useProductVariItem } from '@/stores/product-variant-item';
import { useProductVariant } from '@/stores/product-variant';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { ROUTE_NAMES } from '@/constants/routes'
import { useDelete } from '@/composables/useDelete';
import { useToastStore } from '@/stores/toast'
import DetailLayout from '@/components/admin/detail/DetailLayout.vue';
import DetailActions from '@/components/admin/detail/DetailActions.vue';
import DetailStats from '@/components/admin/detail/DetailStats.vue';
import DetailStatus from '@/components/admin/detail/DetailStatus.vue';
import HeaderDetail from '@/components/admin/detail/HeaderDetail.vue';

const productVariantStore = useProductVariant()
const productVariantItemStore = useProductVariItem()
const toastStore = useToastStore()
const { showConfirm, deleteItem, openDelete, closeDelete } = useDelete()
const { loading, error } = storeToRefs(productVariantItemStore)
const { productVariantOptions } = storeToRefs(productVariantStore)

const route = useRoute()
const router = useRouter()
const productVariantItem = ref({
    _id: '',
    variant: '',
    size: '',
    sku: '',
    stock: '',
    status: ''
})

onMounted(async () => {
    try {
        const sku = route.params.sku

        const data = await productVariantItemStore.getBySku(sku)
        await productVariantStore.fetchOptions()
        Object.assign(productVariantItem.value, data)
    } catch (error) {
        toastStore.showToast(error.general, 'error')
        router.replace({ name: ROUTE_NAMES.PRODUCT_VARIANT_ITEMS })
    }
})
const errors = computed(() => error.value.errors)

const cancelDelete = () => {
    closeDelete()
    toastStore.showToast('Đã hủy thay đổi', 'warning')
}
const confirmDelete = async () => {
    if (!deleteItem.value) return

    const res = await productVariantItemStore.delete(deleteItem.value._id)

    if (res?.code === 200) {
        productVariantItemStore.clearError()
        toastStore.showToast(res.message, 'success')

        setTimeout(() => {
            router.back()
        }, 500)
    } else {
        const message =
            Object.values(productVariantStore.error.errors)[0] ||
            productVariantStore.error.general ||
            'Xóa SKU sản phẩm thất bại!'

        toastStore.showToast(message, 'error')
    }
    closeDelete()
}
const cancelEdit = () => {
    toastStore.showToast('Đã hủy thay đổi', 'warning')

    setTimeout(() => {
        router.back()
    }, 300)
}

const save = async () => {
    const res = await productVariantItemStore.update(productVariantItem.value._id, productVariantItem.value)
    if (res?.code === 200) {
        errors.value = {}
        productVariantItemStore.clearError()
        toastStore.showToast(res.message, 'success')
        setTimeout(() => {
            router.back()
        }, 500)
    } else {
        const message =
            Object.values(productVariantStore.error.errors)[0] ||
            productVariantStore.error.general ||
            'Lỗi, không thể câp nhật dữ liệu biến thể sản phẩm!!!'

        toastStore.showToast(message, 'error')
    }
}
</script>
<template>
    <div v-if="!loading" class="container-detail">
        <HeaderDetail title-go-back="Chi tiết SKU sản phẩm" title-delete="Xóa SKU"
            @delete="openDelete(productVariantItem)" />

        <div class="detail-grid">
            <DetailLayout title="Thông tin cơ bản của SKU">
                <div class="top-info">
                    <div class="form">

                        <!-- mã biến thể  -->
                        <label for="productVariant">Mã biến thể sản phẩm</label>
                        <select name="productVariant" id="productVariant" v-model="productVariantItem.variant">
                            <option v-for="item in productVariantOptions" :value="item._id" :key="item._id">{{ item._id }}</option>
                        </select>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
            </DetailLayout>
        </div>
    </div>
</template>

<style scoped>
@import '../../../assets/css/detail-form.css';
@import '../../../assets/css/swtich.css';
</style>