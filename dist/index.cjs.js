(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('shortid')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'shortid'], factory) :
	(global = global || self, factory(global.crooks = {}, global.react, global.shortid));
}(this, function (exports, react, shortid) { 'use strict';

	shortid = shortid && shortid.hasOwnProperty('default') ? shortid['default'] : shortid;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var ms = {};

	function getItem (key) {
	  return key in ms ? ms[key] : null;
	}

	function setItem (key, value) {
	  ms[key] = value;
	  return true;
	}

	function removeItem (key) {
	  var found = key in ms;
	  if (found) {
	    return delete ms[key];
	  }
	  return false;
	}

	function clear () {
	  ms = {};
	  return true;
	}

	var stub = {
	  getItem: getItem,
	  setItem: setItem,
	  removeItem: removeItem,
	  clear: clear
	};

	var listeners = {};

	function listen () {
	  if (commonjsGlobal.addEventListener) {
	    commonjsGlobal.addEventListener('storage', change, false);
	  } else if (commonjsGlobal.attachEvent) {
	    commonjsGlobal.attachEvent('onstorage', change);
	  } else {
	    commonjsGlobal.onstorage = change;
	  }
	}

	function change (e) {
	  if (!e) {
	    e = commonjsGlobal.event;
	  }
	  var all = listeners[e.key];
	  if (all) {
	    all.forEach(fire);
	  }

	  function fire (listener) {
	    listener(JSON.parse(e.newValue), JSON.parse(e.oldValue), e.url || e.uri);
	  }
	}

	function on (key, fn) {
	  if (listeners[key]) {
	    listeners[key].push(fn);
	  } else {
	    listeners[key] = [fn];
	  }
	  {
	    listen();
	  }
	}

	function off (key, fn) {
	  var ns = listeners[key];
	  if (ns.length > 1) {
	    ns.splice(ns.indexOf(fn), 1);
	  } else {
	    listeners[key] = [];
	  }
	}

	var tracking = {
	  on: on,
	  off: off
	};

	var ls = 'localStorage' in commonjsGlobal && commonjsGlobal.localStorage ? commonjsGlobal.localStorage : stub;

	function accessor (key, value) {
	  if (arguments.length === 1) {
	    return get(key);
	  }
	  return set(key, value);
	}

	function get (key) {
	  return JSON.parse(ls.getItem(key));
	}

	function set (key, value) {
	  try {
	    ls.setItem(key, JSON.stringify(value));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function remove (key) {
	  return ls.removeItem(key);
	}

	function clear$1 () {
	  return ls.clear();
	}

	accessor.set = set;
	accessor.get = get;
	accessor.remove = remove;
	accessor.clear = clear$1;
	accessor.on = tracking.on;
	accessor.off = tracking.off;

	var localStorage = accessor;

	const getCache = (key, initial) => {
	  const cached = localStorage.get(key);
	  return cached !== null ? cached : initial
	};

	const useLocalStorage = (key, initial) => {
	  const [nativeState, setNativeState] = react.useState(getCache(key, initial));
	  const setState = state => {
	    if(typeof state === 'function'){
	      setNativeState(prev => {
	        const newState = state(prev);
	        localStorage.set(key, newState);
	        return newState
	      });
	    }else{
	      localStorage.set(key, state);
	      setNativeState(state);
	    }
	  };

	  return [nativeState, setState]
	};

	const useFiler = key => {
	  const [files, setFiles] = useLocalStorageState(key, {});

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

	const useLocalStorage$1 = useLocalStorage;
	const useFiler$1 = useFiler;
	const useKeyboardShortcut = keyboardShortcut;

	exports.useLocalStorage = useLocalStorage$1;
	exports.useFiler = useFiler$1;
	exports.useKeyboardShortcut = useKeyboardShortcut;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
