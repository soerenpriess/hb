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
}

const manipulateGame = new ManipulateGame()
export default manipulateGame