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
  setSecureItem: (key, value) => DevelopmentStorageUtility.setItem(key, value),
  getSecureItem: (key) => DevelopmentStorageUtility.getItem(key),
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
  setSecureItem: (key, value) =>
    new Promise((resolve) => {
      window.chrome.storage.local.set({ [key]: value }, resolve);
    }),
  getSecureItem: (key) =>
    new Promise((resolve) => {
      window.chrome.storage.local.get(key, (entries) => resolve(entries[key]));
    }),
};

const Storage =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? DevelopmentStorageUtility
    : ProductionStorageUtility;

export default Storage;
