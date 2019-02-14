# crooks

![Crooks](https://github.com/chrisjpatty/crooks/blob/master/logo.png?)

A selection of useful react hooks by [@chrisjpatty](https://github.com/chrisjpatty).

## useLocalStorage

`useLocalStorage` behaves just like the native react `useState` hook, except that any and all state updates are automatically saved in the browser's local storage under the provided key. The first argument is the name of the key to save it under, and the second argument is the initial value. The hook returns the current state and an updater function just like `useState`.

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
