const mongoose = require("./../../database");

const CustomerSchema = new mongoose.Schema({
    NAME: {
		type: String,
		required: true
	},
	PHONE: {
		type: String,
		required: true
	},
    STATUS: {
		type: String,
		enum: ["ACTIVE", "BLOCKED", "DISABLED"],
		default: "ACTIVE"
	},
    CREATED_BY: mongoose.Types.ObjectId,
    CREATED_AT: {
		type: Date,
		default: Date.now
	},
    UPDATED_BY: mongoose.Types.ObjectId,
    UPDATED_AT: Date
});

const Customer = mongoose.model("Customer", CustomerSchema, "Customer");
module.exports = Customer;