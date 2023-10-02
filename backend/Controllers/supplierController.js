const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Supplier = require("../models/Supplier");
const logger = require('../Log/Logger.js');

const suppliesController = {
  // Create Supplier
  createSupplier: async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const supplyData = req.body;
      const newSupply = new Supplier({ ...supplyData, creator: req.userId });
      await newSupply.save();
      logger.info(`Created a new supplier with ID: ${newSupply._id}`);
      res.status(201).json(newSupply);
    } catch (error) {
      logger.error(`Error creating supplier: ${error.message}`);
      res.status(409).json({ message: error.message });
    }
  },

  // Get all the Suppliers
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.find();
      logger.info(`Fetched ${suppliers.length} suppliers`);
      res.status(200).json(suppliers);
    } catch (error) {
      logger.error(`Error fetching suppliers: ${error.message}`);
      res.status(404).json({ message: error.message });
    }
  },

  // Get supplier by ID
  getSupplierByID: async (req, res) => {
    const { id } = req.params;
    try {
      const supplier = await Supplier.findById(id);

      if (!supplier) {
        logger.error(`Supplier with ID ${id} not found`);
        return res.status(404).json({ message: "Supplier not found" });
      }

      logger.info(`Fetched supplier with ID: ${id}`);
      res.status(200).json(supplier);
    } catch (error) {
      logger.error(`Error fetching supplier: ${error.message}`);
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`Invalid supplier ID: ${id}`);
      return res.status(404).send(`No supplier with id: ${id}`);
    }

    const updatedSupplier = {
      suppliername,
      supplierCompanyName,
      SupplyItemsname,
      SupplyDate,
      totalPrice,
      _id: id,
    };
    try {
      const updatedSupplierDoc = await Supplier.findByIdAndUpdate(id, updatedSupplier, { new: true });

      if (!updatedSupplierDoc) {
        logger.error(`Supplier with ID ${id} not found`);
        return res.status(404).json({ message: "Supplier not found" });
      }

      logger.info(`Updated supplier with ID: ${id}`);
      res.json(updatedSupplierDoc);
    } catch (error) {
      logger.error(`Error updating supplier: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },

  // Delete Supplier
  deleteSupplier: async (req, res) => {
    const { id } = req.params;
    try {
      const removedSupplier = await Supplier.findByIdAndRemove(id);
      if (!removedSupplier) {
        logger.error(`Supplier with ID ${id} not found`);
        return res.status(404).json({ message: "Supplier not found" });
      }
      logger.info(`Deleted supplier with ID: ${id}`);
      res.status(200).json({
        success: true,
        supplier: removedSupplier,
      });
    } catch (error) {
      logger.error(`Error deleting supplier: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = suppliesController;
