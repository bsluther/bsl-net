const express = require('express')
const path = require('path')

const server = express()
const PORT = process.env.PORT || 3000

server.use(
  express.static(
    path.join(__dirname,'./frontend/build'))
)

server.get('/', (req, res) => {
  res.sendFile(
      path.join(__dirname, './frontend/build/index.html')
  )
})

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})