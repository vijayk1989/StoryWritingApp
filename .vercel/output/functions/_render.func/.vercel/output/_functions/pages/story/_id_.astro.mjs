import { c as createComponent, a as createAstro, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_RNrNsWmD.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BkDS7zkQ.mjs';
import { S as StoryContext, a as SideNav } from '../../chunks/StoryContext_B6yQZcFl.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState } from 'react';
import { create } from 'zustand';
import { s as supabase } from '../../chunks/supabase_CfcqD-_3.mjs';
import useSWR, { mutate } from 'swr';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { HiPencilSquare, HiTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { T as Toaster } from '../../chunks/Toaster_CiSV0ino.mjs';
import { S as SWRProvider } from '../../chunks/SWRProvider_RwdudDdH.mjs';
export { renderers } from '../../renderers.mjs';

const fetchChapters = async (storyId) => {
  const { data, error } = await supabase.from("chapters").select("*").eq("story_id", storyId).order("chapter_number", { ascending: true });
  if (error) throw error;
  return data;
};
const useChapters = (storyId) => {
  return useSWR(
    storyId ? `chapters/${storyId}` : null,
    () => fetchChapters(storyId)
  );
};
const useChapterStore = create((set, get) => ({
  isCreating: false,
  isSaving: false,
  error: null,
  createChapter: async (chapterData) => {
    set({ isCreating: true });
    try {
      const { data: existingChapters, error: fetchError } = await supabase.from("chapters").select("chapter_number").eq("story_id", chapterData.story_id).order("chapter_number", { ascending: false }).limit(1);
      if (fetchError) throw fetchError;
      const nextChapterNumber = existingChapters && existingChapters.length > 0 ? existingChapters[0].chapter_number + 1 : 1;
      const { error } = await supabase.from("chapters").insert([{
        ...chapterData,
        chapter_number: nextChapterNumber
      }]);
      if (error) throw error;
      mutate(`chapters/${chapterData.story_id}`);
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  updateChapter: async (id, chapterData) => {
    try {
      const { error } = await supabase.from("chapters").update(chapterData).eq("id", id);
      if (error) throw error;
      const storyId = chapterData.story_id;
      mutate(`chapters/${storyId}`);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  deleteChapter: async (id, storyId) => {
    try {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;
      mutate(`chapters/${storyId}`);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

function ChaptersList({ storyId }) {
  const { data: chapters, error, isLoading } = useChapters(storyId);
  const { updateChapter, deleteChapter } = useChapterStore();
  const [editingSummary, setEditingSummary] = useState(null);
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const handleSaveSummary = async (chapterId, summary) => {
    try {
      await updateChapter(chapterId, { summary });
      setEditingSummary(null);
      toast.success("Summary updated");
    } catch (error2) {
      toast.error("Failed to update summary");
    }
  };
  const handleDelete = async (chapterId) => {
    try {
      await deleteChapter(chapterId, storyId);
      toast.success("Chapter deleted");
      setChapterToDelete(null);
    } catch (error2) {
      toast.error("Failed to delete chapter");
    }
  };
  const handleGenerateSummary = async (chapterId) => {
    toast.success("Summary generation coming soon!");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: "Loading chapters..." });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "text-red-500", children: [
      "Error: ",
      error
    ] });
  }
  if (chapters.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500", children: "No chapters yet. Create your first chapter above!" });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: chapters.map((chapter) => /* @__PURE__ */ jsxs(
      AccordionItem,
      {
        value: chapter.id,
        className: "bg-white rounded-lg shadow-sm border border-gray-200",
        children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { className: "px-6 hover:no-underline", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: chapter.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/story/${storyId}/chapter/${chapter.id}`,
                  className: "p-2 text-gray-500 hover:text-gray-700",
                  onClick: (e) => e.stopPropagation(),
                  children: /* @__PURE__ */ jsx(HiPencilSquare, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setChapterToDelete(chapter.id);
                  },
                  className: "p-2 mr-3 text-gray-500 hover:text-red-600 cursor-pointer",
                  children: /* @__PURE__ */ jsx(HiTrash, { className: "h-5 w-5" })
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(AccordionContent, { className: "px-6 pb-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: editingSummary ?? chapter.summary ?? "",
                onChange: (e) => setEditingSummary(e.target.value),
                placeholder: "Enter chapter summary...",
                className: "w-full min-h-[100px] p-3 rounded-md border border-gray-300 \n                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => handleGenerateSummary(chapter.id),
                  variant: "outline",
                  children: "Generate Summary"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => handleSaveSummary(chapter.id, editingSummary || ""),
                  disabled: editingSummary === chapter.summary,
                  children: "Save Summary"
                }
              )
            ] })
          ] }) })
        ]
      },
      chapter.id
    )) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!chapterToDelete, onOpenChange: () => setChapterToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "bg-white", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Are you sure?" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This action cannot be undone. This will permanently delete the chapter." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: () => chapterToDelete && handleDelete(chapterToDelete),
            className: "bg-red-600 hover:bg-red-700 text-white",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}

function CreateChapterForm({ storyId }) {
  const [title, setTitle] = useState("");
  const { createChapter, isCreating } = useChapterStore();
  const initialContent = [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Start writing your story here...", styles: {} }]
    }
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createChapter({
        title,
        story_id: storyId,
        chapter_data: { content: initialContent }
      });
      setTitle("");
      toast.success("Chapter created!");
    } catch (error) {
      toast.error("Failed to create chapter");
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-4 items-end mb-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "Enter chapter title",
        className: "w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        required: true
      }
    ) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        disabled: isCreating,
        className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap",
        children: isCreating ? "Creating..." : "Create Chapter"
      }
    )
  ] });
}

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const { data: story } = await supabase.from("stories").select("*").eq("id", id).single();
  if (!story) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": story.title }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StoryContext", StoryContext, { "client:load": true, "storyId": id, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/StoryContext", "client:component-export": "StoryContext" })} ${maybeRenderHead()}<div class="flex min-h-screen"> ${renderComponent($$result2, "SideNav", SideNav, { "client:load": true, "storyId": id, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/SideNav", "client:component-export": "default" })} <main class="flex-1 w-full"> <div class="w-[90%] sm:max-w-4xl mx-auto mt-12 lg:mt-0 lg:py-8 sm:px-4"> ${renderComponent($$result2, "SWRProvider", SWRProvider, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/SWRProvider", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` <div class="lg:pl-0"> <h1 class="text-2xl font-bold mb-8">${story.title}</h1> ${renderComponent($$result3, "CreateChapterForm", CreateChapterForm, { "client:load": true, "storyId": id, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/CreateChapterForm", "client:component-export": "default" })} <div class="mt-8"> <h2 class="text-xl font-semibold mb-6">Chapters</h2> ${renderComponent($$result3, "ChaptersList", ChaptersList, { "client:load": true, "storyId": id, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/ChaptersList", "client:component-export": "default" })} </div> </div> ` })} </div> </main> </div> ${renderComponent($$result2, "Toaster", Toaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/vijaykumar/projects/story-writing-app/src/components/Toaster", "client:component-export": "default" })} ` })}`;
}, "/home/vijaykumar/projects/story-writing-app/src/pages/story/[id].astro", void 0);

const $$file = "/home/vijaykumar/projects/story-writing-app/src/pages/story/[id].astro";
const $$url = "/story/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$id,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
