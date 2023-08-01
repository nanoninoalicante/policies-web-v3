<template>
    <main class="px-2 lg:px-48 xl:px-96">
        <div
            class="px-4 pt-12 pb-36 font-medium text-sm text-gray-700 dark:text-gray-50"
            v-html="body"
        ></div>
    </main>
</template>
<script setup lang="ts">
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { useRoute } from "vue-router";
const route = useRoute();
const slug: any = route.params?.slug || "";
const contentfulContentApiKey = import.meta.env.VITE_CONTENTFUL_CONTENT_API_KEY;

const getEntry = async (id: string = "") => {
    let headersList = {
        Authorization: `Bearer ${contentfulContentApiKey}`,
    };

    let response = await fetch(
        `https://cdn.contentful.com/spaces/app2ux3l8qni/environments/master/entries?fields.slug=${id}&content_type=policy&limit=1`,
        {
            method: "GET",
            headers: headersList,
        },
    );
    console.log("response: ", response.status);
    if (!response || !response.ok) {
        throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
    }
    const entry = await response.json();
    console.log(`entry for ${slug}`, entry);
    if (!entry || entry.items.length === 0) {
        console.log("404");
        throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
    }
    return entry.items[0];
};

const { data, pending, error, refresh } = await useAsyncData("entry", () =>
    getEntry(slug),
);

const body = computed(() => {
    const options = {
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node: any, next: any) =>
                `<p class="py-2 mb-4">${next(node.content)}</p>`,
            [BLOCKS.HEADING_1]: (node: any, next: any) =>
                `<h1 class="text-xl font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h1>`,

            [BLOCKS.HEADING_2]: (node: any, next: any) =>
                `<h1 class="text-lg font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h1>`,
            [BLOCKS.HEADING_3]: (node: any, next: any) =>
                `<h1 class="text-lg font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h1>`,
            [BLOCKS.HEADING_4]: (node: any, next: any) =>
                `<h1 class="text-lg font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h1>`,
        },
    };
    return documentToHtmlString(data?.value?.fields?.body, options);
});
</script>
