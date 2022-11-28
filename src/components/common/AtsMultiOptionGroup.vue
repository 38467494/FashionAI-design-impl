<template>
  <div class="flex gap-x-3 mt-2">
    <div 
    class="item px-5 py-1 rounded-xl text-black"
    @click="handleOptionClick(option, idx)"
    :class="activeIdx == idx ? 'active' : 'silent'"
    v-for="(option, idx) in options">
    <span class="emoji" v-html="option.emoji"></span>
      {{ option.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AtsMultiOptionGroup',
  props: ['options'],
  data() {
    return {
      activeIdx: 0,
    }
  },
  methods: {
    handleOptionClick(option, idx) {
      this.activeIdx = idx;
      this.$emit('selected', option)
    }
  }
}
</script>

<style scoped>
.emoji {
  position: relative;
  transform: scale(2.8);
  bottom: 8px;
  margin: 0 10px 3px 2px;
  display: inline-block;
}
.item {
  cursor: pointer;
  transition: all .2s ease-out;
  border: 3px solid transparent;
  font-size: 13px;
}
.item:hover {
  background-color: #fff5d5;
  color: black;
}
.active {
  background-color: #fff5d5;
  border: 3px solid #fbd971;
}
.silent {
  background-color: #f0f0f0;
  color: #858585;
}
</style>
