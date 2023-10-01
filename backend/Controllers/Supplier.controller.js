const mongoose = require('mongoose');
const Supplier = require("../models/Suppler");
const logger = require('../Log/Logger.js');

const getAllSupplier = async (req, res) => { 
    try {
        const suppliers = await Supplier.find();
        logger.info('GET request for all suppliers');
        res.status(200).json(suppliers);
    } catch (error) {
        logger.error('Error while fetching suppliers: ' + error.message);
        res.status(404).json({ message: error.message });
    }
}

const updateSupplierByID = async (req, res) => {
    const { id } = req.params;
    const { suppliername, supplierCompanyName, SupplyDate, SupplyItemsname, totalPrice } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Invalid supplier ID: ${id}`);
        return res.status(404).send(`No supplier with id: ${id}`);
    }

    const updatedSupplier = { suppliername, supplierCompanyName, SupplyItemsname, SupplyDate, totalPrice, _id: id };

    try {
        const result = await Supplier.findByIdAndUpdate(id, updatedSupplier, { new: true });
        if (!result) {
            logger.error(`Supplier with ID ${id} not found`);
            return res.status(404).json({ message: 'Supplier not found' });
        }
        logger.info(`Updated supplier with ID ${id}`);
        res.json(updatedSupplier);
    } catch (error) {
        logger.error('Error while updating supplier: ' + error.message);
        res.status(500).json({ message: error.message });
    }
}

const RemoveSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndRemove(req.params.id, (error, supplier) => {
            if (error) {
                logger.error('Error while removing supplier: ' + error.message);
                return res.status(500).json({ error: error.message });
            } else {
                logger.info(`Removed supplier with ID ${req.params.id}`);
                return res.status(200).json({
                    success: true,
                    supplier: supplier
                });
            }
        });
    } catch (error) {
        logger.error('Error while removing supplier: ' + error.message);
        res.status(500).json({ error: error.message });
    }
}

const createSupplier = async (req, res) => {
    const supply = req.body;

    const newSupply = new Supplier({ ...supply, creator: req.userId });

    try {
        await newSupply.save();
        logger.info('Created a new supplier');
        res.status(201).json(newSupply);
    } catch (error) {
        logger.error('Error while creating a new supplier: ' + error.message);
        res.status(409).json({ message: error.message });
    }
}

const getSupplierById = async (req, res) => { 
    const { id } = req.params;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            logger.error(`Supplier with ID ${id} not found`);
            return res.status(404).json({ message: 'Supplier not found' });
        }
        logger.info(`GET request for supplier with ID ${id}`);
        res.status(200).json(supplier);
    } catch (error) {
        logger.error('Error while fetching supplier by ID: ' + error.message);
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    getSupplierById,
    createSupplier,
    updateSupplierByID,
    getAllSupplier,
    RemoveSupplier
};
