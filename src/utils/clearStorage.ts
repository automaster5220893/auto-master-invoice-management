/**
 * Comprehensive storage clearing utility
 * Clears all possible browser storage mechanisms
 */

export const clearAllStorage = async () => {
  try {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
      
      // Clear IndexedDB
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases?.();
          if (databases) {
            await Promise.all(
              databases.map(db => {
                if (db.name) {
                  return new Promise<void>((resolve, reject) => {
                    const deleteReq = indexedDB.deleteDatabase(db.name);
                    deleteReq.onsuccess = () => resolve();
                    deleteReq.onerror = () => reject(deleteReq.error);
                    deleteReq.onblocked = () => resolve(); // Still resolve if blocked
                  });
                }
                return Promise.resolve();
              })
            );
          }
        } catch (error) {
          console.log('Error clearing IndexedDB:', error);
        }
      }
      
      // Clear Cache API
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        } catch (error) {
          console.log('Error clearing caches:', error);
        }
      }
      
      // Clear Service Workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => registration.unregister())
          );
        } catch (error) {
          console.log('Error clearing service workers:', error);
        }
      }
      
      // Clear WebSQL (legacy)
      if ('openDatabase' in window) {
        try {
          // WebSQL is deprecated but still exists in some browsers
          const db = (window as any).openDatabase('', '', '', '');
          if (db) {
            db.transaction((tx: any) => {
              tx.executeSql('DROP TABLE IF EXISTS cache');
            });
          }
        } catch (error) {
          console.log('Error clearing WebSQL:', error);
        }
      }
      
      // Clear any application-specific storage
      try {
        // Clear any custom storage keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('auto-master') || key.includes('auth') || key.includes('user'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
      } catch (error) {
        console.log('Error clearing application storage:', error);
      }
      
      // Force garbage collection if available (development only)
      if (process.env.NODE_ENV === 'development' && (window as any).gc) {
        try {
          (window as any).gc();
        } catch (error) {
          console.log('Error running garbage collection:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error in clearAllStorage:', error);
  }
};

/**
 * Clear only authentication-related data
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    // Clear auth cookies
    const authCookies = ['auth-token', 'session', 'jwt', 'token'];
    authCookies.forEach(cookieName => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
    
    // Clear auth-related localStorage
    const authKeys = ['auth-token', 'user', 'token', 'session'];
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
};
