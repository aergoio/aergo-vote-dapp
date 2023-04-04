<template>
  <Vertical base="fill" class="vertical">
    <ViewTitle>Home</ViewTitle>
    <slot></slot>
    <Island>
      <p>
        <b>Welcome to the Aergo Voting portal!<br /></b>
        This is a Dapp that allows you to view the current status of votes and
        submit your own votes.
      </p>

      <div class="portal-wrapper">
        <a href="https://swap.aergo.io/">
          <div class="card-top">
            <div class="card-img-wrapper">
              <img
                class="card-img"
                src="../assets/icon/aergo-token-swap.png"
                alt="aergo token swap"
              />
            </div>
          </div>
          <div class="card-bottom">
            <img src="../assets/icon/token-swap-icon.svg" alt="" />
            <img src="../assets/icon/enter-arrow-btn.svg" alt="" />
          </div>
        </a>
        <a href="https://aergoscan.io/">
          <div class="card-top">
            <div class="card-img-wrapper">
              <img
                class="card-img"
                src="../assets/icon/aergo-scan.png"
                alt="aergo scan"
              />
            </div>
          </div>
          <div class="card-bottom">
            <img src="../assets/icon/scan-icon.svg" alt="" />
            <img src="../assets/icon/enter-arrow-btn.svg" alt="" />
          </div>
        </a>
        <a href="https://www.aergo.io/resources">
          <div class="card-top">
            <div class="card-img-wrapper">
              <img
                class="card-img"
                src="../assets/icon/aergo-token-stats.png"
                alt="aergo report"
              />
            </div>
          </div>
          <div class="card-bottom">
            <img src="../assets/icon/report-icon.svg" alt="" />
            <img src="../assets/icon/enter-arrow-btn.svg" alt="" />
          </div>
        </a>
      </div>
    </Island>
  </Vertical>
</template>
<script>
import { Vertical } from '@aergoenterprise/lib-components/src/layout';
import { Island } from '@aergoenterprise/lib-components/src/composite';
import ViewTitle from '../components/ViewTitle';

export default {
  props: ['address'],
  components: {
    Island,
    ViewTitle,
    Vertical
  }
};
</script>
<style scoped lang="scss">
.portal-wrapper {
  display: grid;
  gap: 20px;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  grid-auto-rows: 250px;
  -moz-box-align: start;
  align-items: start;
  padding: 10px;

  a {
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 2px 7px 0 #d1d6e2;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-flow: column;
  }
  .card-top {
    flex: 1;
    .card-img-wrapper {
      width: 210px;
      .card-img {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        object-fit: cover;
      }
    }
  }
  .card-bottom {
    display: flex;
    justify-content: space-between;
  }
}
</style>
