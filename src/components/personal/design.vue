<template>
  <module-tab :work-list = "workList" v-loading="loading"></module-tab>
</template>

<script>
import ModuleTab from "./moduleTab";
import {getUserDesign} from "../../api/workAPI";
export default {
  name: "design",
  components: {ModuleTab},
  data: function (){
    return {
      workList: null,
      loading: true
    }
  },
  mounted() {
    this.loading = true;
console.log("mount design")
    var id = this.$store.state.phone;
    var visitorId = this.$store.state.spaceUid;
    var isVisitor = true;
    if(id == visitorId)
      isVisitor = false
    let _this = this;
    getUserDesign({
      id: visitorId,
      isVisitor: isVisitor
    }).then(res => {
      console.log(res.data.data)
      _this.workList = res.data.data;
      _this.loading=false
    })

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
