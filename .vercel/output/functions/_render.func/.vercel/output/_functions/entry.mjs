import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_ou6DFG0I.mjs';
import { manifest } from './manifest_D81ewZza.mjs';
import './_astro-internal_middleware.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/callback.astro.mjs');
const _page2 = () => import('./pages/api/auth/signin.astro.mjs');
const _page3 = () => import('./pages/api/auth/signout.astro.mjs');
const _page4 = () => import('./pages/api/stories/create.astro.mjs');
const _page5 = () => import('./pages/api/stories/_id_/delete.astro.mjs');
const _page6 = () => import('./pages/api/stories.astro.mjs');
const _page7 = () => import('./pages/signin.astro.mjs');
const _page8 = () => import('./pages/story/_storyid_/chapter/_chapterid_.astro.mjs');
const _page9 = () => import('./pages/story/_storyid_/lorebook.astro.mjs');
const _page10 = () => import('./pages/story/_id_.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/callback.ts", _page1],
    ["src/pages/api/auth/signin.ts", _page2],
    ["src/pages/api/auth/signout.ts", _page3],
    ["src/pages/api/stories/create.ts", _page4],
    ["src/pages/api/stories/[id]/delete.ts", _page5],
    ["src/pages/api/stories/index.ts", _page6],
    ["src/pages/signin.astro", _page7],
    ["src/pages/story/[storyId]/chapter/[chapterId].astro", _page8],
    ["src/pages/story/[storyId]/lorebook.astro", _page9],
    ["src/pages/story/[id].astro", _page10],
    ["src/pages/index.astro", _page11]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "866ee19c-182a-4080-bf4b-552f377b2173",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
