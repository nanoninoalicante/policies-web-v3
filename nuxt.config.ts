// https://nuxt.com/docs/api/configuration/nuxt-config
const generateRoutes = async () => {
    let url =
        "https://cdn.contentful.com/spaces/app2ux3l8qni/environments/master/entries";

    let options = {
        method: "GET",
        headers: {
            Authorization: "Bearer O9rDrPc3MXh15k88xsxLhpcjN_Z_faLf14oF2FKzQV8",
        },
    };

    const response = await fetch(url, options)
        .then((res) => res.json())
        .catch((err) => {
            console.error("error:" + err);
            throw err;
        });

    return response.items.map((item: any) => {
        if (!item || !item?.fields?.slug) return null;
        return { slug: item?.fields?.slug, id: item?.sys?.id };
    });
};
export default defineNuxtConfig({
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    ssr: true,
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    nitro: {
        prerender: {
            routes: [],
        },
        future: {
            nativeSWR: true,
        },
    },
    hooks: {
        async "nitro:config"(config: any) {
            const entries = await generateRoutes();
            for (const entry of entries) {
                console.log("rerendering: " + entry?.slug);
                if (!entry || !entry.slug) {
                    console.log("no slug");
                    continue;
                }
                config.prerender.routes.push("/t/" + entry.slug);
            }
        },
    },
});
