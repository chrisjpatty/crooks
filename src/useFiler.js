import shortid from 'shortid'
import useLocalStorage from './useLocalStorage'

const useFiler = key => {
  const [files, setFiles] = useLocalStorage(key, {})

  const add = (data, id) => {
    const newKey = id || shortid.generate()
    const now = Date.now()
    setFiles(files => ({
      ...files,
      [newKey]: {
        id: newKey,
        created: now,
        modified: now,
        data
      }
    }))
    return newKey
  }

  const remove = id => {
    setFiles(({[id]: deleted, newFiles}) => newFiles)
  }

  const update = (id, data) => {
    setFiles(files => ({
      ...files,
      [id]: {
        ...files[id],
        modified: Date.now(),
        data
      }
    }))
  }

  const clear = () => {
    setFiles({})
  }

  return [files, {add, remove, update, clear}]
}

export default useFiler
