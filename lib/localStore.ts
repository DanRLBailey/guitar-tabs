export function getSettingsFromStore(setting: string, fallback?: number | boolean) {
  const local = localStorage.getItem(setting);
  
  if (local) {
    switch (typeof fallback) {
      case "boolean":
        return local == "true";
      case "number":
        return parseFloat(local);
      default:
        return local
    }
  }

  if (!fallback) return -1;

  localStorage.setItem(setting, fallback.toString());
  return fallback;
}

export function writeSettingToStore(key: string, value: string) {
  localStorage.setItem(key, value);
}