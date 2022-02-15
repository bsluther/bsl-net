require('dotenv').config()
const express = require('express')
const path = require('path')
const { MongoClient } = require('mongodb')
const { getCategories, saveBlock, getAllBlocks } = require('./old_db')

const server = express()
const PORT = process.env.PORT || 7777

server.use(express.json())
server.use(
  express.static(
    path.join(__dirname,'../frontend/build'))
)

/*** DATABASE ***/
const mongoUri = process.env.MONGO_URI
const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
const database = mongoClient.db('bsl-net')
const tracker = database.collection('tracker')


async function main() {
  try {
    await mongoClient.connect()
    // await mongoClient.db('bsl-net').command({ ping: 1 })
    console.log('Database connected...')

    const data = await listDatabases(mongoClient)
    return data
  } catch(e) {
    console.error(e)
  } finally {
    await mongoClient.close()
    console.log('Database connection closed.')
  }
}
main().catch(console.dir)


async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases()
  return databasesList
}





/*** ROUTES ***/

// @route   GET /
// @desc    Get frontend build in deployment
// @access  Public
server.get('/', (req, res) => {
  res.sendFile(
      path.join(__dirname, '../frontend/build/index.html')
  )
})

server.get('/test', async (req, res) => {
  console.log('test route hit')
  const data = await main()
  res.send(data)
})

// @route   GET /tracker/categories
// @desc    Get categories data
// @access  Public
server.get('/tracker/categories', async (req, res) => {
  console.log('tracker/categories route hit')
  const data = await getCategories(mongoClient)
  res.send(data)
})

/***** BLOCK ROUTES *****/

// @route   POST /tracker/blocks
// @desc    Save block data
// @access  Public
server.post('/tracker/blocks', (req, res) => {
  saveBlock(mongoClient, req.body)
  .then(x => console.log(x))
  .catch(e => console.error(e))
})

// @route   GET /tracker/blocks
// @desc    Get all block data
// @access  Public
server.get('/tracker/blocks', (req, res) => {
  getAllBlocks(mongoClient)
  .then(blocks => {
    console.log(blocks)
    return blocks
  })
  .then(blocks => res.send(blocks))
  .catch(e => console.error(e))
  // .then(blocks => blocks.json())
  // .then(json => res.send(json))
})


server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})