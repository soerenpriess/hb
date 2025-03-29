import exp from "constants";
import io from "socket.io-client";
import Store from "./ui/stageView/store"
import manipulateGame from "./ui/utils/manipulateGame";

// Typ für die Daten, die vom Server gesendet werden
interface EventData {
    message: string;
}

const socket = io("http://localhost:3001")

// Funktion zum Initialisieren der WebSocket-Verbindung
function initializeWebSocket(store: any) {
    console.log("Verbindung zum WebSocket-Server wird hergestellt...");

    // Lauschen auf benutzerdefinierte Ereignisse vom Server
    socket.on("currentQuadrant", (data: EventData) => {
        console.log("Event empfangen:", data);
        console.log("Nachricht:", data);
        console.log("store", store);
        // console.log(store)
        // manipulateGame.greenAddArcher(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
        getTargetEvent(store, data); // Beispiel: Füge einen Bogenschützen hinzu
        alert(data); // Beispiel: Zeige eine Nachricht an
    });

    // Aufräumen bei Verbindungsabbruch
    socket.on("disconnect", () => {
        console.log("Verbindung zum Server verloren.");
    });
}

function getTargetEvent(store, currentQuadrant) {

    if (currentQuadrant === "LAHV") {

    }

}

function checkIfPlayerIsInRound(store) {
    if (store.state.currentGame.game) {
        console.log("Player is in round")
        return true
    } else {
        console.log("Player is not in round")
        return false
    }
}

function checkIfFractionHasUnit(store, fraction, unit) {
    const { game } = store.state.currentGame
    const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")
    const redFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Reds")

    if (fraction === "greens") {
        const unit = game.factionUnits[greenFractionId.id].find(u => u.type === unit)
        if (unit) {
            console.log("Greens have unit", unit)
            return true
        }
    } else if (fraction === "reds") {
        const unit = game.factionUnits[redFractionId.id].find(u => u.type === unit)
        if (unit) {
            console.log("Reds have unit", unit)
            return true
        }
    }

    console.log("Greens or Reds do not have unit", unit)
    return false
}

function checkIfGreenHasLessUnitsThanRed(store) {
    const { game } = store.state.currentGame
    const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")
    const redFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Reds")

    const greenUnits = game.factionUnits[greenFractionId.id].length
    const redUnits = game.factionUnits[redFractionId.id].length

    console.log("checkIfGreenHasLessUnitsThanRed", greenUnits < redUnits)
    if (greenUnits < redUnits) {
        return true
    }

    return false
}

export { initializeWebSocket };
