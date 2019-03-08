import React from 'react'
import ls from 'local-storage'

const getCache = (key, initial) => {
  const cached = ls.get(key)
  if(cached === null && initial !== null){
    ls.set(key, initial)
  }
  return cached !== null ? cached : initial
}

const useLocalStorage = (key, initial) => {
  const [nativeState, setNativeState] = React.useState(getCache(key, initial))
  const setState = state => {
    if(typeof state === 'function'){
      setNativeState(prev => {
        const newState = state(prev)
        ls.set(key, newState)
        return newState
      })
    }else{
      ls.set(key, state)
      setNativeState(state)
    }
  }

  return [nativeState, setState]
}
export default useLocalStorage
