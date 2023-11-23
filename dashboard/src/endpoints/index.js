import { api } from 'boot/axios'

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
