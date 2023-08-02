<template>
    <div><NuxtPage /></div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const mode = route.params?.mode || "light";
useHead({
    htmlAttrs: {
        class: computed(() => {
            return mode;
        }),
    },
    bodyAttrs: {
        class: computed(() => {
            return "dark:bg-black";
        }),
    },
});
</script>
