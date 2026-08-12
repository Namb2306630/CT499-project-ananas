<script setup>
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/constants/routes';

const router = useRouter()

const handleClick = () => {
    router.push({name: ROUTE_NAMES.HOME})
}

defineProps({
    size: {
        type: String,
        default: '220px'
    },
    direction: {
        type: String,
        default: 'row',
        validator: (value) => ['row', 'column'].includes(value)
    },
    sizeText: {
        type: String,
        default: '100px',
    },
    colorText: {
        type: String,
        default: 'white',
    },
    colorIcon: {
        type: String,
        default: 'white',
    },
    gap: {
        type: String,
        default: '0',
    }
})
</script>

<template>
    <div class="logo" :style="{ flexDirection: direction, gap: gap }" @click="handleClick">
        <i class="fa-brands fa-shopify" :style="{ fontSize: size, color: colorIcon }"></i>
        <p class="p-0 m-0 logo-text" :style="{ color: colorText, fontSize: sizeText }">Shin</p>
    </div>
</template>

<style scoped>
.logo {
    display: flex;
    align-items: center;
}
.logo:hover {
    cursor: pointer;
}

.fa-shopify {
    color: white;
    display: inline-block;
}

.logo-text {
    font-weight: 500;
}
</style>