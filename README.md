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
VUE_APP_AERGO_NODE=http://testnet-api.aergo.io:7845
VUE_APP_CONTRACT_ADDRESS=Amho8hWFGxyJQQ7Uv1G2bNhX1KuvPXsdvchrtMqpyYHJZdD5LuLJ
VUE_APP_AGORA_URL=https://raw.githubusercontent.com/aergoio/agora/
VUE_APP_SCAN_URL=https://testnet.aergoscan.io yarn serve
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
