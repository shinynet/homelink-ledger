import { api } from 'boot/axios'
import { lucid } from 'boot/lucid'
import { getPolicyIdAssets } from 'src/utils/wallet'
import { getPolicyId } from 'src/utils/contract'

/**
 * @typedef {Object} Range
 * @property {number} RangeEnd
 * @property {number} RangeStart
 * @property {string} RangeStatusPrefix
 * @property {string} RangeStatusSuffix
 */

/**
 * @typedef {Object} ControlPair
 * @property {number} CCIndex
 * @property {number} ControlType
 * @property {number} ControlValue
 * @property {string} Label
 * @property {Range} [Range]
 */

/**
 * @typedef {Object} Device
 * @property {ControlPair[]} ControlPairs
 * @property {string} location
 * @property {string} location2
 * @property {string} name
 * @property {string} ref
 * @property {string} status
 * @property {string} status_image
 * @property {number} value
 */

/**
 * @typedef {Object} Status
 * @property {Device[]} Devices
 */

export const getWallets = () => Promise.resolve(window.cardano)
  .then(data => Object.entries(data))
  .then(entries => entries.filter(([key]) => ['lace', 'eternl', 'nami'].includes(key)))
  .then(data => data.map(([key, value]) => ({ id: key, ...value })))

export const getWalletAddress = () => lucid.wallet.address()

export const getWalletUtxos = () => lucid.wallet.getUtxos()

export const getDevices = () => api
  .get('/devices')
  .then(
    ({ data }) => data
      .map(device => ({ ...device, id: device.ref }))
      .sort((d1, d2) => d1.location + d1.name < d2.location + d2.name
        ? -1
        : 1
      )
  )

export const updateDevice = ({ ref, value }) => api
  .patch(`/devices/${ref}`, {
    value
  })

export const getTokens = () => getPolicyIdAssets(getPolicyId(process.env.KEY))
