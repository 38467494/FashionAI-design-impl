// import {fabric} from "../static/js/fabric.js";
import {fabric} from "fabric";
import * as qiniu from 'qiniu-js'
import {getUploadToken} from "../../api/design";
import ca from "element-ui/src/locale/lang/ca";
import store from "../../store";
export async function getCoverImg(category,data){
  var CanvasDoc = document.createElement("CANVAS");

  CanvasDoc.setAttribute("id","canvas")
  CanvasDoc.setAttribute("height",350)
  CanvasDoc.setAttribute("width",550)
  var canvas = new fabric.Canvas("canvas");
  canvas.setBackgroundColor("white")

  console.log(canvas,data)

  var res;

  if(category == "MMC"){
    canvas.setWidth(800)
    canvas.setHeight(500)
    res = await getMMCImg(canvas, data)
  }
  else if(category == "render"){
    canvas.setWidth(350)
    canvas.setHeight(550)
    res = await getRenderImg(canvas, data)
  }
  else if(category == "outfit"){
    canvas.setWidth(600)
    canvas.setHeight(500)
    res = await getOutfitImg(canvas,data)
  }
  else if(category == "collaborate"){
    canvas.setWidth(650)
    canvas.setHeight(450)
    res = await getCollaborateImg(canvas,data)
  }
  else if(category == "vton"){
    canvas.setWidth(950)
    canvas.setHeight(400)
    res = await getVtonImg(canvas,data)
  }
  else if(category == 'aicolor'){
    canvas.setWidth(350)
    canvas.setHeight(550)
    res = await getAIColorImg(canvas,data)
  }
  else if(category == 'inspire'){
    canvas.setWidth(950)
    canvas.setHeight(500)
    res = await getInspireImg(canvas,data)
  }

  var url = await uploadImg(category, res)


  return url
}



async function upload(file,key){
  var token;
  await getUploadToken({
    forever: true
  }).then(res=>{
    console.log("getUploadToken:",res.data);
    token = res.data;
  }).catch(err =>{
    console.log(err);
  })

  console.log("upload token",token)

  // console.log(img)

  const observable = qiniu.upload(file,key, token)
  var url = ""
  let _this = this

  console.log("domain",store.state.domain)

  await new Promise((resolve, reject) => {
    const subscription = observable.subscribe({
      next: res => {
        console.log("next", res)
      },
      error: res=> {
        console.log("error",res)
        this.$message({
          type: "error",
          message: "封面上传失败"
        })
        reject()
      },
      complete: res=> {
        console.log("complete",res, store.state.domain)
        url = store.state.domain  + res.key
        console.log("complete",url)
        resolve()

      }
    })
  })

  console.log("upload url",url)

  return url;
}
//上传data形式的图片
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

export async function uploadImg(category, img){
  var file = dataURLtoFile(img, "1.png")
  let timestamp = Date.parse(new Date());
  var key = "cover_" + category + "_" + timestamp + "_" + Math.random() + ".png"
  console.log("timestamp",timestamp)

  return await upload(file,key)
}

//上传url形式的图片
async function getImageFileFromUrl(url, imageName) {
  var imgFile
  await new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/jpeg');
    xhr.responseType = "blob";
    xhr.onload = () => {
      blob = xhr.response;
      imgFile = new File([blob], imageName, { type: 'image/jpeg' });
      resolve(imgFile);
    };
    xhr.onerror = (e) => {
      reject(e)
    };
    xhr.send();
  });
  return imgFile
}

export async function uploadURL(category, url){
  var file = await getImageFileFromUrl(url)
  console.log(file)
  let timestamp = Date.parse(new Date());
  var key = "reupload_" + category + "_" + timestamp + "_" + Math.random() + ".png"
  console.log("timestamp",timestamp)

  return await upload(file,key)
}

