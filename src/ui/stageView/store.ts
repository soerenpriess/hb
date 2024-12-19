import OpponentAi from '../../ai/opponentAi'
import { UnitAction } from '../../engine/actions/action'
import Hex from '../../engine/hex'
import { ICell } from '../../engine/map'
import Unit from '../../engine/unit'
import BaseStore from '../utils/Store'
import logger from '../utils/logger'
import manipulateGame from '../utils/manipulateGame'

import { IState } from './index'

export default class Store extends BaseStore<IState> {
  indexCells(hexes: Hex[]): { [idx: string]: Hex } {
    const index = {}
    hexes.forEach(h => index[h.toString()] = h)
    return index
  }

  getCellInfo(target: ICell) {
    const { thing } = target

    return {
      cell: target,
      unit: (thing && thing instanceof Unit) ? {
        unit: thing!,
        paths: this.indexCells(thing.moveTargets()),
      } : undefined,
    }
  }

  selectCell = async (cell: ICell) => {
    const { selection, playerFaction } = this.state
    const unit = selection && selection.unit
    const action = unit && unit.action

    let newSelection
    if (action && action.targets[cell.pos.toString()]) {
      await action.action.execute(cell.pos)
    } else if (
      !action && unit && unit.unit.factionId === playerFaction
      && unit.paths[cell.pos.toString()]
    ) {
      await unit.unit.move(cell.pos)
      newSelection = this.getCellInfo(cell)
    } else {
      newSelection = this.getCellInfo(cell)
    }

    this.set({ selection: newSelection, hover: undefined })
  }

  selectAction = (action: UnitAction) => {
    const { selection } = this.state
    selection!.unit!.action = {
      action,
      targets: this.indexCells(action.targets()),
    }

    this.set({ selection, hover: undefined })
  }

  hover = (cell: ICell | null) => {
    if (!cell) {
      this.set({ hover: undefined })
      return
    }

    const { selection } = this.state
    const unit = selection && selection.unit
    const action = unit && unit.action

    if (action && action.action.params.area) {
      action.area = action.targets[cell.pos.toString()]
        ? this.indexCells(cell.pos.range(action.action.params.area))
        : undefined
    }

    this.set({ selection, hover: this.getCellInfo(cell) })
  }

  test = async () => {
    const { game } = this.state

    console.log('game', game)
    console.log("testo", await manipulateGame.getUnitsByFaction(game, '1'))
    console.log("testo", await manipulateGame.increaseDamageOfUnitsFromFaction(game, '1', 100))
    await manipulateGame.increaseMovementPointsOfUnitsFromFaction(game, '1', 3)
  }

  endTurn = async () => {
    const { game } = this.state

    let currentFactionName = game.currenFaction.id === this.state.playerFaction ? "Player" : "Ai"

    // logger.log("EndTurn", "Ending turn for " + currentFactionName)

    await game.endTurn()
    this.set({
      selection: undefined,
      hover: undefined,
    })

    currentFactionName = game.currenFaction.id === this.state.playerFaction ? "Player" : "Ai"
    // logger.log("StartTurn", "Starting turn for " + currentFactionName)

    const currentFactionId = game.currenFaction.id
    if (currentFactionId !== this.state.playerFaction) {
      const opponent = new OpponentAi(this)
      await opponent.performTurn()
    }
    this.set({})
  }
}
