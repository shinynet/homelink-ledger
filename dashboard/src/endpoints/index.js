import { api } from 'boot/axios'

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

/**
 *
 * @returns {Promise<Status>}
 */
export const getStatusQuery = () => api.get('JSON', {
  params: {
    request: 'getstatus',
    everything: true,
    ref: '74,75,6,77'
  }
})
  .then(({ data }) => data.Devices)
  .then(devices => devices.map(device => ({ ...device, id: device.ref })))

export const controlDeviceMutation = ({ ref, value }) => api.get('JSON', {
  params: {
    request: 'controldevicebyvalue',
    value,
    ref
  }
})
