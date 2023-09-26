const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema ({
    room: {
        type: String, required: true 
    },

    userid: {
        type: String, required: true 
    },

    Fullname: {
        type: String, required: true 
    },

    email: {
        type: String, required: true 
    },

    fromdate: {
        type: String, required: true 
    },

    todate: {
        type: String, required: true 
    },

    totAmount: {
        type: Number, required: true 
    },

    totDates: {
        type: Number, required: true 
    },

    transactionID: {
        type: String, required: true ,
    },

    status: {
        type: String, required: true, default: 'Booked' 
    },

    request: {
        type: String, required: true, default: 'Active' 
    }
}, {
    timestamps: true,
})

const bookingmodel = mongoose.model('bookings', bookingSchema)
module.exports = bookingmodel