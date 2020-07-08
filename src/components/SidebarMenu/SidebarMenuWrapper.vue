<template>
  <div class="component sidebar-menu">
    <div v-for="item in items" :key="item.id">
      <SidebarMenuItem v-bind="item.routeAttrs">{{item.label}}</SidebarMenuItem>
      <SidebarSubmenu v-if="item.subItems"
                      :items="item.subItems"
                      :parentRouteAttrs="item.routeAttrs" />
    </div>
  </div>
</template>

<script>
import SidebarMenuItem from './SidebarMenuItem';
import SidebarSubmenu from './SidebarSubmenu';

export default {
  name: 'SidebarMenuWrapper',
  components:{
    SidebarMenuItem,
    SidebarSubmenu
  },
  props:{
    items:Array
  }
}
</script>

<style scoped lang="scss">
.sidebar-menu{
  margin-top: 65px;
}
</style>