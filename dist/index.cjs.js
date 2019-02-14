(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('crypto'), require('cluster')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'crypto', 'cluster'], factory) :
	(global = global || self, factory(global.crooks = {}, global.react, global.crypto, global.cluster));
}(this, function (exports, react, crypto, cluster) { 'use strict';

	crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;
	cluster = cluster && cluster.hasOwnProperty('default') ? cluster['default'] : cluster;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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

	// Found this seed-based random generator somewhere
	// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

	var seed = 1;

	/**
	 * return a random number based on a seed
	 * @param seed
	 * @returns {number}
	 */
	function getNextValue() {
	    seed = (seed * 9301 + 49297) % 233280;
	    return seed/(233280.0);
	}

	function setSeed(_seed_) {
	    seed = _seed_;
	}

	var randomFromSeed = {
	    nextValue: getNextValue,
	    seed: setSeed
	};

	var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
	var alphabet;
	var previousSeed;

	var shuffled;

	function reset() {
	    shuffled = false;
	}

	function setCharacters(_alphabet_) {
	    if (!_alphabet_) {
	        if (alphabet !== ORIGINAL) {
	            alphabet = ORIGINAL;
	            reset();
	        }
	        return;
	    }

	    if (_alphabet_ === alphabet) {
	        return;
	    }

	    if (_alphabet_.length !== ORIGINAL.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
	    }

	    var unique = _alphabet_.split('').filter(function(item, ind, arr){
	       return ind !== arr.lastIndexOf(item);
	    });

	    if (unique.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
	    }

	    alphabet = _alphabet_;
	    reset();
	}

	function characters(_alphabet_) {
	    setCharacters(_alphabet_);
	    return alphabet;
	}

	function setSeed$1(seed) {
	    randomFromSeed.seed(seed);
	    if (previousSeed !== seed) {
	        reset();
	        previousSeed = seed;
	    }
	}

	function shuffle() {
	    if (!alphabet) {
	        setCharacters(ORIGINAL);
	    }

	    var sourceArray = alphabet.split('');
	    var targetArray = [];
	    var r = randomFromSeed.nextValue();
	    var characterIndex;

	    while (sourceArray.length > 0) {
	        r = randomFromSeed.nextValue();
	        characterIndex = Math.floor(r * sourceArray.length);
	        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
	    }
	    return targetArray.join('');
	}

	function getShuffled() {
	    if (shuffled) {
	        return shuffled;
	    }
	    shuffled = shuffle();
	    return shuffled;
	}

	/**
	 * lookup shuffled letter
	 * @param index
	 * @returns {string}
	 */
	function lookup(index) {
	    var alphabetShuffled = getShuffled();
	    return alphabetShuffled[index];
	}

	function get$1 () {
	  return alphabet || ORIGINAL;
	}

	var alphabet_1 = {
	    get: get$1,
	    characters: characters,
	    seed: setSeed$1,
	    lookup: lookup,
	    shuffled: getShuffled
	};

	var random = createCommonjsModule(function (module) {
	if (crypto.randomFillSync) {
	  var buffers = { };
	  module.exports = function (bytes) {
	    var buffer = buffers[bytes];
	    if (!buffer) {
	      buffer = Buffer.allocUnsafe(bytes);
	      if (bytes <= 255) buffers[bytes] = buffer;
	    }
	    return crypto.randomFillSync(buffer)
	  };
	} else {
	  module.exports = crypto.randomBytes;
	}
	});

	var randomByte = random;

	/**
	 * Secure random string generator with custom alphabet.
	 *
	 * Alphabet must contain 256 symbols or less. Otherwise, the generator
	 * will not be secure.
	 *
	 * @param {generator} random The random bytes generator.
	 * @param {string} alphabet Symbols to be used in new random string.
	 * @param {size} size The number of symbols in new random string.
	 *
	 * @return {string} Random string.
	 *
	 * @example
	 * const format = require('nanoid/format')
	 *
	 * function random (size) {
	 *   const result = []
	 *   for (let i = 0; i < size; i++) {
	 *     result.push(randomByte())
	 *   }
	 *   return result
	 * }
	 *
	 * format(random, "abcdef", 5) //=> "fbaef"
	 *
	 * @name format
	 * @function
	 */
	var format = function (random, alphabet, size) {
	  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
	  var step = Math.ceil(1.6 * mask * size / alphabet.length);

	  var id = '';
	  while (true) {
	    var bytes = random(step);
	    for (var i = 0; i < step; i++) {
	      var byte = bytes[i] & mask;
	      if (alphabet[byte]) {
	        id += alphabet[byte];
	        if (id.length === size) return id
	      }
	    }
	  }
	};

	function generate(number) {
	    var loopCounter = 0;
	    var done;

	    var str = '';

	    while (!done) {
	        str = str + format(randomByte, alphabet_1.get(), 1);
	        done = number < (Math.pow(16, loopCounter + 1 ) );
	        loopCounter++;
	    }
	    return str;
	}

	var generate_1 = generate;

	// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
	// This number should be updated every year or so to keep the generated id short.
	// To regenerate `new Date() - 0` and bump the version. Always bump the version!
	var REDUCE_TIME = 1459707606518;

	// don't change unless we change the algos or REDUCE_TIME
	// must be an integer and less than 16
	var version = 6;

	// Counter is used when shortid is called multiple times in one second.
	var counter;

	// Remember the last time shortid was called in case counter is needed.
	var previousSeconds;

	/**
	 * Generate unique id
	 * Returns string id
	 */
	function build(clusterWorkerId) {
	    var str = '';

	    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

	    if (seconds === previousSeconds) {
	        counter++;
	    } else {
	        counter = 0;
	        previousSeconds = seconds;
	    }

	    str = str + generate_1(version);
	    str = str + generate_1(clusterWorkerId);
	    if (counter > 0) {
	        str = str + generate_1(counter);
	    }
	    str = str + generate_1(seconds);
	    return str;
	}

	var build_1 = build;

	function isShortId(id) {
	    if (!id || typeof id !== 'string' || id.length < 6 ) {
	        return false;
	    }

	    var nonAlphabetic = new RegExp('[^' +
	      alphabet_1.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
	    ']');
	    return !nonAlphabetic.test(id);
	}

	var isValid = isShortId;

	var clusterId = 0;
	if (!cluster.isMaster && cluster.worker) {
	    clusterId = cluster.worker.id;
	}
	var clusterWorkerId = parseInt(process.env.NODE_UNIQUE_ID || clusterId, 10);

	var lib = createCommonjsModule(function (module) {





	// if you are using cluster or multiple servers use this to make each instance
	// has a unique value for worker
	// Note: I don't know if this is automatically set when using third
	// party cluster solutions such as pm2.
	var clusterWorkerId$$1 = clusterWorkerId || 0;

	/**
	 * Set the seed.
	 * Highly recommended if you don't want people to try to figure out your id schema.
	 * exposed as shortid.seed(int)
	 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
	 */
	function seed(seedValue) {
	    alphabet_1.seed(seedValue);
	    return module.exports;
	}

	/**
	 * Set the cluster worker or machine id
	 * exposed as shortid.worker(int)
	 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
	 * returns shortid module so it can be chained.
	 */
	function worker(workerId) {
	    clusterWorkerId$$1 = workerId;
	    return module.exports;
	}

	/**
	 *
	 * sets new characters to use in the alphabet
	 * returns the shuffled alphabet
	 */
	function characters(newCharacters) {
	    if (newCharacters !== undefined) {
	        alphabet_1.characters(newCharacters);
	    }

	    return alphabet_1.shuffled();
	}

	/**
	 * Generate unique id
	 * Returns string id
	 */
	function generate() {
	  return build_1(clusterWorkerId$$1);
	}

	// Export all other functions as properties of the generate function
	module.exports = generate;
	module.exports.generate = generate;
	module.exports.seed = seed;
	module.exports.worker = worker;
	module.exports.characters = characters;
	module.exports.isValid = isValid;
	});
	var lib_1 = lib.generate;
	var lib_2 = lib.seed;
	var lib_3 = lib.worker;
	var lib_4 = lib.characters;
	var lib_5 = lib.isValid;

	var shortid = lib;

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

	const useLocalStorage$1 = useLocalStorage;
	const useFiler$1 = useFiler;
	const useKeyboardShortcut = keyboardShortcut;

	exports.useLocalStorage = useLocalStorage$1;
	exports.useFiler = useFiler$1;
	exports.useKeyboardShortcut = useKeyboardShortcut;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
