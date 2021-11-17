import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-netlify";

const config = {
    preprocess: preprocess(),

    kit: {
        adapter: adapter(),
        target: "#svelte",
        vite: {
            define: { "process.env": process.env },
        },
    },
};

export default config;
