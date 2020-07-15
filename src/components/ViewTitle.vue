<template>
  <div class="ViewTitle">
    <span>
      <slot></slot>
    </span>
    <slot name="button"></slot>
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
  width: calc(100% + 20px);
  justify-content: space-between;
  >span{
    margin: auto 0;
    font-size: 18px;
    font-weight: bold;
  }
  button{
    height: 30px;
    margin: auto 30px auto 0;
  }
}
</style>