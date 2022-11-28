import axios from "../api/http";

const address = 'http://8.129.186.75:8083/cosine-core-web-api'

export function login(data) {
  return axios.post(address + '/v1/public/coreuser/login', data)
}

export function getUserInfo(token) {
  return axios.get(address + '/v1/authorization/coreuser/userinfo/personage', {
    headers: {
      "Accept": "application/json;charset=UTF-8",
      "accessToken": token
    }
  })
}

export function doLogout(token) {
  return axios.get(address + '/v1/public/coreuser/logout/' + token)
}
