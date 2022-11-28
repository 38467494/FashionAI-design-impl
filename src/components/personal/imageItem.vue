<template>
<!--  分享区首页图-->
  <AtsCard>
    <template v-slot:image>
      <el-image :src="src" v-if="src" style="border-bottom: #F4F4F5 1px solid; "></el-image>
    </template>
    <template v-slot:title>
      {{title}}
    </template>
    <template v-slot:subtitle>
      <i class="text-gray-400 bi bi-person-circle"></i>
      {{user}}
    </template>
    <template v-slot:side-attach>
      <div class="text-gray-400">
        <i class="bi bi-hand-thumbs-up"></i>
        1.3k
      </div>
      <div class="text-gray-400">
        <i class="bi bi-eye"></i>
        1.3k
      </div>
    </template>
  </AtsCard>
</template>

<script>
import AtsCard from "../common/AtsCard";
export default {
  name: "imageItem",
  components: {AtsCard},
  data: function (){
    return {
      src: null,
      user: null,
      title: null
    }
  },
  props:{
    item: {
      type: Object,
      default: null
    }
  },
  mounted() {
    console.log("imageItem",this.item)
    if(this.item !=null){
      this.src = this.item.coverUrl
      this.user = this.item.userName
      if(this.item.title!= null)
        this.title = this.item.title
      else
        this.title = this.item.category
    }

  },
  methods:{

  }
}
</script>

<style scoped>

</style>
