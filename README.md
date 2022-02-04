# How to use it?

View config.js file and replace values, api key, secret, list of currencies and the amount it has to reach to be sold

Obtenerlas en:
[coinex.com/apikey](https://www.coinex.com/apikey)

```
  export const settings = {
  apikey: "place your api key here",
  secret: "place your secret here",
  coinList: ["COIN"],
  threshold: 1,
};
```

## Execution
In the terminal/cmd

`
  $ node index.js
`

then, go to the browser, and you will be able to see:

**List of coins:**
`
  http://localhost:3000/list
`

**Balance:**
`
  http://localhost:3000/balance
`

**Status:**
`
   http://localhost:3000/coin/COIN-NAME/
`

**Start:**
`
  http://localhost:3000/coin/COIN-NAME/start
`

**Stop**
`
  http://localhost:3000/coin/COIN-NAME/stop
`

