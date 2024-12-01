interface LogEntry {
    title: string;
    text: string;
    timestamp: string;
}

class Logger {
    private logs: LogEntry[] = [];

    public async log(title: string, text: string): Promise<void> {
        const timestamp = new Date().toISOString();
        const logEntry: LogEntry = { title, text, timestamp };
        this.logs.push(logEntry);

        const logString = `[${timestamp}] ${title}: ${text}`;
        console.log(logString);

        try {
            const response = await fetch('http://localhost:3001/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, text }),
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