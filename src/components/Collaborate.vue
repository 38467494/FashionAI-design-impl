<template>
    <div id="collaborate">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name:"collaborate",
  mounted() {
    this.$router.push({name:'collaborate-main'}).catch(err=>err);
  }
}
</script>
