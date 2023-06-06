document.addEventListener('DOMContentLoaded', function () {
  const applicationServerPublicKey = 'BG0XEEvVS1Lk1HyH7Qf8J89GKcUnTxvYSmGHcZPH0Jw6fPvhsoBKx7UXRtQe_4cpKAfaT_DQctvuQLgBZ88xDGI';
  const button = document.getElementById('notification-button');
  let isSubscribed = false;
  let swRegistration = null;

  if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('sw.js')
          .then(function (swReg) {
              console.log('Service Worker is registered', swReg);

              swRegistration = swReg;
              initialiseUI();
          })
          .catch(function (error) {
              console.error('Service Worker Error', error);
          });
  } else {
      console.warn('Push messaging is not supported');
      button.textContent = 'Push Not Supported';
  }

  function initialiseUI() {
      button.addEventListener('click', function () {
          button.disabled = true;
          if (isSubscribed) {
              unsubscribeUser();
          } else {
              subscribeUser();
          }
      });

      swRegistration.pushManager.getSubscription()
          .then(function (subscription) {
              isSubscribed = !(subscription === null);

              updateBtn();
          });
  }

  function updateBtn() {
      if (Notification.permission === 'denied') {
          button.textContent = 'Push Messaging Blocked.';
          button.disabled = true;
          return;
      }

      if (isSubscribed) {
          button.textContent = 'Disable Push Messaging';
      } else {
          button.textContent = 'Enable Push Messaging';
      }

      button.disabled = false;
  }

  function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
        console.log('User is subscribed:', subscription);

        // New code to log the keys.
        const key = subscription.getKey('p256dh');
        const auth = subscription.getKey('auth');

        console.log('p256dh key:', key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null);
        console.log('auth key:', auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : null);

        isSubscribed = true;

        updateBtn();
    })
    .catch(function(err) {
        console.log('Failed to subscribe the user: ', err);
        updateBtn();
    });
}

  function unsubscribeUser() {
      swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
          if (subscription) {
              return subscription.unsubscribe();
          }
      })
      .catch(function(error) {
          console.log('Error unsubscribing', error);
      })
      .then(function() {
          console.log('User is unsubscribed.');
          isSubscribed = false;

          updateBtn();
      });
  }

  function urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  }

  const pushButton = document.getElementById('push-button');

  pushButton.addEventListener('click', function() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.active.postMessage({
                type: 'schedule',
                msg: 'Hello handsome!'
            });
        });
    }
    console.log('I was clicked')
});
});
