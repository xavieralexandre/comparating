(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var context, Fiber;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/router/lib/router_server.js                                                                    //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var connectHandlers, connect;                                                                              // 1
                                                                                                           // 2
if (typeof(Npm) == "undefined") {                                                                          // 3
  connect = __meteor_bootstrap__.require("connect");                                                       // 4
} else {                                                                                                   // 5
  connect = Npm.require("connect");                                                                        // 6
}                                                                                                          // 7
                                                                                                           // 8
if (typeof __meteor_bootstrap__.app !== 'undefined') {                                                     // 9
  connectHandlers = __meteor_bootstrap__.app;                                                              // 10
} else {                                                                                                   // 11
  connectHandlers = WebApp.connectHandlers;                                                                // 12
}                                                                                                          // 13
                                                                                                           // 14
                                                                                                           // 15
var Router = function() {                                                                                  // 16
  this._routes = [];                                                                                       // 17
  this._config = {                                                                                         // 18
    requestParser: connect.bodyParser                                                                      // 19
  };                                                                                                       // 20
  this._started = false;                                                                                   // 21
};                                                                                                         // 22
                                                                                                           // 23
// simply match this path to this function                                                                 // 24
Router.prototype.add = function(path, method, endpoint)  {                                                 // 25
  var self = this;                                                                                         // 26
                                                                                                           // 27
  // Start serving on first add() call                                                                     // 28
  if(!this._started){                                                                                      // 29
    this._start();                                                                                         // 30
  }                                                                                                        // 31
                                                                                                           // 32
  if (_.isObject(path) && ! _.isRegExp(path)) {                                                            // 33
    _.each(path, function(endpoint, p) {                                                                   // 34
      self.add(p, endpoint);                                                                               // 35
    });                                                                                                    // 36
  } else {                                                                                                 // 37
    if (! endpoint) {                                                                                      // 38
      // no http method was supplied so 2nd parameter is the endpoint                                      // 39
      endpoint = method;                                                                                   // 40
      method = null;                                                                                       // 41
    }                                                                                                      // 42
    if (! _.isFunction(endpoint)) {                                                                        // 43
      endpoint = _.bind(_.identity, null, endpoint);                                                       // 44
    }                                                                                                      // 45
    self._routes.push([new Meteor.Router.Route(path, method), endpoint]);                                  // 46
  }                                                                                                        // 47
};                                                                                                         // 48
                                                                                                           // 49
Router.prototype.match = function(request, response) {                                                     // 50
  for (var i = 0; i < this._routes.length; i++) {                                                          // 51
    var params = [], route = this._routes[i];                                                              // 52
                                                                                                           // 53
    if (route[0].match(request.url, request.method, params)) {                                             // 54
      context = {request: request, response: response, params: params};                                    // 55
                                                                                                           // 56
      var args = [];                                                                                       // 57
      for (var key in context.params)                                                                      // 58
        args.push(context.params[key]);                                                                    // 59
                                                                                                           // 60
      return route[1].apply(context, args);                                                                // 61
    }                                                                                                      // 62
  }                                                                                                        // 63
                                                                                                           // 64
  return false;                                                                                            // 65
};                                                                                                         // 66
                                                                                                           // 67
Router.prototype.configure = function(config) {                                                            // 68
  if(this._started){                                                                                       // 69
    throw new Error("Router.configure() has to be called before first call to Router.add()");              // 70
  }                                                                                                        // 71
                                                                                                           // 72
  this._config = _.extend(this._config, config);                                                           // 73
};                                                                                                         // 74
                                                                                                           // 75
Router.prototype._start = function(){                                                                      // 76
  var self = this;                                                                                         // 77
                                                                                                           // 78
  if(this._started){                                                                                       // 79
    throw new Error("Router has already been started");                                                    // 80
  }                                                                                                        // 81
                                                                                                           // 82
  this._started = true;                                                                                    // 83
                                                                                                           // 84
  // hook up the serving                                                                                   // 85
  connectHandlers                                                                                          // 86
    .use(connect.query()) // <- XXX: we can probably assume accounts did this                              // 87
    .use(this._config.requestParser(this._config.bodyParser))                                              // 88
    .use(function(req, res, next) {                                                                        // 89
      // need to wrap in a fiber in case they do something async                                           // 90
      // (e.g. in the database)                                                                            // 91
      if(typeof(Fiber)=="undefined") Fiber = Npm.require('fibers');                                        // 92
                                                                                                           // 93
      Fiber(function() {                                                                                   // 94
        var output = Meteor.Router.match(req, res);                                                        // 95
                                                                                                           // 96
        if (output === false) {                                                                            // 97
          return next();                                                                                   // 98
        } else {                                                                                           // 99
          // parse out the various type of response we can have                                            // 100
                                                                                                           // 101
          // array can be                                                                                  // 102
          // [content], [status, content], [status, headers, content]                                      // 103
          if (_.isArray(output)) {                                                                         // 104
            // copy the array so we aren't actually modifying it!                                          // 105
            output = output.slice(0);                                                                      // 106
                                                                                                           // 107
            if (output.length === 3) {                                                                     // 108
              var headers = output.splice(1, 1)[0];                                                        // 109
              _.each(headers, function(value, key) {                                                       // 110
                res.setHeader(key, value);                                                                 // 111
              });                                                                                          // 112
            }                                                                                              // 113
                                                                                                           // 114
            if (output.length === 2) {                                                                     // 115
              res.statusCode = output.shift();                                                             // 116
            }                                                                                              // 117
                                                                                                           // 118
            output = output[0];                                                                            // 119
          }                                                                                                // 120
                                                                                                           // 121
          if (_.isNumber(output)) {                                                                        // 122
            res.statusCode = output;                                                                       // 123
            output = '';                                                                                   // 124
          }                                                                                                // 125
                                                                                                           // 126
          return res.end(output);                                                                          // 127
        }                                                                                                  // 128
      }).run();                                                                                            // 129
    });                                                                                                    // 130
};                                                                                                         // 131
                                                                                                           // 132
// Make the router available                                                                               // 133
Meteor.Router = new Router();                                                                              // 134
                                                                                                           // 135
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/router/lib/router_common.js                                                                    //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
(function() {                                                                                              // 1
  // Route object taken from page.js, slightly stripped down                                               // 2
  //                                                                                                       // 3
  // Copyright (c) 2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;                                          // 4
  //                                                                                                       // 5
  /**                                                                                                      // 6
   * Initialize `Route` with the given HTTP `path`, HTTP `method`,                                         // 7
   * and an array of `callbacks` and `options`.                                                            // 8
   *                                                                                                       // 9
   * Options:                                                                                              // 10
   *                                                                                                       // 11
   *   - `sensitive`    enable case-sensitive routes                                                       // 12
   *   - `strict`       enable strict matching for trailing slashes                                        // 13
   *                                                                                                       // 14
   * @param {String} path                                                                                  // 15
   * @param {String} method                                                                                // 16
   * @param {Object} options.                                                                              // 17
   * @api private                                                                                          // 18
   */                                                                                                      // 19
                                                                                                           // 20
  Meteor.Router.Route = function(path, method, options) {                                                  // 21
    options = options || {};                                                                               // 22
    this.path = path;                                                                                      // 23
    this.method = method;                                                                                  // 24
    this.regexp = pathtoRegexp(path                                                                        // 25
      , this.keys = []                                                                                     // 26
      , options.sensitive                                                                                  // 27
      , options.strict);                                                                                   // 28
  }                                                                                                        // 29
                                                                                                           // 30
  /**                                                                                                      // 31
   * Check if this route matches `path` and optional `method`, if so                                       // 32
   * populate `params`.                                                                                    // 33
   *                                                                                                       // 34
   * @param {String} path                                                                                  // 35
   * @param {String} method                                                                                // 36
   * @param {Array} params                                                                                 // 37
   * @return {Boolean}                                                                                     // 38
   * @api private                                                                                          // 39
   */                                                                                                      // 40
                                                                                                           // 41
  Meteor.Router.Route.prototype.match = function(path, method, params){                                    // 42
    var keys, qsIndex, pathname, m;                                                                        // 43
                                                                                                           // 44
    if (this.method && this.method.toUpperCase() !== method) return false;                                 // 45
                                                                                                           // 46
    keys = this.keys;                                                                                      // 47
    qsIndex = path.indexOf('?');                                                                           // 48
    pathname = ~qsIndex ? path.slice(0, qsIndex) : path;                                                   // 49
    m = this.regexp.exec(pathname);                                                                        // 50
                                                                                                           // 51
    if (!m) return false;                                                                                  // 52
                                                                                                           // 53
    for (var i = 1, len = m.length; i < len; ++i) {                                                        // 54
      var key = keys[i - 1];                                                                               // 55
                                                                                                           // 56
      var val = 'string' == typeof m[i]                                                                    // 57
        ? decodeURIComponent(m[i])                                                                         // 58
        : m[i];                                                                                            // 59
                                                                                                           // 60
      if (key) {                                                                                           // 61
        params[key.name] = undefined !== params[key.name]                                                  // 62
          ? params[key.name]                                                                               // 63
          : val;                                                                                           // 64
      } else {                                                                                             // 65
        params.push(val);                                                                                  // 66
      }                                                                                                    // 67
    }                                                                                                      // 68
                                                                                                           // 69
    return true;                                                                                           // 70
  };                                                                                                       // 71
                                                                                                           // 72
  /**                                                                                                      // 73
   * Normalize the given path string,                                                                      // 74
   * returning a regular expression.                                                                       // 75
   *                                                                                                       // 76
   * An empty array should be passed,                                                                      // 77
   * which will contain the placeholder                                                                    // 78
   * key names. For example "/user/:id" will                                                               // 79
   * then contain ["id"].                                                                                  // 80
   *                                                                                                       // 81
   * @param  {String|RegExp|Array} path                                                                    // 82
   * @param  {Array} keys                                                                                  // 83
   * @param  {Boolean} sensitive                                                                           // 84
   * @param  {Boolean} strict                                                                              // 85
   * @return {RegExp}                                                                                      // 86
   * @api private                                                                                          // 87
   */                                                                                                      // 88
                                                                                                           // 89
  function pathtoRegexp(path, keys, sensitive, strict) {                                                   // 90
    if (path instanceof RegExp) return path;                                                               // 91
    if (path instanceof Array) path = '(' + path.join('|') + ')';                                          // 92
    path = path                                                                                            // 93
      .concat(strict ? '' : '/?')                                                                          // 94
      .replace(/\/\(/g, '(?:/')                                                                            // 95
      .replace(/\+/g, '__plus__')                                                                          // 96
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){ // 97
        keys.push({ name: key, optional: !! optional });                                                   // 98
        slash = slash || '';                                                                               // 99
        return ''                                                                                          // 100
          + (optional ? '' : slash)                                                                        // 101
          + '(?:'                                                                                          // 102
          + (optional ? slash : '')                                                                        // 103
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                      // 104
          + (optional || '');                                                                              // 105
      })                                                                                                   // 106
      .replace(/([\/.])/g, '\\$1')                                                                         // 107
      .replace(/__plus__/g, '(.+)')                                                                        // 108
      .replace(/\*/g, '(.*)');                                                                             // 109
                                                                                                           // 110
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');                                             // 111
  };                                                                                                       // 112
                                                                                                           // 113
  /// END Route object                                                                                     // 114
                                                                                                           // 115
  // Added by tom, lifted from mini-pages, with some modifications                                         // 116
                                                                                                           // 117
  /**                                                                                                      // 118
    Given a context object, returns a url path with the values of the context                              // 119
    object mapped over the path.                                                                           // 120
                                                                                                           // 121
    Alternatively, supply the named parts of the paths as discrete arguments.                              // 122
                                                                                                           // 123
    @method pathWithContext                                                                                // 124
    @param [context] {Object} An optional context object to use for                                        // 125
    interpolation.                                                                                         // 126
                                                                                                           // 127
    @example                                                                                               // 128
        // given a page with a path of "/posts/:_id/edit"                                                  // 129
        var path = page.pathWithContext({ _id: 123 });                                                     // 130
        // > /posts/123/edit                                                                               // 131
  */                                                                                                       // 132
  Meteor.Router.Route.prototype.pathWithContext = function (context) {                                     // 133
    var self = this,                                                                                       // 134
        path = self.path,                                                                                  // 135
        parts,                                                                                             // 136
        args = arguments;                                                                                  // 137
                                                                                                           // 138
    /* get an array of keys from the path to replace with context values.                                  // 139
    /* XXX Right now this comes from page-js. Remove dependency.                                           // 140
     */                                                                                                    // 141
    parts = self.regexp.exec(self.path).slice(1);                                                          // 142
                                                                                                           // 143
    context = context || {};                                                                               // 144
                                                                                                           // 145
    var replacePathPartWithContextValue = function (part, i) {                                             // 146
      var re = new RegExp(part, "g"),                                                                      // 147
          prop = part.replace(":", ""),                                                                    // 148
          val;                                                                                             // 149
                                                                                                           // 150
      if (_.isObject(context))                                                                             // 151
        val = context[prop]                                                                                // 152
      else                                                                                                 // 153
        val = args[i];                                                                                     // 154
                                                                                                           // 155
      path = path.replace(re, val || '');                                                                  // 156
    };                                                                                                     // 157
                                                                                                           // 158
    _.each(parts, replacePathPartWithContextValue);                                                        // 159
                                                                                                           // 160
    return path;                                                                                           // 161
  }                                                                                                        // 162
}());                                                                                                      // 163
                                                                                                           // 164
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.router = {};

})();
