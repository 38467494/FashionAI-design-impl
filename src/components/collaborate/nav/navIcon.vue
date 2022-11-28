<template>
  <div class="flex flex-col">
    <div class="font-bold text-lg">点击添加 ICON 图标</div>
    <div class="flex-none" style="height: 550px">
      <el-scrollbar style="height:100%" wrap-style="overflow-x:hidden;">
        <template v-for="(item, index) in pageFiles">
          <div class="flex">
            <div class="basis-1/2 p-3">
              <el-image
                class="icon-img"
                :src="getSrc(item[0])"
                v-if="getSrc(item[0])"
                @click="addIcon(item[0])"
                fit="fill"
              ></el-image>
            </div>
            <div class="basis-1/2 p-3" v-if="index + 1 < pageFiles.length">
              <el-image
                class="icon-img"
                :src="getSrc(item[1])"
                v-if="getSrc(item[1])"
                @click="addIcon(item[1])"
                fit="fill"
              ></el-image>
            </div>
          </div>
        </template>
      </el-scrollbar>
    </div>
    <div class="my-2">
      <el-pagination
        :current-page.sync="currentPage"
        :total="total"
        :page-size="pageSize"
        small
        layout="prev, pager, next, jumper"
        :pager-count="5"
        @current-change="toPage"
        style="position:relative;left:-30px;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import editDraw from "./editDraw.vue";
import editGeneral from "./editGeneral.vue";
import { addObj } from "./objFunction";
import { getMaterial } from "../../../api/collaborateAPI";

export default {
  name: "navIcon",
  components: { editDraw, editGeneral },
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  data: function() {
    return {
      files: [
        "adafruit.svg",
        "adidas.svg",
        "alipay.svg",
        "altiumdesigner.svg",
        "amazon.svg",
        "amazonlumberyard.svg",
        "amd.svg",
        "amp.svg",
        "tattoo1.svg"
      ],
      editVisible: false,

      filePath: "/static/svg/icons/",

      pageFiles: [],
      currentPage: 1,
      total: 100,
      pageSize: 20
    };
  },
  mounted: function() {
    this.getFiles();
  },
  methods: {
    //获取文件夹下所有svg素材
    getFiles: function() {
      let _this = this;
      getMaterial({ category: "icons" }).then(res => {
        console.log("icons material", res.data.data);
        const files = res.data.data;
        _this.total = files.length;

        _this.files = [];

        for (var i = 0; i < files.length; i += _this.pageSize) {
          var arr = [];
          for (var j = 0; j < _this.pageSize && i + j < files.length; j += 2) {
            var set = [];
            set.push(files[i + j]);
            if (i + j + 1 < files.length) set.push(files[i + j + 1]);
            arr.push(set);
          }
          _this.files.push(arr);
        }

        console.log(_this.files);
        _this.currentPage = 1;

        _this.toPage(_this.currentPage);
      });
    },
    toPage: function(val) {
      this.pageFiles = this.files[val - 1];
    },
    getSrc: function(item) {
      var file = this.$store.state.domain + item;
      console.log(file);
      // var file='/static/svg/icons/adidas.svg';
      return file;
    },
    addIcon: function(item) {
      var file = this.getSrc(item);
      var canvas = this.canvas;
      var _this = this;
      console.log(file);
      fabric.loadSVGFromURL(file, function(objects, options) {
        var svg = fabric.util.groupSVGElements(objects, options);
        svg.set({
          fill: "#409EFF",
          stroke: "#000000",
          scaleX: 2,
          scaleY: 2,
          left: 100, //距离画布左侧的距离，单位是像素
          top: 100 //距离画布上边的距离
        });
        addObj(svg, canvas);
      });
    }
  }
};
</script>

<style>
.icon-img {
  margin: 2px;
  padding: 1.6rem;
  border-radius: 1rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all .2s ease-out;
}
.icon-img:hover {
  border: 2px solid var(--base-primary);
  box-shadow: 0 10px 15px -3px var(--base-primary-shadow), 0 4px 6px -4px var(--base-primary-shadow);
}
</style>
