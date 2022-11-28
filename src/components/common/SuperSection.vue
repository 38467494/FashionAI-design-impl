<template>
  <div>
    <div class="intro">
      <div class="flex" :class="'flex-row' + (reverse ? '-reverse' : '')">
        <div class="basis-5/12 px-10">
          <div
            class="rounded-xl"
            style="background-color: rgba(53, 80, 246, 1);
                   max-width: max-content"
          >
            <div
              class="pic-on-colorblk rounded-xl shadow-2xl overflow-hidden"
              style="transform: translate(-13%, -4%)"
            >
              <img
                :src="intro.img"
                class="round-lg"
                style="height: 100%; width: auto; max-height: 60vh"
              />
            </div>
          </div>
        </div>
        <div class="basis-7/12" :class="reverse ? 'pr-16 pl-0' : 'pl-16 pr-0'">
          <div class="intro-text flex items-start flex-col gap-y-8">
            <section class="tracking-wider text-black mb-4">
              <h1 class="font-bold text-4xl italic">{{ intro.title }}</h1>
              <h2 class="font-bold text-3xl italic">{{ intro.subtitle }}</h2>
            </section>
            <section style="min-width: 70%">
              <el-steps :active="1" >
                <template v-for="(stp, idx) in intro.step">
                  <el-step
                    :status="idx == 0 ? 'finish' : 'wait'"
                    :title="'步骤 ' + (idx + 1)"
                    :description="stp"
                  ></el-step>
                </template>
              </el-steps>
            </section>
            <section class="tracking-wider">
              <p
                v-for="cont in intro.content"
                class="text-xl my-3"
                style="color: rgba(82, 82, 82, 1)"
              >
                {{ cont }}
              </p>
            </section>
            <AtsSuperButton @click="changeNav(intro.path)">
              {{ intro.btnText }}
            </AtsSuperButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AtsSuperButton from "./AtsSuperButton";

export default {
  name: "SuperSection",
  components: { AtsSuperButton },
  props: ["intro", "reverse"],
  methods: {
    changeNav: function(str) {
      console.log(str);
      // console.log('/recommendation');
      this.$store.commit("increment", {
        index: str
      });
      this.$router.push(str).then(() => {
        // bugfix: 解决路由跳转后页面位于底部的问题
        window.scrollTo({
          top: 0,
          behavior: "auto"
        });
      });
    }
  }
};
</script>

<style scoped>
/*div.pic-with-colorblk:after {*/
/*  display: block;*/
/*  background-color: ;*/
/*  transform: translate(10%, 10%);*/
/*  content: "";*/
/*}*/
</style>
