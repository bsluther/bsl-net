

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
    await client.close()
  }
}

module.exports = { getCategories }