<template>
  <div class="loading">
    <div class="animation"/>
    <span class="text">LOADING...</span>
  </div>
</template>

<script>
    export default {
        name: "Loading"
    }
</script>

<style scoped lang="scss">
  .loading {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(grey, .5);
    display: flex;
    z-index: 999;
    .animation{
      width:12em;
      height:12em;
      border-top:3px solid white;
      border-left:2px solid transparent;
      border-bottom:3px solid white;;
      border-right:2px solid transparent;
      position: fixed;
      top:50%;
      left:50%;
      margin-top: -6em;
      margin-left:-6em;
      border-radius: 50%;
      animation-name: spin;
      animation-duration: 10s;
      animation-iteration-count: infinite;
    }
    .text{
      margin: auto;
      font-size: 1.5em;
      font-weight: bold;
      color:white;
      opacity: .7;
    }
  }
  @keyframes spin {
    0%   {transform: rotateZ(0deg)}
    50%  {transform: rotateZ(179deg)}
    75%  {transform: rotateZ(0)}
    100% {transform: rotateZ(360deg)}
  }

</style>