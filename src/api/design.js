import axios from "../api/http";
import qs from 'qs'
import da from "element-ui/src/locale/lang/da";
import instance from "../api/http";

const address = 'http://10.249.176.82:8888'
//const address = 'http://10.250.111.166:8888'

export function MMCGAN(val){
  console.log("MMCGAN API",val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // var data = qs.stringify(val);
  return axios.post(address + '/mmc/doMMCGAN',val);
}

export function initMMCGAN(){
  return axios.get(address + '/mmc/init');
}

export function OutfitGAN(val){
  console.log("outfit API",val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // var data = qs.stringify(val);
  return axios.post(address + '/outfit/doOutfitGAN',val);
}

export function initOutfitGAN(){
  return axios.get(address+"/outfit/init");
}

export function Render(val){
  console.log("render API",val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // var data = qs.stringify(val);
  return axios.post(address + '/render/doRender',val);
}

export function initRender(){
  return axios.get(address + '/render/init');
}

export function Inspire(val){
  console.log('inspire API', val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  return axios.post(address + '/AIRender/DoAIRender', val);
}
export function initInspire(){
  return axios.get(address + '/AIRender/init');
}

export function AIColor(val){
  console.log("aicolor API",val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // var data = qs.stringify(val);
  return axios.post(address + '/AICOLOR/doColor', val);
}

export function initLandscape(){
  return axios.get(address + '/AIRender/initview');
}

export function judgeRobot(val){
  return axios.post('http://10.249.178.62:5010/api/judge',val);
}

export function recommendRobot(val){
  return axios.post(address + '/OutfitRecommend/styleList', val);
}

export function detailRobot(val){
  return axios.post(address + '/OutfitRecommend/getImage',val);
}


export function chatGPTAPI(val){
  return axios.post('http://10.250.111.166:8888/chat/chatgpt', val);
}

export function getUploadToken(data){
  return axios.get(address+'/qiniuyun/uploadToken',{params:data});
}



