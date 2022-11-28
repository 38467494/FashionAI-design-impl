<template>
  <div id="virtualTryon" class="flex">

    <section class="basis-3/4 px-10 py-3 border-r">
      <el-tabs v-model="activeName" style="width: 100%" @tab-click="handleTabClick">
        <template v-for="(item,index) in tabList">
          <el-tab-pane :key="index" :label="item.label" :name="item.name">
            <image-show v-bind:name="item.name" v-bind:module="moduleType" v-bind:urls="urls[index]"
                        v-bind:index="index"
                        v-bind:is-description-visible="isDescriptionVisible"
                        v-bind:is-price-visible="isPriceVisible"
                        v-if="renderReady" @selectCloth="selectCloth(arguments)">
            </image-show>
          </el-tab-pane>
        </template>
      </el-tabs>
    </section>

    <!-- 右侧1/4栏 -->
    <section class="basis-1/4 py-6 px-12">
      <div>
        <div class="mb-4 font-bold text-xl">虚拟换装结果</div>
        <div class="border-2 rounded-lg p-3 mb-6">
          <div class="mb-2" style="height: 50vh;" >
            <el-image
              v-loading="loading"
              class="rounded h-full w-auto"
              :fit="fit"
              :src="tryOnUrl"
            >
              <!-- 图片加载完成前的占位符 -->
              <div slot="placeholder">
              </div>
            </el-image>
          </div>
          <div class="flex submodel-container">
            <div class="basis-1/3"
                 v-for="model in modelsUrl"
                 :key="model.url"
            >
              <el-image
                :id="model.url"
                class=" rounded"
                :fit="fit"
                :src="model.url"
                @click="chooseModel($event)"
              ></el-image>
            </div>
          </div>
        </div>



        <div class="flex flex-col items-stretch justify-center">
          <div class="my-1">
            <el-upload
              class="upload-container w-full"
              action="http://upload-z2.qiniup.com"
              :show-file-list="false"
              :on-success="handleSuccess"
              :data="uploadData"
              :before-upload="beforeUpload">
                <AtsButton expand type="primary" plain>上传本地模特图片</AtsButton>
            </el-upload>
          </div>

          <div class="my-2 flex">
              <template v-if="isAbleCollect">
                <AtsButton type="pink" expand plain @click="collectItem" v-if="!collectFlag">收藏</AtsButton>
                <AtsButton type="pink" expand v-else>已收藏</AtsButton>
              </template>
              <AtsButton
                expand
                type="primary"
                :loading="loading"
                @click="doVirtualTryOn"
              >
                进行换装
              </AtsButton>
          </div>
        </div>
      </div>

    </section>


  </div>
</template>

<style>
/* to make the upload button auto-expand */
.el-upload {
  display: block !important;
}
</style>

<style scoped>
.submodel-container > div {
  margin-left: 0.4rem; /* 4px */;
  margin-right: 0.4rem; /* 4px */;
}
.submodel-container > :first-child {
  margin-left: 0;
}
.submodel-container > :last-child {
  margin-right: 0;
}
</style>

<script>
import {doVirtualTryOn, doVtonInit} from "../api/vton";
import ImageShow from "./design/ImageShow";
import {getUploadToken, Render} from "../api/design";
import {showError} from "./design/alert";
import {saveOneWork} from "../api/workAPI";
import {getCoverImg} from "./personal/coverFunction";
import {uploadURL} from "./personal/coverFunction";
import AtsButton from "./common/AtsButton";

