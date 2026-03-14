// public/sw.js

self.addEventListener('push', event => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200, 100, 200],
    // sound: '/sounds/alarm.mp3'  // yeh kuch browsers mein direct kaam karta hai
  };

  event.waitUntil(
    Promise.all([
      // Notification show karo
      self.registration.showNotification(data.title, options),

      // Extra sound play (tab open hone par reliable hai)
      new Promise((resolve) => {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = 0.8;
        audio.play()
          .then(() => {
            console.log('[SW] Alarm sound played');
            resolve();
          })
          .catch(e => {
            console.log('[SW] Sound play failed (user interaction required or blocked)', e);
            resolve(); // continue even if sound fails
          });
      })
    ])
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')  // app khol do
  );
});