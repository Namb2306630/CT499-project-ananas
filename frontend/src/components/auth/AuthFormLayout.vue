<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
import Logo from '@/assets/images/ananas_logo.svg'
import LogoApp from '../common/LogoApp.vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <div class="auth-layout">
        <div class="auth-header">
            <div class="auth-logo">
                <!-- <Logo /> -->
                <LogoApp color-icon="var(--color-23)" color-text="var(--color-23)" size-text="25px" size="30px" />
                <p>{{ title }}</p>
            </div>

            <div class="auth-help">
                <RouterLink :to="{ name: ROUTE_NAMES.HELP }">
                    Bạn cần giúp đỡ?
                </RouterLink>
            </div>
        </div>
        <div class="auth-body">
            <div class="auth-body-inner">

                <div class="body-left">
                    <!-- <i class="fa-brands fa-shopify"></i>
                    <Logo /> -->
                    <LogoApp direction="column" />
                    <p class="p-0 m-0">
                        Nền tảng thương mại bán giày dép và phụ kiện thời trang
                    </p>
                </div>

                <!-- PHẦN RIÊNG CỦA LOGIN / REGISTER -->
                <div class="body-right">
                    <slot />
                </div>

            </div>
        </div>
    </div>
</template>
<style scoped>
.auth-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30px 10px;
    max-width: var(--max-width);
    margin: auto;
    align-items: center;
}

.auth-logo :deep(svg) {
    width: 120px
}

.auth-logo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 15px;
}

.auth-logo p {
    color: black;
    font-weight: 500;
    font-size: 25px;
    padding: 0 0 0 10px;
    margin: 0;
    border-left: 5px solid var(--color-23);
}

.auth-header a {
    color: var(--color-23)
}

.auth-body {
    background-color: var(--color-23);
}

.auth-body-inner {
    max-width: var(--max-width);
    height: 650px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 60px 20px;
}

.body-right {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.body-left :deep(svg) {
    width: 200px;
    height: auto;

}

.body-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.body-logo {
    width: 120px;
    margin-bottom: 20px;
}

.body-left p {
    max-width: 350px;
    font-size: 24px;
    line-height: 1.5;
    color: white;
    font-weight: bolder;
    margin-top: 45px;
}


@media (max-width: 661px) {
    .body-left {
        display: none;
    }

    .body-right {
        width: 100%;
    }

    .auth-body-inner {
        width: 100%;
        max-width: none;
        margin: 0 auto;
        padding: 40px 20px;
        box-sizing: border-box;
    }
}
</style>