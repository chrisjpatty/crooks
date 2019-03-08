import React from 'react'
import { useLocalStorage, useKeyboardShortcut, useOnClickOutside, useFiler } from '../src/main'

export const LocalStorageTest = () => {
  const [state, setState] = useLocalStorage("FRUIT", "apple")

  const update = () => {
    setState('pear')
  }

  const updateCallback = () => {
    setState(fruit => fruit + 'pear')
  }

  return (
    <div>
      <div>{state}</div>
      <button onClick={update}>UPDATE</button>
      <button onClick={updateCallback}>UPDATECALLBACK</button>
    </div>
  )
}

export const FilerTest = ({getState}) => {
  const [files, {add, remove, update, clear}] = useFiler('FILES')

  const addFile = () => {
    add('apple')
  }

  const addFileWithID = () => {
    add('apple', 'fruit_id')
  }

  const removeFile = () => {
    const id = Object.keys(files)[0]
    remove(id)
  }

  const updateFile = () => {
    const id = Object.keys(files)[0]
    update(id, 'pear')
  }

  const clearFiles = () => {
    clear()
  }
  getState(files)
  return (
    <div>
      <button onClick={addFile}>ADD</button>
      <button onClick={addFileWithID}>ADDID</button>
      <button onClick={removeFile}>REMOVE</button>
      <button onClick={updateFile}>UPDATE</button>
      <button onClick={clearFiles}>CLEAR</button>
    </div>
  )
}

export const OnClickOutside = ({disabled}) => {
  const [fruit, setFruit] = React.useState('apple')

  const handleClickOutside = () => setFruit('pear')

  const outsideRef = useOnClickOutside(handleClickOutside, disabled)

  return (
    <div>
      <div ref={outsideRef} style={{padding: 10}}>
        <div>MODAL</div>
      </div>
      <div>OUTSIDE</div>
      <div>{fruit}</div>
    </div>
  )
}

export const KeyboardShortcut = ({disabled}) => {
  const [fruit, setFruit] = React.useState('apple')

  const onKey = () => setFruit('pear')

  const { enable, disable } = useKeyboardShortcut({
    keyCode: 65,
    action: onKey,
    disabled
  })

  return (
    <div>
      <div onClick={disable}>DISABLE</div>
      <div onClick={enable}>ENABLE</div>
      <div>{fruit}</div>
    </div>
  )
}
