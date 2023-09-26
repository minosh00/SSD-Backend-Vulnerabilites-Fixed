const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	Fullname: {
		type: String,
		required: true,
	},
	
	email: {
		type: String,
		required: true,
		unique: true,
	},

	pNumber: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},

	userRole: {
		type: String,
		required: true,
	},

	date: {
		type: Date,
		default: Date.now,
	}
});

module.exports = User = mongoose.model("user", UserSchema);