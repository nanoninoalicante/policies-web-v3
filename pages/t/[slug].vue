<template>
    <main class="px-2 lg:px-48 xl:px-96">
        <div
            class="px-4 pt-8 pb-36 font-medium text-sm text-gray-700 dark:text-gray-300"
            v-html="body"
        ></div>
    </main>
</template>
<script setup lang="ts">
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { useRoute } from "vue-router";
const route = useRoute();
const slug: any = route.params?.slug || "";
const contentfulContentApiKey = import.meta.env.VITE_CONTENTFUL_CONTENT_API_KEY;

const darkMode = route.path.includes("/dark");

const entry = ref<any>(null);

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
    console.log(`response for id ${id}`, response.status);
    if (!response || !response.ok) {
        return null;
    }

    let entryResponse = null;
    try {
        entryResponse = await response.json();
        console.log(`entryResponse for ${slug}`, entryResponse);
    } catch (error) {
        console.log("error getting entry response: ", error);
    }
    if (!entryResponse || entryResponse.items.length === 0) {
        console.log("404");
        return null;
    }
    entry.value = entryResponse.items[0];

    return entryResponse.items[0];
};

const { data, pending, error, refresh } = await useAsyncData("entry", () =>
    getEntry(slug),
);

if (!data || !data.value || !data.value?.fields || !data.value?.fields?.body) {
    throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
}
useHead({
    title: `Policy - ${data?.value?.fields?.title}`,
    meta: [
        {
            name: "description",
            content: `Policy - ${data?.value?.fields?.title}`,
        },
    ],
});

const body = computed(() => {
    const options = {
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node: any, next: any) =>
                `<p class="py-2 mb-4">${next(node.content)}</p>`,
            [BLOCKS.HEADING_1]: (node: any, next: any) =>
                `<h1 class="text-2xl font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h1>`,

            [BLOCKS.HEADING_2]: (node: any, next: any) =>
                `<h2 class="text-xl font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h2>`,
            [BLOCKS.HEADING_3]: (node: any, next: any) =>
                `<h3 class="text-lg font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h3>`,
            [BLOCKS.HEADING_4]: (node: any, next: any) =>
                `<h4 class="text-md font-bold py-1 mb-4 mt-10">${next(
                    node.content,
                )}</h4>`,
            [INLINES.HYPERLINK]: (node: any, next: any) => {
                return `<a class="underline text-blue-500 hover:no-underline hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400" href="${
                    node.data?.uri
                }${darkMode ? "/dark" : ""}">${next(node.content)}</a>`;
            },
        },
    };
    return documentToHtmlString(data?.value?.fields?.body, options);
});
</script>
