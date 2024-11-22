import { AIModel } from "@/types/ai";

interface ChapterSummary {
    chapter_number: number;
    summary: string;
}

interface AISettings {
    openai_key?: string;
    mistral_key?: string;
    claude_key?: string;
    openrouter_key?: string;
    local_url?: string;
    preferred_vendor: 'OpenAI' | 'Mistral' | 'Claude' | 'OpenRouter' | 'Local';
}

interface VendorModels {
    openrouter?: AIModel[];
    local?: AIModel[];
    lastUpdated: number;
}

interface StorySettings {
    language: string;
    author: string;
}

interface DBSchema {
    lorebookItems: {
        key: string;
        value: any[];
    };
    chapterSummaries: {
        key: string;
        value: ChapterSummary[];
    };
    aiSettings: {
        key: string;
        value: AISettings;
    };
    vendorModels: {
        key: string;
        value: VendorModels;
    };
    storySettings: {
        key: string;
        value: StorySettings;
    };
}

export class IndexedDBStore {
    private dbName: string;
    private version: number;

    constructor(dbName: string, version: number = 1) {
        this.dbName = dbName;
        this.version = version;
    }

    private async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('lorebookItems')) {
                    db.createObjectStore('lorebookItems');
                }
                if (!db.objectStoreNames.contains('chapterSummaries')) {
                    db.createObjectStore('chapterSummaries');
                }
                if (!db.objectStoreNames.contains('aiSettings')) {
                    db.createObjectStore('aiSettings');
                }
                if (!db.objectStoreNames.contains('vendorModels')) {
                    db.createObjectStore('vendorModels');
                }
                if (!db.objectStoreNames.contains('storySettings')) {
                    db.createObjectStore('storySettings');
                }
            };
        });
    }

    async getItems(storyId: string): Promise<any[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('lorebookItems', 'readonly');
            const store = transaction.objectStore('lorebookItems');
            const request = store.get(storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);

            transaction.oncomplete = () => db.close();
        });
    }

    async setItems(storyId: string, items: any[]): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('lorebookItems', 'readwrite');
            const store = transaction.objectStore('lorebookItems');
            const request = store.put(items, storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async clearItems(storyId: string): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('lorebookItems', 'readwrite');
            const store = transaction.objectStore('lorebookItems');
            const request = store.delete(storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async clearAll(): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('lorebookItems', 'readwrite');
            const store = transaction.objectStore('lorebookItems');
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async getSummaries(storyId: string): Promise<ChapterSummary[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chapterSummaries', 'readonly');
            const store = transaction.objectStore('chapterSummaries');
            const request = store.get(storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);

            transaction.oncomplete = () => db.close();
        });
    }

    async setSummaries(storyId: string, summaries: ChapterSummary[]): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chapterSummaries', 'readwrite');
            const store = transaction.objectStore('chapterSummaries');
            const request = store.put(summaries, storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async clearSummaries(storyId: string): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('chapterSummaries', 'readwrite');
            const store = transaction.objectStore('chapterSummaries');
            const request = store.delete(storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async getAISettings(): Promise<AISettings | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('aiSettings', 'readonly');
            const store = transaction.objectStore('aiSettings');
            const request = store.get('settings');

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);

            transaction.oncomplete = () => db.close();
        });
    }

    async setAISettings(settings: AISettings): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('aiSettings', 'readwrite');
            const store = transaction.objectStore('aiSettings');
            const request = store.put(settings, 'settings');

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async getVendorModels(): Promise<VendorModels | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('vendorModels', 'readonly');
            const store = transaction.objectStore('vendorModels');
            const request = store.get('models');

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);

            transaction.oncomplete = () => db.close();
        });
    }

    async setVendorModels(models: VendorModels): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('vendorModels', 'readwrite');
            const store = transaction.objectStore('vendorModels');
            const request = store.put(models, 'models');

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }

    async getStorySettings(storyId: string): Promise<StorySettings | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('storySettings', 'readonly');
            const store = transaction.objectStore('storySettings');
            const request = store.get(storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);

            transaction.oncomplete = () => db.close();
        });
    }

    async setStorySettings(storyId: string, settings: StorySettings): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('storySettings', 'readwrite');
            const store = transaction.objectStore('storySettings');
            const request = store.put(settings, storyId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    }
}

export const lorebookDB = new IndexedDBStore('lorebook-store');
export const summariesDB = new IndexedDBStore('summaries-store');
export const aiSettingsDB = new IndexedDBStore('ai-settings-store');
export const vendorModelsDB = new IndexedDBStore('vendor-models-store');
export const storySettingsDB = new IndexedDBStore('story-settings-store');
