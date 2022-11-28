<template>
  <div>
    <el-dialog :visible.sync="childVisible" width="55%"
               style="min-width: 840px;">
      <template #title>
        <div class="text-left font-bold text-2xl px-5 py-2">{{ title }}</div>
      </template>
      <slot></slot>
      <template #footer>
        <div class="flex items-center justify-end">
          <AtsButton size="medium" type="pink" plain>导入虚拟换装</AtsButton>
          <AtsButton size="medium" type="primary" @click="collectItem" v-if="!collectFlag">收藏</AtsButton>
          <Ats-button size="medium" type="primary" v-else>
            <i class="mr-2 bi bi-check-lg"></i>
            已收藏
          </Ats-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import {saveOneWork} from "../api/workAPI";
import AtsButton from "./common/AtsButton";
export default {
  name: "my-collect-dialog",
  components: {AtsButton},
  props: {
    title: {
      type: String,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false
    },
    collectInfo: {
      type: Function,
      default: null
    }
  },
  data: function (){
    return {
      childVisible: this.visible,  //两个visible，实现双向绑定
      collectFlag: false,   //标志该作品是否被收藏
    }
  },
  watch:{
    visible(){
      this.childVisible = this.visible
    },
    childVisible(){
      this.$emit("update:visible", this.childVisible)
      if(!this.childVisible){
        this.collectFlag=false
      }
    }
  },
  mounted() {
    console.log(this.title)
  },
  methods: {
    //收藏设计作品
    collectItem:async function (){
      let _this = this
      var res =await this.collectInfo()
      if(res == null) return
      if(res.length > 0){
        for(var i=0;i<res.length;i++){
          var single = res[i]
          single["userName"] = this.$store.state.userName
          single["phone"] = this.$store.state.phone
          saveOneWork(single).then( res => {
            console.log("save one work",res)
              _this.$message({
                message: "收藏成功",
                type: "success"
              });
              _this.collectFlag = true;
            })
        }
      }
      else{
        res["userName"] = this.$store.state.userName
        res["phone"] = this.$store.state.phone
        console.log(res)
        saveOneWork(res).then( res => {
          console.log("save one work",res)
            _this.$message({
              message: "收藏成功",
              type: "success"
            });
            _this.collectFlag = true;
          })
      }

    }
  }
}
</script>

