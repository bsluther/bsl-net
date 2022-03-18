require('dotenv').config()
const express = require('express')
const path = require('path')
const { getAllBlocks, getAllCategories, postBlock, deleteBlock, postCategory, deleteCategory, updateCategory, updateBlock } = require('./dbOperations')
const { dissoc } = require('ramda')


const server = express()
const PORT = process.env.PORT || 7777

server.use(express.json())
server.use(
  express.static(
    path.join(__dirname,'../frontend/build'))
)
/**************************************
                 BLOCK
**************************************/

server.get('/tracker/blocks', (req, res) => {
  getAllBlocks(req.query.user)
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

server.put('/tracker/blocks', (req, res) => {
  updateBlock(req.body._id, req.body)
  .then(data => res.send(data))
})

/**************************************
               CATEGORY
**************************************/

server.get('/tracker/categories', (req, res) => {
  getAllCategories(req.query.user)
  .then(data => res.send(data))
})

server.post('/tracker/categories', (req, res) => {
  postCategory(req.body)
  .then(data => res.send(data))
})

server.delete('/tracker/categories', (req, res) => {
  deleteCategory(req.body.id)
  .then(data => res.send(data))
})

server.put('/tracker/categories', (req, res) => {
  updateCategory(req.body._id, req.body)
  .then(data => res.send(data))
})






server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})