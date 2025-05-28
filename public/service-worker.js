const CACHE_NAME = 'ghosty-tap-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});


// self.addEventListener('fetch', (event) => {
//   if (event.request.method !== 'GET') return;
//   try{
//     if (event.request.url.endsWith('.mp3')) {
//       event.respondWith(
//         caches.open(CACHE_NAME).then(cache => {
//           return cache.match(event.request).then(response => {
//             if (response) {
//               return response;
//             }
//             return fetch(event.request).then(networkResponse => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           });
//         })
//       );
//     } else {
//       // event.respondWith(
//       //   caches.match(event.request)
//       //     .then(function(response) {
//       //       if (response) {
//       //         return response;
//       //       }
//       //       return fetch(event.request).then(
//       //         response => {
//       //           if(!response || response.status !== 200 || response.type !== 'basic') {
//       //             return response;
//       //           }
    
//       //           const responseToCache = response.clone();
//       //           caches.open(CACHE_NAME)
//       //             .then(cache => {
//       //               cache.put(event.request, responseToCache);
//       //             });
    
//       //           return response;
//       //         }
//       //       );
//       //       // return fetch(event.request);
//       //     }
//       //   )
//       // );
//     }
//   }catch(e){
//     throw new Error(`fetch error: `, e)
//   }
// });



// self.addEventListener('push', function(event) {
//   console.log('00000000000000');
//   let data = {};
//   console.log(event);
//   if (event.data) {
//       data = event.data.json();
//       console.log(data);
//   } else {
//       data = { title: '默认消息', body: '没有有效的消息内容' };
//   }

//   const options = {
//       body: data.body,
//       icon: 'logo.png',
//       badge: 'logo.png',
//   };

//   event.waitUntil(
//       self.registration.showNotification(data.title, options)
//   );
// });

// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow(`${window.location.origin}/`) 
//   );
// });




