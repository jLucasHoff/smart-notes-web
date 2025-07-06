// src/lib/notifications.ts

import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export interface INotification {
    id: string;
    message: string;
    type: string;
}

const STORAGE_KEY = 'app-notifications';

const createNotificationStore = () => {
    const internalStore: Writable<INotification[]> = writable([]);
    const { subscribe, set, update } = internalStore;

    if (browser) {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if(storedData) {
            try {
                set(JSON.parse(storedData))
            } catch {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
        subscribe(currentValue => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentValue))
        })
    }

    return {
        subscribe,
        addNotification: (message: string, type = "info") => {
            const newNotification: INotification = {
                id: crypto.randomUUID(),
                message,
                type
            };
            update(items => [...items, newNotification])
        },
        removeNotification: (id: string) => {
            update(items => items.filter(n => n.id !== id))
        },
        clearAll: () => {
            set([])
        }
    }
}

export const notifications = createNotificationStore();