<template>
  <div class="flex" style="height: 100%;">
    <section class="flex-none border-r p-0" style="min-height: 300px">
      <template v-for="(item, index) in sidenavs">
        <div
          class="ats-sidenav"
          :class="selectedMenuIdx == item.idx ? 'active' : ''"
          @click="handleSelect(item)"
        >
          <div class="flex is-justify-end">
            <i class="bi mr-2 text-xl" :class="'bi-' + item.icon"></i>
            <span class="text-lg">{{ item.text }}</span>
          </div>
        </div>
      </template>
    </section>

    <section class="grow">
      <!-- 这里使用嵌套路由进行页面的跳转 -->
      <router-view></router-view>
    </section>
  </div>
</template>

<style scoped>
@import "../assets/css/ats-sidenav.css";
</style>

<script>
import Match from "./design/match.vue";
export default {
  components: { Match },

  name: "design",
  data() {
    return {
      isCollapse: false,
      selectedMenuIdx: 0,
      sidenavs: {
        match: {
          idx: 0,
          name: "match",
          text: "搭配生成",
          icon: "image-fill",
          path: "/design/match"
        },
        render: {
          idx: 1,
          name: "render",
          text: "渲染生成",
          icon: "tropical-storm",
          path: "/design/render"
        },
        collect: {
          idx: 2,
          name: "collect",
          text: "推荐生成",
          icon: "box2-heart",
          path: "/design/recommend"
        },
        inspire:{
          idx: 3,
          name: "inspire",
          text: "灵感迁移",
          icon: "lightbulb",
          path: "/design/inspire",
        },
        AIcolor:{
          idx: 4,
          name: "AIcolor",
          text: "AI着色",
          icon: "brush",
          path: "/design/aicolor",
        },
        // test:{
        //   idx: 5,
        //   name: "test",
        //   text: "测试页面",
        //   icon: "",
        //   path: "/design/test",
        // }
      }
    };
  },
  mounted: function() {
    // console.log(this.$router.options.routes);
    this.$router.push({ name: "match" }).catch(err => err);
    //   console.log(this.$router.options.routes);
  },

  computed: {
    tagList() {
      let tagValue = [
        this.colorValue,
        this.brandValue,
        this.sleeveValue,
        this.shoulderValue,
        this.legValue,
        this.neckValue,
        this.styleValue
      ].concat(this.otherValue);
      // temp += this.otherValue;
      let tagList = [];
      for (let value of tagValue) {
        if (value != "") {
          tagList = tagList.concat(value);
        }
      }
      return tagList;
    },
    describeText() {
      let objectiveText = "Womens Fashion";
      let tagString = this.otherValue.join(" ");
      let textList = [
        this.radio,
        this.colorValue,
        this.sleeveValue,
        this.shoulderValue,
        this.legValue,
        this.neckValue,
        this.styleValue,
        tagString
      ];
      for (let text of textList) {
        if (text != "") {
          objectiveText += " ";
          objectiveText += text;
        }
      }
      if (
        this.radio == "Clothing Jeans" ||
        this.radio == "Clothing Pants" ||
        this.radio == "Clothing Shorts"
      ) {
        objectiveText = objectiveText + " Trousers";
      }
      if (this.brandValue != "") {
        objectiveText = objectiveText + " by " + this.brandValue;
      }
      return objectiveText;
    }
  },

  methods: {
    //某个tab中某张图片被选中，出发该函数，需要修改元素的className和保存id
    selectCloth: function(msg) {
      var dom = msg[0];
      var id = msg[1];
      if (this.selectClothDOM != null) {
        this.selectClothDOM.className = "img-div";
      }
      dom.className = "img-div-selected";
      this.selectClothDOM = dom;

      this.selectedClothId = id;
    },

    handleSelect: function(item) {
      // console.log('select', index);
      // console.log(this.selectedMenu);
      if (item.idx == this.selectedMenuIdx) return;
      else {
        this.selectedMenuIdx = item.idx;
        this.$router.push({ path: item.path });
      }
      // if(index == this.selectedMenu)  return;
      // else{
      //   this.selectedMenu = index;
      // }
      //   if(index == 0)  {
      //       this.$router.push({name:'match'});
      //   }
      //   else if(index==1){
      //       this.$router.push({name:'render'});
      //   }
      //   else if(index==2){
      //       this.$router.push({name:'recommend'});
      //   }
    },

    //侧边栏行为

    collapseOpen() {
      this.isCollapse = false;
    },
    collapseClose() {
      this.isCollapse = true;
    },

    //按钮行为
    submit() {
      if (this.radio == "") {
        this.$message({
          showClose: true,
          message: "生成类别是必选的！",
          type: "error"
        });
      } //检测原图像是否已经选择待处理
      else {
        this.hasSubmit = true;
        console.log(this.describeText, this.tagList);
      }
    },
    sure() {
      this.hasSubmit = false;
      // this.radio = '';
      // this.colorValue = '';
      // this.brandValue = '';
      // this.sleeveValue = '';
      // this.shoulderValue = '';
      // this.legValue = '';
      // this.neckValue = '';
      // this.styleValue = '';
      // this.otherValue = [];
      // 清除图像选择
    },

    //监视
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
