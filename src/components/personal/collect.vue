<template>
  <module-tab :work-list = "workList"></module-tab>
</template>

<script>
import moduleTab from "./moduleTab";
import {getUserShare} from "../../api/shareAPI";
export default {
  name: "collect",
  components: {
    moduleTab
  },
  data: function (){
    return {
      workList: null
    }
  },
  mounted() {
    var id = this.$store.state.spaceUid;
    let _this = this;
    getUserShare(id).then(res => {
      console.log(res.data.data)
      _this.workList = res.data.data;
    })

  },
}
</script>

<style scoped>

</style>
