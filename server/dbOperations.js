const { MongoClient } = require('mongodb')

async function getAllBlocks() {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-blocks')
                              .find()
                              .toArray())
  return result
}

async function getAllCategories() {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-categories')
                              .find()
                              .toArray())
  return result
}

async function postBlock(data) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-blocks')
                              .insertOne(data))
  return result
}

async function main(operation) {
  const mongoUri = process.env.MONGO_URI
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()

    // const result = await client.db('bsl-net').collection('tracker-blocks').find().toArray()
    const result = await operation(client)

    return result
  } catch(e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

module.exports = { main, getAllBlocks, getAllCategories, postBlock }