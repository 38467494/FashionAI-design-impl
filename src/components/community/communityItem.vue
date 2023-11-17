<template>
  <AtsCard
    @onClick="onClick"
  >
    <template v-slot:image>
      <el-image :src="src" v-if="src" style="border-bottom: #F4F4F5 1px solid; "></el-image>
    </template>
    <template v-slot:title>
      {{title}}
    </template>
    <template v-slot:subtitle>
      <i class="text-gray-400 bi bi-person-circle"></i>
      {{publisher}}
    </template>
    <template v-slot:side-attach>
      <div class="text-gray-400">
        <i class="bi bi-hand-thumbs-up"></i>
        {{liked}}
      </div>
      <div class="text-gray-400">
        <i class="bi bi-eye"></i>
        {{browsed}}
      </div>
    </template>
  </AtsCard>
</template>

<script>
import AtsCard from "../common/AtsCard";
export default {
  name: "communityItem",
  components: {AtsCard},
  data: function (){
    return {
      src: null,
      publisher: null,
      title: null,
      liked: null,
      browsed: null,
    }
  },
  props:{
    item: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // console.log("imageItem",this.item)
    if(this.item !=null){
      this.src = this.item.coverUrl
      this.publisher = this.item.publisher
      this.title = this.item.name
      this.liked = this.item.liked
      this.browsed = this.item.browsed
    }
  },
  methods:{
    onClick:function (){
      this.$emit('select');
    }
  }
}
</script>

<style scoped>

</style>
