<template>
  <div style="text-align: center">
    <module-tab :work-list="workList" style="padding: 40px 100px"></module-tab>
  </div>
</template>
<script>
import ModuleTab from "./personal/moduleTab";
import {getAllShareWork} from "../api/workAPI";
export default {
  name: "share",
  components: {ModuleTab},
  data: function (){
    return{
      workList: null,

    }
  },
  mounted: function (){
    getAllShareWork().then(res => {
      console.log("getAllShareWork",res.data.data)
      this.workList = res.data.data
    })
  }
}
</script>
