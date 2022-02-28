const { MongoClient, ObjectId } = require('mongodb')

/**************************************
                 BLOCK
**************************************/

async function getAllBlocks(user) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-blocks')
                              .find({ user })
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

async function deleteBlock(id) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-blocks')
                              .deleteOne({ "_id": id }))
  return result
}

/**************************************
               CATEGORY
**************************************/

async function getAllCategories(user) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-categories')
                              .find({ creator: user })
                              .toArray())
  return result
}

async function postCategory(data) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-categories')
                              .insertOne(data))
  return result
}

async function deleteCategory(id) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-categories')
                              .deleteOne({ "_id": id }))
  return result
}

async function updateCategory(id, data) {
  const result = await main(client =>
                              client
                              .db('bsl-net')
                              .collection('tracker-categories')
                              .updateOne(
                                { "_id": id },
                                { $set: data }
                            ))
  return result
}

/**************************************
                 MAIN
**************************************/


async function main(operation) {
  const mongoUri = process.env.MONGO_URI
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()


    const result = await operation(client)

    return result
  } catch(e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

module.exports = { 
  main, 
  getAllBlocks, 
  getAllCategories, 
  deleteBlock, 
  postBlock, 
  postCategory,
  deleteCategory,
  updateCategory
}