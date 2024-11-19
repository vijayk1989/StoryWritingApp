import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { HiBookOpen, HiCog, HiChat, HiHome, HiX, HiChevronRight } from 'react-icons/hi';
import { create } from 'zustand';
import { s as supabase } from './supabase_CfcqD-_3.mjs';
import useSWR, { mutate } from 'swr';

const SideNav = ({ storyId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  const menuItems = [
    ...storyId ? [
      { name: "Chapters", icon: /* @__PURE__ */ jsx(HiBookOpen, { className: "w-5 h-5" }), path: `/story/${storyId}` },
      { name: "Lorebook", icon: /* @__PURE__ */ jsx(HiBookOpen, { className: "w-5 h-5" }), path: `/story/${storyId}/lorebook` },
      { name: "AI Settings", icon: /* @__PURE__ */ jsx(HiCog, { className: "w-5 h-5" }), path: `/story/${storyId}/settings` },
      { name: "Prompts", icon: /* @__PURE__ */ jsx(HiChat, { className: "w-5 h-5" }), path: `/story/${storyId}/prompts` },
      { name: "Chats", icon: /* @__PURE__ */ jsx(HiChat, { className: "w-5 h-5" }), path: `/story/${storyId}/chats` }
    ] : [],
    { name: "My Stories", icon: /* @__PURE__ */ jsx(HiHome, { className: "w-5 h-5" }), path: "/" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("nav", { className: `
        fixed top-0 left-0 h-screen bg-white z-[50]
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:w-[20%] lg:sticky lg:z-30
        w-[280px] ${isOpen ? "translate-x-0" : "-translate-x-full"}
        border-r border-gray-200
      `, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center p-4 border-b border-gray-100", children: /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "Story Writer" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto py-4", children: menuItems.map((item) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.path,
          className: `
                  w-full flex items-center gap-3 px-4 py-3 transition-colors
                  ${currentPath === item.path ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}
                `,
          children: [
            /* @__PURE__ */ jsx("span", { className: "w-6 text-lg", children: item.icon }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: item.name })
          ]
        },
        item.name
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: `
          lg:hidden fixed z-[60] text-gray-700
          ${isOpen ? "top-[12px] left-[240px]" : "top-[12px] left-[16px]"}
          transition-all duration-200 ease-in-out
        `,
        children: isOpen ? /* @__PURE__ */ jsx(HiX, { size: 24 }) : /* @__PURE__ */ jsx(HiChevronRight, { size: 24 })
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[40]",
        onClick: () => setIsOpen(false)
      }
    )
  ] });
};

class IndexedDBStore {
  dbName;
  version;
  constructor(dbName, version = 1) {
    this.dbName = dbName;
    this.version = version;
  }
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("lorebookItems")) {
          db.createObjectStore("lorebookItems");
        }
      };
    });
  }
  async getItems(storyId) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lorebookItems", "readonly");
      const store = transaction.objectStore("lorebookItems");
      const request = store.get(storyId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
      transaction.oncomplete = () => db.close();
    });
  }
  async setItems(storyId, items) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lorebookItems", "readwrite");
      const store = transaction.objectStore("lorebookItems");
      const request = store.put(items, storyId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      transaction.oncomplete = () => db.close();
    });
  }
  async clearItems(storyId) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lorebookItems", "readwrite");
      const store = transaction.objectStore("lorebookItems");
      const request = store.delete(storyId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      transaction.oncomplete = () => db.close();
    });
  }
  async clearAll() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lorebookItems", "readwrite");
      const store = transaction.objectStore("lorebookItems");
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      transaction.oncomplete = () => db.close();
    });
  }
}
const lorebookDB = new IndexedDBStore("lorebook-store");

const fetchLorebookItems = async (lorebookId) => {
  const { data, error } = await supabase.from("lorebook_items").select("*").eq("lorebook_id", lorebookId).order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};
