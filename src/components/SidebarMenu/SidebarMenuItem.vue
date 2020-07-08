<template>
  <router-link tag="div" class="component sidebar-menu-item" v-bind="$attrs">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: 'SidebarMenuItem'
}
</script>

<style lang="scss">
@import "../../style/color.scss";
.sidebar-menu-item{
  box-sizing: border-box;
  padding-left: 30px;
  padding-top: 5px;
  padding-bottom: 7px;
  width: 226px;
  height: 28px;
  border-bottom-right-radius: 100px;
  border-top-right-radius: 100px;
  font-size: 16px;
  margin-bottom: 8px;
  cursor: pointer;
}
.router-link-active.sidebar-menu-item{
  background-color: $lightgrey;
}
</style>