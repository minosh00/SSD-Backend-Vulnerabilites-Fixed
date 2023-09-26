

const express = require("express");
const router = express.Router();

const {getSupplierById,createSupplier,updateSupplierByID,getAllSupplier,RemoveSupplier} = require("../Controllers/Supplier.controller");


router.post("/createSupplier",createSupplier);
router.get("/getAllSupplier",getAllSupplier);
router.get("/getSupplierById/:id",getSupplierById);
router.patch("/updateSupplierByID/:id",updateSupplierByID);
router.delete("/RemoveSupplier/:id",RemoveSupplier);


module.exports = router;