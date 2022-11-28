<template>
  <div class="flex flex-col gap-y-6 py-2">
    <div class="flex items-baseline gap-x-6">
      <div class="min-w-max text-black">
        <i class="bi bi-journal"></i>
        项目名称
      </div>
      <el-input v-model="form.name" placeholder="输入项目名称"></el-input>
    </div>
    <div class="flex items-baseline gap-x-6">
      <div class="min-w-max text-black">
        <i class="bi bi-journal-text"></i>
        项目简介
      </div>
      <el-input type="textarea" :rows="4" placeholder="输入项目介绍" v-model="form.description"></el-input>
    </div>
    <div class="flex justify-end">
      <AtsButton type="primary" style="width: 180px" @click="submit">创建项目</AtsButton>
    </div>
  </div>
</template>

<script>
import {insertProject} from "../../../api/collaborateAPI";
import AtsButton from "../../common/AtsButton";

export default {
  name: "newProject",
  props:{
    isFromShare: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    AtsButton
  },
  data: function (){
    return {
      uid: -1,
      form: {
        name: "",
        description: ""
      }
    }
  },
  mounted: function(){
    this.uid = this.$store.state.collaborateInfo.uid;
  },
  methods: {
    submit: function (){
      console.log(this.form);
      var project = {
        uid: this.uid,
        name: this.form.name,
        description: this.form.description
      }
      let _this=this;
      insertProject(project).then(res => {
        console.log(res.data);
        _this.$message({
          message: "项目发布成功",
          type: "success"
        })
        _this.$store.commit("changeCollaborateInfo",{
          pid: res.data.id,
          vid: -1,
          version: {
            id: -1,
            canvas: null,
            image: null,
          }
        })
        if(!_this.isFromShare){
          _this.$router.push({
            name: "collaborate-design",
          })
        }
        else{
          _this.$emit("saveVersion")
        }

      });

    }
  }
}
</script>

<style scoped>

</style>
