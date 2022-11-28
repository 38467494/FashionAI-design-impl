<template>
  <div class="">
    <div class="flex divide-x">
      <div class="basis-2/3 py-4 pl-8">
        <el-tabs v-model="activeName" style="width: 95%;">
          <template v-for="(item,index) in tabList">
            <el-tab-pane :label="item.label" :name="item.name" :disabled="item.disabled" :key="index">
              <image-show v-bind:name="item.name" v-bind:module="moduleType" v-bind:urls="urls[index]"
                          v-if="recommendReady" v-bind:height="colorHeight"
                          @selectCloth="selectCloth(arguments)">
              </image-show>

            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <div class="basis-1/3 py-4 px-6 flex flex-col">

        <!-- 期望推荐样式-标题 -->
        <el-tooltip content="每类选择一种样式，没有选择的类别会随即推荐" placement="top">
          <div class="text-black font-bold text-base text-left">期望推荐样式</div>
        </el-tooltip>

        <!-- 三图 -->
        <div class="flex gap-x-2 my-2">
          <template v-for="(item,index) in maskIndex">
            <div class="basis-1/3 relative" :key="index">

              <!-- 删除图标 -->
              <div class="maskicon absolute flex items-center justify-center">
                <i class="el-icon-close" @click="removeMask(item)"></i>
              </div>

              <el-image class="border-2 border-dashed bg-slate-100 rounded" :src="getMaskImg(item)" fit="contain">
              </el-image>

            </div>
          </template>
        </div>

        <div class="my-3">
          <AtsButton style="width: 140px" type="primary" @click="submit" :disabled="selectClothId == null">提交
          </AtsButton>
        </div>

        <el-row type="flex">
          <el-tabs v-model="activeMask" style="width: 100%">
            <template v-for="(item,index) in tabList">
              <el-tab-pane :label="item.label" :name="item.name"
                           :disabled="(!item.disabled) || (selectClothId ==null)" :key="index">
                <image-show v-bind:name="item.name" v-bind:module="moduleType" v-bind:urls="mask_urls[index]"
                            @selectCloth="selectMask(arguments)" v-if="selectClothId != null">
                </image-show>
              </el-tab-pane>
            </template>


          </el-tabs>
        </el-row>

        <!--          <el-row type="flex" justify="center">-->

        <!--            &lt;!&ndash; 每个掩码图像对应一个类，后选择的掩码会顶替同类掩码 &ndash;&gt;-->
        <!--            <template v-for="(item,index) in maskIndex">-->
        <!--              <el-col :key="index" :span="6" class="mask-border">-->
        <!--                <div style="position: relative">-->
        <!--                  <div class="maskicon" v-if="getMaskImg(item)" >-->
        <!--                    <i class="el-icon-close iconClose" @click="removeMask(item)"></i>-->
        <!--                  </div>-->

        <!--                  <div class="mask-div">-->

        <!--                    <el-image :src="getMaskImg(item)" fit="contain">-->
        <!--                      <div slot="error" class="image-slot">-->
        <!--                        <i class="el-icon-plus avatar-uploader-icon"></i>-->
        <!--                      </div>-->
        <!--                    </el-image>-->

        <!--                  </div>-->

        <!--                </div>-->

        <!--&lt;!&ndash;                <i v-else class="el-icon-plus avatar-uploader-icon"></i>&ndash;&gt;-->
        <!--              </el-col>-->

        <!--            </template>-->

        <!--          </el-row>-->
        <!--          <el-row style="margin: 10px;">-->
        <!--            <el-button type="primary" round @click="submit">提交</el-button>-->
        <!--          </el-row>-->
      </div>


    </div>

    <my-collect-dialog title="推荐生成结果" :visible.sync="resultVisible" :collect-info="collect">
      <recommend-result v-bind:cloth-image="resultSelectImage"
                        v-bind:mask-list="resultMaskList"
                        v-bind:result-list="resultImage"
                        v-loading="resultLoading"
      ></recommend-result>
    </my-collect-dialog>

    <!--    <el-dialog title="推荐生成结果" :visible.sync="resultVisible" width="70%">-->
    <!--      <recommend-result v-bind:cloth-image="resultSelectImage"-->
    <!--                        v-bind:mask-list="resultMaskList"-->
    <!--                        v-bind:result-list="resultImage"-->
    <!--                        v-loading="resultLoading"-->
    <!--      ></recommend-result>-->
    <!--    </el-dialog>-->
  </div>

