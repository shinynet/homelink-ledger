const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()

const api = axios.create({
  baseURL: process.env.HS4_BASE_URL,
  params: {
    user: process.env.HS4_USER,
    pass: process.env.HS4_PASS
  }
})

app.use(cors())
app.use(express.json())

app.get('/status', (req, res) => {
  res.send('API Running')
})

app.get('/devices', (req, res) => {
  api.get('JSON', {
    params: {
      request: 'getstatus',
      everything: true,
      ref: '74,75,6,77'
    }
  })
    .then(({ data }) => {
      res.json(data.Devices)
    })
})

app.get('/status-image', (req, res) => {
  const { path } = req.query
  const reducer =  (imageData, byte) => imageData + String.fromCharCode(byte)
  api.get(path, { responseType: 'arraybuffer' })
    .then(({ data }) => {
      const base64 = btoa(new Uint8Array(data).reduce(reducer, ''))
      res.send(`data:;base64,${base64}`)
    })
})

app.patch('/devices/:ref', (req, res) => {
  const { ref } = req.params
  const { value } = req.body
  api.get('JSON', {
    params: {
      request: 'controldevicebyvalue',
      value,
      ref
    }
  })
    .then(({ data }) => {
      const [device] = data.Devices
      res.json(device)
    })
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})