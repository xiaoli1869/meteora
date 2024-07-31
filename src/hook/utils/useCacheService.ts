export default function useCacheService() {
  function set(key: string, value: string, mill?: number) {
    if (mill === undefined) {
      mill = 1000 * 60 * 60 * 24 * 365;
    }
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + mill,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
  function get(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
  function del(key: string) {
    localStorage.removeItem(key);
  }
  return { set, get, del };
}