export async function getMMCImg(canvas,data){
  var matchType = data.matchType.label
  var labels = data.labels
  var labelsStr = objToString(labels)

  addText(canvas, "搭配生成结果",10,10,'bold')

  addText(canvas,"服装样式",375,100,'bold')

  addText(canvas,"生成的服装",375,450,'bold')

  addText(canvas,"生成的服装类别: "+ matchType,400,450,'normal')

  addText(canvas,"生成的服装标签：" + labelsStr, 425,450,'normal')
  var arrow = '/static/cover/arrow.png'

  var imgList = [
    {
      img: data.image,
      top: 35,
      left: 10,
      width: 300,
      height: 300
    },
    {
      img: data.result,
      top: 35,
      left: 400,
      width: 300,
      height: 300
    },
    {
      img: arrow,
      top: 175,
      left: 330,
      width: 80,
      height: 80
    },
  ]

  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll()

  return getImg(canvas)
}

export async function getRenderImg(canvas, data){
  console.log("getRender",canvas)
  // canvas = addText(canvas, "渲染生成结果",10,10,'bold')

  addText(canvas, "服装样式",350,10,'bold')
  // console.log("addText1",getImg(canvas))

  addText(canvas,"颜色样式",350,200,'bold')

  addText(canvas, "渲染生成结果",10,10,'bold')
  // console.log("addText2",getImg(canvas))

  var imgList = [
    {
      img: data.result,
      top: 35,
      left: 10,
      width: 300,
      height: 300
    },
    {
      img: data.sketch,
      top: 375,
      left: 10,
      width: 120,
      height: 120
    },
    {
      img: data.color,
      top:375,
      left: 200,
      width: 120,
      height: 120
    }
  ]

  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll();

  return getImg(canvas)
}

export async function getOutfitImg(canvas,data){
  addText(canvas,"推荐生成结果",245,10,'bold')
  addText(canvas, "服装样式",35,10,'bold')
  addText(canvas,"掩码图片",35,220,'bold')

  var imgList = [
    {
      img: data.clothImage,
      top: 60,
      left: 10,
      width: 100,
      height: 100
    },
    // {
    //   img: data.maskList[0],
    //   top: 60,
    //   left: 220,
    //   width: 100,
    //   height: 100
    // },
    {
      img: '/static/cover/plus.png',
      top: 90,
      left: 140,
      width: 50,
      height: 50
    },
    {
      img: '/static/cover/arrowdown.png',
      top: 200,
      left: 300,
      width: 150,
      height: 50
    },
    // {
    //   img:data.resultList[0],
    //   top: 270,
    //   left: 10,
    //   width: 120,
    //   height: 120
    // }
  ]

  for(var i=0;i<data.maskList.length;i++){
    var left = 220 + i*120
    var img = data.maskList[i]
    if(img == null)
      img = '/static/cover/mask-unchose.png'
    imgList.push({
      img: img,
      top: 60,
      left: left,
      width: 100,
      height: 100
    })


  }

  for(var i=0;i<data.resultList.length;i++){
    var left = 10 + i*190
    imgList.push({
      img: data.resultList[i],
      top:270,
      left: left,
      width: 170,
      height: 170
    })
  }

  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll();

  return getImg(canvas)
}

export async function getCollaborateImg(canvas,data){
  addText(canvas, "协同设计结果",10,10,'bold')
  addText(canvas, "正面",35,10,'bold')
  addText(canvas,"背面",35,350,'bold')

  var imgList = [
    {
      img: data.frontImg,
      top: 60,
      left: 10,
      width: 300,
      height: 300
    },
    {
      img: data.backImg,
      top: 60,
      left: 350,
      width: 300,
      height: 300
    },
  ]

  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll();

  return getImg(canvas)
}

