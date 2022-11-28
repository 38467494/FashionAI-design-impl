<template>
  <div>
    <h4>项目简介</h4>
    <template v-for="(item,index) in project">
      <div :key="index" style="text-align: left; padding: 0px 10px">
        <p style="font-weight: bold;"> {{item.label}} : </p>
        <p> {{item.val}}</p>
      </div>
    </template>
  </div>
</template>

<script>
import {getProjectbyId} from "../../../api/collaborateAPI";

export default {
  name: "projectDetail",
  props: {
    pid: {
      type: Number,
      default: -1,
    }
  },
  data: function (){
    return {
      project: [
        {
          label: "项目名称" ,
          val: ""
        },
        {
          label: "设计者",
          val: ""
        },
        {
          label: "简介",
          val: ""
        },
      ]
    }
  },
  mounted() {
    console.log("projectDetail ",this.pid);
    var pid = this.pid;
    let _this= this;
    getProjectbyId({
      id:pid
    }).then(res =>{
      console.log("process project", res.data);
      var project = res.data;
      console.log(_this.project);
      _this.project[0].val = project.name;
      _this.project[1].val = project.principle_name;
      _this.project[2].val = project.description;
    })
  }
}
</script>

<style scoped>

</style>
