<template>
  <div class="component sidebar-submenu">
    <SidebarSubmenuItem v-for="item in items"
                        :key="item.id"
                        v-bind="item.routeAttrs">{{item.label}}</SidebarSubmenuItem>
  </div>
</template>

<script>
import SidebarSubmenuItem from './SidebarSubmenuItem';

export default {
  name: 'SidebarSubmenu',
  components:{
    SidebarSubmenuItem
  },
  props:{
    items:Array
  }
}
</script>

<style scoped>
.sidebar-submenu{
  display: none;
}
.router-link-active + .component.sidebar-submenu {
  display: block;
}
</style>