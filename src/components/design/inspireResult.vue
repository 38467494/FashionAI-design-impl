<template>
  <div>
    <div class="flex divide-x px-6">
      <!-- 左栏 参数小图 -->
      <section class="basis-1/2 flex flex-col justify-start mr-4 ">

        <!-- 左边上半栏 -->
        <div class="flex-col mb-4">

          <div class="sm-caption" style="text-align: left">原始图像</div>
          <el-card shadow="never" style="width: 100%">
            <el-image :src="sketch" v-if="sketch" fit="contain"></el-image>
          </el-card>
        </div>
        <div class="mt-4 flex">
          <section class="basis-1/3 justify-end" style="padding: 10px">
            <el-card shadow="never" style="width: 100px; height: 100px">
              <el-image :src="color" v-if="color" fit="contain"></el-image>
            </el-card>
            <el-slider v-model="sliderColor" :format-tooltip="formatTooltip"></el-slider>
          </section>
          <section class="basis-1/3 justify-end" style="padding: 10px">
            <el-card shadow="never" style="width: 100px; height: 100px">
              <el-image :src="texture" v-if="texture" fit="contain"></el-image>
            </el-card>
            <el-slider v-model="sliderTexture" :format-tooltip="formatTooltip"></el-slider>
          </section>
          <section class="basis-1/3 justify-end" style="padding: 10px">
            <el-card shadow="never" style="width: 100px; height: 100px">
              <el-image :src="shape" v-if="shape" fit="contain"></el-image>
            </el-card>
            <el-slider v-model="sliderShape" :format-tooltip="formatTooltip"></el-slider>
          </section>
        </div>
        <div>
          <AtsButton size="medium" type="primary" @click="modifyRenderRate">调整渲染程度</AtsButton>
        </div>
      </section>

      <!-- 右栏 结果大图 -->
      <div class="basis-1/2 pl-4 flex flex-col">
        <div class="flex-none sm-caption">渲染生成结果</div>
        <div class="grow">
          <div class="img-big">
            <el-image
              class="rounded-lg border-2 overflow-hidden"
              :src="resultImage"
              v-if="resultImage"
              fit="fill">
            </el-image>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {Inspire, Render} from "../../api/design";
import {showError} from "./alert";
import {getCoverImg, uploadURL} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";

export default {
  name: "inspireResult",
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
    texture: {
      type: String,
      default: null
    },
    shape: {
      type: String,
      default: null
    },
    sliderValueColor: {
      type: Number,
      default: 50
    },
    sliderValueTexture: {
      type: Number,
      default: 50
    },
    sliderValueShape: {
      type: Number,
      default: 50
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
      this.history = {
        sketch: this.sketch,
        color: this.color,
        texture: this.texture,
        shape: this.shape,
        result: this.result,
      }
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
      this.history = null
    },
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

      //历史记录
      history: null,

      currentPic: 0, //当前走马灯图片的index
      selectList: [false],
      refreshCarousel: 0,

      //走马灯高度自适应
      carouselHeight: null,
      screenWidth: '', //记录屏幕宽度

      // 避免修改props
      sliderColor: 0,
      sliderTexture: 0,
      sliderShape: 0,

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

    this.sliderColor = this.sliderValueColor;
    this.sliderTexture = this.sliderValueTexture;
    this.sliderShape = this.sliderValueShape;
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
      var newName = "render_" + timestamp + name;
      console.log("newName", newName);
      return newName;
    },

    modifyRenderRate: function (){
      console.log(this.sliderColor);
      console.log(this.sliderValueColor);
      this.submit();
    },

    submit: function () {
      //上传两张图片并返回结果
      var sketch = this.sketch.slice(33);
      let _this = this;

      var val = {
        sourceImage: sketch,
        colorImage: _this.color.slice(33),
        colorDgree: _this.sliderColor / 100,
        texureImage: _this.texture.slice(33),
        texureDgree: _this.sliderTexture  / 100,
        shapeImage: _this.shape.slice(33),
        shapeDgree: _this.sliderShape / 100,
      }
      console.log(val);
      Inspire(val).then(res=>{
        console.log(res.data);
        _this.resultImage = res.data.data.result;
        _this.history.result = _this.resultImage;
      }).catch(res=>{
        console.log("error",res);
        _this.dialogVisible=false;
        showError(_this,res);
      })

    },

    collect: async function () {
      var res = [];
      console.log("collect");
      if(this.history === null) return null;
      else {
        var workDescription = this.history;
        var cover = await getCoverImg("inspire", workDescription);
        //因为当前的color和result的url是有过期时间的，加入需要收藏，要重新上传图片以长期保存
        workDescription.color = await uploadURL("inspire", workDescription.color);
        workDescription.texture = await uploadURL("inspire", workDescription.texture);
        workDescription.shape = await uploadURL("inspire", workDescription.shape);
        workDescription.result = await uploadURL("inspire", workDescription.result);
        console.log(workDescription);
        var info = {
          category: "inspire",
          workDescription: workDescription,
          coverUrl: cover
        }
        res.push(info);
      }
      if (res.length === 0) {
        this.$message({
          type: "warning",
          message: "未选择图片"
        })
        return null;
      }
      //初始化

      return res;
    },
    formatTooltip(val) {
      return val / 100;
    }

  }
}
</script>

<style scoped>
.img-big{
  padding-top: 20%;
  transform: scaleX(1.5) scaleY(1.5);
}
.sm-caption {
  font-weight: bold;
  color: #000;
  font-size: 1rem;
  text-align: left;
  margin-bottom: 0.5rem;
}
</style>
