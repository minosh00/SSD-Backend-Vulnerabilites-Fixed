const mongoose = require("mongoose");
const Supplier = require("../models/Supplier");

const suppliesController = {
  // Create Supplier
  createSupplier: async (req, res) => {
    try {
      const supplyData = req.body;
      const newSupply = new Supplier({ ...supplyData, creator: req.userId });
      await newSupply.save();
      res.status(201).json(newSupply);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },

  // Get all the Suppliers
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.find();
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Get supplier by ID
  getSupplierByID: async (req, res) => {
    const { id } = req.params;
    try {
      const supplier = await Supplier.findById(id);
      res.status(200).json(supplier);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  //Update supplier
  updateSupplier: async (req, res) => {
    const { id } = req.params;
    const {
      suppliername,
      supplierCompanyName,
      SupplyDate,
      SupplyItemsname,
      totalPrice,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No supplier with id: ${id}`);

    const updatedSupplier = {
      suppliername,
      supplierCompanyName,
      SupplyItemsname,
      SupplyDate,
      totalPrice,
      _id: id,
    };

    try {
      await Supplier.findByIdAndUpdate(id, updatedSupplier, { new: true });
      res.json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Supplier
  deleteSupplier: async (req, res) => {
    const { id } = req.params;
    try {
      const removedSupplier = await Supplier.findByIdAndRemove(id);
      if (!removedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json({
        success: true,
        supplier: removedSupplier,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = suppliesController;
