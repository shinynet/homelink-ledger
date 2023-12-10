const express = require('express')
const cors = require('cors')
const env = require('dotenv').config()
const app = express()
const axios = require('axios')

const api = axios.create({
  baseURL: process.env.HS4_BASE_URL,
  params: {
    user: process.env.HS4_USER,
    pass: process.env.HS4_PASS
  }
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/devices', (req, res) => {
  const result = api.get('JSON', {
    params: {
      request: 'getstatus',
      everything: true,
      ref: '74,75,6,77'
    }
  })
    .then(({ data }) => {
      console.log('Devices: ', data.Devices)
      res.json(data.Devices)
    })
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})