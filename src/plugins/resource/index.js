// The point of this plugin is to decouple data source
// You don't need to call api directly in Vue file

import _ from 'lodash'
import cache from './cache'

export default {
  install(app, {endpoint = '', resources = ''}) {
    app.config.globalProperties.$getResource = function(method, options) {
      let name = this.$options.resource
      if(!name || !resources[name] || !resources[name][method]) return

      // get fetch path and response resolver/mapper
      let { path, resolve } = resources[name][method](options)
      let uri = endpoint + path

      // methods return promise to allow chaining
      const mappers = {
        // only return promise without modifying instance $data
        pipe: dataSet => Promise.resolve(dataSet),

        // deep merge object with instance $data
        merge: dataSet => {
          _.merge(this.$data, dataSet)
          return Promise.resolve(dataSet)
        },

        // set individual props on instance $data
        set: dataSet => {
          Object.keys(dataSet).forEach(prop => {
            this.$set(this.$data, prop, dataSet[prop])
          })

          return Promise.resolve(dataSet)
        }
      }
      // check to see if the resource has been cached already
      if(cache().has(uri)) return resolve(cache().get(uri), mappers)

      // fetch, parse and cache resource then pass to resolver
      return fetch(uri)
      .then(response => response.json())
      .then(response => cache().set(uri, response))
      .then(response => resolve(response, mappers))
    }
  }
}