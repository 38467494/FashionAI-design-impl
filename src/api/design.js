import axios from "../api/http";
import qs from 'qs'
import da from "element-ui/src/locale/lang/da";
import instance from "../api/http";

const address = 'http://10.249.176.82:8888'
// const address = 'http://localhost:8080'

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

export function Render(val){
  console.log("render API",val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // var data = qs.stringify(val);
  return axios.post(address + '/render/doRender',val);
}

export function initRender(){
  return axios.get(address + '/render/init');
}

// todo
export function Inspire(val){

}
export function initInspire(){

}

export function AIColor(val){
  console.log("aicolor API",val);
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  // var data = qs.stringify(val);
  return axios.post('http://10.250.111.166:8888/AICOLOR/doColor',val);
}

export function initAIColor(){
  return axios.get(address + '/aicolor/init');
}

export function getUploadToken(data){
  return axios.get(address+'/qiniuyun/uploadToken',{params:data});
}

export function initOutfitGAN(){
  return axios.get(address+"/outfit/init");
}

export function ripupload(params, token){
  return axios.post(
    "http://upload-z2.qiniup.com",
    params,
    {
      headers:{
        'Content-Type':'multipart/form-data',
        token
      }
    }
    )
}
