

async function getCategories(client) {
  try {
    await client.connect()

    const data = await client.db('bsl-net')
                             .collection('tracker-categories')
                             .find()
                             .toArray()
    console.log('Database connected via getCategories...')
    return data
  } catch(e) {
    console.error(e)
  } finally {
    // await client.close()
  }
}

// const getCategories = client =>
//   client
//     .connect()
//     .db
//     .then()



// const getAllBlocks = client =>
//   client.connect()
//   .then(client =>
//     client
//     .db('bsl-net')
//     .collection('tracker-blocks')
//     .find()
//     .toArray()
//   ).then(data => {
//     return data
//   })
const getAllBlocks = client =>
  client.connect()
        .then(() =>
          client.db('bsl-net')
                .collection('tracker-blocks')
                .find()
                .toArray()
                // .catch(e => console.error(e))
        )
        .catch(e => console.error(e))



const saveBlock = (client, data) => 
  client
    .connect()
    .then(client =>
      client
        .db('bsl-net')
        .collection('tracker-blocks')
        .insertOne(data)
        .then(res => {
          client.close()
          return res
        })
    )

module.exports = { getCategories, saveBlock, getAllBlocks }