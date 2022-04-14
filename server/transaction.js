const { createInvoice } = require("ln-service");

module.exports = class Transaction {
  _buyer;
  _seller;
  _cartitems;
  _amountInSats = 0;

  constructor(buyer, seller, cartitems) {
    this._buyer = buyer;
    this._seller = seller;
    this.cartitems = cartitems;

    this.cartitems.map(
      (item) => (this._amountInSats += item.qty * item.product.price)
    );
  }

  async getInvoiceForBuyerAsync(manager) {
    //raise invoice from system for buyer
    //generate invoice
    const lnd = await manager.connect();
    try {
      const invoice = await createInvoice({
        mtokens: this._amountInSats.toString(),
        lnd,
      });
      return invoice;
    } catch (error) {
      console.log(error);
    }
    return null;
    // return new Promise(async (resolve, reject) => {
    //   //generate invoice
    //   const invoice = await createInvoice({ tokens: this._amountInSats, lnd });

    //   if (invoice) resolve(invoice);
    //   else reject();
    // });
  }
};
