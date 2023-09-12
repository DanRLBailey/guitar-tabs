export function getSettingsFromStore(setting: string, fallback?: number | boolean) {
  const local = localStorage.getItem(setting);
  // if (local) return parseInt(local);

  if (local) {
    switch (typeof fallback) {
      case "boolean":
        return local == "true";
      case "number":
      default:
        return parseInt(local);
    }
  }

  if (!fallback) return 0;

  localStorage.setItem(setting, fallback.toString());
  return fallback;
}