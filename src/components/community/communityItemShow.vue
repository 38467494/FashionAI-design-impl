<template>
  <div style="overflow: auto">
    <el-row type="flex" style="justify-content: space-around;margin: 100px">
      <template v-for="(item,index) in pageItems">
        <el-col type="flex" :key="index" :span="width">
          <template v-for="(subItem, subIndex) in item">
            <el-row :key="subIndex" style="margin-top: 30px">
              <community-item
                v-bind:item="subItem"
                @select="select($event, subItem, subIndex*cols + index)"
              >
              </community-item>
            </el-row>
          </template>
        </el-col>
      </template>
    </el-row>

  </div>
</template>

<script>
import CommunityItem from "./communityItem";
export default {
  name: "communityItemShow",
  components: {CommunityItem},
  props:{
    items:{
      type: Array,
      default: [],
    },
    index:{
      type:Number,
      default:-1,
    },
    height:{
      type:String,
      default:"height: 500px;"
    },
  },
  data: function(){
    return {
      width: 4, // 一行宽度是24，选择5是为了放5列
      selected: null,  //存放被选中的dom元素，用于样式的修改
      cols:5,
      pageItems:[],

      isActive:"img-div-selected",

    }
  },
  mounted: function () {
    this.divideCols();
  },
  methods:{
    divideCols: function (){
      for(var i = 0; i < this.cols ;i++){
        var colArr = [];
        for(var j = i; j < this.items.length; j=j+this.cols){
          colArr.push(this.items[j]);
        }
        this.pageItems.push(colArr);
      }
      // console.log('pageItems:');
      // console.log(this.pageItems);
    },
    select:function (e, item, index){
      console.log("click?");
      this.$emit("selectItem",e, index, item.id);
    }
  }
}
</script>

<style scoped>
.show-card {
  margin-right: 1.5rem; /* 24px */
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-width: 1px;
  border-radius:  0.5rem; /* 8px */;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all .2s ease-out;
}
.show-card:hover {
  cursor: pointer;
  border-width: 2px;
  border-color: var(--base-primary);
  border-radius:  0.5rem; /* 8px */;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.show-card.img-div-selected {
  border-width: 2px;
  border-color: var(--base-primary);
  border-radius:  0.5rem; /* 8px */;
  background-color: var(--base-primary-opac);
  box-shadow: 0 20px 25px -5px var(--base-primary-shadow), 0 8px 10px -6px var(--base-primary-shadow);
}
</style>
