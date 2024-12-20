import createLevel from '../content/createLevel'
import { generateLevel } from '../content/levels'
import Game from '../engine/game'
import { IUnitType } from '../engine/unit'
import * as units from '../engine/units'
import { debug } from '../utils'
import * as storage from './storage'
import Store from './utils/Store'

import logger from './utils/logger'

export interface IState {
  levelReached: number,
  party: IUnitType[]
  money: number,

  currentGame?: {
    game: Game,
    level: number,
    playerFaction: string,
    reward: number,
  }
}

export default class MainStore extends Store<IState> {
  finishGame = (won: boolean) => {
    if (won) {
      const { money, currentGame } = this.state
      const { game, level, playerFaction, reward } = currentGame!

      this.set({
        money: money + reward,
        party: game.factionUnits[playerFaction].map(u => u.type),
        levelReached: level + 1,
        currentGame: undefined,
      }, this.save)
      logger.log("System", "Win", game.currenFaction.id)
      logger.log("System", "Loose", Array.from(game.factions.values()).filter(f => f.id !== game.currenFaction.id)[0].id)
      logger.log("System", "Round" + level.toString(), "End")
      logger.log("System", "Reward", reward.toString())
    } else {
      const { currentGame } = this.state
      const { game, level } = currentGame!
      logger.log("System", "Win", game.currenFaction.id)
      logger.log("System", "Loose", Array.from(game.factions.values()).filter(f => f.id !== game.currenFaction.id)[0].id)
      logger.log("System", "Round" + level.toString(), "End")
      this.set({ currentGame: undefined })
    }

    debug('mainStore: finished game', won)
  }

  startGame(level: number) {
    debug('mainStore: starting new game')
    logger.log("System", "Round" + level.toString(), "Start")
    const levelDef = generateLevel(level)
    const game = createLevel(levelDef, this.state.party)
    this.set({
      currentGame: {
        game,
        level,
        // The player faction is the first one, the rest are AIs
        playerFaction: Array.from(game.factions.keys())[0],
        reward: levelDef.reward,
      },
    })
  }

  purchase = (cart: IUnitType[], cost: number) => {
    debug('mainStore: purchased', cart, 'for', cost)
    logger.log("1", "purchased", cart[0].name)
    this.set({
      money: this.state.money - cost,
      party: [...this.state.party, ...cart],
    }, this.save)
    logger.log("System", "MoneyLeft", (this.state.money - cost).toString())
  }

  resetProgress = () => {
    debug('mainStore: resetting progress')
    logger.log("System", "Game", "ResetProgress")
    storage.reset()
    this.set(this.loadProgress())
  }

  loadProgress = () => {
    return storage.load() || this.getInitialState()
  }

  private getInitialState = () => {
    return {
      levelReached: 0,
      party: [units.archer, units.warrior, units.warrior, units.warrior],
      money: 0,
    }
  }

  private save = () => {
    storage.save({
      money: this.state.money,
      party: this.state.party,
      levelReached: this.state.levelReached,
    })
  }
}
