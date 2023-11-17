<template>
  <div
    class="ats-card border-2 rounded-lg font-sans"
    @click="handleClick"
  >
    <div class="p-1">
      <slot name="cover-image"/>
    </div>
    <div class="px-2 py-1 flex">
      <div class="grow">
        <p class="font-bold" style="text-align: left; color: #000">
          <slot name="title"/>
        </p>
        <p class="text-sm my-1" style="text-align: left; color: #000">
          <slot name="publisher"/>
        </p>
      </div>
      <div class="shrink">
        <slot name="side-attach"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AtsCommunityCard",
  methods: {
    handleClick() {
      this.$emit('onClick');
    }
  }
}
</script>

<style scoped>
div.ats-card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.6s cubic-bezier(0,0,0.2,1);
}
div.ats-card:hover {
  cursor: pointer;
  transform: translateY(-3%);
  border-color: var(--base-primary);
  box-shadow: 0 20px 25px -5px var(--base-primary-shadow), 0 8px 10px -6px var(--base-primary-shadow);
}
</style>
