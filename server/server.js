require('dotenv').config()
const express = require('express')
const path = require('path')
const { getAllBlocks, getAllCategories, postBlock, deleteBlock } = require('./dbOperations')


const server = express()
const PORT = process.env.PORT || 7777

server.use(express.json())
server.use(
  express.static(
    path.join(__dirname,'../frontend/build'))
)

server.get('/tracker/blocks', (req, res) => {
  getAllBlocks()
  .then(data => res.send(data))
})

server.get('/tracker/categories', (req, res) => {
  getAllCategories()
  .then(data => res.send(data))
})

server.post('/tracker/blocks', (req, res) => {
  postBlock(req.body)
  .then(data => res.send(data))
})

server.delete('/tracker/blocks', (req, res) => {
  console.log(req.body)
  deleteBlock(req.body.id)
  .then(data => res.send(data))
})

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})