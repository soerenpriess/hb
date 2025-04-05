// import Store from "./ui/stageView/store"
import exp from "constants";
import manipulateGame from "./ui/utils/manipulateGame";
import io from "socket.io-client";
import logger from "./ui/utils/logger";
import { getOpponentAiInstance } from "./ai/globalOpponentAi";
import OpponentAi from "./ai/opponentAi";

// Typ für die Daten, die vom Server gesendet werden
interface EventData {
    message: string;
}

const socket = io("http://localhost:3001")

// Funktion zum Initialisieren der WebSocket-Verbindung
function initializeWebSocket(store: any) {
    console.log("Verbindung zum WebSocket-Server wird hergestellt...");

    // Lauschen auf benutzerdefinierte Ereignisse vom Server
    socket.on("triggerEvent", (data: EventData) => {
        console.log("Ereignis empfangen:", data);
        getTargetEvent(store, data[0], data[1]);
    });

    // Aufräumen bei Verbindungsabbruch
    socket.on("disconnect", () => {
        console.log("Verbindung zum Server verloren.");
    });
}

function checkIfPlayerIsInRound(store) {
    if (store.state.currentGame.game) {
        return true
    } else {
        return false
    }
}

function checkIfRedHasTurn(store) {
    const { game } = store.state.currentGame
    const currentFactionIndex = game.currentFactionIndex
    if (currentFactionIndex === 1) {
        return true
    }
    return false
}

function checkIfFractionHasUnit(store, fraction, unitName) {
    const { game } = store.state.currentGame
    const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")
    const redFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Reds")

    if (fraction === "greens") {
        const unit = game.factionUnits[greenFractionId.id].find(u => u.type.name === unitName)
        if (unit) {
            return true
        }
    } else if (fraction === "reds") {
        const unit = game.factionUnits[redFractionId.id].find(u => u.type.name === unitName)
        if (unit) {
            return true
        }
    }

    return false
}

function checkIfGreenHasLessUnitsThanRed(store) {
    const { game } = store.state.currentGame
    const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")
    const redFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Reds")

    const greenUnits = game.factionUnits[greenFractionId.id].length
    const redUnits = game.factionUnits[redFractionId.id].length

    if (greenUnits < redUnits) {
        return true
    }

    return false
}

export { initializeWebSocket };


function getTargetEvent(store, currentQuadrant, vectorLength) {

    logger.triggerEventLog(`Trigger Event - currentQuadrant ${currentQuadrant} - vectorLength ${vectorLength}`)
    // when player is not in round, do nothing

    if (currentQuadrant === "HAHV") {
        logger.triggerEventLog("currentQuadrant is HAHV - exit")
        logger.triggerEventLog("--------------------------")
        return
    }

    const isPlayerInRound = checkIfPlayerIsInRound(store)
    logger.triggerEventLog(`Player is in round: ${isPlayerInRound}`)
    if (!isPlayerInRound) {
        logger.triggerEventLog("Player is not in round - exit")
        logger.triggerEventLog("--------------------------")
        return
    }

    switch (currentQuadrant) {
        case "LAHV":
            // trigger LAHV Event
            logger.triggerEventLog("Trigger LAHV Event")
            trigger_LAHV_Event(store, vectorLength)
            break;
        case "HALV":
            // trigger HALV Event
            logger.triggerEventLog("Trigger HALV Event")
            trigger_HALV_LALV_Event(store, vectorLength)
            break;
        case "LALV":
            logger.triggerEventLog("Trigger LALV Event")
            // trigger HALV or LALV Event
            trigger_HALV_LALV_Event(store, vectorLength)
            break;
        default:
            // trigger HALV, LALV or LAHV Event
            logger.triggerEventLog("Trigger HALV, LALV or LAHV Event")
            trigger_HALV_LALV_LAHV_Events(store, vectorLength)
            break;
    }
}

