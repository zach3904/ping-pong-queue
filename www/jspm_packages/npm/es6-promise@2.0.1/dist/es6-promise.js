/* */ 
"format cjs";
(function(process) {
  (function() {
    "use strict";
    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }
    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }
    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }
    var $$utils$$_isArray;
    if (!Array.isArray) {
      $$utils$$_isArray = function(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }
    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() {
      return new Date().getTime();
    };
    function $$utils$$F() {}
    var $$utils$$o_create = (Object.create || function(o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });
    var $$asap$$len = 0;
    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        $$asap$$scheduleFlush();
      }
    };
    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }
    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, {characterData: true});
      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function() {
        channel.port2.postMessage(0);
      };
    }
    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }
    var $$asap$$queue = new Array(1000);
    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i += 2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i + 1];
        callback(arg);
        $$asap$$queue[i] = undefined;
        $$asap$$queue[i + 1] = undefined;
      }
      $$asap$$len = 0;
    }
    var $$asap$$scheduleFlush;
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }
    function $$$internal$$noop() {}
    var $$$internal$$PENDING = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();
    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }
    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }
    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch (error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }
    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch (e) {
        return e;
      }
    }
    function $$$internal$$handleForeignThenable(promise, thenable, then) {
      $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) {
            return ;
          }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) {
            return ;
          }
          sealed = true;
          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));
        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }
    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }
    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);
        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }
    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }
    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }
      $$$internal$$publish(promise);
    }
    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) {
        return ;
      }
      promise._result = value;
      promise._state = $$$internal$$FULFILLED;
      if (promise._subscribers.length === 0) {} else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }
    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) {
        return ;
      }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;
      $$asap$$default($$$internal$$publishRejection, promise);
    }
    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;
      parent._onerror = null;
      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED] = onRejection;
      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }
    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;
      if (subscribers.length === 0) {
        return ;
      }
      var child,
          callback,
          detail = promise._result;
      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];
        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }
      promise._subscribers.length = 0;
    }
    function $$$internal$$ErrorObject() {
      this.error = null;
    }
    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();
    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch (e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }
    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value,
          error,
          succeeded,
          failed;
      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);
        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }
        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return ;
        }
      } else {
        value = detail;
        succeeded = true;
      }
      if (promise._state !== $$$internal$$PENDING) {} else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }
    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value) {
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch (e) {
        $$$internal$$reject(promise, e);
      }
    }
    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }
    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;
      if (this._validateInput(input)) {
        this._input = input;
        this.length = input.length;
        this._remaining = input.length;
        this._init();
        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }
    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };
    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };
    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };
    var $$$enumerator$$default = $$$enumerator$$Enumerator;
    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length = this.length;
      var promise = this.promise;
      var input = this._input;
      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };
    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };
    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;
      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;
        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }
      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };
    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };
    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;
      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };
    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true, label).promise;
    };
    var $$promise$race$$default = function race(entries, label) {
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }
      var length = entries.length;
      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }
      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }
      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }
      return promise;
    };
    var $$promise$resolve$$default = function resolve(object, label) {
      var Constructor = this;
      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };
    var $$promise$reject$$default = function reject(reason, label) {
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };
    var $$es6$promise$promise$$counter = 0;
    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }
    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }
    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;
    function $$es6$promise$promise$$Promise(resolver) {
      this._id = $$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];
      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }
        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }
        $$$internal$$initializePromise(this, resolver);
      }
    }
    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;
    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;
        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }
        var child = new this.constructor($$$internal$$noop);
        var result = parent._result;
        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function() {
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }
        return child;
      },
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;
      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }
      var es6PromiseSupport = "Promise" in local && "resolve" in local.Promise && "reject" in local.Promise && "all" in local.Promise && "race" in local.Promise && (function() {
        var resolve;
        new local.Promise(function(r) {
          resolve = r;
        });
        return $$utils$$isFunction(resolve);
      }());
      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };
    var es6$promise$umd$$ES6Promise = {
      'Promise': $$es6$promise$promise$$default,
      'polyfill': $$es6$promise$polyfill$$default
    };
    if (typeof define === 'function' && define['amd']) {
      define(function() {
        return es6$promise$umd$$ES6Promise;
      });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
  }).call(this);
})(require("process"));
