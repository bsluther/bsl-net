import { useCallback } from 'react'
// const setFilter = useCallback(arg => {
//   if (typeof arg === 'function') {
//     setFilters(prev => assoc(editingFilterId)
//                             (arg(prev[editingFilterId]))
//                             (prev))
//   }
//   if (typeof arg === 'object') {
//     setFilters(assoc(editingFilterId)(arg))
//   }
// }, [setFilters, editingFilterId])

const useFnUpdate = setter => useCallback(arg => {
  if (typeof arg === 'function') {
    setter(prev => arg(prev))
  }
  if (typeof arg !== 'function') {
    setter(arg)
  }
}, [setter])

export default useFnUpdate