interface LogEntry {
    faction: string;
    event: string;
    action: string;
    timestamp: string;
}

class Logger {
    private logs: LogEntry[] = [];

    public async log(faction: string, event: string, action: string): Promise<void> {
        // const raw_timestamp = new Date()
        // const timestamp = formatDateTime(raw_timestamp);
        // const logEntry: LogEntry = { faction, event, action, timestamp };
        // this.logs.push(logEntry);

        // const logString = `${faction}:${event}:${action}:${timestamp}`;
        // console.log(logString);

        // const subject_alias = window.REACT_APP_SUBJECT_ALIAS

        // try {
        //     const response = await fetch(`http://localhost:3001/log?subject_alias=${subject_alias}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ faction, event, action, timestamp }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Fehler beim Senden des Logs an den Server');
        //     }
        // } catch (error) {
        //     console.error('Fehler beim Loggen:', error);
        // }
    }
}

function formatDateTime(date) {
    const pad = (num) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const logger = new Logger();
export default logger;