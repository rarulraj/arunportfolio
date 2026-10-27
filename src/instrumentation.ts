export async function register() {
  const store = (globalThis as { localStorage?: Storage }).localStorage;
  if (store && typeof store.getItem === "function") return;

  const mem = new Map<string, string>();
  const polyfill: Storage = {
    get length() {
      return mem.size;
    },
    clear() {
      mem.clear();
    },
    getItem(key: string) {
      return mem.has(key) ? (mem.get(key) as string) : null;
    },
    key(index: number) {
      return [...mem.keys()][index] ?? null;
    },
    removeItem(key: string) {
      mem.delete(key);
    },
    setItem(key: string, value: string) {
      mem.set(key, String(value));
    },
  };

  Object.defineProperty(globalThis, "localStorage", {
    value: polyfill,
    configurable: true,
    writable: true,
  });
}
