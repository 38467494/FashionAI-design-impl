import {getUploadToken} from "../../api/design";
import * as qiniu from "qiniu-js";
import store from "../../store";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export async function uploadImg(vid,front, img){
  var file = dataURLtoFile(img, "1.png")
  let timestamp = Date.parse(new Date());
  var key = "collaborate_" + vid + "_" + front + "_" + timestamp + ".png"
  var token

  await getUploadToken({
    forever: true
  }).then(res=>{
    console.log("getUploadToken:",res.data);
    token = res.data;
  }).catch(err =>{
    console.log(err);
  })

  console.log("upload token",token)

  console.log(img)

  const observable = qiniu.upload(file,key, token)
  var url = ""

  await new Promise((resolve, reject) => {
    const subscription = observable.subscribe({
      next: res => {
        // console.log("next", res)
      },
      error: res=> {
        console.log("error",res)
        this.$message({
          type: "error",
          message: "服装图片上传失败"
        })
        reject()
      },
      complete: res=> {
        // console.log("complete",res)
        url = store.state.domain + res.key
        resolve()
      }
    })
  })

  console.log("upload url",url)

  return url;

}
