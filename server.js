const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { time } = require('console');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/log', (req, res) => {
    const { faction, event, action, timestamp } = req.body;
    const logEntry = `${faction}:${event}:${action}:${timestamp}\n`;

    fs.appendFile('logs.txt', logEntry, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben des Logs:', err);
            res.status(500).send('Fehler beim Loggen');
        } else {
            res.status(200).send('Log erfolgreich gespeichert');
        }
    });
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});