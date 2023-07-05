/* eslint-disable space-before-function-paren */
import axios from "@/.nuxt/axios";

export default class ApiService {
  setHeaders(removeContentType = false) {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    }

    if (process.client) {
      const token = localStorage.getItem('token')
      if (token) {
        headersConfig.Authorization = 'Bearer '.concat(token)
      }
    }

    if (removeContentType) {
      delete headersConfig['Content-Type']
    }

    return headersConfig
  }

  setFileToBody(body, files = []) {
    let bodyToSend = body

    if (files && files.length > 0) {
      const formData = new FormData()
      formData.append('json', JSON.stringify(body))
      bodyToSend = formData
    }

    return bodyToSend
  }

  callWS(
    method,
    url,
    data
  ) {
    return new Promise((resolve, reject) => {
      const bodyToSend = data

      const headers = this.setHeaders()

      axios({
        method,
        url,
        body: bodyToSend,
        headers
      })
        .then((resp) => {
          resolve(resp.body || resp)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  }

  get(url, query = null) {
    if (query) {
      url = url + '?' + this.serialize(query)
    }
    return this.callWS('get', url, null)
  }

  post(url, data) {
    return this.callWS('post', url, data)
  }

  put(url, data) {
    return this.callWS('put', url, data)
  }

  delete(url, data) {
    return this.callWS('delete', url, data)
  }

  serialize(obj) {
    const str = []
    for (const p in obj) {
      if (obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    }
    return str.join('&')
  }
}
