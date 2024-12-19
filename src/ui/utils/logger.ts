interface LogEntry {
    faction: string;
    event: string;
    action: string;
    timestamp: string;
}

class Logger {
    private logs: LogEntry[] = [];

    public async log(faction: string, event: string, action: string): Promise<void> {
        const timestamp = new Date().toISOString();
        const logEntry: LogEntry = { faction, event, action, timestamp };
        this.logs.push(logEntry);

        const logString = `${faction}:${event}:${action}:${timestamp}`;
        console.log(logString);

        try {
            const response = await fetch('http://localhost:3001/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ faction, event, action, timestamp }),
            });

            if (!response.ok) {
                throw new Error('Fehler beim Senden des Logs an den Server');
            }
        } catch (error) {
            console.error('Fehler beim Loggen:', error);
        }
    }
}

const logger = new Logger();
export default logger;