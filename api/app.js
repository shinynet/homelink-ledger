const express = require('express')
const homeseer = require('./homeseer')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()

const axiosConfig = axios.create({
  baseURL: process.env.HS4_BASE_URL,
  params: {
    user: process.env.HS4_USER,
    pass: process.env.HS4_PASS
  }
})

app.use(cors())
app.use(express.json())
app.use('/', homeseer(axiosConfig))

app.get('/status', (req, res) => {
  res.send('API Running')
})

app.use((req, res) => {
  res.status(404).send('Not found')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
