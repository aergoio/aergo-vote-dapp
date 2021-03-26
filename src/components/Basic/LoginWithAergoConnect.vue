<template>
  <div class="component login-with-aergo-connect" :class="{ dark }">
    <span class="icon"><Icon :name="dark ? 'aergo-generic-light' : 'aergo-generic'" :size="46"/></span>
    <span class="label" v-if="!loggedInAddress">
      <span class="label-main" style="text-transform: uppercase">Login</span>
      <span class="label-sub">with Aergo Connect</span>
    </span>
    <span class="label" v-else>
      <span class="label-main">{{ loggedInAddress }}</span>
      <span class="label-sub">Logged in</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Icon} from "@aergoenterprise/lib-components/src/basic";

export default Vue.extend({
  name: 'InputButton',
  props: {
    dark: Boolean,
    loggedInAddress: String,
  },
  components: {
    Icon,
  },
});
</script>

<style lang="scss">
.component.login-with-aergo-connect {
  border-radius: 40px;
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  position: relative;

  .mobile {
    position: absolute;
    bottom: -15px;
    transform: translateX(-50%);
    left: 50%;
    width: fit-content;
  }

  &:hover {
    background-color: rgba(#000, 0.03);
  }

  > .icon {
    border-radius: 100%;
    border: 1px solid #f4f4f4;
    background-color: #fff;
    padding: 1px;
    margin-right: 15px;
  }

  .label {
    display: flex;
    flex-direction: column;
    line-height: 1.4;
    overflow: hidden;

    .label-main {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .label-sub {
      opacity: 0.5;
      font-size: .9em;
    }
  }

  &.dark {
    &:hover {
      background-color: rgba(#000, .3);
    }

    > .icon {
      background-color: #000;
      border-color: #000;
    }

    > .label {
      color: #fff;
    }
  }
}
</style>
