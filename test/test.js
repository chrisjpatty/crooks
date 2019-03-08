import React from 'react'
import {
  render,
  fireEvent,
  act,
  cleanup,
  waitForElement,
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import 'babel-polyfill';
import { LocalStorageTest, FilerTest, OnClickOutside, KeyboardShortcut } from './components'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('useLocalStorage', () => {
  test('localStorage initializes correctly', async () => {
    const { getByText } = render(<LocalStorageTest/>)
    expect(localStorage.setItem).toHaveBeenLastCalledWith('FRUIT', '\"apple\"')
  })
  test('localStorage updates correctly', () => {
    const { getByText } = render(<LocalStorageTest/>)
    fireEvent.click(getByText('UPDATE'))
    expect(localStorage.setItem).toHaveBeenLastCalledWith('FRUIT', '\"pear\"')
  })
  test('localStorage callback updates correctly', () => {
    const { getByText } = render(<LocalStorageTest/>)
    fireEvent.click(getByText('UPDATECALLBACK'))
    expect(localStorage.setItem).toHaveBeenLastCalledWith('FRUIT', '\"applepear\"')
  })
  test('state initializes correctly', async () => {
    const { getByText } = render(<LocalStorageTest/>)
    getByText('apple')
  })
  test('state updates correctly', () => {
    const { getByText } = render(<LocalStorageTest/>)
    fireEvent.click(getByText('UPDATE'))
    getByText('pear')
  })
  test('state updates correctly', () => {
    const { getByText } = render(<LocalStorageTest/>)
    fireEvent.click(getByText('UPDATECALLBACK'))
    getByText('applepear')
  })
})

let state;
let getState = s => state = s

describe('useFiler', () => {
  test('Files intialize correctly', () => {
    const { getByText } = render(<FilerTest getState={getState}/>)
    expect(typeof state).toBe('object')
    expect(state).toMatchObject({})
  })
  test('File adds correctly', () => {
    const { getByText } = render(<FilerTest getState={getState}/>)
    fireEvent.click(getByText('ADD'))
    expect(Object.keys(state).length).toBe(1)
    const file = state[Object.keys(state)[0]]
    expect(file).toHaveProperty('created')
    expect(file).toHaveProperty('modified')
    expect(file).toHaveProperty('id')
    expect(file.data).toBe('apple')
  })
  test('File removes correctly', () => {
    const { getByText } = render(<FilerTest getState={getState}/>)
    fireEvent.click(getByText('ADD'))
    expect(Object.keys(state).length).toBe(1)
    fireEvent.click(getByText('REMOVE'))
    expect(Object.keys(state).length).toBe(0)
    expect(state).toMatchObject({})
  })
  test('File updates correctly', () => {
    const { getByText } = render(<FilerTest getState={getState}/>)
    fireEvent.click(getByText('ADD'))
    expect(Object.keys(state).length).toBe(1)
    const { modified, created } = state[Object.keys(state)[0]]
    fireEvent.click(getByText('UPDATE'))
    const file = state[Object.keys(state)[0]]
    expect(file.data).toBe('pear')
    expect(file.created === created).toBe(true)
    expect(file.modified === modified).toBe(false)
  })
  test('File update callback updates correctly', () => {
    const { getByText } = render(<FilerTest getState={getState}/>)
    fireEvent.click(getByText('ADD'))
    expect(Object.keys(state).length).toBe(1)
    const { modified, created } = state[Object.keys(state)[0]]
    fireEvent.click(getByText('UPDATE_CALLBACK'))
    const file = state[Object.keys(state)[0]]
    expect(file.data).toBe('applepear')
    expect(file.created === created).toBe(true)
    expect(file.modified === modified).toBe(false)
  })
  test('Files clear correctly', () => {
    const { getByText } = render(<FilerTest getState={getState}/>)
    fireEvent.click(getByText('ADD'))
    expect(Object.keys(state).length).toBe(1)
    fireEvent.click(getByText('ADD'))
    expect(Object.keys(state).length).toBe(2)
    fireEvent.click(getByText('CLEAR'))
    expect(state).toMatchObject({})
  })
})

describe('useOnClickOutside', () => {
  test("Click inside doesn't trigger handler",  () => {
    const { getByText } = render(<OnClickOutside/>)
    getByText('apple')
    fireEvent.click(getByText('MODAL'))
    getByText('apple')
  })
  test("Click without ref doesn't trigger handler",  () => {
    const { getByText } = render(<OnClickOutside noref/>)
    getByText('apple')
    fireEvent.click(getByText('MODAL'))
    getByText('apple')
  })
  test("Click outside triggers handler",  () => {
    const { getByText } = render(<OnClickOutside/>)
    getByText('apple')
    fireEvent.click(getByText('OUTSIDE'))
    getByText('pear')
  })
  test("Click outside doesn't triggers handler when disabled",  () => {
    const { getByText } = render(<OnClickOutside disabled/>)
    getByText('apple')
    fireEvent.click(getByText('OUTSIDE'))
    getByText('apple')
  })
})

describe('useKeyboardShortcut', () => {
  test("Handler initializes correctly", () => {
    const { getByText } = render(<KeyboardShortcut/>)
    getByText('apple')
  })
  test("Pressing \"a\" triggers handler", () => {
    const { getByText } = render(<KeyboardShortcut/>)
    getByText('apple')
    act(() => {
      var event = new KeyboardEvent('keydown', {'keyCode': 65});
      document.dispatchEvent(event);
    })
    getByText('pear')
  })
  test("Pressing \"a\" doesn't trigger handler when disabled", () => {
    const { getByText } = render(<KeyboardShortcut disabled/>)
    getByText('apple')
    act(() => {
      var event = new KeyboardEvent('keydown', {'keyCode': 65});
      document.dispatchEvent(event);
    })
    getByText('apple')
  })
  test("Pressing \"c\" doesn't trigger handler", () => {
    const { getByText } = render(<KeyboardShortcut/>)
    getByText('apple')
    act(() => {
      var event = new KeyboardEvent('keydown', {'keyCode': 67});
      document.dispatchEvent(event);
    })
    getByText('apple')
  })
  test("Enable/disable functions work correctly", () => {
    const { getByText } = render(<KeyboardShortcut/>)
    getByText('apple')
    fireEvent.click(getByText('DISABLE'))
    act(() => {
      var event = new KeyboardEvent('keydown', {'keyCode': 65});
      document.dispatchEvent(event);
    })
    getByText('apple')
    fireEvent.click(getByText('ENABLE'))
    act(() => {
      var event = new KeyboardEvent('keydown', {'keyCode': 65});
      document.dispatchEvent(event);
    })
    getByText('pear')
  })
})