function trigger_LAHV_Event(store, vectorLength) {

    switch (vectorLength) {
        case vectorLength > 1.66:
            // check if greens have less units than reds
            const hasGreenLessUnits = checkIfGreenHasLessUnitsThanRed(store)
            logger.triggerEventLog(`Greens have less units than Reds: ${hasGreenLessUnits}`)
            if (hasGreenLessUnits) {
                logger.triggerEventLog("Greens get Mage")
                store.setPopup(true, "Du erhälst einen Magier!")
                setTimeout(() => { }, 3000)
                manipulateGame.greenAddMage(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        case vectorLength > 0.79:
            // check if red have unit warrior
            const hasRedWarrior = checkIfFractionHasUnit(store, "reds", "Warrior")
            logger.triggerEventLog(`Reds have unit Warrior: ${hasRedWarrior}`)
            if (hasRedWarrior) {
                logger.triggerEventLog("Reds damage Warrior")
                setTimeout(() => { }, 3000)
                store.setPopup(true, "Ein Warrior vom Gegner erleidet Schaden!")
                manipulateGame.redDamageWarrior(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        default:
            // check if greens have unit archer
            const hasGreenArcher = checkIfFractionHasUnit(store, "greens", "Archer")
            logger.triggerEventLog(`Greens have unit Archer: ${hasGreenArcher}`)
            if (hasGreenArcher) {
                logger.triggerEventLog("Greens damage Archer")
                store.setPopup(true, "Ein Archer von dir erleidet Schaden!")
                setTimeout(() => { }, 3000)
                manipulateGame.greenTakeDamageArcher(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
    }

    logger.triggerEventLog("Fallback from LAHV - Triggering HALV, LALV or LAHV Events")
    trigger_HALV_LALV_LAHV_Events(store, vectorLength)
}

function trigger_HALV_LALV_Event(store, vectorLength) {

    switch (vectorLength) {
        case vectorLength > 1.56:
            // check if greens have horseman
            const hasGreenHorseman = checkIfFractionHasUnit(store, "greens", "Horseman")
            logger.triggerEventLog(`Greens have unit Horseman: ${hasGreenHorseman}`)
            if (hasGreenHorseman) {
                logger.triggerEventLog("Greens damage Horseman")
                store.setPopup(true, "Ein Horseman von dir erleidet Schaden!")
                setTimeout(() => { }, 3000)
                manipulateGame.greenTakeDamageHorseman(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        case vectorLength > 1.11:
            // check if reds have unit barbarian
            const hasRedBarbarian = checkIfFractionHasUnit(store, 'reds', 'Barbarian')
            logger.triggerEventLog(`Reds have unit Barbarian: ${hasRedBarbarian}`)
            if (hasRedBarbarian) {
                logger.triggerEventLog("Reds damage Barbarian")
                store.setPopup(true, "Ein Barbarian vom Gegner erleidet Schaden!")
                setTimeout(() => { }, 3000)
                manipulateGame.redDamageBarbarian(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        case vectorLength > 0.66:
            // check if reds have unit knight
            const hasRedKnight = checkIfFractionHasUnit(store, 'reds', 'Knight')
            logger.triggerEventLog(`Reds have unit Knight: ${hasRedKnight}`)
            if (hasRedKnight) {
                logger.triggerEventLog("Reds damage Knight")
                store.setPopup(true, "Ein Knight vom Gegner erleidet Schaden!")
                setTimeout(() => { }, 3000)
                manipulateGame.redDamageKnight(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        default:
            // check if greens have unit cleric
            const hasGreenCleric = checkIfFractionHasUnit(store, 'greens', 'Cleric')
            logger.triggerEventLog(`Greens have unit Cleric: ${hasGreenCleric}`)
            if (hasGreenCleric) {
                logger.triggerEventLog("Greens damage Cleric")
                store.setPopup(true, "Ein Cleric von dir erleidet Schaden!")
                setTimeout(() => { }, 3000)
                manipulateGame.greenTakeDamageCleric(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
    }

    logger.triggerEventLog("Fallback from HALV or LALV - Triggering HALV, LALV or LAHV Events")
    trigger_HALV_LALV_LAHV_Events(store, vectorLength)

}

function trigger_HALV_LALV_LAHV_Events(store, vectorLength) {

    switch (vectorLength) {
        case vectorLength > 1.41:
            // check if reds have unit dragon
            const hasRedDragon = checkIfFractionHasUnit(store, "reds", "Dragon")
            logger.triggerEventLog(`Reds have unit Dragon: ${hasRedDragon}`)
            if (hasRedDragon) {
                logger.triggerEventLog("Reds damage Dragon")
                store.setPopup(true, "Die Einheit Dragon vom Gegner erhält mehr Schaden!")
                setTimeout(() => { }, 3000)
                manipulateGame.setDamageMultiplyerOnDragon(store.state.currentGame.game);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        case vectorLength > 0.91:
            logger.triggerEventLog("Greens get Jump Wildcard")
            store.setPopup(true, "Du kannst mit einer Einheit die Aktion 'Jump' ausführen!")
            manipulateGame.setJumpWildcard(store.state.currentGame.game);
            logger.triggerEventLog("--------------------------")
            return
        case vectorLength > 0.72:
            // check if greens have less units than reds
            const hasGreenLessUnits = checkIfGreenHasLessUnitsThanRed(store)
            logger.triggerEventLog(`Greens have less units than Reds: ${hasGreenLessUnits}`)
            if (hasGreenLessUnits) {
                logger.triggerEventLog("Greens get Archer")
                store.setPopup(true, "Du erhältst einen Archer!")
                setTimeout(() => { }, 3000)
                manipulateGame.greenAddArcher(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
        case vectorLength > 0.52:
            logger.triggerEventLog("Reds random damage unit")
            store.setPopup(true, "Eine Zufällige Einheit vom Gegner erleidet Schaden!")
            setTimeout(() => { }, 3000)
            manipulateGame.redDamageRandomUnit(store.state.currentGame.game);
            logger.triggerEventLog("--------------------------")
            return
        default:
            // check if reds has turn
            const hasRedTurn = checkIfRedHasTurn(store)
            logger.triggerEventLog(`Reds have turn: ${hasRedTurn}`)
            if (hasRedTurn) {
                logger.triggerEventLog("Reds turn end")
                store.setPopup(true, "Der Gegner beendet vorzeitig seinen Zug!")
                const currentOpponent: OpponentAi | null = getOpponentAiInstance();
                manipulateGame.redTurnEnd(currentOpponent);
                logger.triggerEventLog("--------------------------")
                return
            }
            break;
    }

    logger.triggerEventLog("Fallback from HALV, LALV or LAHV - Triggering Jump Wildcard or Random Damage")
    // get Random boolean value
    const randomValue = Math.floor(Math.random() * 2);
    if (randomValue === 0) {
        logger.triggerEventLog("Greens get Jump Wildcard")
        store.setPopup(true, "Du kannst mit einer Einheit die Aktion 'Jump' ausführen!")
        setTimeout(() => { }, 3000)
        manipulateGame.setJumpWildcard(store.state.currentGame.game);
        logger.triggerEventLog("--------------------------")
        return
    }
    else {
        logger.triggerEventLog("Reds random damage unit")
        store.setPopup(true, "Eine Zufällige Einheit vom Gegner erleidet Schaden!")
        setTimeout(() => { }, 3000)
        manipulateGame.redDamageRandomUnit(store.state.currentGame.game);
        logger.triggerEventLog("--------------------------")
        return
    }
}








// function getTargetEvent(store, currentQuadrant, vectorLength) {
//     // Prüfen, ob der Spieler in der Runde ist
//     if (!checkIfPlayerIsInRound(store)) return;

//     // Liste der Events für die Quadranten und Fallbacks
//     const events = [
//         // LAHV
//         {
//             quadrant: "LAHV",
//             vectorRange: [1.66, 1.85],
//             condition: () => checkIfGreenHasLessUnitsThanRed(store),
//             action: () => manipulateGame.greenAddMage(store.state.currentGame.game),
//         },
//         {
//             quadrant: "LAHV",
//             vectorRange: [0.79, 1.66],
//             condition: () => checkIfFractionHasUnit(store, "reds", "Warrior"),
//             action: () => manipulateGame.redDamageWarrior(store.state.currentGame.game),
//         },
//         {
//             quadrant: "LAHV",
//             vectorRange: [0, 0.79],
//             condition: () => checkIfFractionHasUnit(store, "greens", "Archer"),
//             action: () => manipulateGame.greenTakeDamageArcher(store.state.currentGame.game),
//         },
//         // HALV / LALV
//         {
//             quadrant: ["HALV", "LALV"],
//             vectorRange: [1.5, 1.85],
//             condition: () => checkIfFractionHasUnit(store, "greens", "Horseman"),
//             action: () => manipulateGame.greenTakeDamageHorseman(store.state.currentGame.game),
//         },
//         {
//             quadrant: ["HALV", "LALV"],
//             vectorRange: [1.0, 1.5],
//             condition: () => checkIfFractionHasUnit(store, "reds", "Barbarian"),
//             action: () => manipulateGame.redDamageBarbarian(store.state.currentGame.game),
//         },
//         {
//             quadrant: ["HALV", "LALV"],
//             vectorRange: [0.5, 1.0],
//             condition: () => checkIfFractionHasUnit(store, "reds", "Knight"),
//             action: () => manipulateGame.redDamageKnight(store.state.currentGame.game),
//         },
//         {
//             quadrant: ["HALV", "LALV"],
//             vectorRange: [0, 0.5],
//             condition: () => checkIfFractionHasUnit(store, "greens", "Cleric"),
//             action: () => manipulateGame.greenTakeDamageCleric(store.state.currentGame.game),
//         },
//         // HALV / LALV / LAHV (Fallbacks)
//         {
//             quadrant: ["HALV", "LALV", "LAHV"],
//             vectorRange: [1.41, 10],
//             condition: checkIfFractionHasUnit(store, "reds", "Dragon"),
//             action: () => manipulateGame.setDamageMultiplyerOnDragon(store.state.currentGame.game),
//         },
//         {
//             quadrant: ["HALV", "LALV", "LAHV"],
//             vectorRange: [0.91, 1.41],
//             condition: null,
//             action: () => manipulateGame.redDamageRandomUnit(store.state.currentGame.game),
//         },
//         {
//             quadrant: ["HALV", "LALV", "LAHV"],
//             vectorRange: [0.7, 0.9],
//             condition: null,
//             action: () => manipulateGame.setJumpWildcard(store.state.currentGame.game),
//         },
//         {
//             quadrant: ["HALV", "LALV", "LAHV"],
//             vectorRange: [0, 0.7],
//             condition: null,
//             action: () => manipulateGame.redTurnEnd(store.state.currentGame.game),
//         },
//     ];

//     // Iterative Prüfung der Events
//     for (const event of events) {
//         // Prüfen, ob der Quadrant passt
//         if (
//             (Array.isArray(event.quadrant) && event.quadrant.includes(currentQuadrant)) ||
//             event.quadrant === currentQuadrant
//         ) {
//             // Prüfen, ob die Vektorlänge im Bereich liegt
//             if (vectorLength > event.vectorRange[0] && vectorLength <= event.vectorRange[1]) {
//                 // Prüfen, ob die Bedingung erfüllt ist (falls vorhanden)
//                 if (!event.condition || event.condition()) {
//                     console.log("Triggering event:", event);
//                     event.action();
//                     return;
//                 }
//                 // Falls Bedingung nicht erfüllt ist, nächstes Event testen
//                 console.log("Condition not met for event:", event);
//                 continue;
//             }
//         }
//     }

//     // Fallback für bedingungslose Events
//     console.log("No matching event found. Executing fallback.");
//     manipulateGame.setJumpWildcard(store.state.currentGame.game);
// }
