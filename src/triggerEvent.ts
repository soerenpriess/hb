import exp from "constants";
import io from "socket.io-client";
import Store from "./ui/stageView/store"
import manipulateGame from "./ui/utils/manipulateGame";
import { green } from "color";

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
    // when player is not in round, do nothing
    if (!checkIfPlayerIsInRound(store)) return

    if (currentQuadrant === "LAHV") {
        // check if greens have less units than reds
        if (checkIfGreenHasLessUnitsThanRed(store)) {
            console.log("Greens have less units than Reds")
            manipulateGame.greenAddMage(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
            return
        }
        // check if greens have unit archer
        if (checkIfFractionHasUnit(store, "reds", "Warrior")) {
            console.log("Reds have unit Warrior")
            manipulateGame.redDamageWarrior(store.state.currentGame.game);
            return
        }
        // check if greens have unit archer
        if (checkIfFractionHasUnit(store, "greens", "Archer")) {
            console.log("Greens have unit Archer")
            manipulateGame.greenTakeDamageArcher(store.state.currentGame.game);
            return
        }
    }

    if (currentQuadrant === "HALV" || currentQuadrant === "LALV") {
        // check if greens have unit horseman
        if (checkIfFractionHasUnit(store, "greens", "Horseman")) {
            console.log("Greens have unit Horseman")
            manipulateGame.greenTakeDamageHorseman(store.state.currentGame.game);
            return
        }

        // check if reds have unit barbarian
        if (checkIfFractionHasUnit(store, "reds", "Barbarian")) {
            console.log("Reds have unit Barbarian")
            manipulateGame.redDamageBarbarian(store.state.currentGame.game);
            return
        }

        // check if reds have unit Knight
        if (checkIfFractionHasUnit(store, "reds", "Knight")) {
            console.log("Reds have unit Knight")
            manipulateGame.redDamageKnight(store.state.currentGame.game);
            return
        }

        // check if greens have unit cleric
        if (checkIfFractionHasUnit(store, "greens", "Cleric")) {
            console.log("Greens have unit Cleric")
            manipulateGame.greenTakeDamageCleric(store.state.currentGame.game);
            return
        }
    }

    if (currentQuadrant === "HALV" || currentQuadrant === "LALV" || currentQuadrant === "LAHV") {
        // check if reds have unit dragon
        if (checkIfFractionHasUnit(store, "reds", "Dragon")) {
            console.log("Reds have unit Dragon")
            manipulateGame.setDamageMultiplyerOnDragon(store.state.currentGame.game);
            return
        }

        // check if greens have less units than reds
        if (checkIfGreenHasLessUnitsThanRed(store)) {
            console.log("Greens have less units than Reds")
            manipulateGame.greenAddArcher(store.state.currentGame.game);
            return
        }

        // check if reds has turn
        if (checkIfRedHasTurn(store)) {
            console.log("Reds has turn")
            manipulateGame.redTurnEnd(store.state.currentGame.game);
            return
        }

        //Fallback
        manipulateGame.setJumpWildcard(store.state.currentGame.game);
        manipulateGame.redDamageRandomUnit(store.state.currentGame.game);

        //TODO: Die vektorlänge spielt noch eine rolle. In dem py script die vektorlänge zu dem HAHV quadranten berechnen und dann entsprechend die vektorlänge anpassen
        // grafiken erstellen für den ablauf und den bedingungen
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

function checkIfRedHasTurn(store) {
    return true
}

function checkIfFractionHasUnit(store, fraction, unitName) {
    const { game } = store.state.currentGame
    const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")
    const redFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Reds")

    if (fraction === "greens") {
        const unit = game.factionUnits[greenFractionId.id].find(u => u.type.name === unitName)
        if (unit) {
            console.log("Greens have unit", unit)
            return true
        }
    } else if (fraction === "reds") {
        const unit = game.factionUnits[redFractionId.id].find(u => u.type.name === unitName)
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
