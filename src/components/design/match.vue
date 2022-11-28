<template>
  <div>
    <div class="flex divide-x">
      <!-- 这里的奇怪name及label是为了与数据集中的文本描述对应 -->
      <section class="basis-2/3 px-6 py-2">
        <!-- 切换时清空图像选择待处理 -->
        <el-tabs v-model="activeName">
          <el-tab-pane
            :key="index"
            v-for="(item, index) in clothType"
            :label="item.label"
            :name="item.name">
            <image-show v-bind:name="item.name" v-bind:module="moduleType" v-bind:urls="urls[index]"
                        v-bind:index="index"
                        @selectCloth="selectCloth(arguments)" v-if="matchReady"></image-show>
          </el-tab-pane>
        </el-tabs>
      </section>


      <section class="basis-1/3 flex flex-col px-6 py-4">
        <div class="text-left mb-2">
          <el-tooltip content="必选" placement="top">
            <div class="font-bold text-black text-lg">期望生成的类别</div>
          </el-tooltip>
        </div>

        <template v-for="(item,index) in dividedClothType">
          <div class="flex justify-around" :key="index">
            <template v-for="(subitem,subindex) in item">
              <div class="text-left basis-1/4 my-1" :key="subindex">
                <el-radio
                  class=""
                  :disabled="check(subitem.type)"
                          :label="subitem.name"
                          v-model="matchType">
                  {{ subitem.label }}
                </el-radio>
              </div>
            </template>
          </div>
        </template>

        <el-divider/>

        <div class="grow" v-if="matchType != null">
          <div class="flex items-center justify-start">
            <div class="font-bold text-black text-lg">期望生成服装的标签</div>
            <el-tooltip placement="top" content="均非必选，但建议选择5个左右">
              <i class="mx-2 bi bi-info-circle text-slate-300"></i>
            </el-tooltip>
          </div>

          <match-text class="my-4" v-bind:radio="matchType" ref="expectLabel"></match-text>
          <div class="flex py-2">
            <AtsButton expand type="primary" @click="submit">提交</AtsButton>
            <AtsButton expand type="pink" plain>重置参数</AtsButton>
          </div>
        </div>


      </section>
    </div>

    <!--    <el-dialog title="生成结果" :visible.sync = "resultVisible" width="70%">-->
    <!--      <match-result v-loading="resultLoading"-->
    <!--      v-bind:tag-list = "result.labels" v-bind:name="result.matchType.name" v-bind:label="result.matchType.label"-->
    <!--      v-bind:url = "result.image" v-bind:result="result.result" v-if="result"></match-result>-->
    <!--      <span slot="footer">-->
    <!--&lt;!&ndash;        <el-button @click="dialogVisible = false">取 消</el-button>&ndash;&gt;-->
    <!--        <el-button type="primary" @click="dialogVisible = false">收藏</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

    <my-collect-dialog title="生成结果" :visible.sync="resultVisible" :collect-info="collect">
      <match-result v-loading="resultLoading"
                    v-bind:tag-list="result.labels" v-bind:name="result.matchType.name"
                    v-bind:label="result.matchType.label"
                    v-bind:url="result.image" v-bind:result="result.result" v-if="result"></match-result>
    </my-collect-dialog>
  </div>
</template>

<script>
import ImageShow from './ImageShow.vue';
import MatchText from './matchText.vue';
import {MMCGAN} from "../../api/design";
import MatchResult from "./matchResult";
import {initMMCGAN} from "../../api/design";
import {showError} from "./alert";
import MyCollectDialog from "../my-collect-dialog";
import {getCoverImg, uploadURL} from "../personal/coverFunction";
import AtsButton from "../common/AtsButton";

