self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'schedule') {
      console.log('Message event:', event.data);
      setTimeout(function() {
          const title = 'Hello handsome!';
          const options = {
              body: event.data.msg,
              icon: 'images/notification-icon.png',
              badge: 'images/notification-badge.png',
              vibrate: [100, 50, 100],
              data: {
                  dateOfArrival: Date.now(),
                  primaryKey: '2'
              },
              actions: [
                  {action: 'explore', title: 'Explore this new world',
                      icon: 'images/checkmark.png'},
                  {action: 'close', title: 'Close notification',
                      icon: 'images/xmark.png'},
              ]
          };
          self.registration.showNotification(title, options);
      }, 30000); // 30 seconds
  }
});

self.addEventListener('push', function(event) {
  let body;

  if (event.data) {
      body = event.data.text();
  } else {
      body = 'Default body';
  }

  const options = {
      body: body,
      icon: 'images/notification-icon.png',
      badge: 'images/notification-badge.png',
      vibrate: [100, 50, 100],
      data: {
          dateOfArrival: Date.now(),
          primaryKey: '2'
      },
      actions: [
          {action: 'explore', title: 'Explore this new world',
              icon: 'images/checkmark.png'},
          {action: 'close', title: 'Close notification',
              icon: 'images/xmark.png'},
      ]
  };

  event.waitUntil(
      self.registration.showNotification('Hello world!', options)
  );
});
