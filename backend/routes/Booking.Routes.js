const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ROOMS = require("../models/Rooms");

router.post('/bookroom', async (req, res) => {
    const {
        room,
        userid,
        Fullname,
        email,
        fromdate,
        todate,
        totAmount,
        totDates,
        request
    } = req.body

    try {
        const newBooking = new Booking({
            room,
            userid,
            Fullname,
            email,
            fromdate,
            todate,
            totAmount,
            totDates,
            transactionID: '1234',
            request,
        })
        const booking = await newBooking.save();
        const roomtemp = await ROOMS.findOne({ _id: userid._id })
        roomtemp.currentbookings.push({
            bookingid: booking._id,
            fromdate: fromdate,
            Fullname: Fullname,
            email: email,
            todate: todate,
            userid: userid,
            status: booking.status,
            request: booking.request,
        });

        await roomtemp.save()
        res.send('Room Booked Successfully');

    } catch (error) {
        return res.status(400).json({ error })
    }
});

router.get('/viewbook', async (req, res) => {
    try {
        const book = await Booking.find();
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})


//Get booking details from login user name
router.get('/details/:Fullname', async (req, res) => {
    try {
        let Fullname = req.params.Fullname;
        const book = await Booking.find({ Fullname: Fullname });
        res.status(200).json(book);
    } catch (err) {
        res.json(err);
    }
})

router.get('/getbookingbyuserid/:Fullname', async (req, res) => {
    try {
        let Fullname = req.params.Fullname;
        const book = await Booking.find({ Fullname: Fullname });
        res.status(200).json(book);
    } catch (err) {
        res.json(err);
    }
});


router.get('/getname/Prasadi', async (req, res) => {
    try {
        const book = await Booking.find({ Fullname: 'Prasadi' });
        res.status(200).json(book);
    } catch (err) {
        res.json(err);
    }
})

router.get('/getbookstatus/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Booking.findById(id);
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

router.put('/updatestatus/:id', async (req, res) => {
    try {
        const { status, request } = req.body;
        await Booking.findOneAndUpdate({ _id: req.params.id }, { status, request })
        res.json({ msg: "Updated Status" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

router.delete('/deletestatus/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id)
        res.json({ msg: "Deleted Booking" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

module.exports = router;