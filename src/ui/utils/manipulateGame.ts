import OpponentAi from "../../ai/opponentAi"


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





}

const manipulateGame = new ManipulateGame()
export default manipulateGame