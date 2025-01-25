const express = require('express');
const fs = require('fs');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const token = '8109377544:AAFBr8kOqBDS_dgd95fc2s-So5EkYXzHhfs';
const bot = new TelegramBot(token, { polling: true });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

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

app.post('/telegram', (req, res) => {
    const chatId = '1741377810'; // Ersetzen Sie dies durch Ihre Chat-ID
    bot.sendMessage(chatId, "Proband benötigt Hilfe in der Testkabine");
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});