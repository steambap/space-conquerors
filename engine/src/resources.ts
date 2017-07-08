import * as _ from 'lodash'

import buildingTypes from './buildings'
import * as dx from './definitions'
import * as sx from './state'
import technologyTypes from './technologies'
import unitTypes from './units'

export const items: { [idx: string]: dx.PurchaseableItem } = {
  ...buildingTypes,
  ...technologyTypes,
  ...unitTypes,
}

export function subtract(
  a: dx.ResourceAmount,
  b: dx.ResourceAmount,
): dx.ResourceAmount {
  return {
    gold: a.gold - b.gold,
    iron: a.iron - b.iron,
    gas: a.gas - b.gas,
    darkMatter: a.darkMatter - b.darkMatter,
  }
}

export function add(
  a: dx.ResourceAmount,
  b: dx.ResourceAmount,
): dx.ResourceAmount {
  return {
    gold: a.gold + b.gold,
    iron: a.iron + b.iron,
    gas: a.gas + b.gas,
    darkMatter: a.darkMatter + b.darkMatter,
  }
}

export function ge(a: dx.ResourceAmount, b: dx.ResourceAmount) {
  const result = subtract(a, b)
  return _.values(result).every(r => r >= 0)
}

export class ResourceCalculator {
  buildingsByUser = _.groupBy(_.values(this.state.buildings), l => l.playerId)

  constructor(private state: sx.IGameState) { }

  calculateBuildingProduction(building: sx.IBuildingState) {
    return buildingTypes[building.buildingTypeId].resourceYield || dx.zeroResources()
  }

  calculateBuildingsProduction(buildings: sx.IBuildingState[]) {
    return buildings.reduce(
      (prev, cur) => add(prev, this.calculateBuildingProduction(cur)),
      dx.zeroResources(),
    )
  }

  calculatePlayerProduction(playerId: string) {
    // TODO factor in planet type
    return this.calculateBuildingsProduction(this.buildingsByUser[playerId] || [])
  }
}
