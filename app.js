const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// In-memory storage for chat messages associated with passwords
const chatMessages = {
    'password1': [],
    'password2': [],
    'password3': []
};

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Homepage with login form
app.get('/', (req, res) => {
    res.send(`
        <html>
        <body>
            <h1>Login</h1>
            <form action="/chat" method="post">
                <input type="text" name="password" placeholder="Enter password" required>
                <button type="submit">Enter Chat</button>
            </form>
        </body>
        </html>
    `);
});

// Chat room route (both GET and POST)
app.all('/chat', (req, res) => {
    const password = req.body.password || req.query.password; // Use req.query.password for GET requests
    if (password && password in chatMessages) {
        const messages = chatMessages[password];
        res.send(`
            <html>
            <body>
                <h1>Welcome to Chat Room</h1>
                <h2>Chat Messages for Password: ${password}</h2>
                <ul>
                    ${messages.map(message => `<li>${message}</li>`).join('')}
                </ul>
                <form action="/send" method="post">
                    <input type="hidden" name="password" value="${password}">
                    <input type="text" name="message" placeholder="Type your message" required>
                    <button type="submit">Send</button>
                </form>
            </body>
            </html>
        `);
    } else {
        res.send('Invalid password. Please try again.');
    }
});

// Route to handle sending messages
app.post('/send', (req, res) => {
    const password = req.body.password;
    const message = req.body.message;
    if (password && password in chatMessages) {
        chatMessages[password].push(message);
    }
    res.redirect(`/chat?password=${password}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Chat app listening at http://localhost:${port}`);
});
