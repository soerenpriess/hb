import exp from "constants";
import io from "socket.io-client";
import Store from "./ui/stageView/store"
import manipulateGame from "./ui/utils/manipulateGame";
import { green, red } from "color";

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

// function getTargetEvent(store, currentQuadrant) {
//     // when player is not in round, do nothing
//     if (!checkIfPlayerIsInRound(store)) return

//     if (currentQuadrant === "LAHV") {
//         // check if greens have less units than reds
//         if (checkIfGreenHasLessUnitsThanRed(store)) {
//             console.log("Greens have less units than Reds")
//             manipulateGame.greenAddMage(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
//             return
//         }
//         // check if greens have unit archer
//         if (checkIfFractionHasUnit(store, "reds", "Warrior")) {
//             console.log("Reds have unit Warrior")
//             manipulateGame.redDamageWarrior(store.state.currentGame.game);
//             return
//         }
//         // check if greens have unit archer
//         if (checkIfFractionHasUnit(store, "greens", "Archer")) {
//             console.log("Greens have unit Archer")
//             manipulateGame.greenTakeDamageArcher(store.state.currentGame.game);
//             return
//         }
//     }

//     if (currentQuadrant === "HALV" || currentQuadrant === "LALV") {
//         // check if greens have unit horseman
//         if (checkIfFractionHasUnit(store, "greens", "Horseman")) {
//             console.log("Greens have unit Horseman")
//             manipulateGame.greenTakeDamageHorseman(store.state.currentGame.game);
//             return
//         }

//         // check if reds have unit barbarian
//         if (checkIfFractionHasUnit(store, "reds", "Barbarian")) {
//             console.log("Reds have unit Barbarian")
//             manipulateGame.redDamageBarbarian(store.state.currentGame.game);
//             return
//         }

//         // check if reds have unit Knight
//         if (checkIfFractionHasUnit(store, "reds", "Knight")) {
//             console.log("Reds have unit Knight")
//             manipulateGame.redDamageKnight(store.state.currentGame.game);
//             return
//         }

//         // check if greens have unit cleric
//         if (checkIfFractionHasUnit(store, "greens", "Cleric")) {
//             console.log("Greens have unit Cleric")
//             manipulateGame.greenTakeDamageCleric(store.state.currentGame.game);
//             return
//         }
//     }

//     if (currentQuadrant === "HALV" || currentQuadrant === "LALV" || currentQuadrant === "LAHV") {
//         // check if reds have unit dragon
//         if (checkIfFractionHasUnit(store, "reds", "Dragon")) {
//             console.log("Reds have unit Dragon")
//             manipulateGame.setDamageMultiplyerOnDragon(store.state.currentGame.game);
//             return
//         }

//         // check if greens have less units than reds
//         if (checkIfGreenHasLessUnitsThanRed(store)) {
//             console.log("Greens have less units than Reds")
//             manipulateGame.greenAddArcher(store.state.currentGame.game);
//             return
//         }

//         // check if reds has turn
//         if (checkIfRedHasTurn(store)) {
//             console.log("Reds has turn")
//             manipulateGame.redTurnEnd(store.state.currentGame.game);
//             return
//         }

//         //Fallback
//         manipulateGame.setJumpWildcard(store.state.currentGame.game);
//         manipulateGame.redDamageRandomUnit(store.state.currentGame.game);

//         //TODO: Die vektorlänge spielt noch eine rolle. In dem py script die vektorlänge zu dem HAHV quadranten berechnen und dann entsprechend die vektorlänge anpassen
//         // grafiken erstellen für den ablauf und den bedingungen
//         // Im Paper bezüglich der Startquadranten von den Events, werden einige StartQuadranten genommen, welche defakto nicht passen, aber damit argumentiert wird, dass diese in die richtung zeigen
//         // nun argumentiere, dass es zwei optionen gibt, entweder kein event auslösen und warten bis ein target quadrant kommt, in welchem ein event zum auslösen ist und so wie es aktuell gemacht wurde
//     }

// }

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