export async function getVtonImg(canvas,data){
  addText(canvas, "模特",10,10,'bold')
  addText(canvas, "服装",10,350,'bold')
  addText(canvas,"效果图",10,700,'bold')

  var imgList = [
    {
      img: data.model,
      top: 35,
      left: 10,
      width: 300,
      height: 300
    },
    {
      img: '/static/cover/plus.png',
      top: 160,
      left: 275,
      width: 50,
      height: 50
    },
    {
      img: data.cloth,
      top: 35,
      left: 350,
      width: 300,
      height: 300
    },
    {
      img: data.result,
      top: 35,
      left: 700,
      width: 300,
      height: 300
    },
    {
      img: '/static/cover/arrow.png',
      top: 160,
      left: 625,
      width: 50,
      height: 50
    },
  ]

  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll();

  return getImg(canvas)
}

export async function getAIColorImg(canvas, data){
  console.log("getAIColor",canvas)
  // canvas = addText(canvas, "渲染生成结果",10,10,'bold')

  addText(canvas, "服装样式",350,10,'bold')
  // console.log("addText1",getImg(canvas))

  addText(canvas,"颜色样式",350,200,'bold')

  addText(canvas, "AI着色结果",10,10,'bold')
  // console.log("addText2",getImg(canvas))

  var imgList = [
    {
      img: data.result,
      top: 35,
      left: 10,
      width: 300,
      height: 300
    },
    {
      img: data.sketch,
      top: 375,
      left: 10,
      width: 120,
      height: 120
    },
    {
      img: data.color,
      top:375,
      left: 200,
      width: 120,
      height: 120
    }
  ]

  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll();

  return getImg(canvas)
}

export async function getInspireImg(canvas, data){
  console.log("getInspire",canvas);


  addText(canvas,"灵感迁移结果",35,650,'bold')
  addText(canvas, "服装样式",35,200,'bold')
  addText(canvas,"素材图片",35,10,'bold')

  var imgList = [
    {
      img: data.color,
      top: 100,
      left: 10,
      width: 120,
      height: 120
    },
    {
      img: data.texture,
      top: 230,
      left: 10,
      width: 120,
      height: 120
    },
    {
      img: data.shape,
      top: 360,
      left: 10,
      width: 120,
      height: 120
    },
    {
      img: '/static/cover/plus.png',
      top: 250,
      left: 140,
      width: 50,
      height: 50
    },
    {
      img: data.sketch,
      top: 100,
      left: 200,
      width: 300,
      height: 300
    },
    {
      img: '/static/cover/arrow.png',
      top: 250,
      left: 500,
      width: 150,
      height: 50
    },
    {
      img: data.result,
      top: 100,
      left: 650,
      width: 300,
      height: 300
    },
  ]


  for(var i=0;i<imgList.length;i++){
    await addImg(canvas,imgList[i].img,imgList[i].top,imgList[i].left,imgList[i].width,imgList[i].height)
  }

  canvas.renderAll();

  return getImg(canvas)
}

async function addImg(canvas,img,top,left,width,height){

  await new Promise((resolve, reject) => {
    fabric.Image.fromURL(img,async function (oImg){
      var s1 = width / oImg.width;
      var s2 = height / oImg.height;
      var s = s1 < s2?s1:s2;
      oImg.scale(s)

      oImg.top = top
      oImg.left = left

      console.log(oImg.getCrossOrigin())
      canvas.add(oImg)
      canvas.renderAll()

      // getImg(canvas)

      console.log("addImage callback")
      resolve()

    },{crossOrigin: "anonymous"})
  })

  console.log("addImage")

}
function addText(canvas,text,top,left,weight){
  var textBox = new fabric.Textbox(text,{
    left: left,
    top: top,
    width: 300,
    fontSize: 18,
    fontWeight: weight
    // textAlign: "center"
    // hasControls: false
  });
  canvas.add(textBox)
  canvas.renderAll()
  return canvas
}
function objToString(labels){
  var str = ""
  for(var i=0;i<labels.length;i++){
    if(i!=0)
      str +="、 "
    str+=labels[i];
  }
  return str;
}
export function getImg (canvas){
  var img = canvas.toDataURL("png")
  // console.log("getImg",img)
  return img
}
