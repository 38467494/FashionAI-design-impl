import axios from "../api/http";

const community_address = 'http://47.116.122.59:8080'

export function getUploadToken(data){
  return axios.get(community_address + '/qiniuyun/uploadToken', {params: data})
}

export function addOneContent(data){
  return axios.post(community_address + '/content/upload', data)
}

export function getAllItems(data){
  return axios.get(community_address + '/content/getAll', {params: data})
}

export function getOneItem(data){
  return axios.post(community_address + '/content/getDetail', data)
}

export function likeIt(data){
  return axios.get(community_address + '/content/liked', {params: data})
}

export function dislikeIt(data){
  return axios.get(community_address + '/content/disLiked', {params: data})
}

export function collectIt(data){
  return axios.get(community_address + '/content/collected', {params: data})
}

export function discollectIt(data){
  return axios.get(community_address + '/content/disCollected', {params: data})
}

export function getImageUrl(data){
  return axios.get(community_address + '/image/getOne', {params: data})
}

export function getSonImages(data){
  return axios.get(community_address + '/image/getSon', {params: data})
}

export function publishOneComment(data){
  return axios.post(community_address+'/comment/publish', data)
}

export function getComments(data){
  return axios.get(community_address+'/comment/getByContent', {params: data})
}
