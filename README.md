# NFTmall subgraph

- local testing
```bash
npm run build-data -- --network bsctestnet

npm run codegen
npm run build

npm run create-local
npm run deploy-local
```

- bsc testnet deploy
```bash
npm run build-data -- --network bsctestnet
npm run codegen
npm run build
npm run deploy -- --network bsctestnet
```
