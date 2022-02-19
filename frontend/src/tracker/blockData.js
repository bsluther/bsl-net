import { blcId } from '../util'
import { DateTime } from 'luxon'

const blockConstructor = user => ({
  _id: blcId(),
  user,
  category: undefined,
  start: {
    date: DateTime.now().toISODate(),
    time: DateTime.now().toISOTime({ includeOffset: false })
  },
  end: {
    date: DateTime.now().toISODate(),
    time: DateTime.now().toISOTime({ includeOffset: false })
  }
})

const Block = {
  constructor: blockConstructor,
  id: ['_id'],
  user: ['user'],
  category: ['category'],
  categoryName: ['categoryName'],
  startDate: ['start', 'date'],
  startTime: ['start', 'time'],
  endDate: ['end', 'date'],
  endTime: ['end', 'time']
}

export { Block }