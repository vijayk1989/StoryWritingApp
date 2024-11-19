import { c as createComponent, a as createAstro, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../../../../chunks/astro/server_RNrNsWmD.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../../chunks/Layout_BkDS7zkQ.mjs';
import { S as StoryContext, a as SideNav } from '../../../../chunks/StoryContext_B6yQZcFl.mjs';
import { s as supabase } from '../../../../chunks/supabase_CfcqD-_3.mjs';
import { T as Toaster } from '../../../../chunks/Toaster_CiSV0ino.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro();
const $$chapterId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$chapterId;
  const { storyId, chapterId } = Astro2.params;
  const { data: chapter } = await supabase.from("chapters").select("*, stories!inner(*)").eq("id", chapterId).eq("stories.id", storyId).single();
  if (!chapter) {
    return Astro2.redirect(`/story/${storyId}`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${chapter.stories.title} - ${chapter.title}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StoryContext", StoryContext, { "client:load": true, "storyId": storyId, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/StoryContext", "client:component-export": "StoryContext" })} ${maybeRenderHead()}<div class="flex min-h-screen"> ${renderComponent($$result2, "SideNav", SideNav, { "client:load": true, "storyId": storyId, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/SideNav", "client:component-export": "default" })} <main class="flex-1"> ${renderComponent($$result2, "Editor", null, { "client:only": "react", "chapterId": chapterId, "client:component-hydration": "only", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/Editor", "client:component-export": "default" })} </main> </div> ${renderComponent($$result2, "Toaster", Toaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/Toaster", "client:component-export": "default" })} ` })}`;
}, "/home/vijaykumar/projects/story-writing-app/src/pages/story/[storyId]/chapter/[chapterId].astro", void 0);

const $$file = "/home/vijaykumar/projects/story-writing-app/src/pages/story/[storyId]/chapter/[chapterId].astro";
const $$url = "/story/[storyId]/chapter/[chapterId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$chapterId,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