function getTargetEvent(store, currentQuadrant, vectorLength) {
    // when player is not in round, do nothing
    if (!checkIfPlayerIsInRound(store)) return

    switch (currentQuadrant) {
        case "LAHV":
            // trigger LAHV Event
            trigger_LAHV_Event(store, vectorLength)
            break;
        case "HALV":
            // trigger HALV Event
            trigger_HALV_LALV_Event(store, vectorLength)
            break;
        case "LALV":
            // trigger HALV or LALV Event
            trigger_HALV_LALV_Event(store, vectorLength)
            break;
        default:
            // trigger HALV, LALV or LAHV Event
            trigger_HALV_LALV_LAHV_Events(store, vectorLength)
            break;
    }

    function trigger_LAHV_Event(store, vectorLength) {

        switch (vectorLength) {
            case vectorLength > 1.66:
                // check if greens have less units than reds
                if (checkIfGreenHasLessUnitsThanRed(store)) {
                    console.log("Greens have less units than Reds")
                    manipulateGame.greenAddMage(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
                    return
                }
                break;
            case vectorLength > 0.79:
                // check if red have unit warrior
                if (checkIfFractionHasUnit(store, "reds", "Warrior")) {
                    console.log("Reds have unit Warrior")
                    manipulateGame.redDamageWarrior(store.state.currentGame.game);
                    return
                }
                break;
            default:
                // check if greens have unit archer
                if (checkIfFractionHasUnit(store, "greens", "Archer")) {
                    console.log("Greens have unit Archer")
                    manipulateGame.greenTakeDamageArcher(store.state.currentGame.game);
                    return
                }
                break;
        }

        trigger_HALV_LALV_LAHV_Events(store, vectorLength)

        // if (vectorLength > 1.66) {
        //     // check if greens have less units than reds
        //     if (checkIfGreenHasLessUnitsThanRed(store)) {
        //         console.log("Greens have less units than Reds")
        //         manipulateGame.greenAddMage(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
        //         return
        //     }
        // }

        // if (vectorLength > 0.79 && vectorLength <= 1.66) {
        //     // check if red have unit warrior
        //     if (checkIfFractionHasUnit(store, "reds", "Warrior")) {
        //         console.log("Reds have unit Warrior")
        //         manipulateGame.redDamageWarrior(store.state.currentGame.game);
        //         return
        //     }
        // }

        // if (vectorLength >= 0 && vectorLength <= 0.79) {
        //     // check if greens have unit archer
        //     if (checkIfFractionHasUnit(store, "greens", "Archer")) {
        //         console.log("Greens have unit Archer")
        //         manipulateGame.greenTakeDamageArcher(store.state.currentGame.game);
        //         return
        //     }
        // }

        // // if nothing matches, trigger Fallback event
        // trigger_HALV_LALV_LAHV_Events(store, vectorLength)
    }

    function trigger_HALV_LALV_Event(store, vectorLength) {

        switch (vectorLength) {
            case vectorLength > 1.56:
                // check if greens have horseman
                if (checkIfFractionHasUnit(store, "greens", "Horseman")) {
                    console.log("Greens have unit Horseman")
                    manipulateGame.greenTakeDamageHorseman(store.state.currentGame.game);
                    return
                }
                break;
            case vectorLength > 1.11:
                // check if reds have unit barbarian
                if (checkIfFractionHasUnit(store, 'reds', 'Barbarian')) {
                    console.log("Reds have unit Barbarian")
                    manipulateGame.redDamageBarbarian(store.state.currentGame.game);
                    return
                }
                break;
            case vectorLength > 0.66:
                // check if reds have unit knight
                if (checkIfFractionHasUnit(store, 'reds', 'Knight')) {
                    console.log("Reds have unit Knight")
                    manipulateGame.redDamageKnight(store.state.currentGame.game);
                    return
                }
                break;
            default:
                // check if greens have unit cleric
                if (checkIfFractionHasUnit(store, 'greens', 'Cleric')) {
                    console.log("Greens have unit Cleric")
                    manipulateGame.greenTakeDamageCleric(store.state.currentGame.game);
                    return
                }
                break;
        }

        trigger_HALV_LALV_LAHV_Events(store, vectorLength)

        // if (vectorLength > 1.56) {
        //     // check if greens have horseman
        //     if (checkIfFractionHasUnit(store, "greens", "Horseman")) {
        //         console.log("Greens have unit Horseman")
        //         manipulateGame.greenTakeDamageHorseman(store.state.currentGame.game);
        //         return
        //     }
        // }

        // if (vectorLength > 1.11 && vectorLength <= 1.56) {
        //     // check if reds have unit barbarian
        //     if (checkIfFractionHasUnit(store, 'reds', 'Barbarian')) {
        //         console.log("Reds have unit Barbarian")
        //         manipulateGame.redDamageBarbarian(store.state.currentGame.game);
        //         return
        //     }
        // }

        // if (vectorLength > 0.66 && vectorLength <= 1.11) {
        //     // check if reds have unit knight
        //     if (checkIfFractionHasUnit(store, 'reds', 'Knight')) {
        //         console.log("Reds have unit Knight")
        //         manipulateGame.redDamageKnight(store.state.currentGame.game);
        //         return
        //     }
        // }

        // if (vectorLength >= 0 && vectorLength <= 0.66) {
        //     // check if greens have unit cleric
        //     if (checkIfFractionHasUnit(store, 'greens', 'Cleric')) {
        //         console.log("Greens have unit Cleric")
        //         manipulateGame.greenTakeDamageCleric(store.state.currentGame.game);
        //         return
        //     }
        // }

        // trigger_HALV_LALV_LAHV_Events(store, vectorLength)
    }

    function trigger_HALV_LALV_LAHV_Events(store, vectorLength) {

        switch (vectorLength) {
            case vectorLength > 1.41:
                // check if reds have unit dragon
                if (checkIfFractionHasUnit(store, "reds", "Dragon")) {
                    console.log("Reds have unit Dragon")
                    manipulateGame.setDamageMultiplyerOnDragon(store.state.currentGame.game);
                    return
                }
                break;
            case vectorLength > 0.91:
                console.log("set Jump Wildcard")
                manipulateGame.setJumpWildcard(store.state.currentGame.game);
                return
            case vectorLength > 0.72:
                // check if greens have less units than reds
                if (checkIfGreenHasLessUnitsThanRed(store)) {
                    console.log("Greens have less units than Reds")
                    manipulateGame.greenAddArcher(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
                    return
                }
                break;
            case vectorLength > 0.52:
                console.log("red damage random unit")
                manipulateGame.redDamageRandomUnit(store.state.currentGame.game);
                return
            default:
                // check if reds has turn
                if (checkIfRedHasTurn(store)) {
                    manipulateGame.redTurnEnd(store.state.currentGame.game);
                    return
                }
                break;
        }

        // get Random boolean value
        const randomValue = Math.floor(Math.random() * 2);
        if (randomValue === 0) {
            manipulateGame.setJumpWildcard(store.state.currentGame.game);
        }
        else {
            manipulateGame.redDamageRandomUnit(store.state.currentGame.game);
        }


        // if (vectorLength > 1.41) {
        //     // check if reds have unit dragon
        //     if (checkIfFractionHasUnit(store, "reds", "Dragon")) {
        //         console.log("Reds have unit Dragon")
        //         manipulateGame.setDamageMultiplyerOnDragon(store.state.currentGame.game);
        //         return
        //     }
        // }

        // if (vectorLength > 0.91 && vectorLength <= 1.41) {
        //     console.log("set Jump Wildcard")
        //     manipulateGame.setJumpWildcard(store.state.currentGame.game);
        //     return
        // }

        // if (vectorLength > 0.72 && vectorLength <= 0.91) {
        //     // check if greens have less units than reds
        //     if (checkIfGreenHasLessUnitsThanRed(store)) {
        //         console.log("Greens have less units than Reds")
        //         manipulateGame.greenAddArcher(store.state.currentGame.game); // Beispiel: Füge einen Bogenschützen hinzu
        //         return
        //     }
        //     return
        // }

        // if (vectorLength > 0.52 && vectorLength <= 0.72) {
        //     console.log("red damage random unit")
        //     manipulateGame.redDamageRandomUnit(store.state.currentGame.game);
        //     return
        // }

        // if (vectorLength >= 0 && vectorLength <= 0.52) {
        //     // check if reds has turn
        //     if (checkIfRedHasTurn(store)) {
        //         manipulateGame.redTurnEnd(store.state.currentGame.game);
        //     }
        //     return
        // }

        // // Final Fallback if nothing matches
        // // Randomly choose between two actions
        // // 0 = setJumpWildcard, 1 = redDamageRandomUnit
        // const randomValue = Math.floor(Math.random() * 2);
        // if (randomValue === 0) {
        //     manipulateGame.setJumpWildcard(store.state.currentGame.game);
        // }
        // else {
        //     manipulateGame.redDamageRandomUnit(store.state.currentGame.game);
        // }
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
