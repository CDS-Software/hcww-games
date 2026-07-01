const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ── Force no-cache for all games so patched c3runtime.js always loads fresh ──
const noCacheMiddleware = (req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    });
    next();
};

// ── Self-unregistering SW override (kills C3's service worker caching) ──
const swOverride = (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send(`
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
    console.log('[SW] All caches cleared, service worker unregistered');
    self.registration.unregister();
});
`);
};

app.use('/game-1', noCacheMiddleware);
app.get('/game-1/sw.js', swOverride);
app.use('/game-2', noCacheMiddleware);
app.get('/game-2/sw.js', swOverride);
app.use('/game-3', noCacheMiddleware);
app.get('/game-3/sw.js', swOverride);
app.use('/game-4', noCacheMiddleware);
app.get('/game-4/sw.js', swOverride);

// Map each game route to the folder containing its index.html
app.use('/game-1', express.static(path.join(__dirname, 'assets/game-1')));
app.use('/game-2', express.static(path.join(__dirname, 'assets/game-2/HTML5/Fill The Water Bucket')));
app.use('/game-3', express.static(path.join(__dirname, 'assets/game-3/HTML5/Connect The Water Pipes')));
app.use('/game-4', express.static(path.join(__dirname, "assets/game-4/Let's Clean The River")));

// Base route for testing
app.get('/', (req, res) => {
    res.send(`
        <h1>hcww-games</h1>
        <ul>
            <li><a href="/game-1">Game 1 - Fill The Water (Construct 3)</a></li>
            <li><a href="/game-2">Game 2 - Fill The Water Bucket</a></li>
            <li><a href="/game-3">Game 3 - Connect The Water Pipes</a></li>
            <li><a href="/game-4">Game 4 - Let's Clean The River</a></li>
        </ul>
    `);
});

app.post('/api/v1/games/1/progress', (req, res) => {
    console.log('[SERVER MOCK] Progress Report:', req.body);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
