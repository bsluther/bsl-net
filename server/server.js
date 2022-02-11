const express = require('express')
const res = require('express/lib/response')
const path = require('path')
const { MongoClient } = require('mongodb')

const server = express()
const PORT = process.env.PORT || 7777

server.use(
  express.static(
    path.join(__dirname,'../frontend/build'))
)

/*** DATABASE ***/

const mongoUri = 'mongodb+srv://bsluther:throwaway@gv-mdb.yizju.mongodb.net/gv-mdb?retryWrites=true&w=majority'
const mongoClient = new MongoClient(mongoUri)
const database = mongoClient.db('bsl-net')
const tracker = database.collection('tracker')
mongoClient.connect()


// async function main() {
//   try {
//     await mongoClient.connect()
//     // await mongoClient.db('bsl-net').command({ ping: 1 })
//     console.log('Database connected...')

//     await listDatabases(mongoClient)
//   } catch(e) {
//     console.error(e)
//   } finally {
//     await mongoClient.close()
//     console.log('Database connection closed.')
//   }
// }
// main().catch(console.dir)





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
  const data = await listDatabases(mongoClient)
  res.send(data)
})



server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})