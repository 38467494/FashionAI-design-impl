<template>
  <div>
    <div class="flex divide-x px-6">
      <!-- 左栏 参数小图 -->
      <section class="basis-1/2 flex flex-col justify-start mr-4 ">

        <!-- 左边上半栏 -->
        <div class="flex mb-4">

          <div class="basis-1/2 mr-2">
            <div class="sm-caption">服装样式</div>
            <div class="img-small">
              <el-image class="my-2 round-img" :src="sketch" v-if="sketch" fit="contain"></el-image>
            </div>
          </div>

          <div class="basis-1/2 ml-2">
            <div class="flex items-center justify-between">
              <div class="">
                <div class="sm-caption">颜色样式</div>
              </div>
              <div>
                <el-upload action="http://upload-z2.qiniup.com" :show-file-list="false" :on-success="handleSuccess"
                           :data="uploadData"
                           :before-upload="beforeUpload" class="innerUpload">
                  <AtsButton type="primary" plain round size="mini">
                    <i class="bi bi-arrow-clockwise"></i>
                    换一张
                  </AtsButton>
                </el-upload>
              </div>
            </div>
            <div class="img-small">
              <el-image class="my-2 round-img" :src="colorImage" v-if="colorImage" fit="contain"></el-image>
            </div>
          </div>
        </div>


        <!--        更换颜色图片后，保留历史记录 ,历史记录倒序展示-->

        <!-- 左边下半栏 -->
        <div class="mt-4 flex flex-col">
          <div class="sm-caption">渲染生成 历史记录</div>
          <el-carousel class="mt-2 mb-4" :autoplay="false" @change="changePic" :key="refreshCarousel" :height="carouselHeight">
            <template v-for="(item,index) in history">
              <el-carousel-item :key="index" class="carouselItem" :ref="getRefName(index)">
                <div class="flex" @click="selectPic" ref="row">
                  <div class="basis-1/3 mr-2">
                    <div style="margin: auto">
                      <div class="img-tag">颜色样式</div>
                      <div class="img-small">
                        <el-image class="round-img" :src="history[history.length-index-1].color"
                                  :v-if="history[history.length-index-1].color" fit="contain"></el-image>
                      </div>
                    </div>
                  </div>
                  <div class="basis-2/3 ml-2">
                    <div class="img-tag">生成结果</div>
                    <div class="img-small">
                      <el-image class="round-img" :src="history[history.length-index-1].result"
                                :v-if="history[history.length-index-1].result" fit="contain" @load="loadImg"></el-image>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </template>
          </el-carousel>
          <AtsButton type="pink" plain @click="selectPic">选择</AtsButton>
        </div>

      </section>

      <!-- 右栏 结果大图 -->
      <div class="basis-1/2 pl-4 flex flex-col">
        <div class="flex-none sm-caption">渲染生成结果</div>
        <div class="grow">
          <div class="img-small" v-loading="resultImageLoading">
            <el-image
              class="rounded-lg border-2 overflow-hidden"
              :src="resultImage"
              v-if="resultImage"
              fit="fill">
            </el-image>
          </div>
        </div>
        <!--        <el-row>-->
        <!--          <div class="block">-->
        <!--            <el-rate-->
        <!--              v-model="rateValue"-->
        <!--              :colors="colors">-->
        <!--            </el-rate>-->
        <!--          </div>-->
        <!--        </el-row>-->
        <!--        <el-button type="primary" round @click="sure">确定</el-button>-->
      </div>
    </div>

  </div>
</template>

<script>

