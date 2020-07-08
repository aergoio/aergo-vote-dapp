<template>
  <router-link tag="div" class="component sidebar-submenu-item" v-bind="$attrs">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: 'SidebarSubmenuItem'
}
</script>

<style scoped lang="scss">
@import "../../style/color.scss";
.sidebar-submenu-item{
  box-sizing: border-box;
  padding: 4px 4px 4px 50px;
  width: 226px;
  border-radius: 0 100px  100px 0;
  cursor: pointer;
  &.router-link-exact-active{
    background-color: $lightgrey;
  }
}
</style>