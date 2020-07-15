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
  padding: 8px 8px 8px 50px;
  width: 226px;
  cursor: pointer;
  color:$darkgrey;
  &.router-link-exact-active{
    color:black;
  }
}
</style>