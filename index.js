const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
