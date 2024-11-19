interface ChapterSummary {
    chapter_number: number;
    summary: string;
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
}

export const lorebookDB = new IndexedDBStore('lorebook-store');
export const summariesDB = new IndexedDBStore('summaries-store');
