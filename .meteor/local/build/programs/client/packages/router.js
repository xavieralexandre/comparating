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
var Deps = Package.deps.Deps;
var Template = Package.templating.Template;
var Handlebars = Package.handlebars.Handlebars;
var _ = Package.underscore._;
var Spark = Package.spark.Spark;

/* Package-scope variables */
var key;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/router/lib/router_client.js                                                                    //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
(function() {                                                                                              // 1
  var Router = function() {                                                                                // 2
    this._page = null;                                                                                     // 3
    this._autorunHandle = null;                                                                            // 4
                                                                                                           // 5
    this._filters = {};                                                                                    // 6
    this._activeFilters = [];                                                                              // 7
    this._pageDeps = new Deps.Dependency();                                                                // 8
                                                                                                           // 9
    this.namedRoutes = {};                                                                                 // 10
  }                                                                                                        // 11
                                                                                                           // 12
  // internal, don't use                                                                                   // 13
  Router.prototype._setPageFn = function(pageFn, context) {                                                // 14
    var self = this,                                                                                       // 15
		interrupt;                                                                                               // 16
                                                                                                           // 17
    // the current function that generates self._page                                                      // 18
    // we could just store pageFn and call it everytime someone                                            // 19
    // calls Meteor.Router.page(), but this would lead to                                                  // 20
    // the routing function getting called multiple times, which could be                                  // 21
    // unexpected if it has side effects. This is essentially a memoize pattern                            // 22
    self._autorunHandle && self._autorunHandle.stop();                                                     // 23
    self._autorunHandle = Deps.autorun(function() {                                                        // 24
      interrupt = self.beforeRouting(context);                                                             // 25
	  if (interrupt != undefined && interrupt === false) {                                                    // 26
		return;                                                                                                  // 27
	  }                                                                                                       // 28
                                                                                                           // 29
      var args = [];                                                                                       // 30
      for (key in context.params)                                                                          // 31
        args.push(context.params[key]);                                                                    // 32
                                                                                                           // 33
      var oldPage = self._page;                                                                            // 34
      self._page = self._applyFilters(pageFn.apply(context, args));                                        // 35
                                                                                                           // 36
      // no need to invalidate if .page() hasn't changed                                                   // 37
      (oldPage !== self._page) && self._pageDeps.changed();                                                // 38
    })                                                                                                     // 39
  }                                                                                                        // 40
                                                                                                           // 41
  Router.prototype.add = function(path, endpoint) {                                                        // 42
    var self = this;                                                                                       // 43
                                                                                                           // 44
    if (_.isObject(path) && ! _.isRegExp(path)) {                                                          // 45
      _.each(path, function(endpoint, p) {                                                                 // 46
        self.add(p, endpoint);                                                                             // 47
      });                                                                                                  // 48
    } else {                                                                                               // 49
      // '/foo' -> 'bar' <==> '/foo' => {to: 'bar'}                                                        // 50
      if (! _.isObject(endpoint) || _.isFunction(endpoint)) {                                              // 51
        endpoint = {to: endpoint};                                                                         // 52
      }                                                                                                    // 53
                                                                                                           // 54
      // route name defaults to template name (unless it's functional)                                     // 55
      if (! endpoint.as && _.isString(endpoint.to)) {                                                      // 56
        endpoint.as = endpoint.to;                                                                         // 57
      }                                                                                                    // 58
      endpoint.as && self._setUpNamedRoute(endpoint.as, path)                                              // 59
                                                                                                           // 60
      page(path, _.bind(self._setPageFn, self, function() {                                                // 61
        endpoint.and && endpoint.and.apply(this, arguments);                                               // 62
        return _.isFunction(endpoint.to) ? endpoint.to.apply(this, arguments) : endpoint.to;               // 63
      }));                                                                                                 // 64
    }                                                                                                      // 65
  }                                                                                                        // 66
                                                                                                           // 67
  Router.prototype._setUpNamedRoute = function(name, path) {                                               // 68
    var self = this;                                                                                       // 69
    var pathName = name + 'Path', urlName = name + 'Url';                                                  // 70
                                                                                                           // 71
    // XXX: I'm not sure there shouldn't be some way to overwrite them                                     // 72
    if (self.namedRoutes[name])                                                                            // 73
      return;                                                                                              // 74
                                                                                                           // 75
    // XXX: there is some duplication here because page creates it's own                                   // 76
    // route object, but ours has a few extra bits that their's doesn't                                    // 77
    var route = new Meteor.Router.Route(path);                                                             // 78
    self.namedRoutes[name] = route;                                                                        // 79
                                                                                                           // 80
    self[pathName] = _.bind(route.pathWithContext, route);                                                 // 81
    self[urlName] = function() {                                                                           // 82
      var path = self[pathName].apply(self, arguments);                                                    // 83
      return Meteor.absoluteUrl(path.substring(1));                                                        // 84
    }                                                                                                      // 85
                                                                                                           // 86
    if (typeof Handlebars !== 'undefined') {                                                               // 87
      Handlebars.registerHelper(pathName, _.bind(self[pathName], self));                                   // 88
      Handlebars.registerHelper(urlName, _.bind(self[urlName], self));                                     // 89
    }                                                                                                      // 90
  }                                                                                                        // 91
                                                                                                           // 92
  Router.prototype.page = function() {                                                                     // 93
    Deps.depend(this._pageDeps);                                                                           // 94
    return this._page;                                                                                     // 95
  }                                                                                                        // 96
                                                                                                           // 97
  Router.prototype.to = function(path) {                                                                   // 98
    // named route                                                                                         // 99
    if (path[0] !== '/') {                                                                                 // 100
      var route = this.namedRoutes[path];                                                                  // 101
      if (! route)                                                                                         // 102
        throw 'That named route does not exist!';                                                          // 103
                                                                                                           // 104
      var args = Array.prototype.slice.call(arguments, 1);                                                 // 105
      path = route.pathWithContext.apply(route, args);                                                     // 106
    }                                                                                                      // 107
                                                                                                           // 108
    page(path);                                                                                            // 109
  }                                                                                                        // 110
                                                                                                           // 111
  Router.prototype.filters = function(filtersMap) {                                                        // 112
    _.extend(this._filters, filtersMap);                                                                   // 113
  }                                                                                                        // 114
                                                                                                           // 115
  // call with one of:                                                                                     // 116
  //                                                                                                       // 117
  //   Meteor.Router.filter('filter-name');                                                                // 118
  //     - filter all pages with filter-name                                                               // 119
  //   Meteor.Router.filter('filter-name', {only: 'home'});                                                // 120
  //     - filter the 'home' page with filter-name                                                         // 121
  //   Meteor.Router.filter('filter-name', {except: ['home']});                                            // 122
  //     - filter all pages except the 'home' page with filter-name                                        // 123
  //   Meteor.Router.filter(object)                                                                        // 124
  //     -  a map of name: application pairs                                                               // 125
  Router.prototype.filter = function(name, options) {                                                      // 126
    var self = this;                                                                                       // 127
                                                                                                           // 128
    if (_.isObject(name)) {                                                                                // 129
      return _.each(name, function(options, key) {                                                         // 130
        self.filter(key, options);                                                                         // 131
      });                                                                                                  // 132
    }                                                                                                      // 133
                                                                                                           // 134
    options = options || {};                                                                               // 135
    options.name = name;                                                                                   // 136
    if (options.only && ! _.isArray(options.only))                                                         // 137
      options.only = [options.only];                                                                       // 138
    if (options.except && ! _.isArray(options.except))                                                     // 139
      options.except = [options.except];                                                                   // 140
                                                                                                           // 141
    self._activeFilters.push(options);                                                                     // 142
  }                                                                                                        // 143
                                                                                                           // 144
  // Shouldn't need to use this, more for testing                                                          // 145
  // turn off all filters                                                                                  // 146
  Router.prototype.resetFilters = function() {                                                             // 147
    this._activeFilters = [];                                                                              // 148
  }                                                                                                        // 149
                                                                                                           // 150
  // run all filters over page                                                                             // 151
  Router.prototype._applyFilters = function(page) {                                                        // 152
    var self = this;                                                                                       // 153
    return _.reduce(self._activeFilters, function(page, filter) {                                          // 154
      return self._applyFilter(page, filter)                                                               // 155
    }, page);                                                                                              // 156
  }                                                                                                        // 157
                                                                                                           // 158
  // run a single filter (first check only and except apply)                                               // 159
  Router.prototype._applyFilter = function(page, filter) {                                                 // 160
    var apply = true;                                                                                      // 161
    if (filter.only) {                                                                                     // 162
      apply = _.include(filter.only, page);                                                                // 163
    } else if (filter.except) {                                                                            // 164
      apply = ! _.include(filter.except, page);                                                            // 165
    }                                                                                                      // 166
                                                                                                           // 167
    if (apply) {                                                                                           // 168
      return this._filters[filter.name](page);                                                             // 169
    } else {                                                                                               // 170
      return page;                                                                                         // 171
    }                                                                                                      // 172
  }                                                                                                        // 173
                                                                                                           // 174
  // set this to have a function run before each and every route.                                          // 175
  // - the callback should take a context argument                                                         // 176
  Router.prototype.beforeRouting = function() {};                                                          // 177
                                                                                                           // 178
  Meteor.Router = new Router();                                                                            // 179
  Meteor.startup(function() { page(); });                                                                  // 180
}());                                                                                                      // 181
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/router/lib/router_helpers.js                                                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
if (typeof Handlebars !== 'undefined') {                                                                   // 1
  Handlebars.registerHelper('renderPage', function(name, options) {                                        // 2
    if (! _.isString(name))                                                                                // 3
      name = Meteor.Router.page();                                                                         // 4
                                                                                                           // 5
    if (Template[name])                                                                                    // 6
      return new Handlebars.SafeString(Template[name](this));                                              // 7
  });                                                                                                      // 8
                                                                                                           // 9
  Handlebars.registerHelper('currentPage', function() {                                                    // 10
    return Meteor.Router.page();                                                                           // 11
  });                                                                                                      // 12
}                                                                                                          // 13
                                                                                                           // 14
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

//# sourceMappingURL=fa973c1aa0f406a9ff2a8ef2745961b9500ea0f5.map
