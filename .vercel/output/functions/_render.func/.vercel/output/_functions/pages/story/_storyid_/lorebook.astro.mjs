import { c as createComponent, a as createAstro, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../../../chunks/astro/server_RNrNsWmD.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../../chunks/Layout_BkDS7zkQ.mjs';
import { S as StoryContext, a as SideNav } from '../../../chunks/StoryContext_B6yQZcFl.mjs';
import { s as supabase } from '../../../chunks/supabase_CfcqD-_3.mjs';
import { S as SWRProvider } from '../../../chunks/SWRProvider_RwdudDdH.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Lorebook = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Lorebook;
  const { storyId } = Astro2.params;
  let { data: lorebook } = await supabase.from("lorebooks").select("*").eq("story_id", storyId).single();
  if (!lorebook) {
    const { data: story } = await supabase.from("stories").select("title").eq("id", storyId).single();
    const { data: newLorebook } = await supabase.from("lorebooks").insert([
      {
        story_id: storyId,
        name: `${story?.title || "Story"} Lorebook`
      }
    ]).select().single();
    if (newLorebook) {
      lorebook = newLorebook;
    }
  }
  if (!lorebook) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Lorebook" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StoryContext", StoryContext, { "client:load": true, "storyId": storyId, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/StoryContext", "client:component-export": "StoryContext" })} ${maybeRenderHead()}<div class="flex min-h-screen"> ${renderComponent($$result2, "SideNav", SideNav, { "client:load": true, "storyId": storyId, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/SideNav", "client:component-export": "default" })} <main class="flex-1 w-full lg:ml-[5%]"> <div class="w-[90%] sm:max-w-4xl mx-auto lg:py-8 sm:px-4"> ${renderComponent($$result2, "SWRProvider", SWRProvider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/SWRProvider", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` <div class="flex flex-col mt-8 lg:mt-0"> <div class="pl-12 lg:pl-0"> <h1 class="text-2xl font-bold mb-8">${lorebook.name}</h1> </div> ${renderComponent($$result3, "CreateLorebookItemForm", null, { "client:only": "react", "lorebookId": lorebook.id, "client:component-hydration": "only", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/CreateLorebookItemForm", "client:component-export": "default" })} ${renderComponent($$result3, "LorebookItemsList", null, { "client:only": "react", "lorebookId": lorebook.id, "client:component-hydration": "only", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/LorebookItemsList", "client:component-export": "default" })} </div> ` })} </div> </main> </div> ` })}`;
}, "/home/vijaykumar/projects/story-writing-app/src/pages/story/[storyId]/lorebook.astro", void 0);

const $$file = "/home/vijaykumar/projects/story-writing-app/src/pages/story/[storyId]/lorebook.astro";
const $$url = "/story/[storyId]/lorebook";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Lorebook,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
