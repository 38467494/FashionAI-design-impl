<template>
  <AtsButton type="primary" size="large" plain round
  @click="back2top">
    回到顶部
    <i class="bi bi-arrow-up"></i>
  </AtsButton>
</template>

<script>
import AtsButton from "./AtsButton";
export default {
  name: "AtsBack2TopBtn",
  components: {AtsButton},
  methods: {
    back2top() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }
}
</script>

<style scoped>

</style>