</template>

<style>

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.mask-border {
  border: #8c939d dashed 1px;
  height: 100%;
  padding: 5px;
  border-radius: 10px;
  margin: 2px;
}

.mask-div {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

/* 小角标（删除）样式 */
.maskicon {
  z-index: 10;
  width: 20px;
  height: 20px;
  font-size: 0.4rem;
  right: -5px;
  top: -5px;
  background-color: var(--base-pink);
  color: #fff;
  border-radius: 50%;
}
.maskicon:hover {
  cursor: pointer;
  background-color: var(--base-pink-lightup);
}


.errorAlert {
  width: 50%;
  padding: 0px 5px 10px 10px;

}

</style>

<script>
import ImageShow from "./ImageShow";
import RecommendResult from "./recommendResult";
import {OutfitGAN} from "../../api/design";
import {initOutfitGAN} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, uploadURL} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";

export default {
  name: "designRecommend",
  components: {AtsButton, MyCollectDialog, RecommendResult, ImageShow},
  data() {
    return {
      moduleType: 'recommendation',
      activeName: 'Upper clothing',
      activeMask: null,//'Lower clothing',
      colorHeight: "height: 700px;",  //设置左侧衣服image长度

      tabList: [
        {
          label: "上装",
          name: "Upper clothing",
          disabled: false
        },
        {
          label: "下装",
          name: "Lower clothing",
          disabled: true
        },
        {
          label: "鞋",
          name: "Shoes",
          disabled: true
        },
        {
          label: "包",
          name: "Bag",
          disabled: true
        },
      ],

      recommendReady: false,
      fileNames: [],

      // 给定图片地址(左）
      urls: [
        //upper cloth
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e.jpg"],
        // //lower cloth
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e_lower.jpg"],
        // //shoes
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e_shoes.jpg"],
        // //bag
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e_bag.jpg"]
      ],
      //掩码图片地址（右）
      mask_urls: [
        //upper cloth
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e.jpg"],
        // //lower cloth
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e_lower.jpg"],
        // //shoes
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e_shoes.jpg"],
        // //bag
        // ["http://shoplook.voguexplorer.com/001aeb1dc1adbcb6a36060961f92843e_bag.jpg"]
      ],

      //被选中的图片的一些参数
      selectClothId: null,

      selectClothType: null,
      selectClothTypeVal: -1, //val=0/1

      selectedMask: [
        {
          id: null,
          dom: null,
          type: null,
        },
        {
          id: null,
          dom: null,
          type: null,
        },
        {
          id: null,
          dom: null,
          type: null,
        },
        {
          id: null,
          dom: null,
          type: null,
        },

      ],

      maskIndex: [1, 2, 3],

      resultVisible: false,
      resultSelectImage: "",
      resultMaskList: [],
      resultImage: [],
      resultLoading: false,


      //评价
      rateValue: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    }
  },
  mounted() {
    this.getFiles();
  },

  methods: {
    getFiles: function () {
      var nameList = ["upperList", "lowerList", "shoesList", "bagList"];
      let _this = this;
      this.urls = [];
      this.fileNames = [];
      this.mask_urls = [];
      initOutfitGAN().then(res => {
        console.log("outfit init", res.data);
        var files = res.data.data;
        for (var i = 0; i < nameList.length; i++) {
          var arr = [];
          var list = files[nameList[i]];
          for (var j = 0; j < list.length; j++) {
            var name = this.$store.state.domain + list[j];
            arr.push(name);
          }
          if (i == 0) {
            _this.urls.push(arr);
            _this.fileNames.push(list);
            _this.mask_urls.push([]);
          } else {
            _this.mask_urls.push(arr);
            _this.urls.push([]);
          }
        }
        _this.recommendReady = true;
        console.log("recommendation", _this.urls);
      })
    },
    //某个tab中某张图片被选中，出发该函数，需要修改元素的className和保存id
    selectCloth: function (msg) {
      var id = msg[1];  //选中图片的index
      var type = msg[2];

      this.selectClothId = this.urls[0][id];
      this.selectClothType = type;

      this.activeMask = 'Lower clothing'

      // this.getVal();

    },
    selectMask: function (msg) {
      var dom = msg[0];
      var id = msg[1];  //选中图片的index
      var type = msg[2];
      console.log("selectmask", msg)

      var list = this.selectedMask;

      var index = this.getTabIndex(type);
      console.log(list, index, type);

      if (list[index].dom != null) {
        list[index].dom.className = "img-div";
      }
      dom.className = 'img-div-selected';
      this.selectedMask[index].dom = dom;
      this.selectedMask[index].id = this.mask_urls[index][id];
      this.selectedMask[index].type = type;
    },
    getTabIndex: function (type) {
      for (var i = 0; i < this.tabList.length; i++) {
        var tabType = this.tabList[i].name;
        if (tabType == type)
          return i;
      }
    },

    removeMask: function (index) {
      this.selectedMask[index].dom.className = "img-div";
      this.selectedMask[index].dom = null;
      this.selectedMask[index].id = null;
      this.selectedMask[index].type = null;
    },

    //根据给定的index，返回 被选中的图片的缩略图
    getMaskImg: function (index) {
      var img = this.selectedMask[index].id
      if (img == null)
        return '/static/transparent-mask.png';
      else
        return img;
      // return this.selectedMask[index].id;
    },


    //提交请求
    submit: function () {
      this.resultImage = []
      this.resultLoading = true;
      this.resultVisible = true;
      var selectedId = this.selectClothId.slice(33);
      var maskId = [];
      this.resultMaskList = [];
      for (var i of this.maskIndex) {
        var name = null;
        if (this.selectedMask[i].id != null) {
          name = this.selectedMask[i].id.slice(33);
        }

        maskId.push(name);
        this.resultMaskList.push(this.selectedMask[i].id);
      }

      //穿给后端一张图片和三个掩码图片，返回结果跳转到result界面
      this.resultSelectImage = this.selectClothId;

      let _this = this;
      OutfitGAN({
        upperFileName: selectedId,
        lowerFileName: maskId[0],
        shoesFileName: maskId[1],
        bagFileName: maskId[2],
      }).then(res => {
        console.log("recommendation result", res.data)
        var data = res.data.data;

        _this.resultImage.push(data.lowerUrl);
        _this.resultImage.push(data.shoesUrl);
        _this.resultImage.push(data.bagUrl);
        _this.resultLoading = false;
      }).catch(res => {
        console.log("error", res);
        _this.resultVisible = false;
        showError(_this, res);

      })


      // this.$router.push({
      //   name: 'recommend-result',
      //   params: {
      //     image: selectedId,
      //     maskList: maskId,
      //     result: result,   //将获得结果返回给result页面，这里暂时用maskId代替
      //   }
      // });
    },


    collapseOpen() {
      this.isCollapse = false;
    },
    collapseClose() {
      this.isCollapse = true;
    },

    collect: async function () {
      var work = {
        clothImage: this.resultSelectImage,
        maskList: this.resultMaskList,
        resultList: this.resultImage
      }
      console.log(work)
      //封面图片，暂时用result替代
      var cover = await getCoverImg("outfit", work)

      for (var i = 0; i < work.resultList.length; i++) {
        work.resultList[i] = await uploadURL("outfit", work.resultList[i])
      }

      var info = {
        category: "outfit",
        workDescription: work,
        coverUrl: cover
      }
      return info
    }

  },
}
</script>
