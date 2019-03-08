![Crooks](https://raw.githubusercontent.com/chrisjpatty/crooks/master/logo.png)

# crooks ![Travis (.org)](https://img.shields.io/travis/chrisjpatty/crooks.svg) [![](https://img.shields.io/npm/v/crooks.svg?style=flat)](https://www.npmjs.com/package/crooks) [![Coverage Status](https://coveralls.io/repos/github/chrisjpatty/crooks/badge.svg?branch=master)](https://coveralls.io/github/chrisjpatty/crooks?branch=master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A collection of useful react hooks by [@chrisjpatty](https://github.com/chrisjpatty).

# Installing

```bash
yarn add crooks
```

```bash
npm install crooks --save
```

## Available Hooks

- [useLocalStorage](https://www.github.com/chrisjpatty/crooks#useLocalStorage)
- [useFiler](https://www.github.com/chrisjpatty/crooks#useFiler)
- [useKeyboardShortcut](https://www.github.com/chrisjpatty/crooks#useKeyboardShortcut)
- [useOnClickOutside](https://www.github.com/chrisjpatty/crooks#useOnClickOutside)

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

As with the native `useState`, `update()` accepts a callback function injected with the previous file.

```jsx
update("jal31af", file => ([...file.data, "New item"]))
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

```jsx
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

# useOnClickOutside

`useOnClickOutside` accepts a function that will be called when there's a click outside of a target element. The hook returns a ref, which you pass to the ref attribute of the element you want to target.

#### Basic Usage

```jsx
import { useOnClickOutside } from 'crooks'

const App = () => {
  const handleClickOutside = () => {
    console.log("You clicked outside of the blue box")
  }

  const outsideRef = useOnClickOutside(handleClickOutside)

  return (
    <div>
      <div ref={outsideRef}> I'm a blue box </div>
    </div>
  )
}
```

#### Disabling the listener

For performance reasons, you may not want to always listen for clicks outside of an element. For these times you can pass a `Boolean` as a second parameter to this hook representing whether or not the listener should be disabled like so:


```jsx
import { useState } from 'react'
import { useOnClickOutside } from 'crooks'

const App = () => {
  const [isDisabled, setIsDisabled] = useState(false)

  const disableOnOutside = () => setIsDisabled(true)

  const handleClickOutside = () => {
    console.log("You clicked outside of the blue box")
  }

  const outsideRef = useOnClickOutside(handleClickOutside, isDisabled)

  return (
    <div>
      <button onClick={disableOnOutside}>Stop listening for outside clicks</button>
      <div ref={outsideRef}> I'm a blue box </div>
    </div>
  )
}
```
