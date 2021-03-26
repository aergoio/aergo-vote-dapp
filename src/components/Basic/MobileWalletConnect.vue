<template>
  <div class="bg">
    <div class="mobile-wallet-connect">
      <div class="header">
        <span>QRCODE</span>
        <span @click="close()">X</span>
      </div>
      <div class="qrcode">
        <img :src="qr" alt="QRCode" v-if="!!$store.state.QRdata" />
        <div class="loading" v-else />
      </div>
      <div class="button-wrapper">
        <button class="confirm" @click="close()">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'MobileWalletConnect',
  methods: {
    close() {
      this.$store.commit('setQRPopupOpen', false);
      this.$store.commit('setQRData', null);
    },
    confirm() {
      close();
    },
    cancel() {
      close();
    }
  },
  data() {
    return {
      qr: null,
      popupHover: false
    };
  },
  async created() {
    this.qr = await QRCode.toDataURL(this.$store.state.QRdata || '...');
  },
  components: {}
};
</script>

<style lang="scss">
.bg {
  z-index: 900;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  .header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.4em;

    span:nth-child(2) {
      cursor: pointer;
    }
  }

  .mobile-wallet-connect {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    display: flex;
    background-color: white;
    width: 400px;
    height: 600px;
    border-radius: 3px;
    box-shadow: 0 3px 4px 0 rgb(34 34 34 / 5%);
    padding: 20px;
    flex-flow: column;

    .qrcode {
      flex: 1;
      display: flex;

      img {
        margin: auto;
        width: 100%;
        image-rendering: pixelated;
      }
    }

    .button-wrapper {
      bottom: 0;
      display: flex;
      width: 100%;
      box-sizing: border-box;

      button {
        flex: 1;
        height: 3em;
        border: none;
        border-radius: 1.5em;
        color: white;
        font-weight: bold;

        + button {
          margin-left: 1em;
        }
      }

      .confirm {
        background-color: var(--color-primary);
      }

      .cancel {
        background-color: black;
      }
    }
  }

  @keyframes load {
    0% {
      transform: rotateZ(0);
    }
    //50%{transform: rotateZ(180deg)}
    100% {
      transform: rotateZ(360deg);
    }
  }

  .loading {
    width: 20px;
    height: 20px;
    border: 5px solid gray;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: 3s linear 10ms infinite load;
    margin: auto;
  }
}
</style>
