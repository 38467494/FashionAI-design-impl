<template>
  <div>
    <GradientBackground/>
    <div>
      <community-item-show
        :items="items"
        @selectItem="selectItem(arguments)"
        v-if="dataReady"
      >
      </community-item-show>
    </div>

  </div>
</template>

<script>
import GradientBackground from "./common/GradientBackground";
import CommunityItemShow from "./community/communityItemShow";
import {getAllItems, getImageUrl} from "../api/communityAPI";
export default {
  name: "community",
  components: {CommunityItemShow, GradientBackground},
  data: function (){
    return{
      items: [],
      dataReady: false,
    }
  },
  created: async function () {
    await this.load()
  },
  mounted: function () {
    // this.load()
  },
  methods:{
    async load(){
      let _this = this
      await getAllItems({}).then(res=>{
        console.log(res.data.data)
        res.data.data.forEach((i)=>{
          _this.items.push({
            id: i.id,
            publisher: i.publisher,
            publishTime: i.publishTime,
            state: i.state,
            prompt: i.prompt,
            name: i.name,
            browsed: i.browsed,
            liked: i.liked,
            imageId: i.imageID,
            coverUrl: ''
          })
        })
      })
      for(let i = 0; i < this.items.length; i++){
        await getImageUrl({imageId: this.items[i].imageId}).then(res=>{
          _this.items[i].coverUrl = res.data.data.url
        })
      }
      this.dataReady = true
    },
    selectItem: function (msg){
      console.log('msg0:'+msg[0]); // dom节点 没啥用
      console.log('msg1:'+msg[1]); // item在数组中的编号
      console.log('msg2:'+msg[2]); // item在数据库里的id
      // todo 跳转到communityItemDetail界面
      this.$router.push({
        name:'communityItemDetail',
        path: '/communityItemDetail',
        query:{
          itemId: this.items[msg[1]].id
        }
      }).catch(err=>err)
    },
  }
}
</script>

<style>

</style>
