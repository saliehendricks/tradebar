const { authenticatedLndGrpc } = require("lightning");
const {
  subscribeToInvoices,
  getChannelBalance,
  getWalletInfo,
} = require("ln-service");
const { EventEmitter } = require("events");
//const SocketEvents = require("../shared/types/types");
module.exports = class LndNodeManager extends EventEmitter {
  _connectedLnd;
  constructor(options) {
    super(options);
  }

  /*
  Returns a promised LND connected node instance
  */
  async connect() {
    return new Promise((resolve, reject) => {
      if (this._connectedLnd) {
        console.log("LND Node connected and returned");
        resolve(this._connectedLnd);
        return;
      }
      //get connection to lightning endpoint
      const { lnd } = authenticatedLndGrpc({
        cert: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNKekNDQWN5Z0F3SUJBZ0lRRmxlRTFXelA4WjVJb0txWW00clNqekFLQmdncWhrak9QUVFEQWpBeE1SOHcKSFFZRFZRUUtFeFpzYm1RZ1lYVjBiMmRsYm1WeVlYUmxaQ0JqWlhKME1RNHdEQVlEVlFRREV3VmpZWEp2YkRBZQpGdzB5TWpBME1UQXdOekUzTWpSYUZ3MHlNekEyTURVd056RTNNalJhTURFeEh6QWRCZ05WQkFvVEZteHVaQ0JoCmRYUnZaMlZ1WlhKaGRHVmtJR05sY25ReERqQU1CZ05WQkFNVEJXTmhjbTlzTUZrd0V3WUhLb1pJemowQ0FRWUkKS29aSXpqMERBUWNEUWdBRVFCYkxiYjBiVEdUczZZZkhmUlVacWxtamVRQWRDRmxXWXlzOVkvd1RSS0g1UldySgpKTzJzQy9PRnd4WjkzS2VuT1FxVVdGK1RyOVVUUnBHT3ZheEFyNk9CeFRDQndqQU9CZ05WSFE4QkFmOEVCQU1DCkFxUXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUhBd0V3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFkQmdOVkhRNEUKRmdRVTllVkpueGwwMXY2Uk9LeDFkSnJTc1dzNXhSRXdhd1lEVlIwUkJHUXdZb0lGWTJGeWIyeUNDV3h2WTJGcwphRzl6ZElJRlkyRnliMnlDRG5CdmJHRnlMVzR4TFdOaGNtOXNnZ1IxYm1sNGdncDFibWw0Y0dGamEyVjBnZ2RpCmRXWmpiMjV1aHdSL0FBQUJoeEFBQUFBQUFBQUFBQUFBQUFBQUFBQUJod1NzR1FBQ01Bb0dDQ3FHU000OUJBTUMKQTBrQU1FWUNJUURYRWxCckpTQjlhbTZXRlY1UFJTenNyMElPWGZTbm5YVThtWEJLT3psdDBnSWhBSUI4aTJOcApCcUZOYmEzRllTcEhRSjNkUE0yNkxocHorbzcrWTUxL01Ud2MKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
        macaroon:
          "AgEDbG5kAvgBAwoQtXcq1tBL98Tg4kYpx3tIFhIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg+DaETDBNcmA6FKBNdNHsnPMh3moumG5qqqP/x7ciS88=",
        socket: "127.0.0.1:10003",
      });

      console.log("LND Node connection pending...");
      if (lnd) {
        console.log("LND Node connection on the line");
        this._connectedLnd = lnd;
        this.subscribeToPaidInvoicesAsync(lnd);
        resolve(lnd);
      } else reject();
    });
  }

  async getBalance() {
    const lnd = await this.connect();
    try {
      let bal = await getChannelBalance({ lnd });
      return bal;
    } catch (error) {
      console.log(error);
    }
  }

  async getWallet() {
    const lnd = await this.connect();
    try {
      const walletinfo = await getWalletInfo({ lnd });
      return walletinfo;
    } catch (error) {
      console.log(error);
    }
  }

  subscribeToPaidInvoicesAsync(lnd) {
    const sub = subscribeToInvoices({ lnd });
    console.log("...subscribed to lnd invoices");
    //const [lastUpdatedInvoice] = await once(sub, "invoice_paid");
    sub.on("invoice_updated", (invoice) => {
      console.log("...invoice event triggered" + JSON.stringify(invoice));
      if (invoice.is_confirmed) {
        //const hash = invoice.rHash.toString("base64");
        //const amount = invoice.amtPaidSat;
        console.log("...invoice-paid id: " + JSON.stringify(invoice.id));
        this.emit("invoice-paid", invoice);
      }
    });
  }
};
