import type { RouterConfig } from "@nuxt/schema";

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
    routes: (_routes) => [
        {
            name: "home",
            path: "/",
            component: () =>
                import("~/pages/index.vue").then((r) => r.default || r),
        },
        {
            name: "policy",
            path: "/t/:slug",
            component: () =>
                import("~/pages/t/[slug].vue").then((r) => r.default || r),
        },
        {
            name: "policy-darkmode",
            path: "/t/:slug/:mode",
            component: () =>
                import("~/pages/t/[slug].vue").then((r) => r.default || r),
        },
        {
            name: "404",
            path: "/404",
            component: () =>
                import("~/pages/404.vue").then((r) => r.default || r),
        },
    ],
};
