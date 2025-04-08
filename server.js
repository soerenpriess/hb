const express = require('express');
const fs = require('fs');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { Server } = require('socket.io');

const token = '8109377544:AAFBr8kOqBDS_dgd95fc2s-So5EkYXzHhfs';
const bot = new TelegramBot(token, { polling: true });

const app = express();
const port = 3001;
const MAX_PORT = 3100;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:4999', 'http://localhost:3001'];

// HTTP-Server erstellen
const server = http.createServer(app);

// WebSocket-Server erstellen
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST']
    }
});

// CORS-Konfiguration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Nicht erlaubter Origin'));
        }
    }
}));
app.use(express.json());

// Port-Suche Funktion
const findAvailablePort = (startPort, callback) => {
    const testPort = (port) => {
        if (port > MAX_PORT) {
            console.error(`Kein verfügbarer Port im Bereich ${startPort}-${MAX_PORT} gefunden`);
            process.exit(1);
        }

        const testServer = http.createServer();
        testServer.listen(port, () => {
            testServer.close(() => callback(port));
        });
        testServer.on('error', () => testPort(port + 1));
    };
    testPort(startPort);
};

// Endpunkt für Log-Eintrag
app.post('/log', (req, res) => {
    const { faction, event, action, timestamp } = req.body;
    const logEntry = `${faction}:${event}:${action}:${timestamp}\n`;
    const subject_alias = req.query.subject_alias;

    fs.appendFile(`${subject_alias}_logs.txt`, logEntry, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben des Logs:', err);
            res.status(500).send('Fehler beim Loggen');
        } else {
            res.status(200).send('Log erfolgreich gespeichert');
        }
    });
});

// Endpunkt für Event-Trigger-Log
app.post('/triggerEventLog', (req, res) => {
    const { text, timestamp } = req.body;
    const logEntry = `${text}:${timestamp}\n`;
    const subject_alias = req.query.subject_alias;

    fs.appendFile(`${subject_alias}_event_trigger_logs.txt`, logEntry, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben des Logs:', err);
            res.status(500).send('Fehler beim Loggen');
        } else {
            res.status(200).send('Log erfolgreich gespeichert');
        }
    });
});

// Endpunkt für Telegram-Nachricht
app.post('/telegram', (req, res) => {
    const chatId = '1741377810';
    bot.sendMessage(chatId, "Proband benötigt Hilfe in der Testkabine");
    res.status(200).send('Telegram-Nachricht gesendet');
});

// Endpunkt zum Triggern eines Ereignisses
app.post('/triggerEvent', (req, res) => {
    console.log('TriggerEvent-Request:', req.body);

    let { currentQuadrant, vectorLength } = req.body;
    vectorLength = parseFloat(vectorLength);

    io.emit("triggerEvent", [currentQuadrant, vectorLength]);
    res.status(200).send(`Event '${currentQuadrant}' mit der Vectorlänge '${vectorLength}' wurde getriggert`);
});

// WebSocket-Verbindungen
io.on('connection', (socket) => {
    console.log('Ein Client hat sich verbunden');

    socket.on('disconnect', () => {
        console.log('Ein Client hat die Verbindung getrennt');
    });
});

// Server mit automatischer Port-Suche starten
findAvailablePort(port, (availablePort) => {
    server.listen(availablePort, () => {
        console.log(`Server läuft auf http://localhost:${availablePort}`);
        io.listen(server);
    });
});
