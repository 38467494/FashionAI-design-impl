import axios from "./http";
import instance from "./http";

// const address = 'http://10.249.176.82:8888/share'
const address = 'http://localhost:8888/share'
export function getUserShare(id){
  return axios.get(address + '/getUserShare', {params: {id: id}})
}

export function saveOneShare(data){
  console.log("saveOneShare",data)
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  return axios.post(address+'/saveOneShare', data)
}

export function deleteShare(data){
  return axios.delete(address + "/deleteOneShare/"+data)
}
