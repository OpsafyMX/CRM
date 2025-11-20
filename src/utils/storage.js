// LocalStorage utility functions
const STORAGE_PREFIX = 'crm_';

export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting ${key} from localStorage:`, error);
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} in localStorage:`, error);
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(STORAGE_PREFIX + key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    },

    clear: () => {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Initialize default data if not exists
export const initializeStorage = () => {
    if (!storage.get('initialized')) {
        // Default users
        storage.set('users', [
            {
                id: '1',
                email: 'admin@crm.com',
                password: 'admin123', // In production, use hashed passwords
                name: 'Administrador',
                role: 'admin',
                avatar: null
            }
        ]);

        // Default contacts
        storage.set('contacts', []);

        // Default deals
        storage.set('deals', []);

        // Default tasks
        storage.set('tasks', []);

        // Default activities
        storage.set('activities', []);

        storage.set('initialized', true);
    }
};
