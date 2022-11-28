<template>
  <button
    class="ats-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :type="nativeType"
    :class="[
      type ? 'ats-button--' + type : '',
      buttonSize ? 'ats-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'w-full': expand,
        'h-full': expand,
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<style scoped>
@import "./ats-btn.css";
</style>
<script>
export default {
  name: 'AtsButton',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    expand: Boolean,  // 是否自动扩张占满空间
  },

  computed: {
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },
    buttonDisabled() {
      return this.$options.propsData.hasOwnProperty('disabled') ? this.disabled : (this.elForm || {}).disabled;
    }
  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
};
</script>