export default {
  name: "match",
  components: {
    AtsButton,
    MyCollectDialog,
    MatchResult,
    ImageShow,
    MatchText
  },
  mounted: function () {
    this.divideClothType(4);
    this.getFiles();

  },
  data: function () {
    return {
      moduleType: 'match',
      activeName: 'Jackets',
      matchReady: false,
      //服装类型，用于渲染tab
      clothType: [
        {
          label: "夹克衫",
          name: "Jackets",
          type: 0
        },
        {
          label: "卫衣和帽衫",
          name: "Sweatshirts Hoodies",
          type: 0
        },
        {
          label: "外套",
          name: "Outerwear",
          type: 0
        },
        {
          label: "上衣",
          name: "Tops",
          type: 0  //由于这两个模型还不能使用，暂时赋值为-1，禁用（正常应为0）
        },
        {
          label: "牛仔裤",
          name: "Clothing Jeans",
          type: 1
        },
        {
          label: "长裤",
          name: "Clothing Pants",
          type: 1
        },
        {
          label: "短裤",
          name: "Clothing Shorts",
          type: 1
        },
        {
          label: "裙子",
          name: "Skirts",
          type: 1
        },
      ],
      fileNames: [
        //jacket
        [
          "5a9105ecbea6beefe9b7a90b6876d2b3.jpg",
          "9875a8da32d7525b001b8d02211e1c72.jpg",
          "b46e2193669d375ac6295d73cadcb8d4.jpg",
          "08a14c79e0ea3e741fe9f2f3fa83f6b9.jpg",
          "914ada4bf5de9d38571058d497c73222.jpg",
          "5ad2abd1ede18a51884fc166d8253ef3.jpg",
          "7ce44fb815e3389321c8d17e43f28f2d.jpg",
          "4641a40118dada7d17bea5c0ee7fbe53.jpg",
          "e8fd2028d0462196fdd3fbc9b27bbbcc.jpg",
          "0a3dd29c047f1679941c277928d556ee.jpg"
        ],
        //Sweatshirts Hoodies
        [],
        //Outerwear
        [],
        //Tops
        [],
        [], [], [], []
      ],
      urls: [],


      //被选中的图片的一些参数
      selectClothId: null,
      selectClothName: "",  //选中图片的filename
      selectClothType: null,
      selectClothTypeVal: -1, //val=0/1

      //clothType进行划分，用于类别的渲染
      dividedClothType: null,

      //期待生成的类别
      matchType: null,

      resultVisible: false,
      result: null,
      resultLoading: false,


    };
  },
  methods: {
    //从数据库中获取图片
    getFiles: function () {
      var nameList = ["jacketList", "sweatshirtHoodyList", "outerwearList", "topList", "jeansList", "pantsList", "shortsList", "skirtList"];
      let _this = this;
      initMMCGAN().then(res => {
        console.log("init MMCGAN", res.data);
        _this.fileNames = [];
        _this.urls = [];
        const files = res.data.data;
        for (var i = 0; i < nameList.length; i++) {
          var arr = [];
          var list = files[nameList[i]];
          // console.log("getname",nameList[i],list);
          for (var j = 0; j < list.length; j++) {
            var str = this.$store.state.domain + list[j];
            arr.push(str);
          }
          _this.urls.push(arr);
          _this.fileNames.push(list);
        }
        // console.log(_this.urls);
        this.matchReady = true;
      })

    },
    //某个tab中某张图片被选中，出发该函数，需要修改元素的className和保存id
    selectCloth: function (msg) {
      var index = msg[1];
      var index2 = msg[2];
      var type = msg[3];

      var id = this.urls[index][index2];
      var fileName = this.fileNames[index][index2];

      this.selectClothId = id;
      this.selectClothType = type;
      this.selectClothName = fileName;
      this.matchType = null;

      this.getVal();

    },

    divideClothType: function (col) {
      var arr = [];
      var ori = this.clothType;
      for (var i = 0; i < ori.length; i += col) {
        var sub = [];
        for (var j = 0; j < col; j++)
          sub.push(ori[i + j]);
        arr.push(sub);
      }
      this.dividedClothType = arr;
    },

    //返回clothType是上装还是下装
    getVal: function () {
      var selectType = this.selectClothType;
      var clothType = this.clothType;
      var val;
      for (var i = 0; i < clothType.length; i++) {
        if (selectType == clothType[i].name) {
          val = clothType[i].type;
          break;
        }
      }
      this.selectClothTypeVal = val;
    },

    //返回radio是否被禁用
    check: function (type) {
      console.log(type);
      if (this.selectClothTypeVal == -1) return true;
      if (type == -1) return true;
      return type == this.selectClothTypeVal;
    },

    //返回matchtype的中文
    getLabel: function (type) {
      for (var val of this.clothType) {
        if (type == val.name)
          return val.label;
      }
      return ''
    },

    //提交数据给后端，生成结果
    submit: function () {

      console.log("yes")
      var image = this.selectClothId;
      var matchType = this.matchType;
      var c_matchType = this.getLabel(matchType);
      var labels = this.$refs.expectLabel.getValue();

      //labels包括labels和c_labels
      //labels是传给后端的英文参数
      //c_labels是传给result界面的

      console.log('submit', labels)

      //选中的图片、期待生成的类别、标签信息(数组)
      //传给后端，生成图片，页面跳转

      var result = ""; //记录后端返回的七牛云链接

      var targetText = "";
      for (var i = 0; i < labels.labels.length; i++) {
        targetText = labels.labels[i] + " ";
      }

      let _this = this;
      this.result = {
        image: image,
        matchType: {name: matchType, label: c_matchType},
        labels: labels.c_labels,
        result: null
      };

      console.log(labels.c_labels)

      this.resultLoading = true;
      this.resultVisible = true;

      MMCGAN({
        // id: 1,
        fileName: this.selectClothName,
        targetCategory: matchType,
        targetText: targetText
      }).then(res => {
        console.log("MMCGAN result", res.data);
        let data = res.data.data;

        result = data.fileUrl;
        console.log(result)

        // result = "http://shoplook.voguexplorer.com/mmc_gan_1645531518645.png"

        //页面跳转
        _this.result.result = result

        _this.resultLoading = false;
      })
        .catch(res => {
          console.log("error", res);
          _this.resultVisible = false;
          showError(_this, res);

        })

      //test
      // setTimeout(function (){
      //   result = "http://shoplook.voguexplorer.com/mmc_gan_1645531518645.png"
      //
      //   //页面跳转
      //   _this.result = {
      //     image : image,
      //     matchType: {name: matchType, label:c_matchType},
      //     labels: labels.c_labels,
      //     result: result
      //   }
      //
      //   _this.resultLoading = false;
      // },3000)


    },

    collect: async function () {
      var coverUrl = await getCoverImg("MMC", this.result)
      console.log(coverUrl)
      var newURL = await uploadURL("MMC", this.result.result)
      console.log(newURL)
      this.result.result = newURL
      var info = {
        category: "MMC",
        workDescription: this.result,
        coverUrl: coverUrl
      }
      return info;
    }

  }
};
</script>

<style>
.errorAlert {
  width: 50%;
  padding: 0px 5px 10px 10px;
}

.el-dialog__footer {
  text-align: center;
}
</style>
