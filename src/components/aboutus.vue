<template>
  <div>


    <GradientBackground/>

    <div style="max-width: 65vw" class="mx-auto">
      <h1 class="cap-h1 my-16 font-bold">项目贡献者</h1>
      <FrostedGlassContentCard class="mx-auto mb-24 mt-6">

        <div id="aboutus">
          <div style="padding:40px">

            <el-row align="middle" gutter="0">
              <template v-for="(item,index) in members">
                <el-col :span="8" style="padding: 10px 0;">
                  <SimpleInfoCard class="mx-4 mb-4 py-1" round-radius="xl">
                    <div style="margin: 30px 0">
                      <el-avatar :size="100" :src="item.img" style="margin: 5px"></el-avatar>
                      <br>
                      <div class="contributor-name">{{ item.name }}</div>
                      <div class="contributor-edu">{{ item.education }}</div>
                      <!--                    <span v-if="item.personalPage == ''">暂无</span>-->
                      <HyperLink :active="item.personalPage != ''" :href="item.personalPage">
                        个人主页
                      </HyperLink>
                    </div>
                  </SimpleInfoCard>

                </el-col>
              </template>
            </el-row>
          </div>


          <br>


        </div>
      </FrostedGlassContentCard>


      <h1 class="cap-h1 my-16 font-bold">相关研究成果</h1>
      <FrostedGlassContentCard class="mx-auto mx-auto mb-24 mt-6">
        <div style="padding: 40px; font-family: var(--font-serif); font-size: 18px">
          <template v-for="(item,index) in publications">
            <div :key="index" style="text-align: left; padding: 0 10px">
              <a :href="item.url" class="paperLink font-bold text-slate-800">{{ item.title }}</a>
              <br>
              <span>{{ item.name }}</span>
              <span> · {{ item.publish }}</span>
            </div>
            <br>

          </template>
        </div>
      </FrostedGlassContentCard>
    </div>


  </div>

</template>

<script>
import GradientBackground from "./common/GradientBackground";
import FrostedGlassContentCard from "./common/FrostedGlassContentCard";
import SimpleInfoCard from "./common/SimpleInfoCard";
import HyperLink from "./common/HyperLink";

export default {
  name: "aboutUs",
  components: {HyperLink, SimpleInfoCard, FrostedGlassContentCard, GradientBackground},
  data: function () {
    return {
      members: [
        {
          name: "张海军",
          education: "博士（教授）",
          personalPage: "https://www.dl2link.com/",
          img: "/static/member/zhanghaijun.jpg"
        },
        {
          name: "李俊劼",
          education: "博士在读",
          personalPage: "",
          img: "/static/member/lijunjie.jpg"
        },
        {
          name: "施鉴洋",
          education: "博士在读",
          personalPage: "https://github.com/CNFightingSjy",
          img: "/static/member/shijianyang.jpg"
        },
        {
          name: "刘琳琳",
          education: "博士",
          personalPage: "",
          img: ""
        },
        {
          name: "闫寒",
          education: "博士在读",
          personalPage: "",
          img: "/static/member/yanhan.jpg"
        },
        {
          name: "周栋梁",
          education: "博士在读",
          personalPage: "",
          img: "/static/member/zhoudongliang.jpg"
        },
        {
          name: "许文健",
          education: "硕士",
          personalPage: "https://github.com/xwj1427698750",
          img: "/static/member/xuwenjian.jpg"
        },
        {
          name: "李国建",
          education: "硕士在读",
          personalPage: "",
          img: "/static/member/liguojian.jpg"
        },
        {
          name: "蔡恭灿",
          education: "硕士在读",
          personalPage: "",
          img: "/static/member/caigongcan.jpg"
        },
        {
          name: "孙慧玥",
          education: "硕士在读",
          personalPage: "",
          img: "/static/member/sunhuiyue.jpg"
        },
        {
          name: "张馨予",
          education: "本科在读",
          personalPage: "",
          img: "/static/member/zhangxinyu.jpg"
        },
        {
          name:"李亚子",
          education: "硕士在读",
          personalPage: "",
          img: "/static/member/liyazi.jpg",
        },
        {
          name:"董明龙",
          education: "硕士在读",
          personalPage: "",
          img: "/static/member/dongminglong.jpg",
        },
        {
          name:"张纯鑫",
          education: "硕士在读",
          personalPage: "",
          img: "/static/member/zhangchunxin.jpg",
        },
      ],
      publications: [
        {
          name: "Yan, Han and Zhang, Haijun and Liu, Linlin and Zhou, Dongliang and Xu, Xiaofei and Zhang, Zhao and Yan, Shuicheng",
          title: "Toward Intelligent Design: An AI-based Fashion Designer Using Generative Adversarial Networks Aided by Sketch and Rendering Generators",
          publish: " IEEE Transactions on Multimedia, 2022",
          url: "https://ieeexplore.ieee.org/abstract/document/9693190"
        },
        {
          name: "Liu, Linlin and Zhang, Haijun and Xu, Xiaofei and Zhang, Zhao and Yan, Shuicheng",
          title: "Collocating Clothes With Generative Adversarial Networks Cosupervised by Categories and Attributes: A Multidiscriminator Framework",
          publish: " IEEE transactions on neural networks and learning systems, 2019",
          url: "https://ieeexplore.ieee.org/abstract/document/8891673"
        },


      ]
    }
  }
}
</script>

<style>
.paperLink:hover {
  text-decoration: underline;
}

.paperLink {
  text-decoration: none;
  /*color: black;*/
}

.contributor-name {
  font-weight: bold;
  margin: 10px 0;
  font-size: 1.3rem;
}

.contributor-edu {
  font-weight: lighter;
  margin: 5px 0 10px 0;
  font-size: 1rem;
}


</style>
