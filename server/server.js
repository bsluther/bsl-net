require('dotenv').config()
const express = require('express')
const path = require('path')
const { MongoClient } = require('mongodb')
// dotenv.configure()

const server = express()
const PORT = process.env.PORT || 7777

server.use(
  express.static(
    path.join(__dirname,'../frontend/build'))
)

/*** DATABASE ***/
const mongoUri = process.env.MONGO_URI
const mongoClient = new MongoClient(mongoUri)
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



server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})