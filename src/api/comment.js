// const address = 'http://10.249.176.82:8888'
import instance from "./http";
import axios from "./http";

const address = 'http://10.249.176.82:8888/comment'
// const address = 'http://localhost:8888/comment'

export function saveOneComment(data){
  console.log("saveComment",data)
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  return axios.post(address + '/saveOneComment',data);
}
