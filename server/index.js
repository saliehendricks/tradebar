const express = require("express");
const expressWs = require("express-ws");
const Transaction = require("./transaction");
const LndNodeManager = require("./lndNodeManager");
const SocketEvents = require("../shared/types/types");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;
const { app } = expressWs(express());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const products = [
  {
    id: "1",
    name: "lemons",
    description: "Freshly picked lemons from my garden",
    url: "/img/lemons.png",
    price: 100,
    priceDescription: "each",
    instock: 50,
    sellby: "2022-06-30",
    location: { latitude: 34.15, longitude: 19.24 },
  },
  {
    id: "2",
    name: "granadilla",
    description: "Come pick them yourself, I have about 200 ready to go.",
    url: "/img/granadilla.png",
    price: 200,
    priceDescription: "each",
    instock: 20,
    sellby: "2022-05-30",
    location: { latitude: 34.15, longitude: 19.24 },
  },
  {
    id: "3",
    name: "Avocados",
    description: "From my 40 year old avo tree",
    url: "/img/avos.png",
    price: 350,
    priceDescription: "each",
    instock: 30,
    sellby: "2022-06-30",
    location: { latitude: 34.15, longitude: 19.24 },
  },
];

//Setup Lnd Node
const _manager = new LndNodeManager();
let lnd = {};
_manager.connect().then((result) => {
  lnd = result;
});

//
// Configure Websocket
//
app.ws("/api/events", (ws) => {
  // when a websocket connection is made, add listeners for invoices
  const paymentsListener = (info) => {
    const event = { type: "invoice-paid", data: info };
    ws.send(JSON.stringify(event));
  };

  _manager.on("invoice-paid", paymentsListener);

  // remove listeners when the socket is closed
  ws.on("close", () => {
    _manager.off("invoice-paid", paymentsListener);
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "TradeBar v0.1!" });
});

app.get("/walletbalance", async (req, res) => {
  const balance = await _manager.getBalance();
  res.json({ balance });
});

app.get("/wallet", async (req, res) => {
  const wallet = await _manager.getWallet();
  res.json({ wallet });
});

app.get("/search", (req, res) => {
  res.json({ products });
});

app.post("/buy", async (req, res) => {
  const buyer = {};
  const seller = {};
  const cartitems = req.body.cartitems;
  let tx = new Transaction(buyer, seller, cartitems);
  const invoice = await tx.getInvoiceForBuyerAsync(_manager);
  res.json({ success: true, invoice });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
