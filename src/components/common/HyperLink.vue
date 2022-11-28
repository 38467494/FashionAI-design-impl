<template>
  <a :class="active ? 'active-link' : 'inactive-link'" :href="href"
    target="_blank">
    <slot/>
  </a>
</template>

<script>
export default {
  name: "HyperLink",
  props: {
    href: {
      type: String,
      default: '#',
    },
    active: {
      type: Boolean,
      default: true,
    }
  }
}
</script>

<style scoped>
a.inactive-link {
  cursor: not-allowed;
  color: var(--inactive-text);
  text-decoration: none;
}

a.active-link {
  color: inherit;
  text-decoration: none;
}

a.active-link {
  background:
    linear-gradient(
      to right,
      var(--hyperlink-underline-color-static),
      var(--hyperlink-underline-color-static)
    ),
    linear-gradient(
      to right,
      var(--bgball-blue-linear-start),
      var(--bgball-blue-linear-end)
    );
  background-size: 100% 6px, 0 6px;
  background-position: 100% 100%, 0 100%;
  background-repeat: no-repeat;
  transition: background-size 400ms;
}

a.active-link:hover {
  background-size: 0 6px, 100% 6px;
}
</style>
