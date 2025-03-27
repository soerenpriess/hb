import logger from '../../ui/utils/logger'
import Game from '../game'
import Hex from '../hex'
import Unit, { UnitStatus } from '../unit'

export interface IActionResult {
  targets: Array<{
    unitId: string,
    damage?: number,
    status?: { status: UnitStatus, exp: number },
    newPosition?: Hex,
  }>
}

/**
 * Generic Action interface.
 */
export interface IAction {
  name: string
  description: string

  game: Game

  execute(target: Hex): Promise<void>

  targets(): Hex[]
}

export class UnitAction implements IAction {
  name: string
  description: string

  params: any = {}

  manaCost: number = 0

  constructor(public game: Game, public unit: Unit) { }

  get isAvailable() {
    return this.unit.mana >= this.manaCost
  }

  get canExecute() {
    return this.isAvailable && this.unit.canPerformAction
  }

  async execute(target: Hex) {
    if (!this.canExecute) {
      return
    }

    this.unit.actionPerformed = true
    this.unit.mp = 0
    this.unit.mana -= this.manaCost

    await this.game.emit('action:perform', this)
    const result = this.performAction(target)
    await Promise.all(result.targets.map(async t => {
      const targetUnit = this.game.things.get(t.unitId) as Unit

      // const targetUnitType = targetUnit.type.name

      if (t.damage) {
        if (t.damage && targetUnit.damageMultiplyerOnDragon && targetUnit.type.name === 'Dragon') {
          t.damage *= 2;
          targetUnit.damageMultiplyerOnDragon = false;
        }

        let hp = await targetUnit.takeDamage(t.damage)
        const targetFaction = Array.from(this.game.factions.values()).filter((f: Faction) => f.id !== this.game.currenFaction.id)[0]

        if (t.damage < 0) {
          await logger.log(this.game.currenFaction.name, "Heal", targetUnit.type.name)
        }

        if (t.damage > 0) {
          await logger.log(this.game.currenFaction.name, "Attack", targetUnit.type.name)
          logger.log(targetFaction.name, "TakeDamage", targetUnit.type.name)
        }

        if (hp <= 0) {
          await logger.log(targetFaction.name, "Die", targetUnit.type.name)
          const targetFactionUnits = this.game.factionUnits[targetFaction.id]
          const targetFactionUnitsTypes = targetFactionUnits.map(u => u.type.name)
          logger.log(targetFaction.name, "UnitsLeft", targetFactionUnitsTypes.join(','))
        }
      }
      if (t.status) {
        await targetUnit.alterStatus(t.status.status, t.status.exp)
      }
      if (t.newPosition) {
        this.game.moveThing(targetUnit, t.newPosition)
        targetUnit.pos = t.newPosition
      }
    }))
  }

  targets(): Hex[] {
    throw Error('Not Implemented')
  }

  performAction(target: Hex): IActionResult {
    throw Error('Not Implemented')
  }
}
