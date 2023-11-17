<template>
  <div>

    <el-row type="flex" class="mb-6">

      <template v-for="(item,index) in typeList">

        <AtsButton
          round
          :type="getType(index)"
          @click="handleClick(index)"
        >
          {{ item.label }}
        </AtsButton>

      </template>

    </el-row>


    <div style="text-align: center" v-if="checkEmpty(tabList)">
      <p style="color:gray;">暂无数据</p>
    </div>

    <!--  Need 'fresh' to manually trigger rerendering of Vue  -->
    <div class="flex" :key="fresh">
      <div class="basis-1/4 flex flex-col" v-for="(col,index) in tabList">
          <div class="" v-for="(item, idx) in col" :key="index">
            <div @click="goToInner(item.id)">
              <image-item
                v-bind:item="item"
                :key="idx"
                class="my-3 mr-6"
              ></image-item>
            </div>
          </div>
      </div>
    </div>


  </div>


</template>

<script>
import imageItem from "./imageItem";
import AtsButton from "../common/AtsButton";
export default {
  name: "moduleTab",
  components: {
    AtsButton,
    imageItem
  },
  props: {
    workList: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {
      imageType: 'all',
      activeIndex: 0,
      typeList: [
        {
          label: "全部",
          name: "all"
        },
        {
          label: "搭配推荐",
          name: "recommendList"
        },
        {
          label: "虚拟换装",
          name: "vtoList"
        },
        {
          label: "协同设计",
          name: "collaborateList",

        },
        {
          label: "搭配生成",
          name: "mmclist"
        },
        {
          label: "渲染生成",
          name: "renderList"
        },
        {
          label: "推荐生成",
          name: "outfitList"
        },
        {
          label: "灵感迁移",
          name: "inspireList"
        },
        {
          label: "AI着色",
          name: "aiColorList"
        },
      ],
      tabList: null,
      allList: null,
      fresh: 0,
      isEmpty: false
    }
  },
  watch: {
    workList() {
      this.allList = []

      // push every inner single item of workList{[]} into allList[]
      for (let i in this.workList) {
        let arr = this.workList[i];
        this.allList.push(...arr);
      }

      // split allList[] into cols
      this.allList = this.processList(this.allList)


      // split each prop (an array) of workList{} into cols
      for (let i in this.workList) {
        let arr = this.workList[i];
        this.workList[i] = this.processList(arr)
      }

      if (this.imageType == "all") {
        this.tabList = this.allList
      }
    }
  },
  methods: {
    processList: function (works) {
      //修改List的格式，使得能够按列显示
      let col = 4;

      var list = []
      for (let j = 0; j < col; j++) {
        list.push([])
      }
      for (let j = 0; j < works.length; j++) {
        list[j % col].push(works[j])
      }

      return list;
    },
    handleClick: function (index) {
      this.imageType = this.typeList[index].name
      console.log("切换："+ this.imageType);
      this.activeIndex = index
      this.fresh += 1
      if (this.imageType !== "all")
      {
        this.tabList = this.workList[this.imageType];
        console.log(this.tabList);
      }
      else
      {
        this.tabList = this.allList
      }


    },
    goToInner: function (id) {
      // console.log("goToInner", id)
      this.$store.commit("changeShareInnerId", id)
      this.$router.push({
        path: "/share-inner",
      })
    },
    getType: function (index) {
      if (index == this.activeIndex)
        return "primary"
      else
        return "silent"
    },
    //判断当前list是否为空
    //因为都划分成了5列，所以即使没有元素，也不能用list.length直接判断
    checkEmpty: function (list) {
      var isEmpty = true
      if (list == null)
        return isEmpty
      for (var i = 0; i < list.length; i++) {
        if (list[i].length > 0) {
          isEmpty = false
        }
      }
      return isEmpty
    }
  }

}
</script>

<style scoped>
.button-click {
  background: #409EFF;
  color: white;
}

.el-button {
  padding: 10px 15px;
  border: 0px;
}
</style>
