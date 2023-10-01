const express = require("express");
const router = express.Router();
const SupplierService = require("../controllers/supplierController");

router
  .route("/suppliers")
  .post(SupplierService.createSupplier)
  .get(SupplierService.getSuppliers);

router
  .route("/suppliers/:id")
  .get(SupplierService.getSupplierByID)
  .patch(SupplierService.updateSupplier)
  .delete(SupplierService.deleteSupplier);

module.exports = router;
