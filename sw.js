// Service Worker — recibe los push y muestra la notificación
self.addEventListener("push", event => {
  let data = { title: "Recordatorio", body: "", url: "/" };
  try { if (event.data) data = event.data.json(); } catch (e) { data.body = event.data ? event.data.text() : ""; }
  event.waitUntil(
    self.registration.showNotification(data.title || "Recordatorio", {
      body: data.body || "",
      icon: "icon-192.png",
      badge: "icon-192.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/" },
      tag: "recordatorio-" + Date.now(),
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(clients.claim()));
