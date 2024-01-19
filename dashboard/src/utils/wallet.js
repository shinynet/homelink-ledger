import { lucid } from 'boot/lucid'
import { fromUnit, toText } from 'lucid-cardano'
import {
  add, always, compose,
  equals, evolve, filter,
  ifElse, map, mapObjIndexed,
  mergeAll, mergeWith, omit,
  prop, propEq, reduce,
  reject, sortBy, values
} from 'ramda'

const sortByAssetName = sortBy(prop('assetName'))

const parseAsset = ifElse(
  (quantity, unit) => equals(unit, 'lovelace'),
  (quantity, unit) => ({ policyId: '', assetName: unit, name: unit, quantity, unit }),
  (quantity, unit) => mergeAll([fromUnit(unit), { unit }, { quantity }])
)

const parseAssetName = ifElse(
  equals('lovelace'),
  always('lovelace'),
  toText
)

const utxosToAssets = compose(
  sortByAssetName,
  map(evolve({ assetName: parseAssetName })),
  map(omit(['label', 'name'])),
  values,
  mapObjIndexed(parseAsset),
  reduce(mergeWith(add), {}),
  map(prop('assets'))
)

const getAddress = () => lucid.wallet.address()

const getUtxos = () => lucid.wallet.getUtxos()

const getAssets = () => getUtxos()
  .then(utxosToAssets)

const getCustomAssets = () => getAssets()
  .then(reject(propEq('lovelace', 'assetName')))

const getPolicyIdAssets = policyId => getCustomAssets()
  .then(filter(propEq(policyId, 'policyId')))

export {
  getAddress,
  getUtxos,
  getAssets,
  getCustomAssets,
  getPolicyIdAssets
}
