const mongoose = require("../../database");

const CarSchema = new mongoose.Schema({
    CD_CUSTOMER: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	NAME: {
		type: String,
		required: true
	},
	BRAND: {
		type: String,
		required: true
	},
	YEAR: {
		type: Number,
		required: true
	},
	MODEL: {
		type: String,
		unique: true,
		required: true
	},

    CREATED_BY: mongoose.Types.ObjectId,
    CREATED_AT: {
		type: Date,
		default: Date.now
	},
    UPDATED_BY: mongoose.Types.ObjectId,
    UPDATED_AT: Date
});

const Car = mongoose.model("Car", CarSchema, "Car");
module.exports = Car;