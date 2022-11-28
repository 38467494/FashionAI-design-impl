<template>
  <div class="dball-bg">
    <div class="dball-blueball">
    </div>
    <div class="dball-purpleball">
    </div>
    <div class="dball-purpleball-tr">
    </div>
  </div>
</template>

<script>
export default {
  name: "GradientBackground"
}
</script>

<style scoped>
.dball-bg {
  background-color: #fff;
  position: fixed;
  top: 0;
  min-height: 100vh;
  min-width: 100vw;
  z-index: -99;
}

.dball-blueball {
  position: absolute;
  top: 1vw;
  left: -4vw;
  z-index: 1;
  border-radius: 50%;
  width: 27vw;
  height: 27vw;
  background: linear-gradient(180deg, #1E3FFF 0%, #2E99F7 45%, #19C2F6 100%);
  opacity: 1;
  filter: blur(40px);
}

.dball-purpleball {
  position: absolute;
  right: -12vw;
  bottom: -2vw;
  width: 44vw;
  height: 44vw;
  border-radius: 50%;
  background: linear-gradient(180deg, #1E3FFF 0%, #BC9AC8 56%, #F0CAC5 100%);
  opacity: 1;
  filter: blur(60px);
}
.dball-purpleball-tr {
  position: absolute;
  top: -28vw;
  right: -6vw;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  background: linear-gradient(0deg, #1E3FFF 0%, #BC9AC8 56%, #F0CAC5 100%);
  opacity: 1;
  filter: blur(60px);
}
</style>
