import { c as createComponent, a as createAstro, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_RNrNsWmD.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BkDS7zkQ.mjs';
import { s as supabase } from '../chunks/supabase_CfcqD-_3.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { create } from 'zustand';
import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';
import { RiDeleteBinLine } from 'react-icons/ri';
import { T as Toaster } from '../chunks/Toaster_CiSV0ino.mjs';
import { S as SWRProvider } from '../chunks/SWRProvider_RwdudDdH.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const useStoryStore = create((set) => ({
  isCreating: false,
  error: null,
  createStory: async (title) => {
    set({ isCreating: true });
    try {
      const formData = new FormData();
      formData.append("title", title);
      const response = await fetch("/api/stories/create", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create story");
      }
      await mutate("/api/stories");
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  deleteStory: async (id) => {
    try {
      const response = await fetch(`/api/stories/${id}/delete`, {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("Failed to delete story");
      }
      await mutate("/api/stories");
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

function CreateStoryForm() {
  const [title, setTitle] = useState("");
  const { createStory, isCreating } = useStoryStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStory(title);
      setTitle("");
      toast.success("Story created successfully!");
    } catch (error) {
      toast.error("Failed to create story");
      console.error("Error creating story:", error);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-4 items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        name: "title",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "Enter story title...",
        required: true,
        className: "w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      }
    ) }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        disabled: isCreating,
        className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsx("span", { children: isCreating ? "Creating..." : "Create Story" }),
          isCreating && /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
          ] })
        ]
      }
    )
  ] });
}

const fetcher = (url) => fetch(url).then((res) => res.json());
function StoriesList() {
  const { data: stories, error, isLoading } = useSWR(
    "/api/stories",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5e3,
      keepPreviousData: true
    }
  );
  const { deleteStory } = useStoryStore();
  const handleDelete = async (id) => {
    try {
      await deleteStory(id);
      toast.success("Story deleted successfully!");
    } catch (error2) {
      toast.error("Failed to delete story");
      console.error("Error deleting story:", error2);
    }
  };
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-red-500", children: "Error loading stories" }) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-8 w-8 text-blue-600 mx-auto", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
      /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid gap-6", children: !stories?.length ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
    /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "You haven't created any stories yet." }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Enter a title above to create your first story!" })
  ] }) : stories.map((story) => /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/story/${story.id}`,
        className: "block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200",
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: story.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-sm mt-4", children: [
            "Created ",
            new Date(story.created_at).toLocaleDateString()
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => handleDelete(story.id),
        className: "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100",
        title: "Delete story",
        children: /* @__PURE__ */ jsx(RiDeleteBinLine, { className: "w-5 h-5" })
      }
    )
  ] }, story.id)) });
}

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen p-8"> <header class="max-w-4xl mx-auto"> <div class="flex justify-between items-center"> <h1 class="text-2xl font-bold">The Story Nexus</h1> <form action="/api/auth/signout" method="POST"> <button type="submit" class="text-sm text-gray-600 hover:text-gray-900">
Sign Out
</button> </form> </div> </header> <main class="max-w-4xl mx-auto mt-8"> ${renderComponent($$result2, "SWRProvider", SWRProvider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/SWRProvider", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CreateStoryForm", CreateStoryForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/CreateStoryForm", "client:component-export": "default" })} <h2 class="text-xl font-semibold mb-6 mt-8">Your Stories</h2> ${renderComponent($$result3, "StoriesList", StoriesList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/StoriesList", "client:component-export": "default" })} ` })} </main> </div> ${renderComponent($$result2, "Toaster", Toaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/Toaster", "client:component-export": "default" })} ` })}`;
}, "/home/vijaykumar/projects/story-writing-app/src/pages/index.astro", void 0);

const $$file = "/home/vijaykumar/projects/story-writing-app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
