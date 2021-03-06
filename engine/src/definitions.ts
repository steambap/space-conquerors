export type Resource = 'gold' | 'iron' | 'gas' | 'darkMatter'
export const resources: Resource[] = ['gold', 'iron', 'gas', 'darkMatter']

export type ResourceAmount = {
  [P in Resource]: number;
}

export function zeroResources(r: Partial<ResourceAmount> = {}): ResourceAmount {
  return { gold: 0, iron: 0, gas: 0, darkMatter: 0, ...r }
}

export type ItemKind = 'building' | 'unit' | 'tech' | 'techFamily'

export interface IItem {
  kind: ItemKind

  name: string
  id: string
  description: string
}

export interface IPurchaseable {
  cost: ResourceAmount,
  technologyRequirements: { [idx: string]: true }
  productionTime: number
}

export interface IBuildingType extends IItem, IPurchaseable {
  kind: 'building'

  maxPerPlanet?: number
  maxPerPlayer?: number
  maxPerSystem?: number

  resourceYield?: ResourceAmount
  foodYield?: number
  buildingRequirements: { [idx: string]: true },
}

export enum UnitClass {
  // TODO need more explanation about this values...
  P,
  M,
  G,
  E,
  NONE,
}

export enum ArmoringType {
  BASIC,
  PIERCING,
  BOMB,
}

export interface IUnitType extends IItem, IPurchaseable {
  kind: 'unit'

  unitClass: UnitClass
  armoringType: ArmoringType

  shootingSpeed: number
  firePower: number
  strategicCaliber: number
  accuracy: number
  evasion: number
  endurance: number
  speed: number

  gasConsumption: number
  foodConsumption: number

  specials?: any // TBD
  buildingRequirements: { [idx: string]: true },
}

export type TechnologyFamily = 'civil' | 'military'

export interface ITechnology extends IItem, IPurchaseable {
  kind: 'tech'

  level: number
  family: TechnologyFamily
}

export type Item = IBuildingType | IUnitType | ITechnology
export type PurchaseableItem = IBuildingType | IUnitType | ITechnology

export function isBuildingType(item: Item): item is IBuildingType {
  return item.kind === 'building'
}
export function isUnitType(item: Item): item is IUnitType {
  return item.kind === 'unit'
}
export function isTech(item: Item): item is ITechnology {
  return item.kind === 'tech'
}
