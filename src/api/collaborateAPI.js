import axios from "../api/http";
import qs from 'qs'
import da from "element-ui/src/locale/lang/da";
import instance from "../api/http";

const address = 'http://10.249.176.82:8888/collaborate'
// const address = 'http://localhost:8888/collaborate'


export function getProjects(id){
    console.log("axios",id);
    return axios.get(address+"/getProjectsbyId",{params:id});
}

export function getVersion(pid){
    return axios.get(address+"/getVersion",{params:pid});
}

export function getCommentbyVersion(vid){
    return axios.get(address+'/getCommentbyVersion',{params: vid})
}

export function insertVersion(version){
  console.log("insertVersion",version);
  var data = qs.stringify(version)
  return axios.post(address + '/insertVersion',data)
}

//获得正反面的version
export function getVersionDouble(pid){
  return axios.get(address+"/getVersionDouble",{params:pid});
}

//插入正反面的version
export function insertVersionDouble(version){
  console.log("insertVersion",version);
  var data = qs.stringify(version)
  return axios.post(address + '/insertVersionDouble',data)
}

export function insertProject(project){
  var data = qs.stringify(project)
  console.log("insert project",data);
  return axios.post(address+'/insertProject', data);
}

export function getProjectbyId(id){
  return axios.get(address + "/getProjectbyId",{params: id});
}

export function editProject(project){
  var data = qs.stringify(project)
  return axios.post(address+'/editProject', data);
}

export function deleteProject(id){
  var data = qs.stringify(id);
  return axios.post(address + "/deleteProject",data);
}

export function finishProject(id){
  var data = qs.stringify(id);
  // console.log("finish",data)
  return axios.post(address + "/finishProject",data);
}

export function ColLogin(user){
  var data = qs.stringify(user);
  console.log("collogin api",data);
  instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  return axios.post(address+"/login",data);
}

export function getMaterial(data){
  return axios.get(address + "/getMaterialByCategory",{params: data})
}
