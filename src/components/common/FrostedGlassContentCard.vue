<template>
    <div class="frosted-glass-card">
      <slot/>
    </div>

</template>

<script>
export default {
  name: "FrostedGlassContentCard",
  props: {
  }
}
</script>

<style scoped>
/*.base-space {*/
/*  max-width: 65vw;*/
/*}*/
.frosted-glass-card {
  background: rgba(255, 255, 255, 0.27);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.7px);
  -webkit-backdrop-filter: blur(5.7px);
  border: 1px solid rgba(255, 255, 255, 0.82);
}
</style>
