import OpponentAi from "../../ai/opponentAi"
import Jump from "../../engine/actions/jump"
import races from "../../engine/units/races"

class ManipulateGame {

    public async redDamageWarrior(store: any): Promise<void> {
        const warrior = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Reds" && u.type.name === "Warrior")[0] as { hp: number }
        warrior.hp -= 3

        //check if unit is dead
        if (warrior.hp <= 0) {
            //remove unit from store
            store.removeThing(warrior)
        }
    }

    public async redDamageBarbarian(store: any): Promise<void> {
        const warrior = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Reds" && u.type.name === "Barbarian")[0] as { hp: number }
        warrior.hp -= 3

        //check if unit is dead
        if (warrior.hp <= 0) {
            //remove unit from store
            store.removeThing(warrior)
        }
    }

    public async redDamageKnight(store: any): Promise<void> {
        const warrior = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Reds" && u.type.name === "Knight")[0] as { hp: number }
        warrior.hp -= 6

        //check if unit is dead
        if (warrior.hp <= 0) {
            //remove unit from store
            store.removeThing(warrior)
        }
    }

    public async redDamageRandomUnit(store: any): Promise<void> {
        const units = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Reds")
        const unit = units[Math.floor(Math.random() * units.length)] as { hp: number }
        unit.hp -= 3

        //check if unit is dead
        if (unit.hp <= 0) {
            //remove unit from store
            store.removeThing(unit)
        }
    }

    public async greenTakeDamageArcher(store: any): Promise<void> {
        const archer = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Greens" && u.type.name === "Archer")[0] as { hp: number }
        archer.hp -= 3

        // check if unit is dead
        if (archer.hp <= 0) {
            // remove unit from store
            store.removeThing(archer)
        }
    }

    public async greenTakeDamageHorseman(store: any): Promise<void> {
        const horseman = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Greens" && u.type.name === "Horseman")[0] as { hp: number }
        horseman.hp -= 4

        // check if unit is dead
        if (horseman.hp <= 0) {
            // remove unit from store
            store.removeThing(horseman)
        }
    }

    public async greenTakeDamageCleric(store: any): Promise<void> {
        const cleric = Array.from(store.things.values()).filter((u: any) => u.faction.name === "Greens" && u.type.name === "Cleric")[0] as { hp: number }
        cleric.hp -= 2

        // check if unit is dead
        if (cleric.hp <= 0) {
            // remove unit from store
            store.removeThing(cleric)
        }
    }

    public async redTurnEnd(currentOpponent: OpponentAi | null): Promise<void> {
        if (currentOpponent) {
            currentOpponent.abortTurn()
        } else {
            console.log("No active opponent turn to abort");
        }
    }

    public async setDamageMultiplyerOnDragon(store: any): Promise<void> {
        const units = Array.from(store.things.values()).filter((u: any) => u.type.name === 'Dragon')
        units.forEach((u: any) => {
            u.damageMultiplyerOnDragon = true
        })
    }

    public async setJumpWildcard(store: any): Promise<void> {
        const units = Array.from(store.things.values())//.filter((u: any) => u.fraction.name === "Greens")
        const greenUnits = units.filter((u: any) => u.faction.name === "Greens")

        greenUnits.forEach((u: any) => {
            //check if unit already has action jump
            const hasJump = u.actions.find((a: any) => a.name === "Jump")
            if (!hasJump) u.actions.push(new Jump(store, u))
        })
    }

    public async removeJumpWildcard(store: any): Promise<void> {
        const units = Array.from(store.things.values())//.filter((u: any) => u.fraction.name === "Greens")
        const greenUnits = units.filter((u: any) => u.faction.name === "Greens")

        greenUnits.forEach((u: any) => {
            //check if unit already has action jump
            const isHorseman = u.type.name === "Horseman"
            if (!isHorseman) u.actions = u.actions.filter((a: any) => a.name !== "Jump")
        })
    }

    public async greenAddMage(game: any): Promise<void> {
        // get the faction id of the greens
        const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")

        // get eligible cells for the mage
        const eligibleCells = game.map.cells.filter((c: any) =>
            c.terrain === 0 && !c.thing
        );

        // sort the eligible cells by q and r values
        const maxCell = eligibleCells.reduce((prev: any, current: any) => {
            // Zuerst q-Werte vergleichen
            if (current.pos._q > prev.pos._q) return current;
            if (current.pos._q < prev.pos._q) return prev;

            // Bei gleichem q: r-Werte vergleichen
            return current.pos._r > prev.pos._r ? current : prev;
        }, eligibleCells[0]);

        game.addUnit({ factionId: greenFractionId.id, pos: maxCell.pos, type: races.humans[6] })
    }

    public async greenAddArcher(game: any): Promise<void> {
        // get the faction id of the greens
        const greenFractionId = Array.from(game.factions.values() as Iterable<{ name: string; id: string }>).find((f) => f.name === "Greens")

        // get eligible cells for the mage
        const eligibleCells = game.map.cells.filter((c: any) =>
            c.terrain === 0 && !c.thing
        );

        // sort the eligible cells by q and r values
        const maxCell = eligibleCells.reduce((prev: any, current: any) => {
            // Zuerst q-Werte vergleichen
            if (current.pos._q > prev.pos._q) return current;
            if (current.pos._q < prev.pos._q) return prev;

            // Bei gleichem q: r-Werte vergleichen
            return current.pos._r > prev.pos._r ? current : prev;
        }, eligibleCells[0]);


        game.addUnit({ factionId: greenFractionId.id, pos: maxCell.pos, type: races.humans[0] })
    }

    // public async test(store: any): Promise<void> {
    //     console.log("test");
    //     console.log("store state:", store.state); // Zugriff auf den State des Stores
    //     const game = store.getGame(); // getGame() korrekt aufrufen
    //     console.log("game:", game);
    // }

}

const manipulateGame = new ManipulateGame(); // Store übergeben
export default manipulateGame;