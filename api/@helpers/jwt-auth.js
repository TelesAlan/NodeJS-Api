const jwt = require("jsonwebtoken");
const authConfig = require("../../config/default.json");

module.exports = async (req, res, next) => {
	const authHeader = req.headers.accesstoken;
	if(!authHeader)
		return res.status(401).send({ STATUS: false, message: "No token provided" });

	const parts = authHeader.split(" ");
	if(parts.length !== 2)
		return res.status(401).send({ STATUS: false, message: "Token error" });

	const [ schema, token ] = parts;

	if(!/^Bearer$/i.test(schema))
		return res.status(401).send({ STATUS: false, message: "Token malformatted" });

	jwt.verify(token, authConfig.APPLICATION_ID, (err, { id, email, name }) => {
		if(err) return res.status(401).send({ STATUS: false, message: "Token invalid" });

		req.auth = { id, email, name };
		return next();
	});
}