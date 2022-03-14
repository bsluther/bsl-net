import { head, fromMaybe, get, chain, pipe, reduce, and, maybe, flip, lift3, justs, filter } from 'sanctuary'
import { values, assoc, map } from 'ramda'
import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { keys } from 'ramda'
import relationHash from './relations'
import { isTypeof } from '../functions'

// should useFilters provide default comparator values for each accessor? maybe

// use a draft property to keep from filtering during configuration?

const log = x => {
  console.log('LOG', x)
  return x
}

const constructFilter = accessorStr => relationStr => ({
  accessor: accessorStr,
  relation: relationStr,
  comparator: undefined,
  id: uuid()
})


// relationFnFromCfg :: FilterConfig -> Maybe (a -> a -> Boolean)
const relationFnFromCfg = pipe([
  get(isTypeof('string'))
     ('relation'),
  log,
  chain(flip(get(isTypeof('function')))
            (relationHash)),
])

// comparatorFromCfg :: FilterConfig -> a
const comparatorFromCfg = get(x => !!x)('comparator')

// accessorFnFromCfg :: AccessorSettings -> FilterConfig -> Maybe (a -> Maybe b)
const accessorFnFromCfg = accessorSettings => pipe([
  get(isTypeof('string'))
     ('accessor'),
  chain(flip(get(isTypeof('object')))
            (accessorSettings)),
  chain(get(isTypeof('function'))('accessor'))
])

// createPredicate :: (a -> Maybe b) -> (b -> b -> Boolean) -> b -> a -> Boolean
const createPredicate = accessorFn => relationFn => comparator => x =>
  maybe(false)(relationFn(comparator))(accessorFn(x))

const assembleArgs = accessorSettings => cfg => {
  const maybeRel = relationFnFromCfg(cfg)
  const maybeComp = comparatorFromCfg(cfg)
  const maybeAcc = accessorFnFromCfg(accessorSettings)(cfg)
  return lift3(createPredicate)(maybeAcc)(maybeRel)(maybeComp)
}

const useFilters = accessorSettings => {
  const [filterConfigs, setFilterConfigs] = useState({})

  const preds = justs(map(assembleArgs(accessorSettings))(values(filterConfigs)))
  const filterFn = filter(data =>
    reduce(acc => pred => and(pred(data))(acc))
          (true)
          (preds)
  )

  const createFilter = useCallback(() => {
    const maybeDefaultAccessorSettings = head(values(accessorSettings))

    const getRelationStr = pipe([
      chain(get(x => Array.isArray(x))('licitRelations')),
      chain(head)
    ])

    const newFilter = constructFilter(fromMaybe('')(head(keys(accessorSettings))))
                                     (fromMaybe('')(getRelationStr(maybeDefaultAccessorSettings)))

    setFilterConfigs(assoc(newFilter.id)(newFilter))

    return newFilter.id
  }, [setFilterConfigs])
  
  return [createFilter, filterConfigs, setFilterConfigs, filterFn]
}

export { useFilters }