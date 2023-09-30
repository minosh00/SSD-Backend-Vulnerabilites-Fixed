const mongoose = require("mongoose");
const Supplier = require("../models/Suppler");

const getAllSupplier = async (req, res) => {
  try {
    const groups = await Supplier.find();

    res.status(200).json(groups);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateSupplierByID = async (req, res) => {
  const { id } = req.params;
  const {
    suppliername,
    supplierCompanyName,
    SupplyDate,
    SupplyItemsname,
    totalPrice,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No menu with id: ${id}`);

  const updated = {
    suppliername,
    supplierCompanyName,
    SupplyItemsname,
    SupplyDate,
    totalPrice,
    _id: id,
  };

  await Supplier.findByIdAndUpdate(id, updated, { new: true });

  res.json(updated);
};

const RemoveSupplier = async (request, response) => {
  await Supplier.findByIdAndRemove(request.params.id, (error, food) => {
    if (error) {
      response.status(500).json({ error: error.message });
    } else {
      response.status(200).json({
        success: true,
        food: food,
      });
    }
  });
};

const createSupplier = async (req, res) => {
  const supply = req.body;
  const newsupply = new Supplier({ ...supply, creator: req.userId });

  try {
    await newsupply.save();

    res.status(201).json(newsupply);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


const getSupplierById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const groups = await Supplier.findById(id);

    res.status(200).json(groups);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



module.exports = {
  getSupplierById,
  createSupplier,
  updateSupplierByID,
  getAllSupplier,
  RemoveSupplier,
};