const simplifyLorebookItem = (item) => {
  const {
    name,
    tags,
    classification,
    lore_type,
    description
  } = item;
  return {
    name,
    tags,
    classification,
    lore_type,
    description
  };
};
const createTagMap = (items) => {
  const tagMap = {};
  items.forEach((item) => {
    const simplifiedItem = simplifyLorebookItem(item);
    const normalizedName = item.name.toLowerCase().trim();
    tagMap[normalizedName] = simplifiedItem;
    if (item.tags) {
      let tagsArray = [];
      if (typeof item.tags === "string") {
        tagsArray = item.tags.split(",").map((tag) => tag.trim());
      } else if (Array.isArray(item.tags)) {
        tagsArray = item.tags;
      }
      tagsArray.forEach((tag) => {
        const normalizedTag = tag.toLowerCase().trim();
        tagMap[normalizedTag] = simplifiedItem;
      });
    }
  });
  return tagMap;
};
const useLorebookStore = create((set, get) => ({
  currentStoryId: null,
  lorebookItems: [],
  lorebookItemsByTag: {},
  isCreating: false,
  error: null,
  setCurrentStory: async (storyId) => {
    if (storyId !== get().currentStoryId) {
      set({
        lorebookItems: [],
        lorebookItemsByTag: {}
      });
      if (storyId) {
        try {
          const cachedItems = await lorebookDB.getItems(storyId);
          if (cachedItems?.length > 0) {
            set({
              currentStoryId: storyId,
              lorebookItems: cachedItems,
              lorebookItemsByTag: createTagMap(cachedItems)
            });
            return;
          }
        } catch (error) {
          console.error("Error loading from IndexedDB:", error);
        }
      } else {
        try {
          await lorebookDB.clearAll();
        } catch (error) {
          console.error("Error clearing IndexedDB:", error);
        }
      }
      set({ currentStoryId: storyId });
    }
  },
  setLorebookItems: async (items) => {
    set({
      lorebookItems: items,
      lorebookItemsByTag: createTagMap(items)
    });
    const storyId = get().currentStoryId;
    if (storyId) {
      try {
        await lorebookDB.setItems(storyId, items);
      } catch (error) {
        console.error("Error caching to IndexedDB:", error);
      }
    }
  },
  createLorebookItem: async (itemData) => {
    set({ isCreating: true });
    try {
      const { data, error } = await supabase.from("lorebook_items").insert([itemData]).select().single();
      if (error) throw error;
      const newItems = [...get().lorebookItems, data];
      set({
        lorebookItems: newItems,
        lorebookItemsByTag: createTagMap(newItems)
      });
      const storyId = get().currentStoryId;
      if (storyId) {
        await lorebookDB.setItems(storyId, newItems);
      }
      await mutate(`lorebook-items/${itemData.lorebook_id}`);
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },
  updateLorebookItem: async (id, itemData) => {
    try {
      const { data, error } = await supabase.from("lorebook_items").update(itemData).eq("id", id).select().single();
      if (error) throw error;
      const updatedItems = get().lorebookItems.map(
        (item) => item.id === id ? { ...item, ...data } : item
      );
      set({
        lorebookItems: updatedItems,
        lorebookItemsByTag: createTagMap(updatedItems)
      });
      const storyId = get().currentStoryId;
      if (storyId) {
        await lorebookDB.setItems(storyId, updatedItems);
      }
      await mutate(`lorebook-items/${itemData.lorebook_id}`);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  deleteLorebookItem: async (id, lorebookId) => {
    try {
      const { error } = await supabase.from("lorebook_items").delete().eq("id", id);
      if (error) throw error;
      const updatedItems = get().lorebookItems.filter((item) => item.id !== id);
      set({
        lorebookItems: updatedItems,
        lorebookItemsByTag: createTagMap(updatedItems)
      });
      const storyId = get().currentStoryId;
      if (storyId) {
        await lorebookDB.setItems(storyId, updatedItems);
      }
      await mutate(`lorebook-items/${lorebookId}`);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  // Helper function to find item by tag (case-insensitive)
  findItemByTag: (tag) => {
    const normalizedTag = tag.toLowerCase().trim();
    return get().lorebookItemsByTag[normalizedTag];
  }
}));
const useLorebookItems = (lorebookId) => {
  const { currentStoryId, lorebookItems, setLorebookItems } = useLorebookStore();
  return useSWR(
    lorebookId ? `lorebook-items/${lorebookId}` : null,
    async () => {
      if (lorebookItems.length > 0 && currentStoryId) {
        return lorebookItems;
      }
      if (currentStoryId) {
        try {
          const cachedItems = await lorebookDB.getItems(currentStoryId);
          if (cachedItems?.length > 0) {
            setLorebookItems(cachedItems);
            return cachedItems;
          }
        } catch (error) {
          console.error("Error loading from IndexedDB:", error);
        }
      }
      if (lorebookId) {
        const items = await fetchLorebookItems(lorebookId);
        setLorebookItems(items);
        return items;
      }
      return [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );
};

const StoryContext = ({ storyId }) => {
  const { setCurrentStory } = useLorebookStore();
  const { data: lorebook } = useSWR(
    storyId ? `lorebook/${storyId}` : null,
    async () => {
      const { data } = await supabase.from("lorebooks").select("id").eq("story_id", storyId).single();
      return data;
    }
  );
  useLorebookItems(lorebook?.id);
  useEffect(() => {
    setCurrentStory(storyId);
    return () => {
      setCurrentStory(null);
    };
  }, [storyId]);
  return null;
};

export { StoryContext as S, SideNav as a };
