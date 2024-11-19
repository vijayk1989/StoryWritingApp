import { c as createComponent, a as createAstro, r as renderTemplate, b as addAttribute, d as renderHead, e as renderSlot } from './astro/server_RNrNsWmD.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Writing application"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-gray-50 sm:bg-white md:bg-gray-50"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/home/vijaykumar/projects/story-writing-app/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
