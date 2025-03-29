import OpponentAi from "../../ai/opponentAi"
import Jump from "../../engine/actions/jump"
import { IUnitType } from "../../engine/unit"
import races from "../../engine/units/races"


class ManipulateGame {

    public async getUnitsByFaction(store: any, faction: string): Promise<any[]> {
        const units = Array.from(store.things.values()).filter((u: any) => u.factionId === faction)
        console.log('getUnitsByFaction', units)
        return units
    }

    public async increaseDamageOfUnitsFromFaction(store: any, faction: string, damage: number): Promise<void> {
        const units = await this.getUnitsByFaction(store, faction)
        units.forEach((u: any) => {
            u.actions.forEach((action: any) => {
                if (action.params.damage) {
                    action.params.damage += damage
                    console.log('damage', action.params.damage)
                }
            })
        })
    }

    public async increaseMovementPointsOfUnitsFromFaction(store: any, faction: string, movementPoints: number): Promise<void> {
        const units = await this.getUnitsByFaction(store, faction)
        units.forEach((u: any) => {
            if (u.mp) {
                u.type.mp += movementPoints
                u.mp += movementPoints
                console.log('movementPoints', u.mp)
            }
        })
    }

    public async increaseManaOfUnitsFromFaction(store: any, faction: string, mana: number): Promise<void> {
        const units = await this.getUnitsByFaction(store, faction)
        units.forEach((u: any) => {
            if (u.mana) {
                u.type.mana += mana
                u.mana += mana
                console.log('mana', u.mana)
            }
        })
    }

    public async increaseHealthOfUnitsFromFaction(store: any, faction: string, health: number): Promise<void> {
        const units = await this.getUnitsByFaction(store, faction)
        units.forEach((u: any) => {
            if (u.hp) {
                u.type.hp += health
                u.hp += health
                console.log('health', u.hp)
            }
        })
    }

    public async increaseResistanceOfUnitsFromFaction(store: any, faction: string, resistance: number): Promise<void> {
        const units = await this.getUnitsByFaction(store, faction)
        units.forEach((u: any) => {
            if (u.resistance) {
                u.resistance += resistance
                console.log('resistance', u.resistance)
            }
        })
    }

    // public async increaseGoldOfFaction(store: any, faction: string, gold: number): Promise<void> {
    //     const factions = Array.from(store.factions.values()).filter((f: any) => f.id === faction)
    //     factions.forEach((f: any) => {
    //         f.gold += gold
    //         console.log('gold', f.gold)
    //     })
    // }

    //---------------------------------

    // public async greenAddMage(store: any): Promise<void> {
    //     const mage = {
    //         "id": "mage",
    //         "name": "Mage",
    //         "type": "unit",
    //         "factionId": "green",
    //         "hp": 20,
    //         "mp": 3,
    //         "mana": 3,
    //         "resistance": 0,
    //         "actions": [
    //             {
    //                 "type": "attack",
    //                 "params": {
    //                     "damage": 5,
    //                     "range": 3
    //                 }
    //             },
    //             {
    //                 "type": "heal",
    //                 "params": {
    //                     "heal": 5,
    //                     "range": 3
    //                 }
    //             }
    //         ]
    //     }
    //     store.things.set(mage.id, mage)

    //     console.log('greenAddMage', mage)
    //     console.log('store', store)
    // }

    public async redDamageWarrior(store: any): Promise<void> {
        const warrior = Array.from(store.things.values()).filter((u: any) => u.factionId === '2' && u.type.name === "Warrior")[0] as { hp: number }
        warrior.hp -= 10
    }

    public async redDamageBarbarian(store: any): Promise<void> {
        const warrior = Array.from(store.things.values()).filter((u: any) => u.factionId === '2' && u.type.name === "Barbarian")[0] as { hp: number }
        warrior.hp -= 10
    }

    public async redDamageKnight(store: any): Promise<void> {
        const warrior = Array.from(store.things.values()).filter((u: any) => u.factionId === '2' && u.type.name === "Knight")[0] as { hp: number }
        warrior.hp -= 10
    }

    public async redDamageRandomUnit(store: any): Promise<void> {
        const units = Array.from(store.things.values()).filter((u: any) => u.factionId === '2')
        const unit = units[Math.floor(Math.random() * units.length)] as { hp: number }
        unit.hp -= 10
    }

    public async greenTakeDamageArcher(store: any): Promise<void> {
        const archer = Array.from(store.things.values()).filter((u: any) => u.factionId === '1' && u.type.name === "Archer")[0] as { hp: number }
        archer.hp -= 10
    }

    public async greenTakeDamageHorseman(store: any): Promise<void> {
        const horseman = Array.from(store.things.values()).filter((u: any) => u.factionId === '1' && u.type.name === "Horseman")[0] as { hp: number }
        horseman.hp -= 10
    }

    public async greenTakeDamageCleric(store: any): Promise<void> {
        const cleric = Array.from(store.things.values()).filter((u: any) => u.factionId === '1' && u.type.name === "Cleric")[0] as { hp: number }
        cleric.hp -= 10
    }

    public async redTurnEnd(store: any): Promise<void> {
        const opponent = new OpponentAi(store);
        opponent.abortTurn();
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
}

const manipulateGame = new ManipulateGame()
export default manipulateGame