# crooks

![Crooks](https://github.com/chrisjpatty/crooks/blob/master/logo.png?)

A collection of useful react hooks by [@chrisjpatty](https://github.com/chrisjpatty).

# useLocalStorage

`useLocalStorage` behaves just like the native react `useState` hook, except that any and all state updates are automatically saved in the browser\'s localstorage under the provided key. The first argument is the name of the key to save it under, and the second argument is the initial value. The hook returns the current state and an updater function just like `useState`.

When the app reloads, the hook will first look for a previously cached value. If one is found, it will be used as the initial value instead of the provided initial value.

```jsx
import { useLocalStorage } from 'crooks'

const App = () => {
  const [state, setState] = useLocalStorage("LOCAL_STORAGE_KEY", initialValue)

  return (
    <div>App</div>
  )
}
```

# useFiler

`useFiler` manages a simple virtual file system using the browser\'s localstorage. This is especially useful for quick prototyping. Any type of data can be saved in a file provided that it's JSON-serializable.

### Basic Usage

When the hook is first initialized it returns the files as an empty object.

```jsx
import { useFiler } from 'crooks'

const App = () => {
  const [files, {add, remove, update, clear}] = useFiler("LOCAL_STORAGE_KEY")

  return (
    <div>App</div>
  )
}
```

#### File Structure

By default, each file has an automatically generated id generated using the [shortid](https://www.npmjs.com/package/shortid) package. Each single file is structured as follows:
```
{
  id: "ogn41na",
  created: 489108491,
  modified: 489108561,
  data: "The file's data."
}
```

The `files` object returned as the first parameter of the hook represents all of the current files as an object, with each file's ID as the key, and the file as the value.

#### Adding Files

The first parameter of the add function may be any JSON-serializable data and is required. The data will be saved as a new file with an automatically generated ID. If you would like to override the automatically-generated ID, you may pass a String or Int as the second parameter and it will be used as the ID. If the ID already exists, the existing file will be overwritten.

```jsx
add("Any JSON-serializable data to be saved as a new file.")
```

#### Updating Files

To update a file, pass as the first parameter, the ID of the file you want to update. The second parameter is the data you want to overwrite the file with.

```jsx
update("jal31af", "The new data to overwrite the file with.")
```

#### Removing Files

The remove function simply accepts a file ID of the file you wish to remove.

```jsx
remove("zoep31a")
```

#### Clearing all Files

```jsx
clear()
```

# useKeyboardShortcut

The `useKeyboardShortcut` hook listens to "keydown" events on the Document, and will call the provided action when the specified Javascript keyCode is detected. The shortcut listener is enabled by default, but can be declaratively disabled by passing `disabled: true` to the hook.

[keyboard.info](https://keycode.info) is a great resource for finding Javascript keyCodes.

#### Basic Usage

```
import { useKeyboardShortcut } from 'crooks'

const App = () => {
  const submit = () => {
    console.log('Submitted')
  }

  const {enable, disable} = useKeyboardShortcut({
    keyCode: 13,
    action: submit,
    disabled: false // This key is not required
  })

  return (
    <div>
      <button onClick={enable}>Enable</button>
      <button onClick={disable}>Disable</button>
    </div>
  )
}
```

With keyboard shortcuts, there are times when you may want to imperatively enable or disable the shortcut listener. For these occasions, the hook returns `enable` and `disable` functions.
