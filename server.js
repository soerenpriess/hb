const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/log', (req, res) => {
    const { title, text } = req.body;
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${title}: ${text}\n`;

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