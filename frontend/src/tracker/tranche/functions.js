import { filter, values } from 'ramda'
import { DateTime } from 'luxon'
import { map } from 'ramda'

const joinDateWithTime = isoDate => isoTime => 
  `${isoDate}T${isoTime}`

const filterByCategory = catId => blcs =>
  filter(blc => blc.category === catId)
        (blcs)

/************************************************************/

// Below is probably a good use case for a transducer, for performance gains
// blocksToTranches :: [Block] -> [Category] -> [Tranche]
const blocksToTranches = blcs => cats =>
  map(cat => ({
        categoryId: cat._id,
        categoryName: cat.name,
        blocks: filterByCategory(cat._id)(blcs)
      }))
     (cats)





export { 
  blocksToTranches,
  filterByCategory
}