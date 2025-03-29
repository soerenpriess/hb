import OpponentAi from "../../ai/opponentAi"
import Jump from "../../engine/actions/jump"
import races from "../../engine/units/races"


class ManipulateGame {

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
        console.log('greenAddArcher')

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