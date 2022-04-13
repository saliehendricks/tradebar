const { authenticatedLndGrpc } = require("lightning");
const { createInvoice, subscribeToInvoices } = require("ln-service");
//const { createHash, randomBytes } = require("crypto");
//const { createHodlInvoice, settleHodlInvoice } = require("ln-service");
//const { subscribeToInvoice } = require("ln-service");
//const randomSecret = () => randomBytes(32);

//import authenticatedLndGrpc from "lightning";
//import createInvoice from "ln-service";
//import { createHash, randomBytes } from ("crypto");
//import { createHodlInvoice, settleHodlInvoice } from ("ln-service");
//import { subscribeToInvoice } from ("ln-service");
//const randomSecret = () => randomBytes(32);

module.exports = class Transaction {
  _buyer;
  _seller;
  _product;
  _amountInSats = 0;
  _quantityPurchased = 0;
  //   _onProgressChange = new Promise();
  //   _onInvoiceRaised = new Promise();
  //   _onSuccessTransaction = function () {};

  constructor(
    buyer,
    seller,
    product,
    amountInSats = "1000 sats",
    quantityPurchased
  ) {
    this._buyer = buyer;
    this._seller = seller;
    this._product = product;
    this._amountInSats = amountInSats;
    this._quantityPurchased = quantityPurchased;
  }

  async startAsync() {
    //assume setup channel between purchaser and system | buyer and system on creation of accounts
    return new Promise(function (resolve, reject) {
      //get connection to lightning endpoint
      const { lnd } = authenticatedLndGrpc({
        cert: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNKekNDQWN5Z0F3SUJBZ0lRRmxlRTFXelA4WjVJb0txWW00clNqekFLQmdncWhrak9QUVFEQWpBeE1SOHcKSFFZRFZRUUtFeFpzYm1RZ1lYVjBiMmRsYm1WeVlYUmxaQ0JqWlhKME1RNHdEQVlEVlFRREV3VmpZWEp2YkRBZQpGdzB5TWpBME1UQXdOekUzTWpSYUZ3MHlNekEyTURVd056RTNNalJhTURFeEh6QWRCZ05WQkFvVEZteHVaQ0JoCmRYUnZaMlZ1WlhKaGRHVmtJR05sY25ReERqQU1CZ05WQkFNVEJXTmhjbTlzTUZrd0V3WUhLb1pJemowQ0FRWUkKS29aSXpqMERBUWNEUWdBRVFCYkxiYjBiVEdUczZZZkhmUlVacWxtamVRQWRDRmxXWXlzOVkvd1RSS0g1UldySgpKTzJzQy9PRnd4WjkzS2VuT1FxVVdGK1RyOVVUUnBHT3ZheEFyNk9CeFRDQndqQU9CZ05WSFE4QkFmOEVCQU1DCkFxUXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUhBd0V3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFkQmdOVkhRNEUKRmdRVTllVkpueGwwMXY2Uk9LeDFkSnJTc1dzNXhSRXdhd1lEVlIwUkJHUXdZb0lGWTJGeWIyeUNDV3h2WTJGcwphRzl6ZElJRlkyRnliMnlDRG5CdmJHRnlMVzR4TFdOaGNtOXNnZ1IxYm1sNGdncDFibWw0Y0dGamEyVjBnZ2RpCmRXWmpiMjV1aHdSL0FBQUJoeEFBQUFBQUFBQUFBQUFBQUFBQUFBQUJod1NzR1FBQ01Bb0dDQ3FHU000OUJBTUMKQTBrQU1FWUNJUURYRWxCckpTQjlhbTZXRlY1UFJTenNyMElPWGZTbm5YVThtWEJLT3psdDBnSWhBSUI4aTJOcApCcUZOYmEzRllTcEhRSjNkUE0yNkxocHorbzcrWTUxL01Ud2MKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
        macaroon:
          "AgEDbG5kAlgDChCzdyrW0Ev3xODiRinHe0gWEgEwGhYKB2FkZHJlc3MSBHJlYWQSBXdyaXRlGhcKCGludm9pY2VzEgRyZWFkEgV3cml0ZRoPCgdvbmNoYWluEgRyZWFkAAAGIH0MChI/oXA7esYfrKTp+XK+6tuswMOF7J5lRDbwL0Dl",
        socket: "127.0.0.1:10003",
      });

      if (lnd) resolve(lnd);
      else reject();
    });

    //save this transaction details and await payment
    //return transactionid
  }

  async getInvoiceForBuyerAsync(lnd, amountInSats) {
    //setup a polling mechanism to check if when invoice is paid

    //raise invoice from system for buyer
    return new Promise(async function (resolve, reject) {
      //generate invoice
      //const secret = randomSecret();
      //const id = sha256(secret);

      const invoice = await createInvoice({ mtokens: amountInSats, lnd });

      if (invoice) resolve(invoice);
      else reject();
    });
  }
};
