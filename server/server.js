const express = require('express')
const res = require('express/lib/response')
const path = require('path')

const server = express()
const PORT = process.env.PORT || 7777

server.use(
  express.static(
    path.join(__dirname,'../frontend/build'))
)

server.get('/', (req, res) => {
  res.sendFile(
      path.join(__dirname, '../frontend/build/index.html')
  )
})

server.get('/test', (req, res) => {
  res.send('Test API request successful')
})

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})