<template>
  <div class="px-2">
    <el-divider>
      <h3>属性编辑</h3>
    </el-divider>
<!--    <h4>edit</h4>-->

    <div class="edit-div">

      <edit-draw v-bind:canvas="canvas" ref="editDraw" v-if="!(textBox||objImg)"></edit-draw>
<!--      <el-divider></el-divider>-->
      <edit-general v-bind:canvas="canvas" ref="editGeneral"></edit-general>
<!--      <el-divider>-->
<!--      </el-divider>-->
      <edit-font v-bind:canvas="canvas" ref="editFont" v-if="textBox"></edit-font>
    </div>
  </div>

</template>

<script>
import {fabric} from "fabric";
import editDraw from './editDraw.vue';
import editGeneral from './editGeneral.vue';
import editFont from "./editFont.vue";
export default {
  name: "editMain",
  components: {editFont, editDraw, editGeneral },
  props:{
    canvas: {
      type: fabric.Canvas,
      default: null
    }
  },
  mounted() {
    this.selectType = this.$store.state.selectType;
    var type = this.selectType.type;
    console.log("edit main type",type);
    this.textBox = type == "textbox";
    this.objImg = type == "image";
    console.log(this.selectType)
    // this.update();

  },
  computed: {
    modify: function (){
      var modify = this.$store.state.modify;
      // console.log("edit modify")
      return modify;
    }
},
  watch: {
    modify(val){
      this.update();
    }
  },
  data: function (){
    return {
      selectType: null,
      textBox: false,
      objImg: false,
    }
  },
  methods: {
    update: function (){
      this.$refs.editGeneral.update();
      if(this.textBox){
        this.$refs.editFont.update();
        // if(this.selectType.text.length>100)
        //   this.$message({
        //     message: '输入文字长度应小于100',
        //     type: 'warning'
        //   });
      }
      else if(!this.objImg){
        this.$refs.editDraw.update();
      }

    }
  }
}
</script>

<style scoped>

</style>
