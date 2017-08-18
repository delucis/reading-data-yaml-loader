/**
 * @module reading-data-yaml-loader
 */

const GET = require('got')
const LOAD = require('load-yaml-file')
const PARSE = require('js-yaml').safeLoad

const ReadingDataYAMLLoader = (function () {
  /**
   * Test whether a string begins with `http://` or `https://`.
   *
   * @memberof module:reading-data-yaml-loader
   * @private
   *
   * @param  {String} path The string to test.
   * @return {Boolean}     `true` if `path` starts with `http://` or `https://`, otherwise `false`.
   *
   * @since 0.0.1
   */
  const isHTTP = function (path) {
    let httpRegEx = new RegExp(/^http(s)?:\/\/\S+/, 'i')
    return httpRegEx.test(path)
  }

  return {
    /**
     * Plugin configuration object.
     * @type {Object}
     * @property {String|Array} scope='yaml-loader' The scope(s) for which this plugin will return data.
     * @property {String|Object} path               The path(s) of YAML files to load.
     *
     * @since 0.0.1
     */
    config: {
      scope: 'yaml-loader'
    },

    /**
     * Load a YAML file either from the file system or via an HTTP(S) request
     * and return its contents as an object.
     *
     * @param  {Object} pluginContext
     * @param  {Object} pluginContext.config The configuration object for this plugin.
     * @param  {String} pluginContext.scope  The specific scope for which this fetch method is being called.
     * @return {Object} Data retrieved from the YAML file.
     *
     * @since 0.0.1
     */
    data: async function ({config, scope}) {
      if (!config.hasOwnProperty('path')) {
        throw new Error('ReadingDataYAMLLoader#fetch(): expected config to have property path.')
      }
      let path
      if (typeof config.path === 'string') {
        path = config.path
      } else if (typeof config.path === 'object' && config.path.hasOwnProperty(scope)) {
        path = config.path[scope]
      } else {
        throw new Error('ReadingDataYAMLLoader#fetch(): expected config.path to be a string or an object with scope "' + scope + '".')
      }
      if (isHTTP(path)) {
        try {
          let res = await GET(path)
          let yaml = PARSE(res.body)
          return yaml
        } catch (e) {
          throw new Error('ReadingDataYAMLLoader#fetch(): ' + e)
        }
      } else {
        let yaml = await LOAD(path)
        return yaml
      }
    }
  }
}())

module.exports = ReadingDataYAMLLoader
