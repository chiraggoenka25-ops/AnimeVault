self.addEventListener('install', () => {
    console.log('AnimeVault PWA Service Worker Installed');
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through for production
});
