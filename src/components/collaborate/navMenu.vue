<template>
  <div class="flex h-full">
    <div class="basis-2/12 flex-none border-r p-0">
      <!-- left sidebar -->
      <div
        class="ats-sidenav"
        style="padding: 0.7rem"
        v-for="item in navItems"
        :class="selected == item.index ? 'active' : ''"
        @click="handleSelect(item.index)"
      >
        <div class="text-center min-w-max">
          <div :class="getIconClass(item.svg)" class="mb-2 text-center"></div>
          <p style="line-height: initial;margin:0px 2px ; font-size: 0.9rem;">
            {{ item.title }}
          </p>
        </div>
      </div>
      <!--
      <el-menu
        class="el-menu-vertical-demo"
        @select="handleSelect"
        style="width:70px; min-height:680px;"
        default-active="0"
      >
        <template v-for="(item, index) in navItems">
          <el-menu-item
            :index="item.index"
            :key="item.index"
            style="height: auto;padding: 5px;"
          >

          </el-menu-item>
        </template>
      </el-menu> -->
    </div>
    <div class="basis-10/12 border-r px-3 py-4 overflow-auto">
      <div>
        <!-- 这里只能使用‘==’，因为‘===’是严格等于，会判断数据类型 -->
        <!-- 通过当前selected的值选择显示哪个框 -->
        <nav-template
          v-if="selected == 0"
          v-bind:canvas="canvas"
        ></nav-template>
        <nav-text v-if="selected == 1" v-bind:canvas="canvas"></nav-text>
        <nav-graph v-if="selected == 2" v-bind:canvas="canvas"></nav-graph>
        <nav-icon v-if="selected == 3" v-bind:canvas="canvas"></nav-icon>
        <nav-pencil v-if="selected == 4" v-bind:canvas="canvas"></nav-pencil>
      </div>
      <edit-main v-if="selectType" v-bind:canvas="canvas"></edit-main>
    </div>
  </div>
</template>

<script>
import NavGraph from "./nav/navGraph.vue";
import navIcon from "./nav/navIcon.vue";
import NavTemplate from "./nav/navTemplate.vue";
import NavText from "./nav/navText.vue";
import { fabric } from "fabric";
import NavPencil from "./nav/navPencil.vue";
import EditMain from "./nav/editMain";
import {getUploadToken} from "../../api/design";
// import {editFunction} from "./nav/objFunction";

export default {
  components: { EditMain, navIcon, NavTemplate, NavGraph, NavText, NavPencil },
  name: "navMenu",
  props: {
    canvas: {
      type: fabric.Canvas,
      default: null
    },
  },
  computed: {
    selectType: function() {
      return this.$store.state.selectType;
    }
  },
  mounted: function() {
    this.selected = 0;
  },

  data: function() {
    return {
      navItems: [
        {
          index: "0",
          title: "模板图片",
          svg: "template"
        },
        {
          index: "1",
          class: "navSVG",
          title: "文字",
          svg: "text"
        },
        {
          index: "2",
          class: "navSVG",
          title: "几何图案",
          svg: "graphql"
        },
        {
          index: "3",
          class: "navSVG",
          title: "Icon图标",
          svg: "smile"
        },
        {
          index: "4",
          class: "navSVG",
          title: "画笔",
          svg: "pencil"
        }
      ],
      selected: -1,
      editVisible: false,
    };
  },
  methods: {
    handleSelect(selectedIdx, key, keyPath) {
      // console.log('handleSelect ', selectedIdx);
      this.selected = selectedIdx;
      // var selected = this.selected;
      // if (selected != -1) this.$set(this.navItems[selected], "class", "navSVG");
      // this.selected = key;
      // console.log(this.selected);
      // this.$set(this.navItems[key], "class", "navSVG-active");

      //每次选择其他模块时，关闭pencil模式
      this.canvas.isDrawingMode = false;

      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    },
    name: function(name, index) {
      return name + index;
    },
    getText: function(text) {
      this.$emit("getText", text);
    },
    visualizeEdit: function() {
      console.log("visible");
      this.editVisible = true;
      editFunction.$on("visible", res => {
        console.log("navMenu visible");
      });
    },
    getIconClass: function(val) {
      return "icon iconfont el-icon-my-" + val;
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/ats-sidenav.css";
.icon {
  height: auto;
  width: auto;
  line-height: initial;
}
.iconfont {
  font-size: 30px;
}

.el-menu {
  height: 100%;
}

/* ===== Custom Scrollbar CSS ===== */

/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: #dedede #ffffff;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 13px;
  height: 13px;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb {
  background-color: #dedede;
  border-radius: 10px;
  border: 3px solid #ffffff;
}

</style>
