# lendroid-js

A library to wrapper the lendroid Server and Lendroid Contract API's

## installation

```
yarn add lendroid
// or
npm install --save lendroid
```

for the specific versions check on [Releases](https://github.com/lendroidproject/lendroid-js/releases)

## how to use


```javascript
import { Lendroid } from 'lendroid'

const options = {
  provider: window.web3.currentProvider, // optional
  apiEndpoint: 'http://localhost:8080', // default
  apiLoanRequrests: 'http://localhost:5000', //default
  stateCallback: () => { }, // required: in React, Vue frontend, do run `this.forceUpdate()`
}

const LendroidJS = new Lendroid(options)

// properties
const { loading, orders, exchangeRates, contracts, web3Utils, metamask = {} } = LendroidJS
const { address, network } = metamask;
const { currentWETHExchangeRate, currentDAIExchangeRate } = exchangeRates
const offers = orders.orders
const myLendOffers = orders.myOrders.lend
const myBorrowOffers = orders.myOrders.borrow

// methods
const methods = {
  onCreateOrder: LendroidJS.onCreateOrder,
  onWrapETH: LendroidJS.onWrapETH,
  onAllowance: LendroidJS.onAllowance,
  getOffers: LendroidJS.fetchOrders,
  getPositions: LendroidJS.onFetchPositions,
  onPostLoans: LendroidJS.onPostLoans,
  onFillLoan: LendroidJS.onFillLoan,
  onClosePosition: LendroidJS.onClosePosition,
  onTopUpPosition: LendroidJS.onTopUpPosition,
  onLiquidatePosition: LendroidJS.onLiquidatePosition,
  onFillOrderServer: LendroidJS.onFillOrderServer,
  onDeleteOrder: LendroidJS.onDeleteOrder,
  onCancelOrder: LendroidJS.onCancelOrder,
}

methods.onWrapETH(amount, operation === 'Wrap')
```

## how to develop

- First clone repository and install dependencies via Yarn(`yarn`) or NPM(`npm install`)

  via HTTPS - `git clone https://github.com/lendroidproject/lendroid-js.git`

  or SSH - `git clone git@github.com:lendroidproject/lendroid-js.git`

- On UI, update `package.json` to use custom library as follow and install dependencies via Yarn(`yarn`) or NPM(`npm install`)

  ```
  "dependencies": {
    ...
    "lendroid": "../lendroid-js",
    ...
  }
  ```

- To update library, go to `lendroid-js` and run `tsc`

- Copy `dist` folder to `<path-to-ui>/node_modules/lendroid/`

  e.g: `cp -rf ./dist ../reloanr-ui/node_modules/lendroid/`

## relations

- [Reloanr UI](https://github.com/lendroidproject/reloanr-ui)

- [Deployed](https://app.reloanr.com)
