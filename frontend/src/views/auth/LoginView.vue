<script setup>
import AuthFormLayout from '@/components/auth/AuthFormLayout.vue'
</script>

<template>
    <AuthFormLayout title="Đăng nhập">

        <form class="login-form">
            <h2>Đăng nhập</h2>

            <input type="email" placeholder="Email" id="email" />

            <input type="password" placeholder="Mật khẩu" id="password" />

            <button type="submit">
                Đăng nhập
            </button>
        </form>

    </AuthFormLayout>
</template>
<style scoped></style>