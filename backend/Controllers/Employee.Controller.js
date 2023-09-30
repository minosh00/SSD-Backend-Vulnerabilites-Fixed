


const mongoose = require('mongoose');
const Employee = require("../models/Employee");




const getAllEmployee = async (req, res) => { 
    try {
        const groups = await Employee.find();
                 
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}





const updateEmployeeByID = async (req, res) => {
    const { id } = req.params;
    const {  
        fname,
        lname,
        JobPosition,
        gender,
        HomeAddress,
        email,
        Pnumber
        } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No employee with id: ${id}`);

    const updatedGroups = {   fname,
        lname,
        JobPosition,
        gender,
        HomeAddress,
        email,
        Pnumber,
        _id:id};

    await Employee.findByIdAndUpdate(id, updatedGroups, { new: true });

    res.json(updatedGroups);
}

const RemoveEmployee = async (request,response) => {
    await Employee.findByIdAndRemove(request.params.id,(error,employee) => {
        if(error){
            response.status(500).json({ error: error.message });
        }
        else{
            response.status(200).
            json({
                success: true,
                employee: employee
            })
        }
    })
}





const createEmployee= async (req, res) => {

    const groups = req.body;

    
        if(groups.fname.length<5)
        return res.status(400).json({
            errorMessage: "Please enter a fname of at least 12 characters.",
        });
    
    const newGroups = new Employee({ ...groups, creator: req.userId })

    try {
        await newGroups.save();

        res.status(201).json(newGroups );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}







const getEmployeeById = async (req, res) => { 
    const { id } = req.params;

    try {
        const groups = await Employee.findById(id);
        
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



module.exports ={getAllEmployee,updateEmployeeByID,createEmployee,RemoveEmployee,getEmployeeById};



