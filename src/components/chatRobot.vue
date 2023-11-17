<template>
  <div>
    <div v-drag class="drag">
      <el-button
        circle
        style="width: 82px;height: 82px;background-image: url('http://resource.voguexplorer.com/fashion/robot/robot.png')"
        @click="showCheckBox"
      >
      </el-button>
<!--      <el-avatar :size="80" src="http://resource.voguexplorer.com/fashion/robot/robot.png" @click="showCheckBox"></el-avatar>-->
    </div>
    <div v-if="chatBoxVisible">
      <chat-robot-alpha-mode
        v-if="!betaMode"
        @changeMode="changeMode(arguments)"
      >
      </chat-robot-alpha-mode>
      <chat-robot-beta-mode
        v-else
        @changeMode="changeMode(arguments)"
      >
      </chat-robot-beta-mode>
    </div>

  </div>
</template>

<script>
import AtsButton from "./common/AtsButton";
import {judgeRobot, recommendRobot, detailRobot} from "../api/design";
import { v4 as uuidv4 } from 'uuid';
import ImageShow from "./design/ImageShow";
import ChatRobotAlphaMode from "./chatRobotAlphaMode";
import ChatRobotBetaMode from "./chatRobotBetaMode";
export default {
  name: 'chatRobot',
  components: {ChatRobotBetaMode, ChatRobotAlphaMode, ImageShow, AtsButton},
  data() {
    return {
      circleBtn: true,
      chatBoxVisible: false,
      betaMode: false,
    }
  },
  directives:{
    drag(el,bindings){ // 使组件可拖动
      el.onmousedown = function(e){
        // console.log('pagex: '+e.pageX);
        // console.log('pagey: '+e.pageY);
        // console.log('offsetleft: '+el.offsetLeft);
        // console.log('offsettop: '+el.offsetTop);
        var disx = e.pageX - el.offsetLeft;
        var disy = e.pageY - el.offsetTop;
        document.onmousemove = function (e){
          el.style.left = e.pageX - disx+'px';
          el.style.top = e.pageY - disx+'px';
        }
        document.onmouseup = function(){
          document.onmousemove = document.onmouseup = null;
        }
      }
    }
  },
  mounted: function () {
  },
  methods: {
    changeMode: function(args){
      console.log(args);
      this.betaMode = args[1];
      console.log("beta="+this.betaMode);
    },
    showCheckBox(){
      this.chatBoxVisible = !this.chatBoxVisible;
    },
  },
}
</script>

<style>
.drag{
  flex: auto;
  justify-content: center;
  width: 80px;
  height: 80px;
  position: absolute;
  border-radius: 40px;
  top: 800px;
  right: 0;
  z-index: 778;
}
.circleBtn{
  border-radius: 50%;
  flex: auto;
  width: 80px;
  height: 80px;
  background: url("http://resource.voguexplorer.com/fashion/robot/robot.png");
}
</style>
