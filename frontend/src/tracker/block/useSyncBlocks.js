import { fork } from 'fluture'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { currentTrackerUserAtom, namedBlocksAtom } from '../atoms'
import { getUserBlocksF } from '../dbRequests'
import { foldToIdObj } from '../functions'


const useSyncBlocks = () => {
  const [, setBlocks] = useAtom(namedBlocksAtom)
  const [user] = useAtom(currentTrackerUserAtom)

  const syncBlocks = useCallback(() =>
    fork(err => console.error('Failed to fetch blocks!', err))
        (blcs => setBlocks(foldToIdObj(blcs)))
        (getUserBlocksF(user))
  , [setBlocks, user])

  return syncBlocks
}

export default useSyncBlocks