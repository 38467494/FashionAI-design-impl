<template>
  <div id="home" class="font-sans">
    <GradientBackground />
    <div class="main">
      <div class="flex mt-12">
        <div class="basis-2/5 grow-0 text-left pl-32">
          <section class="mt-20 mb-4">
            <div
              class="super-title font-sans font-extrabold italic tracking-wider"
            >
              谙图生创意社区
            </div>
            <div
              class="whitespace-nowrap super-title font-sans font-extrabold italic tracking-wider"
            >
              创造、分享、交流、实现
            </div>
          </section>
          <section class="mb-4">
            <div
              class="super-subtitle font-sans font-extrabold italic tracking-tight"
            >
              Towards Intelligent design-AI Generator.
            </div>
            <div
              class="super-subtitle font-sans font-extrabold italic tracking-tight"
            >
              Create, share, communicate and realize.
            </div>
          </section>
        </div>
        <div class="basis-3/5 grow-0">
          <AtsCardCarousel :imgs="carouselImgs" />
        </div>
      </div>
    </div>
<!--    <SimpleInfoCard class="mx-20 my-20 px-28 py-12" round-radius="3xl">-->
<!--      &lt;!&ndash; recommendation &ndash;&gt;-->
<!--      <SuperSection-->
<!--        v-for="intro in introduction"-->
<!--        class="mt-12 mb-32"-->
<!--        :intro="intro"-->
<!--        :reverse="intro.reverse"-->
<!--      />-->
<!--      <div>-->
<!--        <AtsBack2TopBtn />-->
<!--      </div>-->
<!--    </SimpleInfoCard>-->
  </div>
</template>

<script>
import SimpleInfoCard from "./common/SimpleInfoCard";
import GradientBackground from "./common/GradientBackground";
import AtsSuperButton from "./common/AtsSuperButton";
import SuperSection from "./common/SuperSection";
import AtsButton from "./common/AtsButton";
import AtsCardCarousel from "./common/AtsCardCarousel";
import AtsBack2TopBtn from "./common/AtsBack2TopBtn";

export default {
  name: "home",
  components: {
    AtsBack2TopBtn,
    AtsCardCarousel,
    AtsButton,
    SuperSection,
    AtsSuperButton,
    GradientBackground,
    SimpleInfoCard
  },
  created() {
    console.log('check loginName')
    console.log(this.$store.state.loginName)
  },
  data: function() {
    return {
      carouselImgs: [
        "../../static/img/clothe-example/1.webp",
        "../../static/img/clothe-example/2.webp",
        "../../static/img/clothe-example/3.webp",
        "../../static/img/clothe-example/4.webp",
        "../../static/img/recommendation.png"
      ],
      main: "../../static/img/main.jpeg",
      recommendation: "../../static/img/recommendation.png",
      introduction: [
        {
          /*
          img: 图片地址；
          title： 标题
          content： 文字
          path： 按钮要跳转的路由路径
          */
          img: "../../static/img/clothe-example/1.webp",
          title: "探索您的衣橱",
          btnText: "搭配推荐",
          subtitle: "Explore, Discover & Be Inspired",
          reverse: false,
          step: ["选择待推荐分类", "选择输入单品", "查询中", "查询完成"],
          content: [
            "或许您还在为今天出门穿什么而烦恼？",
            "在这里，你可以设计您所喜欢的搭配",
            "也可以寻求AI搭配师的帮助",
            "谙图生，让OOTD变得简单"
          ],
          path: "/recommendation"
        },
        {
          img: "../../static/img/clothe-example/4.webp",
          btnText: "协同设计",
          title: "创造您的唯一",
          subtitle: "Design and Collaborate",
          reverse: true,
          step: ["新建项目", "开始设计", "设计完成"],
          content: [
            "或许您对现有的衣服都不满意？",
            "每个人都是设计师",
            "在这里，您可以创造只属于自己的独一无二的衣服",
            "谙图生，让团队设计变得简单"
          ],
          path: "/collaborate"
        },
        {
          img: "../../static/img/clothe-example/5.jpg",
          btnText: "虚拟换装",
          title: "试穿您的衣服",
          subtitle: "Virtual Try-on",
          reverse: false,
          step: ["选择模特", "选择衣服", "进行换装"],
          content: [
            "或许您在担心挑选的衣服不符合自己的风格？",
            "您就是最好的模特",
            "在这里，您可以看到每件衣服在自己身上的效果",
            "谙图生，让虚拟换装变得简单"
          ],
          path: "/virtual-tryon"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style>
@import "../assets/css/home.css";
</style>
