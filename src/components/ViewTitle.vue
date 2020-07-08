<template>
  <div class="ViewTitle">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ViewTitle'
}
</script>

<style scoped lang="scss">
.ViewTitle{
  margin-left: -20px;
  height: 74px;
  padding-left: 40px;
  box-sizing: border-box;
  display: flex;
  background-color: white;
  margin-bottom: 15px;
  >span{
    margin: auto 0;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>