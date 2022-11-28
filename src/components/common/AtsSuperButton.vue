<template>
  <button
    class="ats-super-btn font-bold px-8 py-3 text-2xl italic tracking-widest"
    @click="handleClick"
  >
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<style scoped>
.ats-super-btn {
  border-radius: 58px;
  box-shadow: 0 10px 18px 0 rgba(53,80,246,0.42);
  white-space: nowrap;
  cursor: pointer;
  background: linear-gradient(119deg, #3550F6 0%, #23B8F6 100%);;
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  transition: all 0.6s;
}

.ats-super-btn:hover {
  opacity: 0.8;
  transform: translateY(-10%);
}

</style>
<script>
export default {
  name: 'AtsSuperButton',

  props: {

  },

  computed: {

  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
};
</script>
