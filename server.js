const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Ein Client hat sich verbunden');

        socket.on('customerResponse', (response) => {
            console.log('Kundenantwort erhalten:', response);
            // Hier können Sie die Antwort verarbeiten und an den Client zurücksenden
            socket.emit('customerResponse', response);
        });

        socket.on('disconnect', () => {
            console.log('Ein Client hat sich getrennt');
        });
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Bereit auf http://${hostname}:${port}`);
    });
});