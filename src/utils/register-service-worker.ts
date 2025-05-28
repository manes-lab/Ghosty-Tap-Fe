export function registerSW(){
    if ('serviceWorker' in navigator) {
        // window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js?v=1').then(function(registration) {
                registration.update();
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        // });
    }
}
