/* пустой, но нужен: браузер держит его ради showNotification */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
