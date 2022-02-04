import express from "express";
import Coinex from "coinex.com";
import { settings } from "./config.js";

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const API_KEY = settings.apikey;
const SECRET = settings.secret;
const coinex = new Coinex(API_KEY, SECRET);

const coinList = settings.coinList; // ["COIN1", "COIN2", "COIN3", "COIN4", ...]

const threshold = settings.threshold;
let interval = [];
const stop = () => {
  for (let i = 0; i < interval.length; i++) {
    clearInterval(interval[i]);
  }
  return {
    status: "success",
  };
};

let results = {
  status: "not started or failed",
  body: {},
};
async function check(coin) {
  coin = coin.toUpperCase();
  interval.push(
    setInterval(() => {
      coinex
        .balance()
        .then((res) => {
          if ((results.status = "running")) {
            let balance = res[coin] == undefined ? 0 : res[coin].available;
            results.body[coin] = coin + " balance: " + balance;
            let pair = coin.toUpperCase() + "USDT";
            if (balance >= threshold) {
              coinex
                .placeMarketOrder(pair, "sell", balance)
                .then((res) => {
                  results.status = "success";
                  results.body[coin] = res;
                  results.status = "success";
                  return {
                    status: "success",
                  };
                })
                .catch((err) => {
                  console.log(err);
                  return {
                    status: "success",
                  };
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          return {
            status: "success",
          };
        });
    }, 2000)
  );
}

app.get("/stop", (req, res) => {
  res.send(stop());
});
app.get("/balance", (req, res) => {
  coinex
    .balance()
    .then((response) => res.send(response))
    .catch((err) =>
      res.send({
        "Codigo de error": err.code,
        Mensaje: err.message,
      })
    );
});
app.get("/list", (req, res) => {
  coinex
    .list()
    .then((response) => res.send(response))
    .catch((err) =>
      res.send({
        "Codigo de error": err.code,
        Mensaje: err.message,
      })
    );
});
app.get("/coin/:id/", (req, res) => {
  let id = req.params.id;
  if (coinList.includes(id)) {
    res.send(results);
  } else {
    res.send({
      status: "error",
      message: "coin not found",
    });
  }
});
app.get("/coin/:id/start", (req, res) => {
  let id = req.params.id;
  if (coinList.includes(id)) {
    let coin = coinList[coinList.indexOf(id)];
    check(coin);
    res.send({
      status: "started",
    });
  } else {
    res.send({
      status: "error",
      message: "coin not found",
    });
  }
});
app.get("/coin/:id/stop", (req, res) => {
  let id = req.params.id;
  if (coinList.includes(id)) {
    stop();
    results.status = "Stopped, not running";
    results.body = "";
    res.send({
      status: "stopped",
    });
  } else {
    res.send({
      status: "error",
      message: "coin not found",
    });
  }
});
