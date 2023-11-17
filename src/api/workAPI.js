import axios from "../api/http";
import qs from 'qs'
import da from "element-ui/src/locale/lang/da";
import instance from "../api/http";

const address = 'http://10.249.176.82:8888/work'
// const address = 'http://localhost:8888/work'
// const test_address = 'http://10.250.111.166:8888/work'

export function saveOneWork(work){
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  work.workDescription = JSON.stringify(work.workDescription)
  return axios.post(address + '/saveOneWork',work);
}


export function getUserDesign(data){
  console.log("getUserDesign",data)
  return axios.get(address + '/getUserDesign', {params: data})
}

export function getWorkDetail(data){
  return axios.get(address + "/getWorkDetail", {params: data})
}

export function getAllShareWork(){
  return axios.get(address+ "/getAllShareWork")
}

export function shareWorkCriteria(data){
  console.log("shareWorkAPI",data)
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  return axios.post(address + '/shareWork', data)
}

export function cancelWorkShare(data){
  return axios.delete(address + "/cancelOneWorkShare/"+data)
}

export function saveOneLike(data){
  console.log("saveOneLike API",data)
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  return axios.post(address+"/saveOneLike",data)
}

export function deleteOneLike(data){
  return axios.delete(address+"/deleteOneLike/"+data)
}

export function deleteOneWork(data){
  return axios.delete(address+"/deleteOneWork/"+data)
}