import {AIColor} from "../../api/design";
import {showError} from "./alert";
import {getCoverImg, uploadURL} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";
export default {
  name: "aicolorResult",
  components: {AtsButton},
  props: {
    sketch: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null
    },
    result: {
      type: String,
      default: null
    },
    uploadToken: {
      type: String,
      default: null
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    result: function (n, o) {
      console.log("sketch change", n, o)
      this.history = [
        {
          sketch: this.sketch,
          color: this.color,
          result: this.result
        }

      ]
      this.uploadData.token = this.uploadToken
      this.colorImage = this.color
      this.resultImage = this.result
    },
    //走马灯高度自适应,屏幕宽度改变，修改走马灯高度
    screenWidth: function () {
      var ref = "row"
      this.carouselHeight = window.getComputedStyle(this.$refs[ref][0].$el).height
    },
    dialogVisible: function () {
      this.selectList = []
      this.history = []
    }
  },
  data: function () {
    return {
      cloth: null,
      colorImage: null,
      resultImage: null,  //避免对于props的修改

      rateValue: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }

      //上传颜色图像
      imageUrl: null, //图片在七牛云上的url，通过这个url可以直接访问到图片
      imageKey: null,  //图片上传到七牛云上，返回的key
      uploadData: {
        token: "",
        key: ""
      },
      resultImageLoading: false,

      //历史记录
      history: [
        // {
        //   setch:"http://shoplook.voguexplorer.com/fashion/render/origin/202.jpg",
        //   color: "http://shoplook.voguexplorer.com/fashion/collaborate/template/alberta-g1513f2ea5_1920.jpg",
        //   result: "http://shoplook.voguexplorer.com/fashion/collaborate/template/alberta-g1513f2ea5_1920.jpg",
        // },
        // {
        //   setch:"http://shoplook.voguexplorer.com/fashion/render/origin/202.jpg",
        //   color: "http://shoplook.voguexplorer.com/fashion/collaborate/template/art-74050_1920.jpg",
        //   result: "http://shoplook.voguexplorer.com/fashion/collaborate/template/art-74050_1920.jpg",
        // }
      ],

      currentPic: 0, //当前走马灯图片的index
      selectList: [false],
      refreshCarousel: 0,

      //走马灯高度自适应
      carouselHeight: null,
      screenWidth: '' //记录屏幕宽度
    }
  },
  mounted() {
    //走马灯高度自适应，监听屏幕宽度
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.screenHeight = document.body.clientHeight;
      })();
    };
  },
  methods: {
    loadImg: function () {
      if (this.carouselHeight == null) {
        this.$nextTick(() => {
          var ref = "row"
          this.carouselHeight = window.getComputedStyle(this.$refs[ref][0].$el).height
        })
      }

    },

    changePic: function (index) {
      console.log("changePic", index)
      this.currentPic = index
    },
    getRefName: function (index) {
      return "pic_" + index;
    },
    selectPic: function () {
      var index = this.currentPic

      var ref = this.getRefName(index);
      var obj = this.$refs[ref][0].$el.style.background;
      var reverseIndex = this.selectList.length - index - 1;
      console.log("select Pic", index, reverseIndex)
      if (this.selectList[reverseIndex])
        this.$refs[ref][0].$el.style.background = "transparent"
      else
        this.$refs[ref][0].$el.style.background = "rgb(198,226,255)"
      this.selectList[reverseIndex] = !this.selectList[reverseIndex]
      console.log(reverseIndex)
    },

    handleSuccess: function (res, file) {
      console.log("success:", res, file)
      this.imageUrl = this.$store.state.domain + res.key;
      this.imageKey = res.key;

      this.colorImage = this.imageUrl
      this.resultImageLoading = true;
      //2. 将信息传提给后端
      this.submit();
    },
    beforeUpload: function (file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error('上传图片只能为JPG或PNG格式');
        this.fileList = [];
        return false;
      }

      this.uploadData.key = this.getName(file.name);
      return true;
    },
    //设置上传文件的文件名
    getName: function (name) {
      var timestamp = Date.parse(new Date());
      var newName = "aicolor_" + timestamp + name;
      console.log("newName", newName);
      return newName;
    },

    submit: function () {
      //上传两张图片并返回结果
      var sketch = this.sketch.slice(33);
      var color = this.imageKey;
      let _this = this;

      var resultColor = _this.imageUrl

      AIColor({
        personImage: sketch,
        landscapeImage: color,
        // colorPosition:着色部位, colorType:抽取颜色/纹理，目前支持颜色
        bodySection: 0,
        type: 0,
      }).then(res => {
        console.log(res.data);

        var aicolorResult = res.data.data.fileUrl
        this.resultImage = aicolorResult

        // console.log(_this.history)

        _this.history.push({
          sketch: _this.sketch,
          color: resultColor,
          result: aicolorResult
        })

        _this.resultImageLoading = false;
        console.log(_this.history);
        for (var i = 0; i < _this.selectList.length; i++)
          _this.selectList[i] = false;
        _this.selectList.push(false)
        _this.refreshCarousel += 1
      }).catch(res => {
        console.log("error", res);
        _this.dialogVisible = false;
        showError(_this, res);

      })

    },

    collect: async function () {
      var res = []
      console.log("collect", this.selectList)
      for (var i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i] == false) continue;
        var workDescription = this.history[i]
        var cover = await getCoverImg("aicolor", workDescription)
        //因为当前的color和result的url是有过期时间的，加入需要收藏，要重新上传图片以长期保存
        workDescription.color = await uploadURL("aicolor", workDescription.color)
        workDescription.result = await uploadURL("aicolor", workDescription.result)
        console.log(workDescription)
        var info = {
          category: "aicolor",
          workDescription: workDescription,
          coverUrl: cover
        }
        res.push(info)
      }
      if (res.length == 0) {
        this.$message({
          type: "warning",
          message: "未选择图片"
        })
        return null;
      }

      //初始化

      return res;
    }

  }
}
</script>

<style scoped>

</style>
