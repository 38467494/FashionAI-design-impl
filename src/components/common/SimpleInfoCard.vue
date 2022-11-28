<template>
  <div class="info-card"
    :class="'rounded-' + roundRadius"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: "SimpleInfoCard",
  props: {
    roundRadius: {
      type: String,
      default: 'sm'
    }
  }
}
</script>

<style scoped>
.info-card {
  /*margin: 10px;*/
  /*padding: 10px;*/
  background: #FFFFFF;
  box-shadow: 0 4px 20px 0 rgba(43, 66, 199, 0.18);
  /*border-radius: 10px 10px 10px 10px;*/
  opacity: 1;
}
</style>
