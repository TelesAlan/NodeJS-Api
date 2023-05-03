const mongoose = require("./../../database");

const UserSchema = new mongoose.Schema({
    CD_CUSTOMER: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	EMAIL: {
		type: String,
		unique: true,
		required: true
	},
    PASSWORD: String,

	TOKEN: String,
	EXPIRATION_TOKEN_DATE: String,

    CREATED_BY: mongoose.Types.ObjectId,
    CREATED_AT: {
		type: Date,
		default: Date.now
	},
    UPDATED_BY: mongoose.Types.ObjectId,
    UPDATED_AT: Date
});

const User = mongoose.model("User", UserSchema, "User");
module.exports = User;