# daodapp

## Project setup
```
git submodule init && git submodule update
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

Configure Aergo node:

> * https://mainnet-api-http.aergo.io
> * https://testnet-api-http.aergo.io

```
VUE_APP_AERGO_NODE=http://192.168.1.244:7845
VUE_APP_CONTRACT_ADDRESS=AmgAWgx2m1jCK5w4eCREkGP1Q9Wc66M4mApihvx2zSxUtxmTPVMv
VUE_APP_AGORA_URL=https://raw.githubusercontent.com/aergoio/agora_testcase/
VUE_APP_SCAN_URL=http://192.168.1.244/transaction/ yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your tests
```
yarn test
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
