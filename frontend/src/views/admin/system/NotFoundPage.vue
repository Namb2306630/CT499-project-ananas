<script setup>
import { onMounted } from 'vue'
import AppAdminPageHeader from '@/components/admin/AppAdminPageHeader.vue'
import UploadImage from '@/components/admin/forms/UploadImage.vue'
import { useSystemConfigStore } from '@/stores/system-config'

const systemConfigStore = useSystemConfigStore()

onMounted(async () => {
  await systemConfigStore.get()
})

const uploadImage = async (file) => {
  await systemConfigStore.updateImage(file)

  // lấy lại dữ liệu mới sau khi upload
  await systemConfigStore.get()
}
</script>

<template>
  <div class="admin-container">
    <AppAdminPageHeader
      title="Cài Đặt Ảnh 404"
      description="Cấu hình hình ảnh hiển thị khi không tìm thấy trang."
      :show-button="false"
      :show-search="false"
      :show-filter="false"
      :show-sort="false"
    />

    <div class="mt-3 box-image">
      <UploadImage
        content-img="Chọn ảnh 404"
        :model-value="systemConfigStore.systemConfig?.notFoundImage"
        @change="uploadImage"
        :container-box="false"
        height="350px"
        width="600px"
        object-fit="contain"
        :show-b-g-image="false"
        :show-content-in-image="false"
        :show-icon-b-g="false"
      />
    </div>
  </div>
</template>

<style scoped>
.box-image {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 520px;

  border: 2px dashed var(--border-gray-3);
  border-radius: 16px;

  padding: 50px;

  background: var(--bg-gray-1);

  transition: 0.3s ease;
}

.box-image:hover {
  border-color: var(--bg-active);
}
</style>
