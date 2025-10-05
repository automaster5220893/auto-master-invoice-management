// Utility functions for cache management

export const clearAllCaches = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }
  return false;
};

export const clearServiceWorkerCache = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('Service worker unregistered successfully');
      return true;
    } catch (error) {
      console.error('Error unregistering service worker:', error);
      return false;
    }
  }
  return false;
};

export const forceRefresh = () => {
  // Clear caches and reload
  clearAllCaches().then(() => {
    window.location.reload();
  });
};

export const clearApiCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          const apiKeys = keys.filter(request => request.url.includes('/api/'));
          await Promise.all(apiKeys.map(key => cache.delete(key)));
        })
      );
      console.log('API cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing API cache:', error);
      return false;
    }
  }
  return false;
};
