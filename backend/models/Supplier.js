const mongoose = require("mongoose");

const SupplySchema = mongoose.Schema(
  {
    suppliername: { type: String, required: true },
    supplierCompanyName: { type: String, required: true },
    SupplyItemsname: { type: String, required: true },
    SupplyAmount: { type: Number, required: true },
    SupplyDate: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", SupplySchema);

module.exports = Supplier;
