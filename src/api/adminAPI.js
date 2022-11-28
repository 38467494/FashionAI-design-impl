import axios from "../api/http";
// const address = 'http://localhost:8888/admin'
const address = 'http://10.249.176.82:8888/admin'


export const getAdminInfo = params => {
    return axios.get(address + '/get-admin-user-info', params);
  }