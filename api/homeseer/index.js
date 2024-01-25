const express = require('express')

const middleware = http => {
  const app = express.Router()

  app.get('/devices', (req, res) => {
    http.get('JSON', {
      params: {
        request: 'getstatus',
        everything: true,
        ref: '74,75,6,77'
      }
    })
      .then(({data}) => data.Devices.map(d => ({
        id: d.ref,
        controlPairs: d.ControlPairs,
        name: `${d.location} ${d.name}`,
        location: d.location2,
        status: d.status,
        statusImage: d.status_image,
        value: d.value
      })))
      .then(data => data.sort((d1, d2) =>
        d1.name < d2.name ? -1 : 1
      ))
      .then(data => res.json(data))
  })

  app.patch('/devices/:id', (req, res) => {
    const { id } = req.params
    const { value } = req.body
    http.get('JSON', {
      params: {
        request: 'controldevicebyvalue',
        value,
        ref: id
      }
    })
      .then(({ data }) => {
        const [device] = data.Devices
        res.json(device)
      })
  })

  return app
}

module.exports = middleware