export default {
  name: "virtualTryon",
  components: {AtsButton, ImageShow},
  data() {
    return {
      activeName: 'maleUpperShort',
      moduleType: 'vton',
      renderReady: false,
      loading: false,
      isModelChoose: false,
      // isVtonVisual: false,
      fit: 'fill',
      tryOnUrl: '',
      modelsUrl: '',
      clothUrl: '',
      modelChosenUrl: '',
      clothChosenUrl: '',
      category: '',
      clothMaleUpperLongList: '',
      clothMaleUpperShortList: '',
      imageMaleUpperLongList: '',
      imageMaleUpperShortList: '',
      clothFemaleUpperNoList: '',
      clothFemaleUpperShortList: '',
      imageFemaleUpperNoList: '',
      imageFemaleUpperShortList: '',
      isPriceVisible: true,
      isDescriptionVisible: true,
      isChooseGivenModel: true,

      //用于用户上传图片
      imageUrl: null, //图片在七牛云上的url，通过这个url可以直接访问到图片
      imageKey: null,  //图片上传到七牛云上，返回的key


      tabList: [{
        name: 'maleUpperShort',
        label: '男短袖上衣',
      }, {
        name: 'maleUpperLong',
        label: '男长袖上衣',
      }, {
        name: 'femaleUpperNo',
        label: '女无袖上衣',
      }, {
        name: 'femaleUpperShort',
        label: '女短袖上衣',
      }],
      urls: [],
      uploadData: {
        token: "",
        key: ""
      },


      //收藏
      resultModel: null,
      resultCloth: null,
      resultImg: null,
      collectFlag: false,
      isAbleCollect: false, //记录是否能收藏

    }
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(this.isPriceVisible)
      this.selectClothId = null
      if (tab.index === '0') {
        this.modelsUrl = this.imageMaleUpperShortList
      } else if (tab.index === '1') {
        this.modelsUrl = this.imageMaleUpperLongList
      } else if (tab.index === '2') {
        this.modelsUrl = this.imageFemaleUpperNoList
      } else if (tab.index === '3') {
        this.modelsUrl = this.imageFemaleUpperShortList
      } else {
      }
      this.modelChosenUrl = this.modelsUrl[0].url;
      this.tryOnUrl = this.modelChosenUrl
      this.isModelChoose = false
      this.isChooseGivenModel = true
    },
    doVirtualTryOn() {
      this.collectFlag = false
      if (this.selectClothId == null || !this.isModelChoose) {
        this.$message({
          message: '您还未选择衣服和模特图片',
          type: 'warning'
        });
        return
      }
      this.loading = true
      // this.isVtonVisual = true
      // console.log(this.selectClothId);
      // console.log(this.modelChosenUrl);
      let model = null
      if (this.isChooseGivenModel) {
        model = this.modelChosenUrl.substr(33)
      } else {
        model = this.imageUrl.substr(33)
      }

      //记录换装的信息用于收藏
      this.resultModel = this.$store.state.domain + model
      this.resultCloth = this.selectClothId.url


      doVirtualTryOn(this.selectClothId.url.substr(33), model).then(res => {
        // console.log(res.data)
        if (res.data.code !== 200) {
          console.log(res.data.message)
        } else {
          this.tryOnUrl = res.data.data.fileUrl;

          this.resultImg = this.tryOnUrl
        }
        this.loading = false

        this.isAbleCollect = true
      })
    },
    chooseModel(e) {
      this.isAbleCollect = false
      let element = document.getElementById(this.modelChosenUrl)
      element.style.border = ''
      element.style.boxSizing = ''
      element = document.getElementById(e.target.id)
      element.style.border = '2px solid var(--base-primary)';
      element.style.overflow = 'hidden';
      element.style.boxSizing = 'border-box';
      console.log(e.target.id)
      this.modelChosenUrl = e.target.id
      this.tryOnUrl = this.modelChosenUrl
      this.isModelChoose = true
      this.isChooseGivenModel = true
    },
    doConcat(arr) {
      let res = [];
      for (let j = 0, len = arr.length; j < len; j++) {
        let url = this.$store.state.domain + arr[j].fileName
        let description = null, price = null;
        if (arr[j].description != null) {
          description = arr[j].description;
        }
        if (arr[j].price != null) {
          price = arr[j].price;
        }
        res.push({
          url: url,
          price: price,
          description: description,
        })
      }
      return res;
    },
    //某个tab中某张图片被选中，出发该函数，需要修改元素的className和保存id
    selectCloth(msg) {
      let dom = msg[0];
      let index = msg[1];
      let type = msg[2];
      console.log("select vton", msg);

      this.isAbleCollect = false

      let typeIndex = this.getType(type);
      this.selectClothId = this.urls[typeIndex][index];
      this.selectClothType = type;

    },
    getType(name) {
      let list = this.tabList;
      for (let i = 0; i < list.length; i++) {
        if (name == list[i].name)
          return i;
      }
      return -1;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error('上传图片只能为JPG或PNG格式');
        return false;
      }

      this.uploadData.key = this.getName(file.name);
      return true;
    },
    handleSuccess(res, file) {
      console.log("success:", res, file)
      this.imageUrl = this.$store.state.domain + res.key;
      this.imageKey = res.key;


      this.tryOnUrl = this.imageUrl
      this.isModelChoose = true
      this.isChooseGivenModel = false

      this.isAbleCollect = false

      console.log(this.imageUrl, this.tryOnUrl)

      // this.colorImage = this.imageUrl
      // this.resultImageLoading = true;
      //2. 将信息传提给后端

    },
    //设置上传文件的文件名
    getName(name) {
      let timestamp = Date.parse(new Date());
      let newName = "vton_" + timestamp + name;
      // console.log("newName",newName);
      return newName;
    },

    collectItem: async function () {
      let _this = this
      var res = await this.collectInfo()
      res["userName"] = this.$store.state.userName
      res["phone"] = this.$store.state.phone
      console.log("collectItem", res)
      saveOneWork(res).then(res => {
        console.log("save one work", res)
        _this.$message({
          message: "收藏成功",
          type: "success"
        });
        _this.collectFlag = true;
      })
    },

    collectInfo: async function () {
      var workDescription = {
        model: this.resultModel,
        cloth: this.resultCloth,
        result: this.resultImg
      }
      console.log("vto", workDescription);
      var coverUrl = await getCoverImg("vton", workDescription);
      workDescription.result = await uploadURL("vton", workDescription.result)
      console.log(coverUrl)
      var info = {
        category: "vton",
        workDescription: workDescription,
        coverUrl: coverUrl
      }
      return info;
    }
  },

  mounted() {
    let _this = this;
    doVtonInit().then(res => {
      // console.log(res.data.data)
      if (res.data.code !== 200) {
        console.log(res.data.message)
      } else {
        _this.clothMaleUpperLongList = this.doConcat(res.data.data.clothMaleUpperLongList);
        _this.clothMaleUpperShortList = this.doConcat(res.data.data.clothMaleUpperShortList);
        _this.imageMaleUpperLongList = this.doConcat(res.data.data.imageMaleUpperLongList);
        _this.imageMaleUpperShortList = this.doConcat(res.data.data.imageMaleUpperShortList);
        _this.clothFemaleUpperNoList = this.doConcat(res.data.data.clothFemaleUpperNoList);
        _this.clothFemaleUpperShortList = this.doConcat(res.data.data.clothFemaleUpperShortList);
        _this.imageFemaleUpperNoList = this.doConcat(res.data.data.imageFemaleUpperNoList);
        _this.imageFemaleUpperShortList = this.doConcat(res.data.data.imageFemaleUpperShortList);
        _this.urls.push(_this.clothMaleUpperShortList)
        _this.urls.push(_this.clothMaleUpperLongList)
        _this.urls.push(_this.clothFemaleUpperNoList)
        _this.urls.push(_this.clothFemaleUpperShortList)
        _this.renderReady = true

        _this.modelsUrl = _this.imageMaleUpperShortList
        _this.modelChosenUrl = _this.modelsUrl[0].url;
        _this.tryOnUrl = _this.modelChosenUrl

      }
    }).catch(err => {
      console.log(err);
    })

    getUploadToken({
      forever: false
    }).then(res => {
      console.log("getUploadToken:", res.data);
      _this.uploadData.token = res.data;
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

