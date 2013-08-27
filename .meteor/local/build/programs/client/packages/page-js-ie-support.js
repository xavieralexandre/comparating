//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/page-js-ie-support/page-js/index.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
;(function(){                                                                                              // 1
                                                                                                           // 2
  /**                                                                                                      // 3
   * Perform initial dispatch.                                                                             // 4
   */                                                                                                      // 5
                                                                                                           // 6
  var dispatch = true;                                                                                     // 7
                                                                                                           // 8
  /**                                                                                                      // 9
   * Base path.                                                                                            // 10
   */                                                                                                      // 11
                                                                                                           // 12
  var base = '';                                                                                           // 13
                                                                                                           // 14
  /**                                                                                                      // 15
   * Running flag.                                                                                         // 16
   */                                                                                                      // 17
                                                                                                           // 18
  var running;                                                                                             // 19
                                                                                                           // 20
  /**                                                                                                      // 21
   * To work properly with the URL                                                                         // 22
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API                    // 23
   */                                                                                                      // 24
  var location = history.location || window.location;                                                      // 25
                                                                                                           // 26
  /**                                                                                                      // 27
   * Register `path` with callback `fn()`,                                                                 // 28
   * or route `path`, or `page.start()`.                                                                   // 29
   *                                                                                                       // 30
   *   page(fn);                                                                                           // 31
   *   page('*', fn);                                                                                      // 32
   *   page('/user/:id', load, user);                                                                      // 33
   *   page('/user/' + user.id, { some: 'thing' });                                                        // 34
   *   page('/user/' + user.id);                                                                           // 35
   *   page();                                                                                             // 36
   *                                                                                                       // 37
   * @param {String|Function} path                                                                         // 38
   * @param {Function} fn...                                                                               // 39
   * @api public                                                                                           // 40
   */                                                                                                      // 41
                                                                                                           // 42
  function page(path, fn) {                                                                                // 43
    // <callback>                                                                                          // 44
    if ('function' == typeof path) {                                                                       // 45
      return page('*', path);                                                                              // 46
    }                                                                                                      // 47
                                                                                                           // 48
    // route <path> to <callback ...>                                                                      // 49
    if ('function' == typeof fn) {                                                                         // 50
      var route = new Route(path);                                                                         // 51
      for (var i = 1; i < arguments.length; ++i) {                                                         // 52
        page.callbacks.push(route.middleware(arguments[i]));                                               // 53
      }                                                                                                    // 54
    // show <path> with [state]                                                                            // 55
    } else if ('string' == typeof path) {                                                                  // 56
      page.show(path, fn);                                                                                 // 57
    // start [options]                                                                                     // 58
    } else {                                                                                               // 59
      page.start(path);                                                                                    // 60
    }                                                                                                      // 61
  }                                                                                                        // 62
                                                                                                           // 63
  /**                                                                                                      // 64
   * Callback functions.                                                                                   // 65
   */                                                                                                      // 66
                                                                                                           // 67
  page.callbacks = [];                                                                                     // 68
                                                                                                           // 69
  /**                                                                                                      // 70
   * Get or set basepath to `path`.                                                                        // 71
   *                                                                                                       // 72
   * @param {String} path                                                                                  // 73
   * @api public                                                                                           // 74
   */                                                                                                      // 75
                                                                                                           // 76
  page.base = function(path){                                                                              // 77
    if (0 == arguments.length) return base;                                                                // 78
    base = path;                                                                                           // 79
  };                                                                                                       // 80
                                                                                                           // 81
  /**                                                                                                      // 82
   * Bind with the given `options`.                                                                        // 83
   *                                                                                                       // 84
   * Options:                                                                                              // 85
   *                                                                                                       // 86
   *    - `click` bind to click events [true]                                                              // 87
   *    - `popstate` bind to popstate [true]                                                               // 88
   *    - `dispatch` perform initial dispatch [true]                                                       // 89
   *                                                                                                       // 90
   * @param {Object} options                                                                               // 91
   * @api public                                                                                           // 92
   */                                                                                                      // 93
                                                                                                           // 94
  page.start = function(options){                                                                          // 95
    options = options || {};                                                                               // 96
    if (running) return;                                                                                   // 97
    running = true;                                                                                        // 98
    if (false === options.dispatch) dispatch = false;                                                      // 99
    if (false !== options.popstate) addEvent(window, 'popstate', onpopstate);                              // 100
    if (false !== options.click) addEvent(document, 'click', onclick);                                     // 101
    if (!dispatch) return;                                                                                 // 102
    page.replace(location.pathname + location.search, null, true, dispatch);                               // 103
  };                                                                                                       // 104
                                                                                                           // 105
  /**                                                                                                      // 106
   * Unbind click and popstate event handlers.                                                             // 107
   *                                                                                                       // 108
   * @api public                                                                                           // 109
   */                                                                                                      // 110
                                                                                                           // 111
  page.stop = function(){                                                                                  // 112
    running = false;                                                                                       // 113
    removeEvent(document, 'click', onclick);                                                               // 114
    removeEvent(window, 'popstate', onpopstate);                                                           // 115
  };                                                                                                       // 116
                                                                                                           // 117
  /**                                                                                                      // 118
   * Show `path` with optional `state` object.                                                             // 119
   *                                                                                                       // 120
   * @param {String} path                                                                                  // 121
   * @param {Object} state                                                                                 // 122
   * @param {Boolean} dispatch                                                                             // 123
   * @return {Context}                                                                                     // 124
   * @api public                                                                                           // 125
   */                                                                                                      // 126
                                                                                                           // 127
  page.show = function(path, state, dispatch){                                                             // 128
    var ctx = new Context(path, state);                                                                    // 129
    if (false !== dispatch) page.dispatch(ctx);                                                            // 130
    if (!ctx.unhandled) ctx.pushState();                                                                   // 131
    return ctx;                                                                                            // 132
  };                                                                                                       // 133
                                                                                                           // 134
  /**                                                                                                      // 135
   * Replace `path` with optional `state` object.                                                          // 136
   *                                                                                                       // 137
   * @param {String} path                                                                                  // 138
   * @param {Object} state                                                                                 // 139
   * @return {Context}                                                                                     // 140
   * @api public                                                                                           // 141
   */                                                                                                      // 142
                                                                                                           // 143
  page.replace = function(path, state, init, dispatch){                                                    // 144
    var ctx = new Context(path, state);                                                                    // 145
    ctx.init = init;                                                                                       // 146
    if (null == dispatch) dispatch = true;                                                                 // 147
    if (dispatch) page.dispatch(ctx);                                                                      // 148
    ctx.save();                                                                                            // 149
    return ctx;                                                                                            // 150
  };                                                                                                       // 151
                                                                                                           // 152
  /**                                                                                                      // 153
   * Dispatch the given `ctx`.                                                                             // 154
   *                                                                                                       // 155
   * @param {Object} ctx                                                                                   // 156
   * @api private                                                                                          // 157
   */                                                                                                      // 158
                                                                                                           // 159
  page.dispatch = function(ctx){                                                                           // 160
    var i = 0;                                                                                             // 161
                                                                                                           // 162
    function next() {                                                                                      // 163
      var fn = page.callbacks[i++];                                                                        // 164
      if (!fn) return unhandled(ctx);                                                                      // 165
      fn(ctx, next);                                                                                       // 166
    }                                                                                                      // 167
                                                                                                           // 168
    next();                                                                                                // 169
  };                                                                                                       // 170
                                                                                                           // 171
  /**                                                                                                      // 172
   * Unhandled `ctx`. When it's not the initial                                                            // 173
   * popstate then redirect. If you wish to handle                                                         // 174
   * 404s on your own use `page('*', callback)`.                                                           // 175
   *                                                                                                       // 176
   * @param {Context} ctx                                                                                  // 177
   * @api private                                                                                          // 178
   */                                                                                                      // 179
                                                                                                           // 180
  function unhandled(ctx) {                                                                                // 181
    if (location.pathname + location.search == ctx.canonicalPath) return;                                  // 182
    page.stop();                                                                                           // 183
    ctx.unhandled = true;                                                                                  // 184
    window.location = ctx.canonicalPath;                                                                   // 185
  }                                                                                                        // 186
                                                                                                           // 187
  /**                                                                                                      // 188
   * Initialize a new "request" `Context`                                                                  // 189
   * with the given `path` and optional initial `state`.                                                   // 190
   *                                                                                                       // 191
   * @param {String} path                                                                                  // 192
   * @param {Object} state                                                                                 // 193
   * @api public                                                                                           // 194
   */                                                                                                      // 195
                                                                                                           // 196
  function Context(path, state) {                                                                          // 197
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;                                     // 198
    var i = path.indexOf('?');                                                                             // 199
    this.canonicalPath = path;                                                                             // 200
    this.path = path.replace(base, '') || '/';                                                             // 201
    this.title = document.title;                                                                           // 202
    this.state = state || {};                                                                              // 203
    this.state.path = path;                                                                                // 204
    this.querystring = ~i ? path.slice(i + 1) : '';                                                        // 205
    this.pathname = ~i ? path.slice(0, i) : path;                                                          // 206
    this.params = [];                                                                                      // 207
  }                                                                                                        // 208
                                                                                                           // 209
  /**                                                                                                      // 210
   * Expose `Context`.                                                                                     // 211
   */                                                                                                      // 212
                                                                                                           // 213
  page.Context = Context;                                                                                  // 214
                                                                                                           // 215
  /**                                                                                                      // 216
   * Push state.                                                                                           // 217
   *                                                                                                       // 218
   * @api private                                                                                          // 219
   */                                                                                                      // 220
                                                                                                           // 221
  Context.prototype.pushState = function(){                                                                // 222
    history.pushState(this.state, this.title, this.canonicalPath);                                         // 223
  };                                                                                                       // 224
                                                                                                           // 225
  /**                                                                                                      // 226
   * Save the context state.                                                                               // 227
   *                                                                                                       // 228
   * @api public                                                                                           // 229
   */                                                                                                      // 230
                                                                                                           // 231
  Context.prototype.save = function(){                                                                     // 232
    history.replaceState(this.state, this.title, this.canonicalPath);                                      // 233
  };                                                                                                       // 234
                                                                                                           // 235
  /**                                                                                                      // 236
   * Initialize `Route` with the given HTTP `path`,                                                        // 237
   * and an array of `callbacks` and `options`.                                                            // 238
   *                                                                                                       // 239
   * Options:                                                                                              // 240
   *                                                                                                       // 241
   *   - `sensitive`    enable case-sensitive routes                                                       // 242
   *   - `strict`       enable strict matching for trailing slashes                                        // 243
   *                                                                                                       // 244
   * @param {String} path                                                                                  // 245
   * @param {Object} options.                                                                              // 246
   * @api private                                                                                          // 247
   */                                                                                                      // 248
                                                                                                           // 249
  function Route(path, options) {                                                                          // 250
    options = options || {};                                                                               // 251
    this.path = path;                                                                                      // 252
    this.method = 'GET';                                                                                   // 253
    this.regexp = pathtoRegexp(path                                                                        // 254
      , this.keys = []                                                                                     // 255
      , options.sensitive                                                                                  // 256
      , options.strict);                                                                                   // 257
  }                                                                                                        // 258
                                                                                                           // 259
  /**                                                                                                      // 260
   * Expose `Route`.                                                                                       // 261
   */                                                                                                      // 262
                                                                                                           // 263
  page.Route = Route;                                                                                      // 264
                                                                                                           // 265
  /**                                                                                                      // 266
   * Return route middleware with                                                                          // 267
   * the given callback `fn()`.                                                                            // 268
   *                                                                                                       // 269
   * @param {Function} fn                                                                                  // 270
   * @return {Function}                                                                                    // 271
   * @api public                                                                                           // 272
   */                                                                                                      // 273
                                                                                                           // 274
  Route.prototype.middleware = function(fn){                                                               // 275
    var self = this;                                                                                       // 276
    return function(ctx, next){                                                                            // 277
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);                                          // 278
      next();                                                                                              // 279
    }                                                                                                      // 280
  };                                                                                                       // 281
                                                                                                           // 282
  /**                                                                                                      // 283
   * Check if this route matches `path`, if so                                                             // 284
   * populate `params`.                                                                                    // 285
   *                                                                                                       // 286
   * @param {String} path                                                                                  // 287
   * @param {Array} params                                                                                 // 288
   * @return {Boolean}                                                                                     // 289
   * @api private                                                                                          // 290
   */                                                                                                      // 291
                                                                                                           // 292
  Route.prototype.match = function(path, params){                                                          // 293
    var keys = this.keys                                                                                   // 294
      , qsIndex = path.indexOf('?')                                                                        // 295
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path                                                // 296
      , m = this.regexp.exec(pathname);                                                                    // 297
                                                                                                           // 298
    if (!m) return false;                                                                                  // 299
                                                                                                           // 300
    for (var i = 1, len = m.length; i < len; ++i) {                                                        // 301
      var key = keys[i - 1];                                                                               // 302
                                                                                                           // 303
      var val = 'string' == typeof m[i]                                                                    // 304
        ? decodeURIComponent(m[i])                                                                         // 305
        : m[i];                                                                                            // 306
                                                                                                           // 307
      if (key) {                                                                                           // 308
        params[key.name] = undefined !== params[key.name]                                                  // 309
          ? params[key.name]                                                                               // 310
          : val;                                                                                           // 311
      } else {                                                                                             // 312
        params.push(val);                                                                                  // 313
      }                                                                                                    // 314
    }                                                                                                      // 315
                                                                                                           // 316
    return true;                                                                                           // 317
  };                                                                                                       // 318
                                                                                                           // 319
  /**                                                                                                      // 320
   * Normalize the given path string,                                                                      // 321
   * returning a regular expression.                                                                       // 322
   *                                                                                                       // 323
   * An empty array should be passed,                                                                      // 324
   * which will contain the placeholder                                                                    // 325
   * key names. For example "/user/:id" will                                                               // 326
   * then contain ["id"].                                                                                  // 327
   *                                                                                                       // 328
   * @param  {String|RegExp|Array} path                                                                    // 329
   * @param  {Array} keys                                                                                  // 330
   * @param  {Boolean} sensitive                                                                           // 331
   * @param  {Boolean} strict                                                                              // 332
   * @return {RegExp}                                                                                      // 333
   * @api private                                                                                          // 334
   */                                                                                                      // 335
                                                                                                           // 336
  function pathtoRegexp(path, keys, sensitive, strict) {                                                   // 337
    if (path instanceof RegExp) return path;                                                               // 338
    if (path instanceof Array) path = '(' + path.join('|') + ')';                                          // 339
    path = path                                                                                            // 340
      .concat(strict ? '' : '/?')                                                                          // 341
      .replace(/\/\(/g, '(?:/')                                                                            // 342
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){ // 343
        keys.push({ name: key, optional: !! optional });                                                   // 344
        slash = slash || '';                                                                               // 345
        return ''                                                                                          // 346
          + (optional ? '' : slash)                                                                        // 347
          + '(?:'                                                                                          // 348
          + (optional ? slash : '')                                                                        // 349
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                      // 350
          + (optional || '');                                                                              // 351
      })                                                                                                   // 352
      .replace(/([\/.])/g, '\\$1')                                                                         // 353
      .replace(/\*/g, '(.*)');                                                                             // 354
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');                                             // 355
  };                                                                                                       // 356
                                                                                                           // 357
  /**                                                                                                      // 358
   * Handle "populate" events.                                                                             // 359
   */                                                                                                      // 360
                                                                                                           // 361
  function onpopstate(e) {                                                                                 // 362
    if (e.state) {                                                                                         // 363
      var path = e.state.path;                                                                             // 364
      page.replace(path, e.state);                                                                         // 365
    }                                                                                                      // 366
  }                                                                                                        // 367
                                                                                                           // 368
  /**                                                                                                      // 369
   * Handle "click" events.                                                                                // 370
   */                                                                                                      // 371
                                                                                                           // 372
  function onclick(e) {                                                                                    // 373
    if (!which(e)) return;                                                                                 // 374
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;                                                      // 375
    if (e.defaultPrevented) return;                                                                        // 376
    var el = e.target || e.srcElement;                                                                     // 377
    while (el && 'A' != el.nodeName) el = el.parentNode;                                                   // 378
    if (!el || 'A' != el.nodeName) return;                                                                 // 379
    var href = el.href;                                                                                    // 380
    var path = el.pathname + el.search;                                                                    // 381
                                                                                                           // 382
    // XXX: I don't think this hack will work in earlier versions of IE,                                   // 383
    // fix to properly parse out path from href; I'm just putting this in for                              // 384
    // now to see if it works                                                                              // 385
    if (path[0] !== '/')                                                                                   // 386
      path = '/' + path;                                                                                   // 387
                                                                                                           // 388
    if (el.hash || '#' == el.getAttribute('href')) return;                                                 // 389
    if (!sameOrigin(href)) return;                                                                         // 390
    var orig = path;                                                                                       // 391
    path = path.replace(base, '');                                                                         // 392
    if (base && orig == path) return;                                                                      // 393
    e.preventDefault ? e.preventDefault() : e.returnValue = false;                                         // 394
    page.show(orig);                                                                                       // 395
  }                                                                                                        // 396
                                                                                                           // 397
  /**                                                                                                      // 398
   * Event button.                                                                                         // 399
   */                                                                                                      // 400
                                                                                                           // 401
  function which(e) {                                                                                      // 402
    e = e || window.event;                                                                                 // 403
    return null == e.which                                                                                 // 404
      ? e.button == 0                                                                                      // 405
      : e.which == 1;                                                                                      // 406
  }                                                                                                        // 407
                                                                                                           // 408
  /**                                                                                                      // 409
   * Check if `href` is the same origin.                                                                   // 410
   */                                                                                                      // 411
                                                                                                           // 412
  function sameOrigin(href) {                                                                              // 413
    var origin = location.protocol + '//' + location.hostname;                                             // 414
    if (location.port) origin += ':' + location.port;                                                      // 415
    return 0 == href.indexOf(origin);                                                                      // 416
  }                                                                                                        // 417
                                                                                                           // 418
  /**                                                                                                      // 419
   * Basic cross browser event code                                                                        // 420
   */                                                                                                      // 421
                                                                                                           // 422
   function addEvent(obj, type, fn) {                                                                      // 423
     if (obj.addEventListener) {                                                                           // 424
       obj.addEventListener(type, fn, false);                                                              // 425
     } else {                                                                                              // 426
       obj.attachEvent('on' + type, fn);                                                                   // 427
     }                                                                                                     // 428
   }                                                                                                       // 429
                                                                                                           // 430
   function removeEvent(obj, type, fn) {                                                                   // 431
     if (obj.removeEventListener) {                                                                        // 432
       obj.removeEventListener(type, fn, false);                                                           // 433
     } else {                                                                                              // 434
       obj.detachEvent('on' + type, fn);                                                                   // 435
     }                                                                                                     // 436
   }                                                                                                       // 437
                                                                                                           // 438
  /**                                                                                                      // 439
   * Expose `page`.                                                                                        // 440
   */                                                                                                      // 441
                                                                                                           // 442
  if ('undefined' == typeof module) {                                                                      // 443
    window.page = page;                                                                                    // 444
  } else {                                                                                                 // 445
    module.exports = page;                                                                                 // 446
  }                                                                                                        // 447
                                                                                                           // 448
})();                                                                                                      // 449
                                                                                                           // 450
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['page-js-ie-support'] = {};

})();

//# sourceMappingURL=eb95012d4c01dbb6793ca50e92b2b25f095e950c.map
