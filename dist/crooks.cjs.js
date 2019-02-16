'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var ls = _interopDefault(require('local-storage'));
var shortid = _interopDefault(require('shortid'));

const getCache = (key, initial) => {
  const cached = ls.get(key);
  return cached !== null ? cached : initial
};

const useLocalStorage = (key, initial) => {
  const [nativeState, setNativeState] = react.useState(getCache(key, initial));
  const setState = state => {
    if(typeof state === 'function'){
      setNativeState(prev => {
        const newState = state(prev);
        ls.set(key, newState);
        return newState
      });
    }else{
      ls.set(key, state);
      setNativeState(state);
    }
  };

  return [nativeState, setState]
};

const useFiler = key => {
  const [files, setFiles] = useLocalStorage$1(key, {});

  const add = (data, id) => {
    const newKey = id || shortid.generate();
    const now = Date.now();
    setFiles(files => ({
      ...files,
      [newKey]: {
        id: newKey,
        created: now,
        modified: now,
        data
      }
    }));
    return newKey
  };

  const remove = id => {
    setFiles(({[id]: deleted, newFiles}) => newFiles);
  };

  const update = (id, data) => {
    setFiles(files => ({
      ...files,
      [id]: {
        ...files[id],
        modified: Date.now(),
        data
      }
    }));
  };

  const clear = () => {
    setFiles({});
  };

  return [files, {add, remove, update, clear}]
};

var keyboardShortcut = ({keyCode, action, disabled}) => {
  react.useEffect(() => {
    if(!disabled){
      enable();
    }
    return () => {
      disable();
    }
  });

  const enable = () => {
    document.addEventListener('keydown', handleAction);
  };

  const disable = () => {
    document.removeEventListener('keydown', handleAction);
  };

  const handleAction = e => {
    if(e.keyCode === keyCode){
      e.preventDefault();
      action(e);
    }
  };

  return {enable, disable}
};

var onClickOutside = (onClickOutside, disabled) => {
  const ref = react.useRef();

  react.useEffect(() => {
    if(!disabled){
      window.addEventListener('click', checkForClickOutside);
      return () => {
        window.removeEventListener('click', checkForClickOutside);
      }
    }else{
      window.removeEventListener('click', checkForClickOutside);
    }
  }, [disabled]);

  const checkForClickOutside = e => {
    if(ref.current){
      if(!ref.current.contains(e.target)){
        onClickOutside();
      }
    }
  };
  return ref;
};

const useLocalStorage$1 = useLocalStorage;
const useFiler$1 = useFiler;
const useKeyboardShortcut = keyboardShortcut;
const useOnClickOutside = onClickOutside;

exports.useLocalStorage = useLocalStorage$1;
exports.useFiler = useFiler$1;
exports.useKeyboardShortcut = useKeyboardShortcut;
exports.useOnClickOutside = useOnClickOutside;
