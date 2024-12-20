import { ICell } from '../engine/map'
import Unit from '../engine/unit'
import Store from '../ui/stageView/store'
import { debug, intervalForeach } from '../utils'
import UnitAi from './unitAi'

import logger from '../ui/utils/logger'

/**
 * the main strategy for the opponent is to move each unit, and if possible
 * execute an action
 */
export default class OpponentAi {
  constructor(private store: Store) { }

  hasCellFriendlyUnit = (c: ICell) => {
    return c.thing && c.thing instanceof Unit
      ? c.thing.factionId === this.store.state.game.currenFaction.id
      : false
  }

  hasCellEnemyUnit = (c: ICell) => {
    return c.thing && c.thing instanceof Unit
      ? c.thing.factionId !== this.store.state.game.currenFaction.id
      : false
  }

  update() {
    this.store.forceUpdate()
    if (this.store.state.game.checkGameOver()) {
      throw 'GAME_OVER' // tslint:disable-line:no-string-throw
    }
  }

  isCellNearEnemyUnit = (c: ICell): boolean => {
    const { map } = this.store.state.game
    return c.pos.neighbors.filter(map.isIn).map(map.cellAt)
      .some(this.hasCellEnemyUnit)
  }

  async tryExecuteUnitAction(unit: Unit, action: (() => Promise<any>) | null, actionName?: string | null) {
    this.update()
    if (action && unit.canPerformAction) {
      const { id } = this.store.state.game.currenFaction
      if (actionName) logger.log(id, 'Executing action', actionName)
      await action()
    }
    this.update()
  }

  moveUnit = async (unit: Unit) => {
    debug('Ai: moving unit', unit)
    const { game } = this.store.state
    const unitAi = new UnitAi(unit, game.map, this)

    await this.tryExecuteUnitAction(unit, unitAi.getAction(), unitAi.getActionName())

    for (const p of unitAi.findPath()) {
      // we have to recompute the move targets every cycle because stuff
      // could have happened after performing the action
      const moveTargets = unit.moveTargets()

      if (!(moveTargets.some(h => h.toString() === p.toString()))) {
        debug('ai: reached final position', p)
        // const pX = p._q
        // const pY = p._r
        // logger.log('Ai', `Moving unit ${unit.type.name} from ${unitBasePosition} to ${pX - 1},${pY}`);
        break
      }
      await unit.move(p)

      await this.tryExecuteUnitAction(unit, unitAi.getAction(), unitAi.getActionName())
    }

    await this.tryExecuteUnitAction(unit, unitAi.getLastAction(), unitAi.getActionName())

    this.update()
  }

  async performTurn() {
    try {
      const { game } = this.store.state
      const { id } = this.store.state.game.currenFaction
      debug('ai: perform turn for faction', id)
      const units = game.factionUnits[id]
      await intervalForeach(units, this.moveUnit, 200)

      await this.store.endTurn()
    } catch (e) {
      if (e === 'GAME_OVER') {
        // pass
      }
      throw e
    }
  }
}
