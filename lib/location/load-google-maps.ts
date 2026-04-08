let googleMapsScriptPromise: Promise<void> | null = null;

// Extend the global Window interface for the bootstrap variable
declare global {
  interface Window {
    __ib__?: string;
  }
}

/**
 * Loads the Google Maps JavaScript API using the Dynamic Library Loading bootstrap.
 * This ensures window.google.maps.importLibrary is available.
 */
export function loadGoogleMapsPlacesScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps script can only be loaded in the browser.'));
  }

  // If already loaded and has importLibrary, we're good
  const existingImportLibrary = (
    window as Window & { google?: { maps?: { importLibrary?: unknown } } }
  ).google?.maps?.importLibrary;
  if (typeof existingImportLibrary === 'function') {
    return Promise.resolve();
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    try {
      const l = "__ib__";
      const d = document;
      const s = d.createElement("script");

      // Initialize the namespace if it doesn't exist
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = window as any;
      g.google ||= {};
      g.google.maps ||= {};
      const h = g.google.maps;

      if (h.importLibrary) {
        resolve();
        return;
      }

      // Keep track of pending library requests
      const pending: Array<{ name: string; resolve: (val: unknown) => void; reject: (err: Error) => void }> = [];

      h.importLibrary = (name: string, opts?: unknown) => {
        return new Promise((res, rej) => {
          if (h.importLibrary !== bootstrapImport) {
            // If importLibrary has been replaced by the real implementation, use it
            res(h.importLibrary!(name, opts));
            return;
          }
          pending.push({ name, resolve: res, reject: rej });
          
          // If this is the first call, start loading the script
          if (pending.length === 1) {
             window[l] = name;
             s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
             s.async = true;
             s.defer = true;
             s.dataset.googleMapsPlaces = "true";
             s.onerror = () => {
               pending.forEach(p => p.reject(new Error(`${p.name} not found`)));
               reject(new Error('Failed to load Google Maps script.'));
             };
             s.onload = () => {
                // The script should replace importLibrary with the real one.
                // We resolve the main promise and let the real importLibrary handle future calls.
                // For pending calls, we need to wait a tiny bit for the script to initialize importLibrary.
                setTimeout(() => {
                  if (typeof h.importLibrary === 'function' && h.importLibrary !== bootstrapImport) {
                    pending.forEach(p => h.importLibrary!(p.name).then(p.resolve).catch(p.reject));
                  } else {
                    pending.forEach(p => p.reject(new Error('Google Maps failed to initialize.')));
                  }
                  resolve();
                }, 0);
             };
             d.head.appendChild(s);
          }
        });
      };

      const bootstrapImport = h.importLibrary;

      // Kick off the load
      h.importLibrary("maps").catch(reject);

    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });

  return googleMapsScriptPromise;
}
