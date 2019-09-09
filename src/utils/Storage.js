const DevelopmentStorageUtility = {
  setItem: async (key, value) =>
    new Promise((resolve) => {
      window.localStorage.setItem(key, value);
      resolve();
    }),
  getItem: (key) =>
    new Promise((resolve) => {
      const item = window.localStorage.getItem(key);
      resolve(item);
    }),
};

const ProductionStorageUtility = {
  setItem: async (key, value) =>
    new Promise((resolve) => {
      window.chrome.storage.sync.set({ [key]: value }, resolve);
    }),
  getItem: (key) =>
    new Promise((resolve) => {
      window.chrome.storage.sync.get(key, (entries) => resolve(entries[key]));
    }),
};

const Storage = process.env.NODE_ENV === 'development' ? DevelopmentStorageUtility : ProductionStorageUtility;

export default Storage;
