<template>
    <div><NuxtPage /></div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const mode = route.params?.mode || "light";
const darkModeColorHex = "#1A1A1C";
const lightModeColorHex = "#fff";
const colorHex = mode === "dark" ? darkModeColorHex : lightModeColorHex;
useHead({
    htmlAttrs: {
        class: computed(() => {
            return `${mode} bg-[${colorHex}]`;
        }),
        style: computed(() => {
            return `background-color: ${colorHex};`;
        }),
    },
    bodyAttrs: {
        class: computed(() => {
            return `dark:bg-[#1A1A1C] bg-[${colorHex}]`;
        }),
    },
});
</script>
