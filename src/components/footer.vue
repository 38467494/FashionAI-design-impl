<template>
  <div class="myFooter px-32 pb-6 pt-16 txt-in-dark">
    <el-row type="flex" :gutter="30" class="mb-16">
      <el-col :span="6">
          <AtsLogo/>
      </el-col>
      <el-col :span="4">
        <h3 class="text-lg font-bold text-left mb-6">关于我们</h3>
        <p class="txt-in-dark-secondary text-justify text-sm">It is a long established fact that a reader will be distracted by the readable content
          of a page when looking at its lyout. The point of using Lorem Ipsum is that it has a more-or-less normal
          distribution of letters, as opposed to using 'Content here, content here', making it look like readable
          English.</p>
      </el-col>
      <el-col :span="4">
        <h3 class="text-lg font-bold text-left mb-6">团队介绍</h3>
        <p class="txt-in-dark-secondary text-justify text-sm">content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable
          English.</p>
      </el-col>
      <el-col :span="4">
        <h3 class="text-lg font-bold text-left mb-6">科研成果</h3>
        <p class="txt-in-dark-secondary text-justify text-sm">content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable
          English.</p>
      </el-col>
      <el-col :span="4">
        <h3 class="text-lg font-bold text-left mb-6">FAQ</h3>
        <p class="txt-in-dark-secondary text-justify text-sm">content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable
          English.</p>
      </el-col>
    </el-row>
    <div class="mt-8">
      <div class="font-bold text-2xl my-3">哈尔滨工业大学（深圳）</div>
      <div class="mt-2 font-light text-sm">地址：深圳市南山区桃源街道深圳大学城哈尔滨工业大学校区</div>
      <div class="mt-2 font-light text-sm">邮编：518055</div>
      <el-divider/>
    </div>
  </div>
</template>

<script>
import AtsLogo from "./common/AtsLogo";

export default {
  name: "myFooter",
  components: {AtsLogo}
}
</script>

<style>
.myFooter {
  background: var(--base-purple);
}
</style>
