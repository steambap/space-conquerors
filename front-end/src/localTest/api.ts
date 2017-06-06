import * as _ from 'lodash'
import { Action } from 'sco-engine/actions'
import * as dx from 'sco-engine/definitions'
import { ITurnLogEntry } from 'sco-engine/gameEngine'
import MapGenerator from 'sco-engine/mapGenerator'
import * as mapLayout from 'sco-engine/mapLayout'
import * as sx from 'sco-engine/state'
import { deepClone } from 'sco-engine/utils'
import { getStateforPlayer, IVisibleState } from 'sco-engine/visibility'

import IApi, { Game } from '../api'
import * as storage from './storage'

const GAME_ID = 'test game'

export default class TestApi implements IApi {
  game: Game | null = null
  gameState: sx.IGameState | null = null
  actions: { [idx: string]: Action[] }
  log: ITurnLogEntry[]

  playerId: string

  constructor() {
    const data = storage.load()
    this.actions = {}
    this.log = []

    if (data) {
      this.gameState = data.state
      this.game = {
        currentTurnNumber: data.currentTurnNumber,
        id: GAME_ID,
        map: data.map,
        players: data.players,
        mapLayout: data.mapLayout,
      }
      this.actions = data.actions
      this.log = data.log
    }
  }

  async createGame(players: string[]): Promise<string> {
    const playerStates: sx.IPlayerState[] = players.map(p => ({
      id: p,
      status: sx.PlayerStatus.Alive,
      resourcesAmount: dx.zeroResources({ gold: 2000, iron: 300 }),
      productionStatuses: [],
      technologies: {},
    }))

    const mapGenerator = new MapGenerator()
    const { origins, ...map } = mapGenerator.generate(players.length)
    const planetStates: sx.IPlanetState[] = _.values(map.cells)
      .filter(c => c.planet)
      .map(p => ({ locationId: p.id }))
    const indexedPlanetStates = _.keyBy(planetStates, 'locationId')
    origins.forEach((o, idx) => {
      indexedPlanetStates[o.id].ownerPlayerId = players[idx]
    })

    this.gameState = {
      players: _.keyBy(playerStates, 'id'),
      planets: indexedPlanetStates,
      units: {},
      buildings: {},
      marketState: {},
    }

    this.game = {
      id: GAME_ID,
      currentTurnNumber: 0,
      map,
      players,
      mapLayout: mapLayout.generate(map),
    }

    this.actions = {}

    this.log = []

    this.save()

    return GAME_ID
  }

  async getGame(gameId: string): Promise<Game | null> {
    return deepClone(this.game)
  }

  async getGameState(gameId: string): Promise<IVisibleState | null> {
    if (!this.gameState || !this.game) {
      return null
    }
    return deepClone(getStateforPlayer(this.playerId, this.gameState, this.game.map))
  }

  async getActions(gameId: string): Promise<Action[]> {
    return deepClone(this.actions[this.playerId] || [])
  }

  async submitActions(gameId: string, actions: Action[]): Promise<void> {
    this.actions[this.playerId] = deepClone(actions)

    this.save()
  }

  async getLog(gameId: string): Promise<ITurnLogEntry[]> {
    return this.log.filter(l => l.player === this.playerId)
  }

  private save() {
    if (!this.game || !this.gameState) {
      return
    }

    storage.save({
      currentTurnNumber: this.game.currentTurnNumber,
      map: this.game.map,
      players: this.game.players,
      state: this.gameState,
      actions: this.actions,
      mapLayout: this.game.mapLayout,
      log: this.log,
    })
  }
}